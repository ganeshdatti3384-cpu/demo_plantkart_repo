import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Consultant from '@/models/Consultant';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const specialization = searchParams.get('specialization');
    const location = searchParams.get('location');
    const availability = searchParams.get('availability') !== 'false';

    let query: any = { availability };

    if (specialization && specialization !== 'all') {
      query.specialization = { $in: [specialization] };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const consultants = await Consultant.find(query).sort({ rating: -1 });

    return NextResponse.json(consultants);
  } catch (error) {
    console.error('Get consultants error:', error);
    return NextResponse.json({ message: 'Failed to fetch consultants' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const consultantData = await request.json();
    await connectToDatabase();

    // Generate unique ID
    const id = `consultant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const consultant = new Consultant({
      ...consultantData,
      id,
    });

    await consultant.save();

    return NextResponse.json(consultant, { status: 201 });
  } catch (error) {
    console.error('Create consultant error:', error);
    return NextResponse.json({ message: 'Failed to create consultant' }, { status: 500 });
  }
}