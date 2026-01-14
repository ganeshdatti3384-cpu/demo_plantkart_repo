import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { signJwt } from '../../../../lib/jwt';
import { OAuth2Client } from 'google-auth-library';

export async function POST(req: NextRequest) {
  try {
    const { credential } = await req.json();

    if (!credential) {
      return NextResponse.json({ error: 'Credential is required' }, { status: 400 });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('SERVER SIDE: GOOGLE_CLIENT_ID NOT FOUND');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const client = new OAuth2Client(clientId);

    // Verify Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json({ error: 'Invalid Google token' }, { status: 401 });
    }

    const { email, name, picture, sub: googleId } = payload;

    const mongoClient = await clientPromise;
    const db = mongoClient.db();

    // Check if user exists
    let user = await db.collection('users').findOne({ email });

    if (!user) {
      // Create new user if they don't exist
      const newUser = {
        email,
        name,
        image: picture,
        googleId,
        role: 'user', // Default role
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await db.collection('users').insertOne(newUser);
      user = { ...newUser, _id: result.insertedId };
    } else {
      // Update existing user with googleId if not present
      await db.collection('users').updateOne(
        { _id: user._id },
        { 
          $set: { 
            googleId,
            image: picture || user.image,
            updatedAt: new Date()
          } 
        }
      );
    }

    const role = user.role || 'user';
    const token = signJwt({ userId: user._id.toString(), role });

    const response = NextResponse.json({ 
      success: true, 
      token, 
      role,
      user: {
        name: user.name,
        email: user.email,
        image: user.image
      }
    });

    // Set HttpOnly cookie for middleware access
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365 * 10 // 10 years
    });

    return response;
  } catch (error) {
    console.error('Google Auth Error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
