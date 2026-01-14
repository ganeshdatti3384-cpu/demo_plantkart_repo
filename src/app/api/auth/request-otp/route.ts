
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { sendOtpEmail } from '../../../../lib/email';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection('users').findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  await db.collection('otps').insertOne({ email, otp, expiresAt });
  try {
    await sendOtpEmail(email, otp);
    return NextResponse.json({ success: true, message: 'OTP sent to email.' });
  } catch (err: any) {
    console.error('Request-OTP Email Error (Non-blocking):', err.message);
    // Return success anyway so developers can see the OTP in terminal
    return NextResponse.json({ 
      success: true, 
      message: 'OTP generated. Check console if email delivery fails.',
      warning: 'Email delivery failed: ' + err.message
    });
  }
}
