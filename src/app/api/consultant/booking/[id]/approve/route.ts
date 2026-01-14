import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { createGoogleMeetMeeting } from '../../../../../../lib/googleMeet';

export async function PUT(req: NextRequest, { params }) {
  try {
    const { meetLink: customMeetLink } = await req.json();
    const client = await clientPromise;
    const db = client.db();
    
    const booking = await db.collection('consultant_booking').findOne({ _id: new ObjectId(params.id) });
    
    if (!booking) {
      return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
    }

    let meetLink = customMeetLink;

    if (!meetLink) {
      // Generate meeting link as per spec workflow if not provided
      const meetResult = await createGoogleMeetMeeting({
        topic: `Session for ${booking.reason || 'Consultancy'}`,
        startTime: booking.slot || new Date().toISOString(),
        attendees: [booking.userId]
      });
      meetLink = meetResult.meetLink;
    }

    await db.collection('consultant_booking').updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $set: { 
          status: 'MEETING_SCHEDULED', 
          meetLink: meetLink,
          updatedAt: new Date() 
        } 
      }
    );

    // Notify user
    await db.collection('notifications').insertOne({
      userId: booking.userId,
      title: 'Consultation Approved!',
      message: `Your consultant session has been approved. Join here: ${meetLink}`,
      status: 'UNREAD',
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, meetLink: meetLink });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
