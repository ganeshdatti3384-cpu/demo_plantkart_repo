import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest, { params }) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const client = await clientPromise;
    const db = client.db();
    const offer = await db.collection('offers').findOne({ _id: new ObjectId(params.id) });
    if (!offer) return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    if (new Date() > offer.expiryDate) return NextResponse.json({ error: 'Offer expired' }, { status: 400 });

    const qrString = `UID_${userId}_OFF_${params.id}_${Date.now()}`;
    await db.collection('offers').updateOne(
      { _id: new ObjectId(params.id) },
      { $push: { claimed: { userId, qrCode: qrString, claimedAt: new Date() } } }
    );

    return NextResponse.json({ success: true, qrCode: qrString, offer: offer.offerDetails });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
