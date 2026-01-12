import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { createNotification } from '../../../../../../lib/notifications';
import { sendEmail } from '../../../../../../lib/email';

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
    
    const { driverName, driverPhone, vehicleNumber, vehicleType, pickupPoint, adminNotes } = body;
    const client = await clientPromise;
    const db = client.db();
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid ID format' }, { status: 400 });
    }

    if (!driverName || !driverPhone || !vehicleNumber || !vehicleType || !pickupPoint) {
      return NextResponse.json({ success: false, message: 'Missing mandatory driver details' }, { status: 400 });
    }

    const request = await db.collection('airport_pickup').findOne({ _id: new ObjectId(id) });
    
    if (!request) {
      return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 });
    }

    const updateData = {
      status: 'ACCEPTED',
      driverName,
      driverPhone,
      vehicleNumber,
      vehicleType,
      pickupPoint,
      adminNotes: adminNotes || null,
      assignedAt: new Date(),
      assignedBy: req.headers.get('x-user-id'),
      updatedAt: new Date()
    };

    await db.collection('airport_pickup').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Notify user via DB notification
    try {
      await createNotification({
        userId: request.userId,
        title: 'Airport Pickup Accepted',
        message: `Your pickup request for flight ${request.flightNumber} has been accepted. Driver ${driverName} will meet you at ${pickupPoint}.`,
        type: 'AIRPORT_PICKUP'
      });
    } catch (notifErr) {
      console.error('Notification failed:', notifErr);
    }

    // Fetch user for email
    if (request.userId) {
      const user = await db.collection('users').findOne({ 
        _id: ObjectId.isValid(request.userId) ? new ObjectId(request.userId) : request.userId 
      });

      if (user && user.email) {
        try {
          await sendEmail({
            to: user.email,
            subject: 'Airport Pickup Confirmed!',
            text: `Your airport pickup request for flight ${request.flightNumber} has been accepted.\n\nDriver Details:\nName: ${driverName}\nPhone: ${driverPhone}\nVehicle: ${vehicleNumber} (${vehicleType})\nPickup Point: ${pickupPoint}`,
            html: `
              <h3>Airport Pickup Confirmed!</h3>
              <p>Your request for flight <strong>${request.flightNumber}</strong> has been accepted.</p>
              <div style="padding: 15px; background: #f3f4f6; border-radius: 8px;">
                <strong>Driver Details:</strong><br/>
                Name: ${driverName}<br/>
                Phone: ${driverPhone}<br/>
                Vehicle: ${vehicleNumber} (${vehicleType})<br/>
                Pickup Point: ${pickupPoint}
              </div>
            `
          });
        } catch (emailErr) {
          console.error('Email notification failed:', emailErr);
        }
      }
    }

    // Add Audit Log
    try {
      await db.collection('audit_logs').insertOne({
        action: 'AIRPORT_PICKUP_ACCEPTED',
        details: { requestId: id, userId: request.userId, driverName, vehicleNumber },
        timestamp: new Date().toISOString(),
        adminId: req.headers.get('x-user-id')
      });
    } catch (auditErr) {
      console.error('Audit log failed:', auditErr);
    }

    return NextResponse.json({ success: true, message: 'Request accepted and driver assigned' });
  } catch (error: any) {
    console.error('Airport Pickup Accept Error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
