import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const client = await clientPromise;
    const db = client.db();

    // Fetch user details for embedded snapshot
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const pickupRequest = {
      userId,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
      // Embedded User Snapshot
      userFullName: user.name || user.fullName,
      userEmail: user.email,
      userPhone: user.phone || user.mobileNumber,
      nationality: user.nationality || 'N/A',
      currentCountry: user.currentCountry || 'N/A',
      // Arrival & Visit Details
      arrivalAirport: data.arrivalAirport,
      airlineName: data.airlineName,
      flightNumber: data.flightNumber,
      arrivalDate: data.arrivalDate,
      arrivalTime: data.arrivalTime,
      terminalNumber: data.terminalNumber,
      purposeOfVisit: data.purposeOfVisit,
      collegeName: data.purposeOfVisit === 'Study' ? data.collegeName : null,
      collegeCity: data.purposeOfVisit === 'Study' ? data.collegeCity : null,
      luggageCount: data.luggageCount || 0,
      specialInstructions: data.specialInstructions || '',
      // Admin Fields (initially empty)
      driverName: null,
      driverPhone: null,
      vehicleNumber: null,
      vehicleType: null,
      pickupPoint: null,
      adminNotes: null,
      assignedAt: null,
      assignedBy: null
    };

    const result = await db.collection('airport_pickup').insertOne(pickupRequest);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
