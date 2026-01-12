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
  const client = await clientPromise;
  const db = client.db();

  const consultant = await db.collection('consultants').findOne({ _id: new ObjectId(id) });
  if (!consultant) {
    return NextResponse.json({ error: 'Consultant not found' }, { status: 404 });
  }

  // 1. Update Consultant Status
  await db.collection('consultants').updateOne(
    { _id: new ObjectId(id) },
    { 
      $set: { 
        status: 'APPROVED',
        approvedAt: new Date()
      } 
    }
  );

  // 2. Update User Role to 'consultant'
  const user = await db.collection('users').findOne({ email: consultant.email });
  if (user) {
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { role: 'consultant' } }
    );

    // 3. Send Notification
    await db.collection('notifications').insertOne({
      userId: user._id.toString(),
      title: 'Consultant Privileges Enabled',
      message: 'Congratulations! Your consultant application has been approved. You now have access to the consultant dashboard.',
      type: 'CONSULTANT_APP',
      status: 'UNREAD',
      createdAt: new Date()
    });
  }

  // 4. Log Audit
  await db.collection('audit_logs').insertOne({
    action: 'CONSULTANT_APPROVED',
    details: { consultantId: id, userEmail: consultant.email },
    adminId,
    timestamp: new Date()
  });

  return NextResponse.json({ success: true });
}
