import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';

export async function GET(req: NextRequest) {
  const role = req.headers.get('x-user-role');
  if (role !== 'admin' && role !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();
  const pendingConsultants = await db.collection('consultants').find({ status: 'PENDING' }).toArray();

  return NextResponse.json(pendingConsultants);
}
