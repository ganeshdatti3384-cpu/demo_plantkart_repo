import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  const data = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection('loan').insertOne({
    ...data,
    userId,
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return NextResponse.json({ success: true, id: result.insertedId });
}
