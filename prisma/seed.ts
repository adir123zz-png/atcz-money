import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultCategories = [
  // Expense Categories
  { name: 'מזון', icon: '🛒', type: 'expense', sortOrder: 1, color: '#2E6FBF' },
  { name: 'סופרמרקט', icon: '🛒', type: 'expense', parentId: null, sortOrder: 1, color: '#2E6FBF' },
  { name: 'מסעדות', icon: '🍽�?, type: 'expense', sortOrder: 2, color: '#C05C00' },
  { name: 'בילויים', icon: '🎭', type: 'expense', sortOrder: 3, color: '#B91C1C' },
  { name: 'תחבורה', icon: '🚗', type: 'expense', sortOrder: 4, color: '#1A7A4A' },
  { name: 'דיור', icon: '🏠', type: 'expense', sortOrder: 5, color: '#8B5CF6' },
  { name: 'בריאות', icon: '💊', type: 'expense', sortOrder: 6, color: '#EC4899' },
  { name: 'בגדים', icon: '👗', type: 'expense', sortOrder: 7, color: '#F59E0B' },
  { name: 'חינוך', icon: '📚', type: 'expense', sortOrder: 8, color: '#10B981' },
  { name: 'ספורט', icon: '🏋�?, type: 'expense', sortOrder: 9, color: '#3B82F6' },
  { name: 'טכנולוגיה', icon: '📱', type: 'expense', sortOrder: 10, color: '#6366F1' },
  { name: 'פיננסים', icon: '💳', type: 'expense', sortOrder: 11, color: '#84CC16' },
  { name: 'העברות', icon: '💸', type: 'expense', sortOrder: 12, color: '#F97316' },
  { name: 'מיסים', icon: '🏛�?, type: 'expense', sortOrder: 13, color: '#DC2626' },
  { name: 'אחר', icon: '📦', type: 'expense', sortOrder: 14, color: '#6B7280' },

  // Income Categories
  { name: 'משכורת', icon: '💰', type: 'income', sortOrder: 1, color: '#10B981' },
  { name: 'פרילנס', icon: '💼', type: 'income', sortOrder: 2, color: '#3B82F6' },
  { name: 'השקעות', icon: '📈', type: 'income', sortOrder: 3, color: '#8B5CF6' },
  { name: 'דמי שכירות', icon: '🏘�?, type: 'income', sortOrder: 4, color: '#F59E0B' },
  { name: 'הטבות', icon: '🏛�?, type: 'income', sortOrder: 5, color: '#EC4899' },
  { name: 'מתנות', icon: '🎁', type: 'income', sortOrder: 6, color: '#F97316' },
  { name: 'מכירת נכסים', icon: '🔄', type: 'income', sortOrder: 7, color: '#84CC16' },
  { name: 'הכנסה אחרת', icon: '📦', type: 'income', sortOrder: 8, color: '#6B7280' },
];

async function main() {
  console.log('Start seeding...');

  // Create default categories (system-wide, userId = null)
  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: {
        name_userId: {
          name: category.name,
          userId: null
        }
      },
      update: category,
      create: {
        ...category,
        userId: null,
        isDefault: true
      }
    });
  }

  console.log('Default categories created');

  // Create sample user for testing (in development)
  if (process.env.NODE_ENV === 'development') {
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        googleId: 'test-google-id',
        name: 'משתמש טסט',
        currency: 'ILS',
        language: 'he',
        theme: 'system'
      }
    });

    console.log('Test user created:', testUser.id);

    // Create sample account
    const testAccount = await prisma.account.create({
      data: {
        userId: testUser.id,
        name: 'אמריקן אקספרס ירוק',
        type: 'credit_card',
        provider: 'amex',
        lastFour: '1234',
        color: '#2E6FBF'
      }
    });

    console.log('Test account created:', testAccount.id);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
