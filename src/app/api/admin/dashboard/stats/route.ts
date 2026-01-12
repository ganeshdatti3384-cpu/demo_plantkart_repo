import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';

export async function GET(req: NextRequest) {
  const role = req.headers.get('x-user-role');

  if (role !== 'admin' && role !== 'super_admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    
    const [
      userCount,
      activePickups,
      completedPickups,
      consultantStats,
      bookingStats,
      paymentSummary,
      pendingConsultants
    ] = await Promise.all([
      db.collection('users').countDocuments(),
      db.collection('airport_pickup').countDocuments({ status: 'ACCEPTED' }),
      db.collection('airport_pickup').countDocuments({ status: 'COMPLETED' }),
      db.collection('consultants').aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]).toArray(),
      db.collection('consultant_bookings').aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]).toArray(),
      db.collection('payments').aggregate([
        { $match: { status: 'COMPLETED' } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]).toArray(),
      db.collection('consultants').countDocuments({ status: 'PENDING' })
    ]);

    // Format stats
    const consultants = {
      pending: pendingConsultants,
      approved: consultantStats.find(s => s._id === 'APPROVED')?.count || 0,
      total: consultantStats.reduce((acc, curr) => acc + curr.count, 0)
    };

    const bookings = {
      completed: bookingStats.find(s => s._id === 'COMPLETED')?.count || 0,
      total: bookingStats.reduce((acc, curr) => acc + curr.count, 0)
    };
    
    const revenue = paymentSummary.length > 0 ? paymentSummary[0].total : 0;
    
    return NextResponse.json({
      userCount,
      activePickups,
      completedPickups,
      consultants,
      bookings,
      revenue,
      systemHealth: 'HEALTHY',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Stats error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
