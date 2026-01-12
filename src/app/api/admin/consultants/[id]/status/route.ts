import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(req: NextRequest, { params }: { params: any }) {
  const role = req.headers.get('x-user-role');
  const adminId = req.headers.get('x-user-id');
  if (role !== 'admin' && role !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { isLive } = await req.json();

  try {
    const client = await clientPromise;
    const db = client.db();
    
    await db.collection('consultants').updateOne(
      { _id: new ObjectId(id) },
      { $set: { isLive: !!isLive, updatedAt: new Date() } }
    );

    // Audit
    await db.collection('audit_logs').insertOne({
      action: 'CONSULTANT_LIVE_STATUS_CHANGE',
      details: { consultantId: id, isLive },
      adminId,
      timestamp: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
