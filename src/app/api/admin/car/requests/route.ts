import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || (decoded.role !== 'admin' && decoded.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Join with users collection to get user details
    // Only show requests that DON'T have a vendorId (Platform-managed)
    const requests = await db.collection('car_requests').aggregate([
      {
        $match: { 
          userId: { $exists: true, $ne: null },
          $or: [
            { vendorId: { $exists: false } },
            { vendorId: null },
            { vendorId: "" }
          ]
        }
      },
      {
        $addFields: {
          userObjectId: {
            $cond: {
              if: { $and: [ { $gt: [ { $strLenCP: "$userId" }, 23 ] }, { $lt: [ { $strLenCP: "$userId" }, 25 ] } ] },
              then: { $toObjectId: "$userId" },
              else: null
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userObjectId',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: {
          path: '$userDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      { $sort: { createdAt: -1 } }
    ]).toArray();

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching car requests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
