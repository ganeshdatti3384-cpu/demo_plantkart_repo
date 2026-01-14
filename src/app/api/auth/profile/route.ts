import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { verifyJwt } from '../../../../utils/jwt';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const userData = token ? verifyJwt(token) : null;
  
  if (!userData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection('users').findOne({ _id: new ObjectId(userData.userId) });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { password, ...safeUser } = user;
  return NextResponse.json(safeUser);
}

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const userData = token ? verifyJwt(token) : null;

  if (!userData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, phone, bio, university } = await req.json();
    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userData.userId) },
      { 
        $set: { 
          name, 
          phone, 
          bio, 
          university,
          updatedAt: new Date() 
        } 
      }
    );

    return NextResponse.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
