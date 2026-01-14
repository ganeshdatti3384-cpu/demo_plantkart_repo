import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest, { params }: { params: any }) {
  const adminRole = req.headers.get('x-user-role');
  if (adminRole !== 'admin' && adminRole !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Fetch User
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Fetch Activity Summary
    const airportPickupsCount = await db.collection('airport_pickup').countDocuments({ userId: id });
    const consultantBookingsCount = await db.collection('consultant_bookings').countDocuments({ userId: id });
    const paymentsCount = await db.collection('payments').countDocuments({ userId: id });

    const { password, ...safeUser } = user;

    return NextResponse.json({
      user: safeUser,
      activity: {
        airportPickups: airportPickupsCount,
        consultantBookings: consultantBookingsCount,
        payments: paymentsCount
      }
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: any }) {
  const adminRole = req.headers.get('x-user-role');
  const adminId = req.headers.get('x-user-id');
  if (adminRole !== 'admin' && adminRole !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { isDisabled } = await req.json();

  try {
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: { isDisabled: !!isDisabled, updatedAt: new Date() } }
    );

    if (result.modifiedCount > 0) {
      // Log Audit
      await db.collection('audit_logs').insertOne({
        action: 'USER_STATUS_CHANGE',
        details: { targetUserId: id, isDisabled },
        adminId,
        timestamp: new Date()
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: any }) {
  const adminRole = req.headers.get('x-user-role');
  const adminId = req.headers.get('x-user-id');
  if (adminRole !== 'admin' && adminRole !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { name, email, role } = await req.json();

  try {
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, email, role, updatedAt: new Date() } }
    );

    if (result.modifiedCount > 0) {
      await db.collection('audit_logs').insertOne({
        action: 'USER_UPDATE',
        details: { targetUserId: id, name, role },
        adminId,
        timestamp: new Date()
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: any }) {
  const adminRole = req.headers.get('x-user-role');
  const adminId = req.headers.get('x-user-id');
  if (adminRole !== 'admin' && adminRole !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Check if user is super admin - protect them
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    if (user?.role === 'super_admin') {
        return NextResponse.json({ error: 'Cannot delete super admin' }, { status: 403 });
    }

    const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount > 0) {
      await db.collection('audit_logs').insertOne({
        action: 'USER_DELETE',
        details: { targetUserId: id, email: user?.email },
        adminId,
        timestamp: new Date()
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
