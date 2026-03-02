import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { parseImportFile, detectProvider } from '@/lib/import/parser';
import { batchCategorize } from '@/lib/ai/categorize';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only Excel and CSV files are allowed.' },
        { status: 400 }
      );
    }

    // Parse the file
    const transactions = await parseImportFile(file);
    
    if (transactions.length === 0) {
      return NextResponse.json(
        { error: 'No transactions found in file' },
        { status: 400 }
      );
    }

    // Detect provider
    const headers = transactions.length > 0 ? Object.keys(transactions[0].originalData) : [];
    const detection = await detectProvider(headers, transactions.slice(0, 5).map(t => t.originalData));

    // Categorize transactions
    const categorizationResults = await batchCategorize(
      transactions.map(t => ({ merchant: t.merchant, amount: t.amount })),
      session.user.id
    );

    // Combine transactions with categorization
    const categorizedTransactions = transactions.map((transaction, index) => {
      const categorization = categorizationResults[index];
      return {
        ...transaction,
        id: `temp-${index}`,
        categoryId: categorization?.category,
        subcategory: categorization?.subcategory,
        confidence: categorization?.confidence || 0,
        isManual: false
      };
    });

    // Create import record
    const importRecord = await prisma.import.create({
      data: {
        userId: session.user.id,
        filename: file.name,
        provider: detection.provider,
        status: 'done',
        rowsTotal: transactions.length,
        rowsSuccess: transactions.length,
        rowsDuplicate: 0,
        rowsError: 0
      }
    });

    return NextResponse.json({
      importId: importRecord.id,
      detection,
      transactions: categorizedTransactions,
      summary: {
        total: transactions.length,
        categorized: categorizedTransactions.filter(t => t.confidence > 70).length,
        needsReview: categorizedTransactions.filter(t => t.confidence <= 70).length
      }
    });
  } catch (error) {
    console.error('Import upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
}
