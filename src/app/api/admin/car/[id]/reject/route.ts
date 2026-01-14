import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyAuth } from '@/utils/jwt';

export async function PUT(req: NextRequest, { params }) {
  const auth = await verifyAuth(req as unknown as Request);
  if (!auth || !['admin', 'super_admin'].includes(auth.role)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { reason } = await req.json();
  const client = await clientPromise;
  const db = client.db();
  await db.collection('car').updateOne(
    { _id: new ObjectId(params.id) },
    { $set: { status: 'REJECTED', reason, updatedAt: new Date() } }
  );
  return NextResponse.json({ success: true });
}
