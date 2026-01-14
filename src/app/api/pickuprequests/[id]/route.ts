import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import PickupRequest from '@/models/PickupRequest';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const pickupRequest = await PickupRequest.findOne({ id });

    if (!pickupRequest) {
      return NextResponse.json({ message: 'Pickup request not found' }, { status: 404 });
    }

    return NextResponse.json(pickupRequest);
  } catch (error) {
    console.error('Get pickup request error:', error);
    return NextResponse.json({ message: 'Failed to fetch pickup request' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const updateData = await request.json();
    await connectToDatabase();
    const { id } = await params;

    const pickupRequest = await PickupRequest.findOneAndUpdate(
      { id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!pickupRequest) {
      return NextResponse.json({ message: 'Pickup request not found' }, { status: 404 });
    }

    return NextResponse.json(pickupRequest);
  } catch (error) {
    console.error('Update pickup request error:', error);
    return NextResponse.json({ message: 'Failed to update pickup request' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const pickupRequest = await PickupRequest.findOneAndDelete({ id });

    if (!pickupRequest) {
      return NextResponse.json({ message: 'Pickup request not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Pickup request deleted successfully' });
  } catch (error) {
    console.error('Delete pickup request error:', error);
    return NextResponse.json({ message: 'Failed to delete pickup request' }, { status: 500 });
  }
}