export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { mockTransactions, mockCategories } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Skip auth for now - use mock data
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Use mock data for development
    let transactions = [...mockTransactions];
    
    // Apply filters
    if (category) {
      transactions = transactions.filter(t => t.categoryId === category);
    }
    
    if (search) {
      transactions = transactions.filter(t => 
        t.merchant.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = transactions.length;
    const start = (page - 1) * limit;
    const paginatedTransactions = transactions.slice(start, start + limit);

    return NextResponse.json({
      transactions: paginatedTransactions.map(t => ({
        ...t,
        category: mockCategories.find(c => c.id === t.categoryId),
        account: null
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      date,
      merchant,
      amount,
      currency = 'ILS',
      categoryId,
      note,
      isRecurring = false,
      accountId
    } = body;

    // Validation
    if (!date || !merchant || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: date, merchant, amount' },
        { status: 400 }
      );
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        date: new Date(date),
        merchant,
        originalMerchant: merchant,
        amount: parseFloat(amount),
        currency,
        categoryId,
        note,
        isRecurring,
        accountId
      },
      include: {
        category: true,
        account: true
      }
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Create transaction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
