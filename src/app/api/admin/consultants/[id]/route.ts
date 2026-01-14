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

    // Clean up data for update
    const updateData = { ...data };
    delete updateData._id;
    delete updateData.userId;
    delete updateData.createdAt;
    
    updateData.updatedAt = new Date();

    const result = await db.collection('consultants').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Consultant not found' }, { status: 404 });
    }

    await createAuditLog({
      userId: auth.userId,
      action: 'UPDATE_CONSULTANT',
      entity: 'Consultant',
      entityId: id,
      details: { updatedFields: Object.keys(updateData) }
    });

    return NextResponse.json({ message: 'Consultant updated successfully' });
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

    const consultant = await db.collection('consultants').findOne({ _id: new ObjectId(id) });
    if (!consultant) {
      return NextResponse.json({ message: 'Consultant not found' }, { status: 404 });
    }

    // Optional: Also delete or update the associated user role? 
    // Usually, we just remove the consultant profile.
    
    await db.collection('consultants').deleteOne({ _id: new ObjectId(id) });

    await createAuditLog({
      userId: auth.userId,
      action: 'DELETE_CONSULTANT',
      entity: 'Consultant',
      entityId: id,
      details: { consultantEmail: consultant.email }
    });

    return NextResponse.json({ message: 'Consultant deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
