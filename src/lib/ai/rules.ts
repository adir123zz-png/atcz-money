export interface MerchantRule {
  pattern: RegExp;
  category: string;
  subcategory: string;
  confidence: number;
}

export const MERCHANT_RULES: MerchantRule[] = [
  // Supermarkets
  { pattern: /שופרסל|shufersal/i, category: 'food', subcategory: 'supermarket', confidence: 95 },
  { pattern: /יוחננוף|yochananof/i, category: 'food', subcategory: 'supermarket', confidence: 95 },
  { pattern: /ויקטורי|victory/i, category: 'food', subcategory: 'supermarket', confidence: 95 },
  { pattern: /רמי לוי|rami levy/i, category: 'food', subcategory: 'supermarket', confidence: 95 },
  { pattern: /מגה|mega/i, category: 'food', subcategory: 'supermarket', confidence: 90 },
  { pattern: /כל בו|kolbo/i, category: 'food', subcategory: 'supermarket', confidence: 90 },
  { pattern: /מחסני מזון|machsanei mazon/i, category: 'food', subcategory: 'supermarket', confidence: 95 },
  
  // Fuel
  { pattern: /סונול|sonol/i, category: 'transport', subcategory: 'fuel', confidence: 95 },
  { pattern: /פז|paz/i, category: 'transport', subcategory: 'fuel', confidence: 95 },
  { pattern: /דלק|delek/i, category: 'transport', subcategory: 'fuel', confidence: 95 },
  { pattern: /yellow|פז אפליקצית/i, category: 'transport', subcategory: 'fuel', confidence: 90 },
  { pattern: /תפוז|tapuz/i, category: 'transport', subcategory: 'fuel', confidence: 90 },
  
  // Restaurants & Fast Food
  { pattern: /פיצה האט|pizza hut/i, category: 'dining', subcategory: 'pizza', confidence: 95 },
  { pattern: /מקדונלד|mcdonalds/i, category: 'dining', subcategory: 'fast_food', confidence: 95 },
  { pattern: /בורגר קינג|burger king/i, category: 'dining', subcategory: 'fast_food', confidence: 95 },
  { pattern: /בורגר סאלט|burger salat/i, category: 'dining', subcategory: 'fast_food', confidence: 90 },
  { pattern: /ארומה|aroma/i, category: 'dining', subcategory: 'coffee', confidence: 90 },
  { pattern: /קפה גרג|cafe greg/i, category: 'dining', subcategory: 'coffee', confidence: 90 },
  { pattern: /לנדוור|landwer/i, category: 'dining', subcategory: 'coffee', confidence: 90 },
  
  // Home & Furniture
  { pattern: /איקאה|ikea/i, category: 'home', subcategory: 'furniture', confidence: 95 },
  { pattern: /הום סנטר|home center/i, category: 'home', subcategory: 'hardware', confidence: 90 },
  { pattern: /ACE/i, category: 'home', subcategory: 'hardware', confidence: 90 },
  { pattern: /מגה ספורט|Mega Sport/i, category: 'sports', subcategory: 'equipment', confidence: 90 },
  
  // Digital Transfers & Payments
  { pattern: /העברה.*bit|bit.*העברה/i, category: 'transfers', subcategory: 'bit', confidence: 95 },
  { pattern: /paybox/i, category: 'transfers', subcategory: 'paybox', confidence: 95 },
  { pattern: /פאי\פאי|paypal/i, category: 'transfers', subcategory: 'paypal', confidence: 95 },
  { pattern: /העברה בנקאית/i, category: 'transfers', subcategory: 'bank_transfer', confidence: 90 },
  
  // Entertainment & Subscriptions
  { pattern: /netflix/i, category: 'entertainment', subcategory: 'streaming', confidence: 95 },
  { pattern: /spotify/i, category: 'entertainment', subcategory: 'music', confidence: 95 },
  { pattern: /yes\s|hot\s/i, category: 'entertainment', subcategory: 'cable_tv', confidence: 90 },
  { pattern: /סלקום|cellcom/i, category: 'tech', subcategory: 'mobile', confidence: 90 },
  { pattern: /פרטנר|partner/i, category: 'tech', subcategory: 'mobile', confidence: 90 },
  { pattern: /בזק|bezeq/i, category: 'tech', subcategory: 'internet', confidence: 90 },
  
  // Health & Wellness
  { pattern: /free.?fit|חדר כושר|gym/i, category: 'health', subcategory: 'gym', confidence: 90 },
  { pattern: /מכבי|maccabi/i, category: 'health', subcategory: 'hmo', confidence: 95 },
  { pattern: /כללית|clalit/i, category: 'health', subcategory: 'hmo', confidence: 95 },
  { pattern: /לאומית|leumit/i, category: 'health', subcategory: 'hmo', confidence: 95 },
  { pattern: /סופר פארם|super pharm/i, category: 'health', subcategory: 'pharmacy', confidence: 95 },
  { pattern: /מחלקות|iHerb/i, category: 'health', subcategory: 'pharmacy', confidence: 90 },
  
  // Travel & Transportation
  { pattern: /יקי טורי|arkia|אל על|el al/i, category: 'travel', subcategory: 'flights', confidence: 95 },
  { pattern: /הסעות|egged/i, category: 'transport', subcategory: 'public_transport', confidence: 90 },
  { pattern: /דן|dan/i, category: 'transport', subcategory: 'public_transport', confidence: 90 },
  { pattern: /רכבת|railway/i, category: 'transport', subcategory: 'public_transport', confidence: 90 },
  { pattern: /מונית|taxi/i, category: 'transport', subcategory: 'taxi', confidence: 90 },
  { pattern: /gett/i, category: 'transport', subcategory: 'taxi', confidence: 95 },
  
  // Shopping & Clothing
  { pattern: /המשבית המרכזי|hamashabir/i, category: 'clothing', subcategory: 'department_store', confidence: 90 },
  { pattern: /פוקס|fox/i, category: 'clothing', subcategory: 'clothing', confidence: 90 },
  { pattern: /קסטרו|castro/i, category: 'clothing', subcategory: 'clothing', confidence: 90 },
  { pattern: /אלדו|aldo/i, category: 'clothing', subcategory: 'shoes', confidence: 90 },
  { pattern: /נעלי בית|naot/i, category: 'clothing', subcategory: 'shoes', confidence: 90 },
  
  // Finance & Banking
  { pattern: /בנק.*הפועלים|hapoalim/i, category: 'finance', subcategory: 'bank_fees', confidence: 90 },
  { pattern: /בנק.*לאומי|leumi/i, category: 'finance', subcategory: 'bank_fees', confidence: 90 },
  { pattern: /דמי ניהול/i, category: 'finance', subcategory: 'bank_fees', confidence: 95 },
  { pattern: /עמלת משיכה/i, category: 'finance', subcategory: 'bank_fees', confidence: 95 },
  
  // Education
  { pattern: /אוניברסיטה|university/i, category: 'education', subcategory: 'tuition', confidence: 90 },
  { pattern: /מכללה|college/i, category: 'education', subcategory: 'tuition', confidence: 90 },
  { pattern: /סטודנט|student/i, category: 'education', subcategory: 'tuition', confidence: 85 },
  
  // Taxes & Government
  { pattern: /רשות המיסים|mas hachnasa/i, category: 'taxes', subcategory: 'income_tax', confidence: 95 },
  { pattern: /עירייה|irya/i, category: 'taxes', subcategory: 'municipal', confidence: 90 },
  { pattern: /ארנונה|arnona/i, category: 'taxes', subcategory: 'municipal', confidence: 95 },
  { pattern: /ביטוח לאומי|bituach leumi/i, category: 'taxes', subcategory: 'national_insurance', confidence: 95 },
  
  // Utilities
  { pattern: /חברת חשמל|hevra chashmal/i, category: 'home', subcategory: 'utilities', confidence: 95 },
  { pattern: /מקורות|mekorot/i, category: 'home', subcategory: 'utilities', confidence: 95 },
  { pattern: /חברת גז|gas company/i, category: 'home', subcategory: 'utilities', confidence: 90 },
  
  // Income patterns
  { pattern: /משכורת|salary/i, category: 'salary', subcategory: 'employment', confidence: 95 },
  { pattern: /העברה משכורת/i, category: 'salary', subcategory: 'employment', confidence: 95 },
  { pattern: /בונוס|bonus/i, category: 'salary', subcategory: 'bonus', confidence: 90 },
  { pattern: /פנסיה|pension/i, category: 'benefits', subcategory: 'pension', confidence: 90 },
  { pattern: /תגמולים|tagmulim/i, category: 'benefits', subcategory: 'severance', confidence: 90 },
];

export function categorizeByRules(merchant: string): { category: string; subcategory: string; confidence: number } | null {
  for (const rule of MERCHANT_RULES) {
    if (rule.pattern.test(merchant)) {
      return {
        category: rule.category,
        subcategory: rule.subcategory,
        confidence: rule.confidence
      };
    }
  }
  
  return null;
}
