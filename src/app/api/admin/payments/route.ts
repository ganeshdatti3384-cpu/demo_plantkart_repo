import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET(req: NextRequest) {
  const adminRole = req.headers.get('x-user-role');
  if (adminRole !== 'admin' && adminRole !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const client = await clientPromise;
    const db = client.db();
    
    let query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const payments = await db.collection('payments')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(payments);
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
