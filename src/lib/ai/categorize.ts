import OpenAI from 'openai';
import { categorizeByRules } from './rules';
import { prisma } from '../prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface CategorizationResult {
  category: string;
  subcategory: string;
  confidence: number;
  source: 'rule' | 'personal' | 'ai';
}

export async function categorizeTransaction(
  merchant: string,
  amount: number,
  userId?: string
): Promise<CategorizationResult> {
  // Layer 1: Rule Engine (regex + exact match)
  const ruleResult = categorizeByRules(merchant);
  if (ruleResult && ruleResult.confidence >= 70) {
    return {
      ...ruleResult,
      source: 'rule'
    };
  }

  // Layer 2: Personal Learning DB (user's past corrections)
  if (userId) {
    const personalRule = await getPersonalRule(userId, merchant);
    if (personalRule) {
      return {
        category: personalRule.category.name,
        subcategory: personalRule.category.name, // TODO: Add subcategory to merchant rules
        confidence: 95,
        source: 'personal'
      };
    }
  }

  // Layer 3: OpenAI GPT-4o (for unknown merchants)
  try {
    const aiResult = await categorizeWithAI([{ merchant, amount }]);
    if (aiResult.length > 0) {
      return {
        ...aiResult[0],
        source: 'ai'
      };
    }
  } catch (error) {
    console.error('AI categorization failed:', error);
  }

  // Fallback
  return {
    category: 'other',
    subcategory: 'uncategorized',
    confidence: 0,
    source: 'rule'
  };
}

export async function categorizeWithAI(transactions: { merchant: string; amount: number }[]) {
  const prompt = `
You are a financial transaction categorizer for Israeli users.
Categorize each transaction into: category + subcategory + confidence (0-100).

Available categories: food, dining, transport, home, health, clothing, 
entertainment, education, sports, tech, finance, transfers, taxes, other

Subcategories examples:
- food: supermarket, online, market, organic
- dining: restaurant, pizza, coffee, bar, takeout
- transport: fuel, parking, insurance, maintenance, fines, public_transport
- home: rent, property_tax, utilities, furniture, repairs
- health: doctor, pharmacy, insurance, hmo, dental, gym
- clothing: clothes, shoes, accessories, beauty
- entertainment: cinema, concerts, subscriptions, streaming
- education: tuition, courses, books, kindergarten
- sports: gym, equipment, classes
- tech: mobile, internet, streaming, software
- finance: insurance, loans, fees, bank_fees
- transfers: bit, paybox, paypal, bank_transfer
- taxes: income_tax, municipal, national_insurance
- other: uncategorized

Transactions (JSON array):
${JSON.stringify(transactions)}

Respond ONLY with a JSON array:
[{ "category": "...", "subcategory": "...", "confidence": 85 }]
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.1,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error('No response from AI');

  const result = JSON.parse(content);
  return result.results || [];
}

async function getPersonalRule(userId: string, merchant: string) {
  const rule = await prisma.merchantRule.findFirst({
    where: {
      userId,
      pattern: {
        contains: merchant,
        mode: 'insensitive'
      }
    },
    include: {
      category: true
    }
  });

  return rule;
}

export async function learnFromCorrection(
  userId: string,
  merchant: string,
  categoryId: string
) {
  // Save to merchant_rules table
  await prisma.merchantRule.upsert({
    where: {
      userId_pattern: {
        userId,
        pattern: merchant
      }
    },
    update: {
      categoryId,
      usageCount: {
        increment: 1
      }
    },
    create: {
      userId,
      pattern: merchant,
      categoryId,
      isRegex: false
    }
  });

  // TODO: Cache in Cloudflare KV
  // await env.ATCZ_CACHE.put(`rule:${userId}:${merchant}`, categoryId, { expirationTtl: 2592000 });
}

export async function batchCategorize(
  transactions: { merchant: string; amount: number }[],
  userId?: string
): Promise<CategorizationResult[]> {
  const results: CategorizationResult[] = [];
  const aiBatch: { merchant: string; amount: number; index: number }[] = [];

  // First pass: try rules and personal learning
  for (let i = 0; i < transactions.length; i++) {
    const transaction = transactions[i];
    
    // Try rule engine
    const ruleResult = categorizeByRules(transaction.merchant);
    if (ruleResult && ruleResult.confidence >= 70) {
      results[i] = {
        ...ruleResult,
        source: 'rule'
      };
      continue;
    }

    // Try personal learning
    if (userId) {
      const personalRule = await getPersonalRule(userId, transaction.merchant);
      if (personalRule) {
        results[i] = {
          category: personalRule.category.name,
          subcategory: personalRule.category.name,
          confidence: 95,
          source: 'personal'
        };
        continue;
      }
    }

    // Add to AI batch
    aiBatch.push({ ...transaction, index: i });
  }

  // Second pass: AI categorization for remaining
  if (aiBatch.length > 0) {
    try {
      const aiResults = await categorizeWithAI(aiBatch);
      
      for (let i = 0; i < aiBatch.length; i++) {
        const batchItem = aiBatch[i];
        const aiResult = aiResults[i];
        
        if (aiResult) {
          results[batchItem.index] = {
            ...aiResult,
            source: 'ai'
          };
        } else {
          results[batchItem.index] = {
            category: 'other',
            subcategory: 'uncategorized',
            confidence: 0,
            source: 'rule'
          };
        }
      }
    } catch (error) {
      console.error('Batch AI categorization failed:', error);
      
      // Fallback for failed AI batch
      for (const batchItem of aiBatch) {
        results[batchItem.index] = {
          category: 'other',
          subcategory: 'uncategorized',
          confidence: 0,
          source: 'rule'
        };
      }
    }
  }

  return results;
}
