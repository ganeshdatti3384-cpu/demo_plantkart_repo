import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    // You may want to filter by vendorId if available in headers or session
    // For now, return all accommodation bookings
    const bookings = await db.collection('accommodation_requests').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch accommodation bookings', details: error }, { status: 500 });
  }
}
