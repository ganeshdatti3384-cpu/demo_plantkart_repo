import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const now = new Date();
    const offers = await db.collection('offers').find({ expiryDate: { $gt: now } }).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(offers);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
