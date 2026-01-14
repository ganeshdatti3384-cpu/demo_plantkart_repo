import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();
  const requests = await db.collection('accommodation_requests')
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
    
  return NextResponse.json(requests);
}
