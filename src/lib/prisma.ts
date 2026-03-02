// In-memory mock layer instead of a real database.
// `prisma` is kept as `any` so existing imports keep working,
// but it does not talk to a real database.
export const prisma: any = null;

// Mock data for development without database
export const mockTransactions = [
  {
    id: '1',
    date: new Date('2026-01-30'),
    merchant: 'סונול תל אביב',
    amount: 306,
    currency: 'ILS',
    categoryId: 'transport',
    subcategory: 'fuel',
    note: 'תדלוק מלא'
  },
  {
    id: '2', 
    date: new Date('2026-01-26'),
    merchant: 'שופרסל דיזנגוף',
    amount: 421,
    currency: 'ILS',
    categoryId: 'food',
    subcategory: 'supermarket',
    note: 'קניות שבועית'
  }
];

export const mockCategories = [
  { id: 'food', name: 'מזון', icon: '🛒', type: 'expense' },
  { id: 'transport', name: 'תחבורה', icon: '🚗', type: 'expense' },
  { id: 'dining', name: 'בילויים', icon: '🍽️', type: 'expense' }
];
