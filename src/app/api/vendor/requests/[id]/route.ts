import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getUserIdFromToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const userId = getUserIdFromToken(token);
    if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { status, type } = await req.json();
    const client = await clientPromise;
    const db = client.db();

    let collectionName = '';
    if (type === 'CAR') collectionName = 'car_requests';
    else if (type === 'ACCOMMODATION') collectionName = 'accommodation_requests';
    else if (type === 'EVENT') collectionName = 'event_registrations';
    else return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });

    // Verify this vendor owns the listing associated with this request
    const request = await db.collection(collectionName).findOne({ _id: new ObjectId(params.id) });
    if (!request || request.vendorId !== userId.toString()) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const result = await db.collection(collectionName).updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { status, updatedAt: new Date() } }
    );

    if (result.modifiedCount > 0) {
      // Create notification for the customer
      let serviceName = '';
      if (type === 'CAR') serviceName = 'car rental';
      else if (type === 'ACCOMMODATION') serviceName = 'accommodation';
      else if (type === 'EVENT') serviceName = 'event registration';

      await db.collection('notifications').insertOne({
        userId: request.userId,
        title: 'Booking Update',
        message: `Your ${serviceName} request has been ${status.toLowerCase()}.`,
        status: 'UNREAD',
        createdAt: new Date()
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
