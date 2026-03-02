import * as XLSX from 'xlsx';
import { DetectionResult, ParsedTransaction } from '@/types/import';

export interface DetectionResult {
  provider: string;
  confidence: number;
  dateColumn: string;
  merchantColumn: string;
  amountColumn: string;
  currencyColumn?: string;
  dateFormat: string;
  currency: string;
  rowCount: number;
  dateRange: { from: Date; to: Date };
}

export interface ParsedTransaction {
  date: Date;
  merchant: string;
  amount: number;
  currency: string;
  originalData: any;
}

export async function parseImportFile(file: File): Promise<ParsedTransaction[]> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  
  if (ext === 'csv') {
    return parseCSV(file);
  } else if (ext === 'xlsx' || ext === 'xls') {
    return parseExcel(file);
  }
  
  throw new Error('Unsupported file format');
}

async function parseExcel(file: File): Promise<ParsedTransaction[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  
  // Try to find the transactions sheet
  let sheetName = workbook.SheetNames.find(name => 
    name.includes('פירוט') || name.includes('עסקאות') || name.includes('transactions')
  ) || workbook.SheetNames[0];
  
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  return parseDataToTransactions(data);
}

async function parseCSV(file: File): Promise<ParsedTransaction[]> {
  const text = await file.text();
  const lines = text.split('\n').filter(line => line.trim());
  const data = lines.map(line => line.split(','));
  
  return parseDataToTransactions(data);
}

function parseDataToTransactions(data: any[][]): ParsedTransaction[] {
  const transactions: ParsedTransaction[] = [];
  
  // Skip header rows and find data start
  let dataStart = 0;
  for (let i = 0; i < Math.min(10, data.length); i++) {
    const row = data[i];
    if (row && row.length > 2) {
      // Check if this looks like a data row (date-like first column)
      const firstCell = String(row[0] || '').trim();
      if (/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/.test(firstCell)) {
        dataStart = i;
        break;
      }
    }
  }
  
  // Parse data rows
  for (let i = dataStart; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length < 3) continue;
    
    const dateStr = String(row[0] || '').trim();
    const merchant = String(row[1] || '').trim();
    const amountStr = String(row[2] || '').trim();
    
    if (!dateStr || !merchant || !amountStr) continue;
    
    // Parse date
    const date = parseDate(dateStr);
    if (!date) continue;
    
    // Parse amount
    const amount = parseAmount(amountStr);
    if (isNaN(amount)) continue;
    
    transactions.push({
      date,
      merchant,
      amount,
      currency: 'ILS',
      originalData: row
    });
  }
  
  return transactions;
}

function parseDate(dateStr: string): Date | null {
  // Try different date formats
  const formats = [
    /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/, // DD/MM/YYYY or DD-MM-YYYY
    /(\d{2,4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/, // YYYY/MM/DD
  ];
  
  for (const format of formats) {
    const match = dateStr.match(format);
    if (match) {
      const [, part1, part2, part3] = match;
      
      // Try DD/MM/YYYY first
      if (parseInt(part1) <= 31 && parseInt(part2) <= 12) {
        const year = parseInt(part3.length === 2 ? '20' + part3 : part3);
        const month = parseInt(part2);
        const day = parseInt(part1);
        
        const date = new Date(year, month - 1, day);
        if (!isNaN(date.getTime())) return date;
      }
      
      // Try YYYY/MM/DD
      if (parseInt(part1) > 31) {
        const year = parseInt(part1);
        const month = parseInt(part2);
        const day = parseInt(part3);
        
        const date = new Date(year, month - 1, day);
        if (!isNaN(date.getTime())) return date;
      }
    }
  }
  
  return null;
}

function parseAmount(amountStr: string): number {
  // Remove currency symbols, spaces, and convert decimal separators
  const clean = amountStr
    .replace(/[₪$,]/g, '')
    .replace(/\s/g, '')
    .replace(/,/g, '.');
  
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

export async function detectProvider(headers: string[], sampleRows: any[]): Promise<DetectionResult> {
  // Known provider signatures
  const signatures = {
    amex: {
      patterns: ['תאריך רכישה', 'שם בית עסק', 'סכום עסקה'],
      dateFormat: 'DD/MM/YYYY',
      currency: 'ILS'
    },
    isracard: {
      patterns: ['תאריך עסקה', 'שם בית עסק', 'סכום חיוב'],
      dateFormat: 'DD/MM/YYYY',
      currency: 'ILS'
    },
    leumi: {
      patterns: ['תאריך ערך', 'תיאור פעולה', 'סכום'],
      dateFormat: 'DD/MM/YYYY',
      currency: 'ILS'
    },
    hapoalim: {
      patterns: ['תאריך', 'תיאור', 'חובה', 'זכות'],
      dateFormat: 'DD/MM/YYYY',
      currency: 'ILS'
    }
  };
  
  // Check against known providers
  for (const [provider, sig] of Object.entries(signatures)) {
    const matches = sig.patterns.filter(pattern => 
      headers.some(header => header.includes(pattern))
    );
    
    if (matches.length >= 2) {
      return buildDetectionResult(provider, headers, sampleRows, sig);
    }
  }
  
  // Fallback to generic detection
  return buildDetectionResult('generic', headers, sampleRows, {
    dateFormat: 'DD/MM/YYYY',
    currency: 'ILS'
  });
}

function buildDetectionResult(
  provider: string, 
  headers: string[], 
  sampleRows: any[],
  config: any
): DetectionResult {
  // Find column indices
  let dateColumn = -1;
  let merchantColumn = -1;
  let amountColumn = -1;
  let currencyColumn = -1;
  
  headers.forEach((header, index) => {
    const h = header.toLowerCase();
    
    if (dateColumn === -1 && (h.includes('תאריך') || h.includes('date'))) {
      dateColumn = index;
    }
    if (merchantColumn === -1 && (h.includes('שם') || h.includes('עסק') || h.includes('merchant'))) {
      merchantColumn = index;
    }
    if (amountColumn === -1 && (h.includes('סכום') || h.includes('amount'))) {
      amountColumn = index;
    }
    if (currencyColumn === -1 && (h.includes('מטבע') || h.includes('currency'))) {
      currencyColumn = index;
    }
  });
  
  return {
    provider,
    confidence: provider === 'generic' ? 50 : 85,
    dateColumn: dateColumn >= 0 ? headers[dateColumn] : '',
    merchantColumn: merchantColumn >= 0 ? headers[merchantColumn] : '',
    amountColumn: amountColumn >= 0 ? headers[amountColumn] : '',
    currencyColumn: currencyColumn >= 0 ? headers[currencyColumn] : undefined,
    dateFormat: config.dateFormat,
    currency: config.currency,
    rowCount: sampleRows.length,
    dateRange: { from: new Date(), to: new Date() } // TODO: Calculate actual range
  };
}
