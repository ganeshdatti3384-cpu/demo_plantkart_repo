import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { createNotification } from '../../../../../../lib/notifications';

export async function PUT(req: NextRequest, { params }: { params: any }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const body = await req.json();
    const { driverPhone, vehicleNumber, vehicleType, pickupPoint } = body;
    
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
      { 
        $set: { 
          driverPhone: driverPhone || request.driverPhone,
          vehicleNumber: vehicleNumber || request.vehicleNumber,
          vehicleType: vehicleType || request.vehicleType,
          pickupPoint: pickupPoint || request.pickupPoint,
          updatedAt: new Date()
        } 
      }
    );

    // Notify user of update
    try {
      await createNotification({
        userId: request.userId,
        title: 'Driver Details Updated',
        message: `Your driver details for flight ${request.flightNumber} have been updated. Please check your dashboard.`,
        type: 'AIRPORT_PICKUP'
      });
    } catch (notifErr) {
      console.error('Notification failed:', notifErr);
    }

    // Add Audit Log
    await db.collection('audit_logs').insertOne({
      action: 'AIRPORT_PICKUP_DRIVER_UPDATED',
      details: { requestId: id, userId: request.userId, updatedFields: Object.keys(body) },
      timestamp: new Date().toISOString(),
      adminId: req.headers.get('x-user-id')
    });

    return NextResponse.json({ success: true, message: 'Driver details updated' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
