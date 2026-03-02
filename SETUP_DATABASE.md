# הגדרת מסד נתונים ל-ATcz Money

## אופציה 1: Supabase Cloud (מומלץ לפיתוח)

1. **צור חשבון ב-Supabase**
   - היכנס ל https://supabase.com
   - צור חשבון חינם
   - צור פרויקט חדש

2. **קבל את פרטי ההתחברות**
   - Project URL
   - Anon Key  
   - Service Role Key

3. **הגדר את הסביבה**
   החלף את המידע בקובץ `.env.development`:

```bash
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
SUPABASE_URL=https://[project].supabase.co
SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-key]
```

4. **הרץ את ה-migrations**
```bash
npm run db:push
npm run db:seed
```

## אופציה 2: Docker PostgreSQL (מתקדם)

אם יש לך Docker מותקן:

```bash
# הרץ PostgreSQL ב-Docker
docker run --name atcz-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=atcz_money -p 5432:5432 -d postgres:15

# הגדר את הסביבה
DATABASE_URL=postgresql://postgres:password@localhost:5432/atcz_money
```

## אופציה 3: PostgreSQL מקומי

אם יש לך PostgreSQL מותקן על המחשב:

```bash
# צור מסד נתונים
createdb atcz_money

# הגדר משתמש
createuser atcz_user

# הענק הרשאות
psql -d atcz_money -c "GRANT ALL PRIVILEGES ON DATABASE atcz_money TO atcz_user;"
```

## המלצה שלי

**התחל עם Supabase Cloud** - זה:
- חינם לפיתוח
- קל להגדיר
- זהה לסביבת הייצור
- ניתן לגבות ולשחזר
- תומך ב-Realtime

אחרי שהכל עובד, אפשר להעביר לפתרון מקומי אם צריך.
