import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const requests = await db.collection('airport_pickup')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
