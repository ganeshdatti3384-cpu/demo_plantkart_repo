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

    const client = await clientPromise;
    const db = client.db();
    
    // Get the accommodation to find the vendorId
    const item = await db.collection('accommodation').findOne({ _id: new ObjectId(params.id) });
    
    if (!item) {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }

    await db.collection('accommodation').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { status: 'APPROVED', updatedAt: new Date() } }
    );

    await createNotification({
      userId: item.vendorId,
      title: 'Accommodation Approved',
      message: `Your listing "${item.title}" has been approved and is now live.`,
      type: 'success'
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error approving accommodation:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
