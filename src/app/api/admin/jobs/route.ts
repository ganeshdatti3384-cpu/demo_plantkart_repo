import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyAuth } from '@/utils/jwt';

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAuth(req as unknown as Request);
    if (!auth || !['admin','super_admin'].includes(auth.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const required = ['title','company','location','externalUrl'];
    for (const f of required) if (!body[f]) return NextResponse.json({ error: `${f} is required` }, { status: 400 });

    try { new URL(body.externalUrl); } catch (e) { return NextResponse.json({ error: 'externalUrl must be a valid URL' }, { status: 400 }); }

    const client = await clientPromise;
    const db = client.db();
    const doc = { ...body, createdAt: new Date(), createdBy: auth.userId };
    const result = await db.collection('jobs').insertOne(doc);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
