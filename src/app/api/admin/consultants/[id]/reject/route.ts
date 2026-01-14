import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(req: NextRequest, { params }: { params: any }) {
  const role = req.headers.get('x-user-role');
  const adminId = req.headers.get('x-user-id');
  if (role !== 'admin' && role !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { reason } = await req.json();

  const client = await clientPromise;
  const db = client.db();

  const consultant = await db.collection('consultants').findOne({ _id: new ObjectId(id) });
  if (!consultant) {
    return NextResponse.json({ error: 'Consultant not found' }, { status: 404 });
  }

  await db.collection('consultants').updateOne(
    { _id: new ObjectId(id) },
    { 
      $set: { 
        status: 'REJECTED',
        rejectionReason: reason,
        rejectedAt: new Date()
      } 
    }
  );

  const user = await db.collection('users').findOne({ email: consultant.email });
  if (user) {
    await db.collection('notifications').insertOne({
      userId: user._id.toString(),
      title: 'Consultant Application Rejected',
      message: `Your application was not approved. Reason: ${reason || 'Does not meet requirements.'}`,
      type: 'CONSULTANT_APP',
      status: 'UNREAD',
      createdAt: new Date()
    });
  }

  // Audit
  await db.collection('audit_logs').insertOne({
    action: 'CONSULTANT_REJECTED',
    details: { consultantId: id, reason },
    adminId,
    timestamp: new Date()
  });

  return NextResponse.json({ success: true });
}
