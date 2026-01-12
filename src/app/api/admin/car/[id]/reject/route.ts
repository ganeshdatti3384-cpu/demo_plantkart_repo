import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || (decoded.role !== 'admin' && decoded.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let reason = 'Vehicle did not meet audit standards';
    try {
      const body = await req.json();
      if (body.reason) reason = body.reason;
    } catch (e) {
      // Body might be empty, use default reason
    }

    const client = await clientPromise;
    const db = client.db();
    await db.collection('car').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { status: 'REJECTED', reason, updatedAt: new Date() } }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error rejecting car:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
