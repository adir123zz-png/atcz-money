# ATcz Money - Deployment Guide

## 🚀 Cloudflare Pages Deployment

### 1. Prerequisites

- Cloudflare account
- GitHub repository
- Supabase project
- Google OAuth credentials
- OpenAI API key
- Twilio account (for WhatsApp)

### 2. Environment Variables

Create these in Cloudflare Pages → Settings → Environment Variables:

```bash
# App
ENVIRONMENT=production
NEXT_PUBLIC_APP_URL=https://app.atcz-money.com
NODE_VERSION=20

# Authentication
NEXTAUTH_URL=https://app.atcz-money.com
NEXTAUTH_SECRET=<generate: openssl rand -base64 32>
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>

# Database
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
SUPABASE_URL=https://[project].supabase.co
SUPABASE_ANON_KEY=<from Supabase Dashboard>
SUPABASE_SERVICE_ROLE_KEY=<from Supabase Dashboard>

# AI
OPENAI_API_KEY=sk-...

# WhatsApp
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=<from Twilio Console>
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Cloudflare Services
CLOUDFLARE_ACCOUNT_ID=<from Cloudflare Dashboard>
R2_ACCESS_KEY_ID=<R2 API token key ID>
R2_SECRET_ACCESS_KEY=<R2 API token secret>
R2_BUCKET_NAME=atcz-money-imports

# Security
ENCRYPTION_KEY=<generate: openssl rand -base64 32>
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=15m
```

### 3. Cloudflare Services Setup

#### KV Namespaces
1. Go to Cloudflare Dashboard → Workers & Pages → KV
2. Create two namespaces:
   - `ATCZ_CACHE` (for AI results, exchange rates)
   - `ATCZ_SESSIONS` (for refresh tokens)

#### R2 Bucket
1. Go to Cloudflare Dashboard → R2
2. Create bucket: `atcz-money-imports`
3. Generate API tokens with R2 permissions

#### Cron Triggers
In `wrangler.toml`:
```toml
[[triggers.crons]]
crons = ["0 6 1 * *"]  # Monthly summaries at 06:00 UTC
```

### 4. Database Setup

1. Create Supabase project
2. Run database migrations:
```bash
npm run db:push
npm run db:seed
```

3. Enable Row Level Security (RLS) on all tables
4. Create RLS policies for user data isolation

### 5. Build Configuration

In Cloudflare Pages → Settings → Builds & deployments:

- **Framework preset**: `Next.js`
- **Build command**: `npm run build`
- **Build output directory**: `.vercel/output/static`
- **Node.js version**: `20`
- **Root directory**: `/`

### 6. Security Headers

The app includes security headers in `next.config.js`:
- HSTS
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options

### 7. WAF Rules

Configure in Cloudflare Dashboard → Security → WAF:

| Rule | Expression | Action |
|------|------------|--------|
| Rate Limit API | `http.request.uri.path contains "/api/" and rate > 100/min` | Block |
| Rate Limit Auth | `http.request.uri.path eq "/api/auth/google" and rate > 10/min` | Challenge |
| Block Bad Bots | `cf.client.bot = true and not cf.verified_bot` | Block |

### 8. Custom Domain

1. Add custom domain in Cloudflare Pages
2. Update Google OAuth redirect URI:
   `https://app.atcz-money.com/api/auth/callback/google`

### 9. Monitoring

- Cloudflare Analytics for traffic
- Supabase Logs for database issues
- Custom error tracking in audit_log table

### 10. Local Development

```bash
# Install dependencies
npm install

# Setup environment
cp env.example .env.local

# Generate Prisma client
npm run db:generate

# Setup database
npm run db:push
npm run db:seed

# Run development server
npm run dev
```

## 📱 Features Included

- ✅ Google OAuth authentication
- ✅ File import for Israeli credit cards
- ✅ AI-powered transaction categorization
- ✅ Dashboard with charts and insights
- ✅ Transaction management CRUD
- ✅ Goals & budgets system
- ✅ WhatsApp summaries (Twilio)
- ✅ RTL Hebrew support
- ✅ Dark mode
- ✅ Security headers and middleware
- ✅ Row-Level Security
- ✅ Cloudflare R2 storage
- ✅ Cloudflare KV caching

## 🔧 Troubleshooting

### Build Issues
- Check Node.js version (must be 20)
- Verify all environment variables
- Check Prisma schema validity

### Runtime Issues
- Check Supabase connection
- Verify JWT secret matches
- Check R2 bucket permissions

### Performance Issues
- Enable Cloudflare caching
- Check database indexes
- Monitor KV cache hit rates

## 📞 Support

For deployment issues:
1. Check Cloudflare Pages logs
2. Review Supabase logs
3. Verify environment variables
4. Check WAF rules blocking requests
