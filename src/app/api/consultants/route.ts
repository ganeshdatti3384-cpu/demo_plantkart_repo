import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const consultants = await db.collection('consultants').find({ status: 'APPROVED' }).toArray();
  return NextResponse.json(consultants);
}
