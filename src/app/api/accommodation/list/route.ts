import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const now = new Date();
  const listings = await db.collection('accommodation').find({ status: 'APPROVED', expiry: { $gt: now } }).toArray();
  return NextResponse.json(listings);
}
