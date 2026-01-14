import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Loan from '@/models/Loan';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const loan = await Loan.findOne({ id });

    if (!loan) {
      return NextResponse.json({ message: 'Loan not found' }, { status: 404 });
    }

    return NextResponse.json(loan);
  } catch (error) {
    console.error('Get loan error:', error);
    return NextResponse.json({ message: 'Failed to fetch loan' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const updateData = await request.json();
    await connectToDatabase();
    const { id } = await params;

    const loan = await Loan.findOneAndUpdate(
      { id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!loan) {
      return NextResponse.json({ message: 'Loan not found' }, { status: 404 });
    }

    return NextResponse.json(loan);
  } catch (error) {
    console.error('Update loan error:', error);
    return NextResponse.json({ message: 'Failed to update loan' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const loan = await Loan.findOneAndDelete({ id });

    if (!loan) {
      return NextResponse.json({ message: 'Loan not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Loan deleted successfully' });
  } catch (error) {
    console.error('Delete loan error:', error);
    return NextResponse.json({ message: 'Failed to delete loan' }, { status: 500 });
  }
}