import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import PickupRequest from '@/models/PickupRequest';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query: any = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const pickupRequests = await PickupRequest.find(query).sort({ createdAt: -1 });

    return NextResponse.json(pickupRequests);
  } catch (error) {
    console.error('Get pickup requests error:', error);
    return NextResponse.json({ message: 'Failed to fetch pickup requests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const pickupData = await request.json();
    await connectToDatabase();

    // Generate unique ID
    const id = `pickup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const pickupRequest = new PickupRequest({
      ...pickupData,
      id,
    });

    await pickupRequest.save();

    return NextResponse.json(pickupRequest, { status: 201 });
  } catch (error) {
    console.error('Create pickup request error:', error);
    return NextResponse.json({ message: 'Failed to create pickup request' }, { status: 500 });
  }
}