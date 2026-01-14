import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const partners = await db.collection('partners').find({}).toArray();
  return NextResponse.json(partners);
}
