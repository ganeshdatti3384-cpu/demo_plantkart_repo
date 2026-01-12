import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const module = searchParams.get('module'); // 'airport_pickup' or 'consultant_booking'

  const client = await clientPromise;
  const db = client.db();
  
  const collections = module ? [module] : ['airport_pickup', 'accommodation', 'car', 'consultant_booking', 'loan', 'events'];
  const terminalStatuses = ['COMPLETED', 'REJECTED', 'CANCELLED'];
  const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  
  let preview = {};
  for (const name of collections) {
    const count = await db.collection(name).countDocuments({
      status: { $in: terminalStatuses },
      updatedAt: { $lt: cutoff },
    });
    preview[name] = count;
  }
  return NextResponse.json(preview);
}
