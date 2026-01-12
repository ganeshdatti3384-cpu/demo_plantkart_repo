
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { signJwt } from '../../../../lib/jwt';


export async function POST(req: NextRequest) {
  const { email, otp } = await req.json();
  const client = await clientPromise;
  const db = client.db();
  // Find user by email
  const user = await db.collection('users').findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  // Find OTP record
  const otpRecord = await db.collection('otps').findOne({ email, otp });
  if (!otpRecord || otpRecord.expiresAt < Date.now()) {
    return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
  }
  // Optionally, delete OTP after use
  await db.collection('otps').deleteOne({ _id: otpRecord._id });
  // Issue JWT
  const role = user.role || 'user';
  const token = signJwt({ userId: user._id.toString(), role });

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
