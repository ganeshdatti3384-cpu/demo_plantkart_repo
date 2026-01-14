import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest, { params }) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const client = await clientPromise;
    const db = client.db();
    const resume = await db.collection('user_resumes').findOne({
      _id: new ObjectId(params.id),
      userId
    });

    if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({
      id: resume._id,
      type: resume.type,
      text: resume.optimizedText || resume.formattedText,
      createdAt: resume.createdAt
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const client = await clientPromise;
    const db = client.db();
    const resume = await db.collection('user_resumes').findOne({
      _id: new ObjectId(params.id),
      userId
    });

    if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // For now, return the text for client to generate PDF using jsPDF
    // Production: integrate jspdf server-side to generate and return binary PDF
    const pdfContent = resume.optimizedText || resume.formattedText;

    return NextResponse.json({
      success: true,
      content: pdfContent,
      message: 'Use this content to generate PDF on client-side with jsPDF or integrate server-side PDF generation'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
