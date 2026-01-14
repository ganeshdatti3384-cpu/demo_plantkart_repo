import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const logs = await db.collection('audit_logs').find({}).sort({ timestamp: -1 }).limit(100).toArray();
  return NextResponse.json(logs);
}
