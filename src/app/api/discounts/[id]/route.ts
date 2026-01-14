import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Discount from '@/models/Discount';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const discount = await Discount.findOne({ id });

    if (!discount) {
      return NextResponse.json({ message: 'Discount not found' }, { status: 404 });
    }

    return NextResponse.json(discount);
  } catch (error) {
    console.error('Get discount error:', error);
    return NextResponse.json({ message: 'Failed to fetch discount' }, { status: 500 });
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

    const discount = await Discount.findOneAndUpdate(
      { id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!discount) {
      return NextResponse.json({ message: 'Discount not found' }, { status: 404 });
    }

    return NextResponse.json(discount);
  } catch (error) {
    console.error('Update discount error:', error);
    return NextResponse.json({ message: 'Failed to update discount' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const discount = await Discount.findOneAndDelete({ id });

    if (!discount) {
      return NextResponse.json({ message: 'Discount not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Discount deleted successfully' });
  } catch (error) {
    console.error('Delete discount error:', error);
    return NextResponse.json({ message: 'Failed to delete discount' }, { status: 500 });
  }
}