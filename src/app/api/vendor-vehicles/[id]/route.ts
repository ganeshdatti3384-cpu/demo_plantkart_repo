import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import VendorVehicle from '@/models/VendorVehicle';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;

    const vehicle = await VendorVehicle.findOne({ id });

    if (!vehicle) {
      return NextResponse.json({ message: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Get vehicle error:', error);
    return NextResponse.json({ message: 'Failed to fetch vehicle' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updateData = await request.json();
    await connectToDatabase();
    const { id } = params;

    const vehicle = await VendorVehicle.findOneAndUpdate(
      { id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return NextResponse.json({ message: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Update vehicle error:', error);
    return NextResponse.json({ message: 'Failed to update vehicle' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;

    const vehicle = await VendorVehicle.findOneAndDelete({ id });

    if (!vehicle) {
      return NextResponse.json({ message: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    return NextResponse.json({ message: 'Failed to delete vehicle' }, { status: 500 });
  }
}
