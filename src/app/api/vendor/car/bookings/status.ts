import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const { bookingId, status } = await req.json();
    if (!bookingId || !status) {
      return NextResponse.json({ error: 'Missing bookingId or status' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    await db.collection('car_requests').updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: { status } }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update status', details: error }, { status: 500 });
  }
}
