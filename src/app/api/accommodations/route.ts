import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Accommodation from '@/models/Accommodation';

export async function GET() {
  try {
    await connectToDatabase();
    const accommodations = await Accommodation.find({});
    return NextResponse.json(accommodations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch accommodations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const accommodation = new Accommodation(body);
    await accommodation.save();
    return NextResponse.json(accommodation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create accommodation' }, { status: 500 });
  }
}