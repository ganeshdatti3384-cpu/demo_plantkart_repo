import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyAuth } from '@/utils/jwt';
import { createAuditLog } from '@/lib/audit';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyAuth(req);
    if (!auth || !['admin', 'super_admin'].includes(auth.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const client = await clientPromise;
    const db = client.db();

    await db.collection('payments').deleteOne({ _id: new ObjectId(id) });

    await createAuditLog({
      userId: auth.userId,
      action: 'PURGE_PAYMENT',
      entity: 'Payment',
      entityId: id,
      details: { purgedById: auth.userId }
    });

    return NextResponse.json({ message: 'Payment record purged' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyAuth(req);
    if (!auth || !['admin', 'super_admin'].includes(auth.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db();

    const updateData = { ...body };
    delete updateData._id;

    await db.collection('payments').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    await createAuditLog({
      userId: auth.userId,
      action: 'UPDATE_PAYMENT',
      entity: 'Payment',
      entityId: id,
      details: { updatedById: auth.userId, changes: updateData }
    });

    return NextResponse.json({ message: 'Payment updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
