import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';

export async function GET(req: NextRequest) {
  const adminRole = req.headers.get('x-user-role');
  if (adminRole !== 'admin' && adminRole !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Join with consultants and users to get full details
    const bookings = await db.collection('consultant_bookings')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(bookings);
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
