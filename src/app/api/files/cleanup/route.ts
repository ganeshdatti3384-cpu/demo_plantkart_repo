import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyAuth } from '@/utils/jwt';

export async function POST(req: NextRequest) {
  try {
    const authResult = await verifyAuth(req);
    if (!authResult || !['admin', 'super_admin'].includes(authResult.role)) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const filesCollection = db.collection('files');

    // Find and delete expired files
    const now = new Date();
    const deleteResult = await filesCollection.deleteMany({
      expiresAt: { $lt: now },
    });

    // Also mark orphaned files as inactive (older than 180 days without references)
    const updateResult = await filesCollection.updateMany(
      {
        createdAt: { $lt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) },
        isActive: true,
      },
      {
        $set: { isActive: false },
      }
    );

    // Get cleanup stats
    const stats = {
      deletedExpiredFiles: deleteResult.deletedCount,
      deactivatedOrphanedFiles: updateResult.modifiedCount,
      timestamp: new Date(),
    };

    // Audit log
    const auditCollection = db.collection('audit_logs');
    await auditCollection.insertOne({
      action: 'FILES_CLEANUP',
      performedBy: authResult.userId,
      role: authResult.role,
      details: stats,
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        message: 'File cleanup completed',
        stats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('File cleanup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
