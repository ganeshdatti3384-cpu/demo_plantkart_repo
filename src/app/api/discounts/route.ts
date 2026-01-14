import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Discount from '@/models/Discount';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const applicableTo = searchParams.get('applicableTo');
    const isActive = searchParams.get('isActive') !== 'false';

    let query: any = { isActive };

    if (code) {
      query.code = code;
    }

    if (applicableTo) {
      query.applicableTo = { $in: [applicableTo] };
    }

    const discounts = await Discount.find(query).sort({ validUntil: 1 });

    return NextResponse.json(discounts);
  } catch (error) {
    console.error('Get discounts error:', error);
    return NextResponse.json({ message: 'Failed to fetch discounts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const discountData = await request.json();
    await connectToDatabase();

    // Generate unique ID
    const id = `discount_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const discount = new Discount({
      ...discountData,
      id,
    });

    await discount.save();

    return NextResponse.json(discount, { status: 201 });
  } catch (error) {
    console.error('Create discount error:', error);
    return NextResponse.json({ message: 'Failed to create discount' }, { status: 500 });
  }
}