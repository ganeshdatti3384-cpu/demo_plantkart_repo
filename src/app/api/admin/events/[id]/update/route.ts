import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(req: NextRequest, { params }) {
  const data = await req.json();
  const client = await clientPromise;
  const db = client.db();
  await db.collection('events').updateOne(
    { _id: new ObjectId(params.id) },
    { $set: { ...data, updatedAt: new Date() } }
  );
  return NextResponse.json({ success: true });
}
