import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt, signJwt } from '../../../../utils/jwt';

export async function POST(req: NextRequest) {
  const { refreshToken } = await req.json();
  const userData = refreshToken ? verifyJwt(refreshToken) : null;
  if (!userData) {
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
  }
  const newToken = signJwt({ userId: userData.userId, role: userData.role });
  
  const response = NextResponse.json({ success: true, token: newToken });

  // Set HttpOnly cookie for middleware access
  response.cookies.set('token', newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365 * 10 // 10 years
  });

  return response;
}
