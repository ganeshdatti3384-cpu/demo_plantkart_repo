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

    // Fetch accommodation details to get vendorId
    let vendorId = null;
    try {
        const accommodation = await db.collection('accommodation').findOne({ _id: new ObjectId(data.accommodationId) });
        vendorId = accommodation?.vendorId || null;
    } catch (e) {
        console.error('Error finding accommodation:', e);
    }

    const result = await db.collection('accommodation_requests').insertOne({
      ...data,
      userId,
      vendorId: vendorId, // Add vendorId so the provider can see it
      status: 'PENDING_PAYMENT',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
