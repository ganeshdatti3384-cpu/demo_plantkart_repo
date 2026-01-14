import { NextRequest, NextResponse } from 'next/server';
import { createGoogleMeetMeeting } from '../../../../lib/googleMeet';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  const data = await req.json();
  // Create Google Meet meeting (placeholder)
  const meeting = await createGoogleMeetMeeting({
    topic: data.topic,
    startTime: data.startTime,
    attendees: data.attendees,
  });
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection('meetings').insertOne({
    ...data,
    meetLink: meeting.meetLink,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return NextResponse.json({ success: true, id: result.insertedId, meetLink: meeting.meetLink });
}
