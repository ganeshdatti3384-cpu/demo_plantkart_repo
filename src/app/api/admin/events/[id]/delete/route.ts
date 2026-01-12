import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(req: NextRequest, { params }) {
  const client = await clientPromise;
  const db = client.db();
  await db.collection('events').deleteOne({ _id: new ObjectId(params.id) });
  return NextResponse.json({ success: true });
}
