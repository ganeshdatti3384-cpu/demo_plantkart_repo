import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getUserIdFromToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Fetch car requests where this user is the vendor
    const carRequests = await db.collection('car_requests')
      .find({ vendorId: userId.toString() })
      .sort({ createdAt: -1 })
      .toArray();

    // Fetch accommodation requests where this user is the vendor
    const accommodationRequests = await db.collection('accommodation_requests')
      .find({ vendorId: userId.toString() })
      .sort({ createdAt: -1 })
      .toArray();

    // Fetch event registrations where this user is the vendor
    const eventRegistrations = await db.collection('event_registrations')
      .find({ vendorId: userId.toString() })
      .sort({ createdAt: -1 })
      .toArray();

    // Get user details for each request to show who booked it
    const enrichRequests = async (requests: any[]) => {
      return Promise.all(requests.map(async (req) => {
        let user = null;
        try {
            const searchId = typeof req.userId === 'string' && ObjectId.isValid(req.userId) 
                ? new ObjectId(req.userId) 
                : req.userId;
            user = await db.collection('users').findOne({ _id: searchId }, { projection: { name: 1, email: 1, phone: 1 } });
        } catch (e) {
            console.error('Error fetching user for request:', e);
        }
        return { ...req, userDetails: user };
      }));
    };

    const enrichedCar = await enrichRequests(carRequests);
    const enrichedAcc = await enrichRequests(accommodationRequests);
    const enrichedEvents = await enrichRequests(eventRegistrations);

    return NextResponse.json({
      success: true,
      carRequests: enrichedCar,
      accommodationRequests: enrichedAcc,
      eventRequests: enrichedEvents
    });

  } catch (error: any) {
    console.error('Vendor requests error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
