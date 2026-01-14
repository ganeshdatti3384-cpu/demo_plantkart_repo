import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyAuth } from '@/utils/jwt';

export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyAuth(req);
    if (!authResult) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const filesCollection = db.collection('files');

    // Get query parameters for filtering
    const fileType = req.nextUrl.searchParams.get('fileType');

    // Build filter
    const filter: any = {
      uploadedBy: authResult.userId,
      isActive: true,
    };

    if (fileType) {
      filter.fileType = fileType;
    }

    // Fetch user's files (exclude binary data)
    const files = await filesCollection
      .find(filter, { projection: { data: 0 } })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    // Filter out expired files
    const activeFiles = files.filter((file) => {
      return !file.expiresAt || new Date() <= file.expiresAt;
    });

    return NextResponse.json(
      {
        total: activeFiles.length,
        files: activeFiles.map((file) => ({
          fileId: file._id,
          fileName: file.fileName,
          mimeType: file.mimeType,
          size: file.size,
          fileType: file.fileType,
          uploadedAt: file.createdAt,
          expiresAt: file.expiresAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('File list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
