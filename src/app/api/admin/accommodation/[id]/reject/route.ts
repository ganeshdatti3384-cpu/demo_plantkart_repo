import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { createNotification } from '../../../../../../lib/notifications';
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

    const { reason } = await req.json();
    const client = await clientPromise;
    const db = client.db();
    
    const item = await db.collection('accommodation').findOne({ _id: new ObjectId(params.id) });
    
    if (!item) {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }

    await db.collection('accommodation').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { status: 'REJECTED', reason, updatedAt: new Date() } }
    );

    await createNotification({
      userId: item.vendorId,
      title: 'Listing Rejected',
      message: `Your listing "${item.title}" was rejected. Reason: ${reason}`,
      type: 'error'
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error rejecting accommodation:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
