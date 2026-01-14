import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { signJwt } from '../../../../lib/jwt';

export async function POST(req: NextRequest) {
  const { email, password, role, name } = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const existing = await db.collection('users').findOne({ email });
  if (existing) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }
  const result = await db.collection('users').insertOne({ 
    email, 
    password, 
    role, 
    name,
    createdAt: new Date() 
  });
  const token = signJwt({ userId: result.insertedId, role });
  
  const response = NextResponse.json({ success: true, token, role });

  // Set HttpOnly cookie for middleware access
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365 * 10 // 10 years
  });

  return response;
}
