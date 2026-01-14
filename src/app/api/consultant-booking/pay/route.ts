// Payment integration removed. Endpoint disabled.
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return NextResponse.json({ error: 'Payment integration is currently disabled.' }, { status: 503 });
}
