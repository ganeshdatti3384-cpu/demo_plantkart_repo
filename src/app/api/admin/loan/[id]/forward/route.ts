import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(req: NextRequest, { params }) {
  const client = await clientPromise;
  const db = client.db();
  await db.collection('loan').updateOne(
    { _id: new ObjectId(params.id) },
    { $set: { status: 'FORWARDED', updatedAt: new Date() } }
  );
  return NextResponse.json({ success: true });
}
