import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET(req: NextRequest) {
  const adminRole = req.headers.get('x-user-role');
  if (adminRole !== 'admin' && adminRole !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const roleFilter = searchParams.get('role');
    const statusFilter = searchParams.get('status');

    const client = await clientPromise;
    const db = client.db();
    
    let query: any = {};
    
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (roleFilter && roleFilter !== 'all') {
      query.role = roleFilter;
    }
    
    if (statusFilter === 'disabled') {
      query.isDisabled = true;
    } else if (statusFilter === 'active') {
      query.isDisabled = { $ne: true };
    }

    const users = await db.collection('users').find(query).sort({ createdAt: -1 }).toArray();
    
    const safeUsers = users.map(u => ({
      _id: u._id,
      email: u.email,
      name: u.name,
      role: u.role,
      phone: u.phone,
      isDisabled: u.isDisabled || false,
      createdAt: u.createdAt
    }));

    return NextResponse.json(safeUsers);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
