import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET(req: NextRequest) {
  // TODO: Use JWT to get userId
  const userId = req.headers.get('x-user-id');
  const client = await clientPromise;
  const db = client.db();
  const notifications = await db.collection('notifications').find({ userId }).toArray();
  return NextResponse.json(notifications);
}
