import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { verifyAuth } from '@/utils/jwt';

export async function GET(req: NextRequest) {
  // authorization check: ensure admin
  // Note: using headers-based verifyAuth since middleware adds x-user-role/x-user-id
  // If request is not authorized, return 401
  try {
    const auth = req ? await verifyAuth(req as unknown as Request) : null;
    if (!auth || !['admin', 'super_admin'].includes(auth.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const pending = await db.collection('accommodation').find({ status: 'PENDING' }).toArray();
    return NextResponse.json(pending);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
