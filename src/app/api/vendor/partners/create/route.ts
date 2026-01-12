import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { name, category, discount, location, address, image, description, terms, contactInfo } = body;

    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('partners').insertOne({
      name,
      category,
      discount,
      location,
      address,
      image,
      description,
      terms,
      contactInfo,
      vendorId: decoded.userId,
      vendorEmail: decoded.email,
      status: 'PENDING',
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error creating partner offer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
