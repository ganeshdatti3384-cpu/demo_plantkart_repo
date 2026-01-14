import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Vendor from '@/models/Vendor';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const vendor = await Vendor.findOne({ id });

    if (!vendor) {
      return NextResponse.json({ message: 'Vendor not found' }, { status: 404 });
    }

    return NextResponse.json(vendor);
  } catch (error) {
    console.error('Get vendor error:', error);
    return NextResponse.json({ message: 'Failed to fetch vendor' }, { status: 500 });
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

    const vendor = await Vendor.findOneAndUpdate(
      { id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return NextResponse.json({ message: 'Vendor not found' }, { status: 404 });
    }

    return NextResponse.json(vendor);
  } catch (error) {
    console.error('Update vendor error:', error);
    return NextResponse.json({ message: 'Failed to update vendor' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const vendor = await Vendor.findOneAndDelete({ id });

    if (!vendor) {
      return NextResponse.json({ message: 'Vendor not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    console.error('Delete vendor error:', error);
    return NextResponse.json({ message: 'Failed to delete vendor' }, { status: 500 });
  }
}