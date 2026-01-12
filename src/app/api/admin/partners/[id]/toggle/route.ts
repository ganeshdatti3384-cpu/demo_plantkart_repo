import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(req: NextRequest, { params }) {
  const client = await clientPromise;
  const db = client.db();
  const partner = await db.collection('partners').findOne({ _id: new ObjectId(params.id) });
  await db.collection('partners').updateOne(
    { _id: new ObjectId(params.id) },
    { $set: { enabled: !partner.enabled, updatedAt: new Date() } }
  );
  return NextResponse.json({ success: true, enabled: !partner.enabled });
}
