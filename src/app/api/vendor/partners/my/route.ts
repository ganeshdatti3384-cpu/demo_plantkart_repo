import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getUserIdFromToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const partners = await db.collection('partners')
      .find({ vendorId: userId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(partners);
  } catch (error) {
    console.error('Error fetching vendor partners:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
