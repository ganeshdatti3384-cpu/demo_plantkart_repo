import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Consultant from '@/models/Consultant';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const consultant = await Consultant.findOne({ id });

    if (!consultant) {
      return NextResponse.json({ message: 'Consultant not found' }, { status: 404 });
    }

    return NextResponse.json(consultant);
  } catch (error) {
    console.error('Get consultant error:', error);
    return NextResponse.json({ message: 'Failed to fetch consultant' }, { status: 500 });
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

    const consultant = await Consultant.findOneAndUpdate(
      { id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!consultant) {
      return NextResponse.json({ message: 'Consultant not found' }, { status: 404 });
    }

    return NextResponse.json(consultant);
  } catch (error) {
    console.error('Update consultant error:', error);
    return NextResponse.json({ message: 'Failed to update consultant' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const consultant = await Consultant.findOneAndDelete({ id });

    if (!consultant) {
      return NextResponse.json({ message: 'Consultant not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Consultant deleted successfully' });
  } catch (error) {
    console.error('Delete consultant error:', error);
    return NextResponse.json({ message: 'Failed to delete consultant' }, { status: 500 });
  }
}