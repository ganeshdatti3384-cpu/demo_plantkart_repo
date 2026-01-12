import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { getUserIdFromToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const data = await req.json();
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('accommodation').insertOne({
      ...data,
      vendorId: userId,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
      expiry: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error creating accommodation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
