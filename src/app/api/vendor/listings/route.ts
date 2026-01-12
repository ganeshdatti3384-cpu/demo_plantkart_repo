import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    
    const [accommodations, cars] = await Promise.all([
      db.collection('accommodation').find({ vendorId: userId }).toArray(),
      db.collection('car').find({ vendorId: userId }).toArray(),
    ]);

    return NextResponse.json({
      accommodations,
      cars
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
