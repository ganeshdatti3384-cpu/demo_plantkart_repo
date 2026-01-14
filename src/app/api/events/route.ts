import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Event from '@/models/Event';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'Active';

    let query: any = { status };

    if (category && category !== 'all') {
      query.category = category;
    }

    const events = await Event.find(query).sort({ date: 1 });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json({ message: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json();
    await connectToDatabase();

    // Generate unique ID
    const id = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const event = new Event({
      ...eventData,
      id,
    });

    await event.save();

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json({ message: 'Failed to create event' }, { status: 500 });
  }
}