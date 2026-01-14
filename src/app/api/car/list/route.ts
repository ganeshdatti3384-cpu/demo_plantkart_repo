import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const now = new Date();
  const cars = await db.collection('car').find({ status: 'APPROVED', expiry: { $gt: now } }).toArray();
  return NextResponse.json(cars);
}
