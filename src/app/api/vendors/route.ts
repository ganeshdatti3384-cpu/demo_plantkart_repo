import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Vendor from '@/models/Vendor';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const businessType = searchParams.get('businessType');
    const city = searchParams.get('city');
    const isVerified = searchParams.get('isVerified') === 'true';
    const isActive = searchParams.get('isActive') !== 'false';

    let query: any = { isActive };

    if (businessType && businessType !== 'all') {
      query.businessType = businessType;
    }

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    if (isVerified) {
      query.isVerified = true;
    }

    const vendors = await Vendor.find(query).sort({ rating: -1 });

    return NextResponse.json(vendors);
  } catch (error) {
    console.error('Get vendors error:', error);
    return NextResponse.json({ message: 'Failed to fetch vendors' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const vendorData = await request.json();
    await connectToDatabase();

    // Generate unique ID
    const id = `vendor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const vendor = new Vendor({
      ...vendorData,
      id,
    });

    await vendor.save();

    return NextResponse.json(vendor, { status: 201 });
  } catch (error) {
    console.error('Create vendor error:', error);
    return NextResponse.json({ message: 'Failed to create vendor' }, { status: 500 });
  }
}