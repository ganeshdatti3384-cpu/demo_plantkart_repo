import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ViewingRequest from '@/models/ViewingRequest';

export async function GET() {
  try {
    await connectToDatabase();
    const viewingRequests = await ViewingRequest.find({});
    return NextResponse.json(viewingRequests);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch viewing requests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const viewingRequest = new ViewingRequest(body);
    await viewingRequest.save();
    return NextResponse.json(viewingRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create viewing request' }, { status: 500 });
  }
}