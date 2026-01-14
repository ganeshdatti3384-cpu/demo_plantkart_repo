import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const { slotId } = await req.json();
    const client = await clientPromise;
    const db = client.db();
    const now = Date.now();
    const THREE_MINUTES = 3 * 60 * 1000;

    // First, find the consultant and the specific slot
    const consultant = await db.collection('consultants').findOne({
      _id: new ObjectId(params.id),
      "slots.id": slotId
    });

    if (!consultant) {
      return NextResponse.json({ success: false, message: 'Slot not found' }, { status: 404 });
    }

    const slot = consultant.slots.find((s: any) => s.id === slotId);

    // Check if it's already booked
    if (slot.status === 'booked') {
      return NextResponse.json({ success: false, message: 'Slot already booked' }, { status: 400 });
    }

    // Check if it's locked by someone else and still valid
    if (slot.status === 'locked' && slot.lockedBy !== userId && now - slot.lockedAt < THREE_MINUTES) {
      return NextResponse.json({ success: false, message: 'Slot is temporarily locked by another user' }, { status: 400 });
    }

    // Perform atomic update to lock the slot
    const result = await db.collection('consultants').updateOne(
      { 
        _id: new ObjectId(params.id),
        "slots.id": slotId,
        $or: [
          { "slots.status": 'available' },
          { "slots.status": 'locked', "slots.lockedAt": { $lt: now - THREE_MINUTES } },
          { "slots.status": 'locked', "slots.lockedBy": userId }
        ]
      },
      { 
        $set: { 
          "slots.$.status": 'locked', 
          "slots.$.lockedAt": now, 
          "slots.$.lockedBy": userId 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: 'Could not lock slot. It may have been taken.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Slot locked for 3 minutes' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
