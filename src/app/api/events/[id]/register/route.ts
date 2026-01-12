import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest, { params }) {
  const userId = req.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    
    const eventId = params.id;
    
    // Check if user is already registered (optional, can keep both for redundancy)
    const event = await db.collection('events').findOne({ 
      _id: new ObjectId(eventId)
    });

    if (!event) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }

    if (event.attendees?.includes(userId)) {
      return NextResponse.json({ success: false, message: 'Already registered' });
    }

    // Add to attendees list in event document
    await db.collection('events').updateOne(
      { _id: new ObjectId(eventId) },
      { $addToSet: { attendees: userId } }
    );

    // Create a separate registration record for the vendor to see in their dashboard
    await db.collection('event_registrations').insertOne({
      eventId: eventId,
      userId: userId,
      vendorId: event.vendorId || null, // Link to the uploader
      title: event.title,
      category: event.category,
      date: event.date,
      location: event.location,
      status: 'REGISTERED',
      createdAt: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
