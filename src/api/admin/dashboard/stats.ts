import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyAuth } from '@/utils/jwt';

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAuth(req as unknown as Request);
    if (!auth || !['admin', 'super_admin'].includes(auth.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const [
      userCount,
      pendingAccommodations,
      pendingCars,
      activePickups,
      consultantBookings,
      totalRevenue,
      pendingConsultants
    ] = await Promise.all([
      db.collection('users').countDocuments(),
      db.collection('accommodation').countDocuments({ status: 'PENDING' }),
      db.collection('car').countDocuments({ status: 'PENDING' }),
      db.collection('airport_pickup').countDocuments({ status: { $in: ['PENDING', 'APPROVED'] } }),
      db.collection('consultant_booking').countDocuments({ status: 'REQUEST_SENT' }),
      db.collection('payments').aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]).toArray(),
      db.collection('consultants').countDocuments({ status: 'PENDING' })
    ]);

    return NextResponse.json({
      userCount,
      pendingAccommodations,
      pendingCars,
      activePickups,
      bookings: { total: consultantBookings },
      revenue: totalRevenue?.[0]?.total || 0,
      consultants: { pending: pendingConsultants }
    });
  } catch (err: any) {
    console.error('Stats error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
