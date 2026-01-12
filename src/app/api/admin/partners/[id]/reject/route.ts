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
    
    const result = await db.collection('partners').updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $set: { 
          status: 'rejected',
          rejectedAt: new Date(),
          rejectedBy: decoded.userId
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Partner rejected' });
  } catch (error) {
    console.error('Error rejecting partner:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
