import { NextApiRequest, NextApiResponse } from 'next';
import getDb from '../../../lib/mongodb';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded: any = verify(token, JWT_SECRET);
    if (decoded.role !== 'admin' && decoded.role !== 'super_admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const db = await getDb();
    
    // Count pending accommodations
    const pendingAccommodation = await db.collection('accommodations').countDocuments({ status: 'PENDING' });
    
    // Count pickup requests
    const pickupRequests = await db.collection('airport_pickup').countDocuments({ status: 'PENDING' });
    
    // Count consultant bookings
    const consultantBookings = await db.collection('consultant_booking').countDocuments({ status: 'PENDING' });
    
    // Total users
    const userCount = await db.collection('users').countDocuments();

    res.status(200).json({
      pendingAccommodation,
      pickupRequests,
      consultantBookings,
      userCount
    });
  } catch (error) {
    console.error('Stats query error:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
}
