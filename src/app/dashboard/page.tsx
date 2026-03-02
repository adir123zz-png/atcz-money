'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Target,
  AlertTriangle,
  Plus,
  Upload
} from 'lucide-react';

interface MonthlySummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsActual: number;
  savingsGoal: number;
  savingsPercent: number;
  trendVsLastMonth: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
}

interface BudgetProgress {
  name: string;
  spent: number;
  budget: number;
  percent: number;
  status: 'good' | 'warning' | 'danger';
}

interface RecentTransaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
}

const COLORS = ['#2E6FBF', '#1A7A4A', '#C05C00', '#B91C1C', '#8B5CF6', '#EC4899'];

export default function Dashboard() {
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [trendData, setTrendData] = useState<MonthlyTrend[]>([]);
  const [budgets, setBudgets] = useState<BudgetProgress[]>([]);
  const [transactions, setTransactions] = useState<RecentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch real data from API
    const mockData = {
      summary: {
        totalIncome: 18500,
        totalExpenses: 12340,
        balance: 6160,
        savingsActual: 6160,
        savingsGoal: 6000,
        savingsPercent: 103,
        trendVsLastMonth: 12.5
      },
      categories: [
        { name: 'מזון', value: 3200, color: '#2E6FBF' },
        { name: 'תחבורה', value: 1800, color: '#1A7A4A' },
        { name: 'דיור', value: 3500, color: '#C05C00' },
        { name: 'בילויים', value: 1200, color: '#B91C1C' },
        { name: 'בריאות', value: 800, color: '#8B5CF6' },
        { name: 'אחר', value: 1840, color: '#EC4899' }
      ],
      trends: [
        { month: 'אוג', income: 17500, expenses: 11800 },
        { month: 'ספט', income: 18200, expenses: 12500 },
        { month: 'אוק', income: 18500, expenses: 12100 },
        { month: 'נוב', income: 18000, expenses: 11900 },
        { month: 'דצמ', income: 19000, expenses: 13200 },
        { month: 'ינו', income: 18500, expenses: 12340 }
      ],
      budgets: [
        { name: 'מזון', spent: 3200, budget: 4000, percent: 80, status: 'good' as const },
        { name: 'תחבורה', spent: 1800, budget: 2000, percent: 90, status: 'warning' as const },
        { name: 'בילויים', spent: 1200, budget: 1200, percent: 100, status: 'danger' as const }
      ] as BudgetProgress[],
      transactions: [
        { id: '1', date: '30/01', merchant: 'סונול תל אביב', amount: 306, category: 'תחבורה' },
        { id: '2', date: '26/01', merchant: 'שופרסל דיזנגוף', amount: 421, category: 'מזון' },
        { id: '3', date: '26/01', merchant: 'יוחננוף סיטי', amount: 156, category: 'מזון' },
        { id: '4', date: '25/01', merchant: 'ארומה אם המושבות', amount: 35, category: 'בילויים' },
        { id: '5', date: '24/01', merchant: 'הום סנטר', amount: 287, category: 'בית' }
      ]
    };

    setSummary(mockData.summary);
    setCategoryData(mockData.categories);
    setTrendData(mockData.trends);
    setBudgets(mockData.budgets);
    setTransactions(mockData.transactions);
    setLoading(false);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'danger': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <TrendingUp className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'danger': return <TrendingDown className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ATcz Money</h1>
          <p className="text-gray-600">ינואר 2026</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 ml-2" />
            ייבוא קבצים
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 ml-2" />
            עסקה חדשה
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">הכנסות</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(summary?.totalIncome || 0)}</div>
            <p className="text-xs text-green-600">
              +{summary?.trendVsLastMonth}% מהחודש שעבר
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">הוצאות</CardTitle>
            <CreditCard className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(summary?.totalExpenses || 0)}</div>
            <p className="text-xs text-gray-600">ינואר 2026</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">יתרה</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(summary?.balance || 0)}</div>
            <p className="text-xs text-blue-600">חיסכון החודש</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">יעד חיסכון</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{summary?.savingsPercent}%</div>
            <Progress value={summary?.savingsPercent} className="mt-2" />
            <p className="text-xs text-gray-600 mt-1">
              {formatCurrency(summary?.savingsActual || 0)} / {formatCurrency(summary?.savingsGoal || 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Category Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle>הוצאות לפי קטגוריה</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((category, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <span className="text-sm font-medium">{formatCurrency(category.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>מגמה חודשית</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="income" fill="#10b981" name="הכנסות" />
                <Bar dataKey="expenses" fill="#ef4444" name="הוצאות" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Budget Progress */}
        <Card>
          <CardHeader>
            <CardTitle>התקדמות תקציב</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgets.map((budget, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{budget.name}</span>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(budget.status)}
                      <span className={`text-sm ${getStatusColor(budget.status)}`}>
                        {budget.percent}%
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={budget.percent} 
                    className={`h-2 ${
                      budget.status === 'danger' ? 'bg-red-200' : 
                      budget.status === 'warning' ? 'bg-yellow-200' : 'bg-green-200'
                    }`}
                  />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{formatCurrency(budget.spent)}</span>
                    <span>{formatCurrency(budget.budget)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>עסקאות אחרונות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600">{transaction.date}</div>
                  <div>
                    <div className="font-medium">{transaction.merchant}</div>
                    <div className="text-sm text-gray-600">{transaction.category}</div>
                  </div>
                </div>
                <div className="text-lg font-medium text-red-600">
                  -{formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Insights */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>תובנות חכמות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="text-blue-600">💡</div>
              <div>
                <div className="font-medium text-blue-900">הוצאות מזון עלו ב-22%</div>
                <div className="text-sm text-blue-700">שווה להשוות מחירים בסופרים שונים</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="text-green-600">🎉</div>
              <div>
                <div className="font-medium text-green-900">חיסכת יותר מהממוצע!</div>
                <div className="text-sm text-green-700">חיסכת ₪850 מעל הממוצע החודשי - עבודה טובה!</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="text-yellow-600">⚠️</div>
              <div>
                <div className="font-medium text-yellow-900">80% מתקציב הדלק</div>
                <div className="text-sm text-yellow-700">נותרו 11 ימים לחודש</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
