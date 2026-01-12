import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    // Only show approved events to users
    const events = await db.collection('events')
      .find({ status: 'APPROVED' })
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const role = req.headers.get('x-user-role');
  if (role !== 'admin' && role !== 'super_admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
  }

  try {
    const data = await req.json();
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('events').insertOne({
      ...data,
      registrations: [],
      status: 'APPROVED', // Admin-created events are auto-approved
      createdAt: new Date()
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
