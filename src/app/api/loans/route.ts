import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Loan from '@/models/Loan';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const loanType = searchParams.get('loanType');
    const applicantEmail = searchParams.get('applicantEmail');

    let query: any = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (loanType && loanType !== 'all') {
      query.loanType = loanType;
    }

    if (applicantEmail) {
      query.applicantEmail = applicantEmail;
    }

    const loans = await Loan.find(query).sort({ applicationDate: -1 });

    return NextResponse.json(loans);
  } catch (error) {
    console.error('Get loans error:', error);
    return NextResponse.json({ message: 'Failed to fetch loans' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const loanData = await request.json();
    await connectToDatabase();

    // Generate unique ID
    const id = `loan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const loan = new Loan({
      ...loanData,
      id,
    });

    await loan.save();

    return NextResponse.json(loan, { status: 201 });
  } catch (error) {
    console.error('Create loan error:', error);
    return NextResponse.json({ message: 'Failed to create loan' }, { status: 500 });
  }
}