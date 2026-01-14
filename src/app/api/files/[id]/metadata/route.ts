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

    const fileDoc = await filesCollection.findOne(
      {
        _id: new ObjectId(params.id),
        isActive: true,
      },
      {
        projection: { data: 0 }, // Exclude binary data
      }
    );

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

    return NextResponse.json(
      {
        fileId: fileDoc._id,
        fileName: fileDoc.fileName,
        mimeType: fileDoc.mimeType,
        size: fileDoc.size,
        fileType: fileDoc.fileType,
        uploadedAt: fileDoc.createdAt,
        expiresAt: fileDoc.expiresAt,
        uploadedBy: fileDoc.uploadedBy,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('File metadata error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
