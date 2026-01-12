import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getUserIdFromToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Find registrations for this user
    const registrations = await db.collection('event_registrations')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    // Fetch event details for each registration
    const enrichedRegistrations = await Promise.all(registrations.map(async (reg) => {
      let event = null;
      try {
        event = await db.collection('events').findOne({ _id: new ObjectId(reg.eventId) });
      } catch (e) {
        console.error("Invalid event ID in registration:", reg.eventId);
      }
      return {
        ...reg,
        eventTitle: event?.title || reg.title || 'Unknown Event',
        eventDate: event?.date || reg.date || reg.createdAt,
        eventLocation: event?.location || reg.location || 'TBA',
        eventImage: event?.image
      };
    }));

    return NextResponse.json(enrichedRegistrations);
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
