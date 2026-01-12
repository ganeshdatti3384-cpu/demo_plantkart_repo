import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET(req: NextRequest) {
  // TODO: Use JWT to get consultantId
  const consultantId = req.headers.get('x-user-id');
  const client = await clientPromise;
  const db = client.db();
  const meetings = await db.collection('meetings').find({ consultantId }).toArray();
  return NextResponse.json(meetings);
}
