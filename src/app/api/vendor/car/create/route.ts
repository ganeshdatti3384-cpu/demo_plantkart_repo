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
    listingType: data.listingType || 'rent',
    makeModel: data.makeModel,
    year: data.year,
    transmission: data.transmission,
    kilometers: data.kilometers,
    dailyRate: data.dailyRate,
    weeklyRate: data.weeklyRate,
    monthlyRate: data.monthlyRate,
    salePrice: data.salePrice,
    registrationExpiry: data.registrationExpiry,
    condition: data.condition,
    vendorId,
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date(),
    expiry: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  };

  if (Array.isArray(data.imagesBase64) && data.imagesBase64.length > 0) {
    const images: any[] = [];
    for (const d of data.imagesBase64) {
      const parsed = parseBase64Image(d);
      if (parsed) images.push({ data: parsed.buffer, mime: parsed.mime });
    }
    if (images.length) doc.images = images;
  } else if (data.image) {
    doc.image = data.image;
  }

  const result = await db.collection('car').insertOne(doc);

  if (doc.images && doc.images.length) {
    await db.collection('car').updateOne({ _id: result.insertedId }, { $set: { image: `/api/car/image/${result.insertedId}?index=0` } });
  }

  return NextResponse.json({ success: true, id: result.insertedId });
}
