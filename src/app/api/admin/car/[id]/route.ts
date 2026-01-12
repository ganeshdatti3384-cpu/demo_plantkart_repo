import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyAuth } from '@/utils/jwt';
import { createAuditLog } from '@/lib/audit';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyAuth(req);
    if (!auth || !['admin', 'super_admin'].includes(auth.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const data = await req.json();
    const client = await clientPromise;
    const db = client.db();

    const updateData = { ...data };
    delete updateData._id;
    updateData.updatedAt = new Date();

    await db.collection('cars').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    await createAuditLog({
      userId: auth.userId,
      action: 'UPDATE_CAR',
      entity: 'Car',
      entityId: id,
      details: { updatedFields: Object.keys(updateData) }
    });

    return NextResponse.json({ message: 'Car updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyAuth(req);
    if (!auth || !['admin', 'super_admin'].includes(auth.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const client = await clientPromise;
    const db = client.db();

    await db.collection('cars').deleteOne({ _id: new ObjectId(id) });

    await createAuditLog({
      userId: auth.userId,
      action: 'DELETE_CAR',
      entity: 'Car',
      entityId: id,
      details: { carId: id }
    });

    return NextResponse.json({ message: 'Car deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
