import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const { requestId, type, paymentId, amount } = await req.json();
    const userId = req.headers.get('x-user-id');

    if (!requestId || !type) {
      return NextResponse.json({ error: 'Missing payment metadata' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const collections: Record<string, string> = {
      'PICKUP': 'airport_pickup',
      'ACCOMMODATION': 'accommodation_requests',
      'LOAN': 'loans',
      'CONSULTANCY': 'consultant_booking',
      'CAR': 'car_requests'
    };

    const collectionName = collections[type];
    if (!collectionName) {
      return NextResponse.json({ error: 'Unsupported service type' }, { status: 400 });
    }

    // Prepare update object
    const updateData: any = { 
      paymentStatus: 'PAID',
      transactionId: paymentId || `TRX-${Date.now()}`,
      paidAmount: amount,
      updatedAt: new Date().toISOString()
    };

    // If consultancy, move to REQUEST_SENT status as per spec
    if (type === 'CONSULTANCY') {
      updateData.status = 'REQUEST_SENT';
    }

    // 1. Update the status in the relevant collection
    const updateResult = await db.collection(collectionName).updateOne(
      { _id: new ObjectId(requestId) },
      { $set: updateData }
    );

    if (updateResult.matchedCount === 0) {
       return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    // 2. Log in global audit
    await db.collection('audit_logs').insertOne({
      userId,
      action: 'PAYMENT_VERIFIED',
      details: { requestId, type, amount, paymentId },
      timestamp: new Date().toISOString()
    });

    // 3. Notify the user
    await db.collection('notifications').insertOne({
      userId,
      title: 'Payment Confirmed',
      message: `Payment of AUD ${amount} for your ${type.toLowerCase()} request has been received.`,
      status: 'UNREAD',
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Database updated to PAID status.' 
    });

  } catch (error) {
    console.error('Payment DB Error:', error);
    return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 });
  }
}
