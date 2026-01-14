import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

function parseBase64Image(dataUrl: string) {
  try {
    const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (match) {
      const mime = match[1];
      const base64 = match[2];
      const buffer = Buffer.from(base64, 'base64');
      return { buffer, mime };
    }
    // fallback: assume raw base64 jpeg
    const buffer = Buffer.from(dataUrl, 'base64');
    return { buffer, mime: 'image/jpeg' };
  } catch (err) {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const vendorId = req.headers.get('x-user-id');
  if (!vendorId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const data = await req.json();
  const client = await clientPromise;
  const db = client.db();

  const doc: any = {
    title: data.title,
    price: data.price,
    location: data.location,
    address: data.address,
    amenities: data.amenities,
    contactInfo: data.contactInfo,
    description: data.description,
    vendorId,
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date(),
    expiry: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  };

  // Support images provided as base64 array (imagesBase64)
  if (Array.isArray(data.imagesBase64) && data.imagesBase64.length > 0) {
    const images: any[] = [];
    for (const d of data.imagesBase64) {
      const parsed = parseBase64Image(d);
      if (parsed) images.push({ data: parsed.buffer, mime: parsed.mime });
    }
    if (images.length) doc.images = images;
  } else if (data.image) {
    // legacy single image URL string
    doc.image = data.image;
  }

  const result = await db.collection('accommodation').insertOne(doc);

  // If we stored binary images, set a convenient image URL for the frontend
  if (doc.images && doc.images.length) {
    await db.collection('accommodation').updateOne({ _id: result.insertedId }, { $set: { image: `/api/accommodation/image/${result.insertedId}?index=0` } });
  }

  return NextResponse.json({ success: true, id: result.insertedId });
}
