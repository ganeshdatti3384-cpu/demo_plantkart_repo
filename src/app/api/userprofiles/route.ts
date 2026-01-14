import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import UserProfile from '@/models/UserProfile';

export async function GET() {
  try {
    await connectToDatabase();
    const userProfiles = await UserProfile.find({});
    return NextResponse.json(userProfiles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user profiles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const userProfile = new UserProfile(body);
    await userProfile.save();
    return NextResponse.json(userProfile, { status: 201 });
  } catch (error) {
    console.error('Create user profile error:', error);
    return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 });
  }
}