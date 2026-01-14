import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyAuth } from '@/utils/jwt';
import { ObjectId } from 'mongodb';

const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export async function POST(req: NextRequest) {
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

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as string; // 'resume', 'accommodation', 'car', 'general'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Store file metadata and binary data in MongoDB
    const fileDoc = {
      _id: new ObjectId(),
      fileName: file.name,
      mimeType: file.type,
      size: file.size,
      fileType: fileType || 'general',
      data: buffer,
      uploadedBy: authResult.userId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      isActive: true,
    };

    const result = await filesCollection.insertOne(fileDoc);

    return NextResponse.json(
      {
        fileId: result.insertedId,
        fileName: file.name,
        size: file.size,
        message: 'File uploaded successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
