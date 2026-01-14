import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyAuth } from '@/utils/jwt';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyAuth(req);
    if (!auth || auth.role !== 'super_admin') {
      return NextResponse.json({ message: 'Only super_admin can delete audit logs' }, { status: 401 });
    }

    const { id } = params;
    const client = await clientPromise;
    const db = client.db();

    await db.collection('audit_logs').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: 'Log entry deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
