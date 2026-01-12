import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const now = new Date();
    // Only show approved cars to users
    const cars = await db.collection('car')
      .find({ 
        status: 'APPROVED', 
        expiry: { $gt: now } 
      })
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
