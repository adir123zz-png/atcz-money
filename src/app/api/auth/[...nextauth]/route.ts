export const runtime = 'edge';

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { error: 'Auth is disabled in this Cloudflare demo deployment.' },
    { status: 501 }
  );
}

export const POST = GET;
