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

    await db.collection('consultant_bookings').deleteOne({ _id: new ObjectId(id) });

    await createAuditLog({
      userId: auth.userId,
      action: 'CANCEL_BOOKING_ADMIN',
      entity: 'Booking',
      entityId: id,
      details: { cancelledBy: auth.userId }
    });

    return NextResponse.json({ message: 'Booking removed successfully' });
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

    await db.collection('consultant_bookings').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    await createAuditLog({
      userId: auth.userId,
      action: 'UPDATE_BOOKING_ADMIN',
      entity: 'Booking',
      entityId: id,
      details: { updatedBy: auth.userId, changes: updateData }
    });

    return NextResponse.json({ message: 'Booking updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
