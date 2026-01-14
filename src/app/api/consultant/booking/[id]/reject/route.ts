import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(req: NextRequest, { params }) {
  const { reason } = await req.json();
  const client = await clientPromise;
  const db = client.db();
  await db.collection('consultant_booking').updateOne(
    { _id: new ObjectId(params.id) },
    { $set: { status: 'REJECTED', reason, updatedAt: new Date() } }
  );
  return NextResponse.json({ success: true });
}
