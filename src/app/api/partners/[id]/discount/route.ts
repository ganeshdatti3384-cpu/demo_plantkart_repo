import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest, { params }) {
  const client = await clientPromise;
  const db = client.db();
  const partner = await db.collection('partners').findOne({ _id: new ObjectId(params.id) });
  return NextResponse.json({ discount: partner?.discount || 0 });
}
