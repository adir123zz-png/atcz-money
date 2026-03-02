# ATcz Money

Smart personal finance manager for Israeli users.

## Features

- Google OAuth authentication
- File import for Israeli credit cards (Amex, Isracard, Leumi, etc.)
- AI-powered transaction categorization
- Dashboard with charts and insights
- Goals & budgets tracking
- WhatsApp monthly summaries
- RTL Hebrew support
- Dark mode

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Prisma + Supabase
- NextAuth.js
- OpenAI GPT-4o
- Twilio WhatsApp
- Recharts

## Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp env.example .env.local

# Run development server
npm run dev
```

## Cloudflare Deployment

### Build for Cloudflare Pages

```bash
# Build the application
npm run build

# Build for Cloudflare Pages
npm run pages:build
```

### Deploy to Cloudflare Pages

1. Push your code to GitHub repository
2. Connect your repo to Cloudflare Pages
3. Set build configuration:
   - Framework preset: `Next.js`
   - Build command: `npm run build`
   - Build output directory: `.vercel/output/static`
   - Node.js version: `20`

### Environment Variables

Set these in Cloudflare Pages → Settings → Environment Variables:

```
NEXTAUTH_URL=https://app.atcz-money.com
NEXTAUTH_SECRET=your-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
DATABASE_URL=your-supabase-url
OPENAI_API_KEY=your-openai-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
```

### Cloudflare Services

Configure these services in your Cloudflare dashboard:

- **KV Namespaces**: ATCZ_CACHE, ATCZ_SESSIONS
- **R2 Bucket**: atcz-money-imports
- **Cron Triggers**: Monthly summaries (1st of each month)
- **WAF Rules**: Rate limiting and bot protection

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare Pages](https://pages.cloudflare.com)
- [Supabase](https://supabase.com)
