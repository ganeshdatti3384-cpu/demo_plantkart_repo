import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Accommodation from '@/models/Accommodation';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const accommodation = await Accommodation.findOneAndUpdate({ id: params.id }, body, { new: true });
    if (!accommodation) {
      return NextResponse.json({ error: 'Accommodation not found' }, { status: 404 });
    }
    return NextResponse.json(accommodation);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update accommodation' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const accommodation = await Accommodation.findOneAndDelete({ id: params.id });
    if (!accommodation) {
      return NextResponse.json({ error: 'Accommodation not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Accommodation deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete accommodation' }, { status: 500 });
  }
}