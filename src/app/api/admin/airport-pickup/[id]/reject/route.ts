import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { createNotification } from '../../../../../../lib/notifications';

export async function PUT(req: NextRequest, { params }: { params: any }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    let body;
    try {
      body = await req.json();
    } catch (e) {
      body = {};
    }
    
    const { reason } = body;
    const client = await clientPromise;
    const db = client.db();
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid ID format' }, { status: 400 });
    }

    const request = await db.collection('airport_pickup').findOne({ _id: new ObjectId(id) });
    
    if (!request) {
      return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 });
    }

    await db.collection('airport_pickup').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'REJECTED', rejectReason: reason || 'No reason provided', updatedAt: new Date() } }
    );

    // Notify user
    try {
      await createNotification({
        userId: request.userId,
        title: 'Airport Pickup Rejected',
        message: `Your pickup request for flight ${request.flightNumber} has been rejected. Reason: ${reason || 'No reason provided'}.`,
        type: 'AIRPORT_PICKUP'
      });
    } catch (notifErr) {
      console.error('Notification failed:', notifErr);
    }

    // Add Audit Log
    await db.collection('audit_logs').insertOne({
      action: 'AIRPORT_PICKUP_REJECTED',
      details: { requestId: id, reason, userId: request.userId },
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Airport Pickup Reject Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
