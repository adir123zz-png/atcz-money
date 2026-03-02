import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

// We intentionally keep the global prisma type loose, because
// the extended client type from withAccelerate is complex.
const globalForPrisma = globalThis as unknown as {
  prisma: any
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // This must be set to your Prisma Accelerate URL (prisma://...)
    accelerateUrl: process.env.PRISMA_ACCELERATE_URL,
  }).$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

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
