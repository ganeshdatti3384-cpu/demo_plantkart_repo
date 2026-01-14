import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { verifyAuth } from '@/utils/jwt';

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAuth(req as any);
    if (!auth || !['admin', 'super_admin'].includes(auth.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const requests = await db.collection('airport_pickup')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
