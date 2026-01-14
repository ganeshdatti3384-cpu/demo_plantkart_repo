import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const filesCollection = db.collection('files');

    // Parse file ID
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid file ID' },
        { status: 400 }
      );
    }

    const fileDoc = await filesCollection.findOne({
      _id: new ObjectId(params.id),
      isActive: true,
    });

    if (!fileDoc) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Check if file has expired
    if (fileDoc.expiresAt && new Date() > fileDoc.expiresAt) {
      return NextResponse.json(
        { error: 'File has expired' },
        { status: 410 }
      );
    }

    const buffer = fileDoc.data;
    const mimeType = fileDoc.mimeType || 'application/octet-stream';
    const fileName = fileDoc.fileName || 'download';

    // Return file with proper headers
    const response = new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': buffer.length.toString(),
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });

    return response;
  } catch (error) {
    console.error('File download error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
