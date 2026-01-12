import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { getUserIdFromToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized - No Token' }, { status: 401 });
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized - Invalid User' }, { status: 401 });
    }

    const data = await req.json();
    const client = await clientPromise;
    const db = client.db();

    // Fetch car details to get vendorId
    const car = await db.collection('car').findOne({ _id: new ObjectId(data.carId) });
    const vendorId = car?.vendorId || null;

    // Log the request attempt
    console.log(`Creating car request for user ${userId}:`, data);

    const result = await db.collection('car_requests').insertOne({
      ...data,
      userId: userId.toString(),
      vendorId: vendorId, // Add vendorId so the provider can see it
      status: 'PENDING_PAYMENT',
      paymentStatus: 'UNPAID',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error: any) {
    console.error('Car request error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Internal server error during request creation' 
    }, { status: 500 });
  }
}
