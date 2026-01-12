import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const now = new Date();
    // Only show approved accommodations to users
    const listings = await db.collection('accommodation')
      .find({ 
        status: 'APPROVED', 
        expiry: { $gt: now } 
      })
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(listings);
  } catch (error) {
    console.error('Error fetching accommodations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
