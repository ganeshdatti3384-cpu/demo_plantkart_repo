import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import UserProfile from '@/models/UserProfile';

export async function GET(request: NextRequest, { params }: { params: Promise<{ email: string }> }) {
  try {
    await connectToDatabase();
    const { email } = await params;
    const userProfile = await UserProfile.findOne({ email });
    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }
    return NextResponse.json(userProfile);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ email: string }> }) {
  try {
    await connectToDatabase();
    const { email } = await params;
    const body = await request.json();
    const userProfile = await UserProfile.findOneAndUpdate({ email }, body, { new: true });
    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }
    return NextResponse.json(userProfile);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
}