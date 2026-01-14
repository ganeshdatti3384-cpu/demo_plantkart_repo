import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const job = await db.collection('jobs').findOne({ _id: new ObjectId(params.id) });
    if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(job);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    await db.collection('jobs').deleteOne({ _id: new ObjectId(params.id) });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
