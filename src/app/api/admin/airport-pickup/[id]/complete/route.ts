import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { createNotification } from '../../../../../../lib/notifications';

export async function PUT(req: NextRequest, { params }: { params: any }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const client = await clientPromise;
  const db = client.db();
  
  const request = await db.collection('airport_pickup').findOne({ _id: new ObjectId(id) });
  if (!request) {
    return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 });
  }

  await db.collection('airport_pickup').updateOne(
    { _id: new ObjectId(id) },
    { 
      $set: { 
        status: 'COMPLETED', 
        completedAt: new Date(),
        updatedAt: new Date() 
      } 
    }
  );

  // Notify user
  try {
    await createNotification({
      userId: request.userId,
      title: 'Airport Pickup Completed',
      message: `Your airport pickup for flight ${request.flightNumber} has been marked as completed. Thank you for using our service!`,
      type: 'AIRPORT_PICKUP'
    });
  } catch (notifErr) {
    console.error('Notification failed:', notifErr);
  }

  // Add Audit Log
  await db.collection('audit_logs').insertOne({
    action: 'AIRPORT_PICKUP_COMPLETED',
    details: { requestId: id, userId: request.userId },
    timestamp: new Date().toISOString(),
    adminId: req.headers.get('x-user-id')
  });

  return NextResponse.json({ success: true });
}
