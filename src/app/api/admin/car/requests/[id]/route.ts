import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || (decoded.role !== 'admin' && decoded.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await req.json();
    const client = await clientPromise;
    const db = client.db();

    const updateData = { ...data };
    delete updateData._id;
    delete updateData.userId;
    delete updateData.userObjectId;
    delete updateData.userDetails;
    updateData.updatedAt = new Date();

    await db.collection('car_requests').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    // Create notification for user
    const request = await db.collection('car_requests').findOne({ _id: new ObjectId(params.id) });
    if (request && data.status) {
      await db.collection('notifications').insertOne({
        userId: request.userId,
        title: `Car Request ${data.status}`,
        message: `Your request for ${request.title} has been ${data.status.toLowerCase()}.`,
        status: 'UNREAD',
        createdAt: new Date(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating car request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || (decoded.role !== 'admin' && decoded.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db();
    await db.collection('car_requests').deleteOne({ _id: new ObjectId(params.id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting car request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
