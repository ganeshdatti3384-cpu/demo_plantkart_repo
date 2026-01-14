import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const client = await clientPromise;
    const db = client.db();

    // Fetch user details to store contact name
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    const result = await db.collection('consultant_booking').insertOne({
      ...data,
      userId,
      userName: user?.name || 'Guest User',
      status: 'PENDING_PAYMENT',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Mark slot as booked in consultants collection
    if (data.slotId && data.consultantId) {
      await db.collection('consultants').updateOne(
        { _id: new ObjectId(data.consultantId), "slots.id": data.slotId },
        { 
          $set: { 
            "slots.$.status": 'booked',
            "slots.$.bookedBy": userId 
          } 
        }
      );
    }

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
