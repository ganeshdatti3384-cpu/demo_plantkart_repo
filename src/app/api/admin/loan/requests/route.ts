import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const requests = await db.collection('loan').find({ status: 'PENDING' }).toArray();
  return NextResponse.json(requests);
}
