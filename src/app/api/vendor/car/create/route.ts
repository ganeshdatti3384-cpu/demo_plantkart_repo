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

    console.log(`Vendor ${userId} creating car listing:`, data);

    const result = await db.collection('car').insertOne({
      ...data,
      vendorId: userId.toString(),
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
      expiry: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error: any) {
    console.error('Error creating car listing:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error during listing creation' 
    }, { status: 500 });
  }
}
