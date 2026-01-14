import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest, { params }) {
  const client = await clientPromise;
  const db = client.db();
  const event = await db.collection('events').findOne({ _id: new ObjectId(params.id) });
  return NextResponse.json(event);
}
