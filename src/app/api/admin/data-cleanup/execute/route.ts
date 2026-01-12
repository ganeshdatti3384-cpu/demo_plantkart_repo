import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const module = searchParams.get('module');

  const client = await clientPromise;
  const db = client.db();
  
  const collections = module ? [module] : ['airport_pickup', 'accommodation', 'car', 'consultant_booking', 'loan', 'events'];
  const terminalStatuses = ['COMPLETED', 'REJECTED', 'CANCELLED'];
  const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  
  let deleted = {};
  for (const name of collections) {
    const result = await db.collection(name).deleteMany({
      status: { $in: terminalStatuses },
      updatedAt: { $lt: cutoff },
    });
    deleted[name] = result.deletedCount;
  }
  
  // Create audit log
  await db.collection('audit_logs').insertOne({
    action: 'MANUAL_CLEANUP',
    details: { module: module || 'ALL', deleted },
    timestamp: new Date().toISOString()
  });

  return NextResponse.json(deleted);
}
