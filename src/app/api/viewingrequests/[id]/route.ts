import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ViewingRequest from '@/models/ViewingRequest';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const viewingRequest = await ViewingRequest.findOneAndUpdate({ id: params.id }, body, { new: true });
    if (!viewingRequest) {
      return NextResponse.json({ error: 'Viewing request not found' }, { status: 404 });
    }
    return NextResponse.json(viewingRequest);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update viewing request' }, { status: 500 });
  }
}