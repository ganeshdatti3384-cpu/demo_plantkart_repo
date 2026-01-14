import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const indexParam = req.nextUrl.searchParams.get('index') || '0';
    const index = parseInt(indexParam, 10) || 0;

    const client = await clientPromise;
    const db = client.db();
    const item = await db.collection('accommodation').findOne({ _id: new ObjectId(params.id) });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const images = item.images || [];
    const img = images[index];
    if (!img || !img.data) return NextResponse.json({ error: 'Image not found' }, { status: 404 });

    // img.data can be Buffer or Binary; convert to Uint8Array
    let buffer: Uint8Array | Buffer;
    if (Buffer.isBuffer(img.data)) buffer = img.data;
    else if (img.data.buffer) buffer = Buffer.from(img.data.buffer);
    else buffer = Buffer.from(img.data);

    const headers = new Headers();
    headers.set('Content-Type', img.mime || img.mimeType || 'application/octet-stream');
    // Convert Buffer/Uint8Array to ArrayBuffer for NextResponse
    const arrayBuffer = buffer instanceof Buffer
      ? buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
      : buffer.buffer;
    return new NextResponse(arrayBuffer, { status: 200, headers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
