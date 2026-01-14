import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const jobs = await db.collection('jobs').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(jobs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const required = ['title','company','location','externalUrl'];
    for (const f of required) if (!body[f]) return NextResponse.json({ error: `${f} is required` }, { status: 400 });

    // validate URL
    try { new URL(body.externalUrl); } catch (e) { return NextResponse.json({ error: 'externalUrl must be a valid URL' }, { status: 400 }); }

    const client = await clientPromise;
    const db = client.db();
    const doc = { ...body, createdAt: new Date(), createdBy: null };
    const result = await db.collection('jobs').insertOne(doc);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
