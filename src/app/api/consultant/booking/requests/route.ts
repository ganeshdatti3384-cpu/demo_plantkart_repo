import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  const role = req.headers.get('x-user-role');

  if (!userId || role !== 'consultant') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();
  
  // Find the user to get email
  const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
  if (!user) return NextResponse.json([], { status: 404 });

  // Find the consultant record for this email
  const consultant = await db.collection('consultants').findOne({ email: user.email });
  
  if (!consultant) return NextResponse.json([]);

  const requests = await db.collection('consultant_booking').find({ 
    consultantId: consultant._id.toString(),
    status: { $in: ['REQUEST_SENT', 'APPROVED', 'MEETING_SCHEDULED', 'COMPLETED', 'REJECTED'] }
  }).sort({ updatedAt: -1 }).toArray();
  
  return NextResponse.json(requests);
}
