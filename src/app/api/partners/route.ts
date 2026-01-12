import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    // Only show approved partners to users
    const partners = await db.collection('partners')
      .find({ status: 'APPROVED' })
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
