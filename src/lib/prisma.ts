import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const adapter =
  typeof process !== 'undefined' && process.env.DATABASE_URL
    ? new PrismaPg({ connectionString: process.env.DATABASE_URL })
    : undefined

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
    ...(adapter ? { adapter } : {}),
  })

if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
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
