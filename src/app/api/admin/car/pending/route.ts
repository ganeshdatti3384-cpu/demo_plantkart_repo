import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || (decoded.role !== 'admin' && decoded.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db();
    const pending = await db.collection('car').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(pending);
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
