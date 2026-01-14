import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const bookingType = searchParams.get('bookingType');
    const status = searchParams.get('status');
    const clientEmail = searchParams.get('clientEmail');
    const serviceProviderEmail = searchParams.get('serviceProviderEmail');

    let query: any = {};

    if (bookingType && bookingType !== 'all') {
      query.bookingType = bookingType;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (clientEmail) {
      query.clientEmail = clientEmail;
    }

    if (serviceProviderEmail) {
      query.serviceProviderEmail = serviceProviderEmail;
    }

    const bookings = await Booking.find(query).sort({ bookingDate: -1 });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json({ message: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();
    await connectToDatabase();

    // Generate unique ID
    const id = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const booking = new Booking({
      ...bookingData,
      id,
    });

    await booking.save();

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json({ message: 'Failed to create booking' }, { status: 500 });
  }
}