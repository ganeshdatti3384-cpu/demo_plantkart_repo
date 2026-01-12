import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
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
    
    const result = await db.collection('events').updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $set: { 
          status: 'approved',
          approvedAt: new Date(),
          approvedBy: decoded.userId
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Event approved' });
  } catch (error) {
    console.error('Error approving event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
