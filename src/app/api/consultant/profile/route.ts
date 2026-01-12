import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
  const consultant = await db.collection('consultants').findOne({ email: user?.email });

  return NextResponse.json(consultant || {});
}

export async function PUT(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

  const result = await db.collection('consultants').updateOne(
    { email: user?.email },
    { 
      $set: { 
        ...body,
        updatedAt: new Date()
      },
      $setOnInsert: {
        status: 'PENDING',
        createdAt: new Date()
      }
    },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}
