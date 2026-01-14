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
    
    // Check if user is already registered
    const event = await db.collection('events').findOne({ 
      _id: new ObjectId(eventId),
      attendees: userId
    });

    if (event) {
      return NextResponse.json({ success: false, message: 'Already registered' });
    }

    await db.collection('events').updateOne(
      { _id: new ObjectId(eventId) },
      { $addToSet: { attendees: userId } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
