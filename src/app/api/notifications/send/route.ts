import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection('notifications').insertOne({
    ...data,
    createdAt: new Date(),
    read: false,
  });
  return NextResponse.json({ success: true, id: result.insertedId });
}
