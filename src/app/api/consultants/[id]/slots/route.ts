import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest, { params }) {
  const client = await clientPromise;
  const db = client.db();
  const consultant = await db.collection('consultants').findOne({ _id: new ObjectId(params.id) });
  
  const slots = consultant?.slots || [];
  const now = Date.now();
  const THREE_MINUTES = 3 * 60 * 1000;

  // Process slots to handle expired locks and structure
  const processedSlots = slots.map((slot: any) => {
    // If it's still a string (legacy data), convert it
    if (typeof slot === 'string') {
      return { id: slot, time: slot, status: 'available' };
    }

    // If it's locked but expired, consider it available
    if (slot.status === 'locked' && slot.lockedAt && now - slot.lockedAt > THREE_MINUTES) {
      return { ...slot, status: 'available', lockedBy: null, lockedAt: null };
    }

    return slot;
  });

  return NextResponse.json(processedSlots);
}
