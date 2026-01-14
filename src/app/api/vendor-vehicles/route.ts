import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import VendorVehicle from '@/models/VendorVehicle';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const vendorName = searchParams.get('vendorName');

    let query: any = {};

    if (vendorName) {
      query.vendorName = vendorName;
    }

    const vehicles = await VendorVehicle.find(query).sort({ make: 1 });

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Get vendor vehicles error:', error);
    return NextResponse.json({ message: 'Failed to fetch vendor vehicles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const vehicleData = await request.json();
    await connectToDatabase();

    const id = `veh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const vehicle = new VendorVehicle({
      ...vehicleData,
      id,
    });

    await vehicle.save();

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error('Create vendor vehicle error:', error);
    return NextResponse.json({ message: 'Failed to create vendor vehicle' }, { status: 500 });
  }
}
