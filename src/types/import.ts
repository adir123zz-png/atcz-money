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

export interface ImportSession {
  id: string;
  userId: string;
  filename: string;
  detection: DetectionResult;
  transactions: ParsedTransaction[];
  categorizedTransactions: CategorizedTransaction[];
  status: 'uploading' | 'detecting' | 'categorizing' | 'reviewing' | 'importing' | 'done' | 'error';
  errors: string[];
}

export interface CategorizedTransaction extends ParsedTransaction {
  id: string;
  categoryId?: string;
  subcategory?: string;
  confidence: number;
  isManual?: boolean;
}

export interface MerchantRule {
  id: string;
  userId?: string;
  pattern: string;
  categoryId: string;
  isRegex: boolean;
  usageCount: number;
  createdAt: Date;
}
