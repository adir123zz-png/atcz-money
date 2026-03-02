import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/transactions/:path*',
    '/api/import/:path*',
    '/api/reports/:path*',
    '/api/budgets/:path*',
    '/api/goals/:path*',
    '/api/whatsapp/:path*',
  ],
};

export async function middleware(request: NextRequest) {
  // 1. Get token from cookie or Authorization header
  const token = 
    request.cookies.get('next-auth.session-token')?.value ||
    request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // 2. Verify JWT at the Edge (no DB call)
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    
    // 3. Pass user ID downstream via header
    const response = NextResponse.next();
    response.headers.set('X-User-Id', payload.sub!);
    response.headers.set('X-User-Email', payload.email as string);
    return response;
    
  } catch {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
