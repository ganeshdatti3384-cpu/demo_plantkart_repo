import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { getUserIdFromToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const requests = await db.collection('loans')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
      
    return NextResponse.json(requests);
  } catch (error: any) {
    console.error('Error fetching loan requests:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
