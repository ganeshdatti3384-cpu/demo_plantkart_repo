import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const location = searchParams.get('location');
    const vendorName = searchParams.get('vendorName');
    const availability = searchParams.get('availability') !== 'false';

    let query: any = { availability };

    if (type && type !== 'all') {
      query.type = type;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (vendorName) {
      query.vendorName = vendorName;
    }

    const vehicles = await Vehicle.find(query).sort({ name: 1 });

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Get vehicles error:', error);
    return NextResponse.json({ message: 'Failed to fetch vehicles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const vehicleData = await request.json();
    await connectToDatabase();

    // Generate unique ID
    const id = `vehicle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const vehicle = new Vehicle({
      ...vehicleData,
      id,
    });

    await vehicle.save();

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error('Create vehicle error:', error);
    return NextResponse.json({ message: 'Failed to create vehicle' }, { status: 500 });
  }
}