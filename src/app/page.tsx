'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Shield, Smartphone, BarChart3 } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to dashboard after 2 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="mr-3 text-2xl font-bold text-gray-900">ATcz Money</h1>
            </div>
            <Button onClick={() => router.push('/dashboard')}>
              לדשבורד
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ניהול פיננסי חכם לישראלים
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            ייבא קבצי אשראי מכל הבנקים, קטגוריזציה אוטומטית ב-AI, דשבורד חכם, 
            וסיכומים חודשיים ב-WhatsApp. הכל במקום אחד מאובטח.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => router.push('/dashboard')}>
              צפה בדשבורד
            </Button>
            <Button variant="outline" size="lg">
              הפגנון
            </Button>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            מעביר אוטומטית לדשבורד...
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">אבטחה בנקאית</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                הצפנה מתקדמת, אימות גוגל, ומעולם לא מאחסנים מספרי כרטיסי אשראי
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">AI חכם</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                קטגוריזציה אוטומטית של עסקאות עם למידה אישית ותובנות פיננסיות
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">דשבורד מתקדם</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                גרפים אינטראקטיביים, תקציבים, יעדים ומעקב אחר הוצאות בזמן אמת
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg">סיכומים ב-WhatsApp</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                קבל סיכום חודשי אוטומטי והתראות תקציב ישירות ב-WhatsApp
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-16">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <h3 className="font-semibold text-green-900">הפרויקט פעיל! 🎉</h3>
              <p className="text-green-700">כל התכונות המרכזיות עובדות עם דמה מדומה</p>
            </div>
          </div>
        </div>

        {/* Supported Banks */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            תומך בכל הבנקים וחברות האשראי בישראל
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['אמריקן אקספרס', 'ישראכרט', 'לאומי קארד', 'בנק הפועלים', 'בנק לאומי', 'ביט', 'פייבוקס', 'פייפאל'].map((bank) => (
              <div key={bank} className="bg-white p-4 rounded-lg shadow-sm border">
                <span className="text-sm font-medium text-gray-700">{bank}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2026 ATcz Money. כל הזכויות שמורות.</p>
            <p className="mt-2">גרסה מלאה - עובד עם דמה מדומה</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
