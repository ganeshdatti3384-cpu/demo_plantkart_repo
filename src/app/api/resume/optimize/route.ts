import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyAuth } from '@/utils/jwt';
import { ObjectId } from 'mongodb';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const authResult = await verifyAuth(req);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const formData = await req.formData();
    const pdfFile = formData.get('pdf') as File | null;
    const jobDescription = formData.get('jobDescription') as string | null;

    if (!pdfFile || !jobDescription) {
      return NextResponse.json({ error: 'Missing pdf or jobDescription' }, { status: 400 });
    }

    // Read PDF buffer
    const buffer = await pdfFile.arrayBuffer();
    const pdfBuffer = Buffer.from(buffer);

    // Call OpenAI with system prompt to optimize resume text
    const prompt = `You are an expert Australian HR consultant. The user is uploading a resume PDF and wants to optimize it for the following job description:\n\nJob Description:\n${jobDescription}\n\nPlease rewrite the resume text to:\n1. Use Australian English spelling\n2. Highlight transferable skills relevant to the job\n3. Use professional, action-oriented language\n4. Return ONLY valid JSON in this format: { "optimizedText": "..." }`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'OpenAI API error' }, { status: 500 });
    }

    const data = await response.json();
    const optimizedText = data.choices?.[0]?.message?.content || '';

    // Parse JSON from response
    let parsed: any = {};
    try {
      parsed = JSON.parse(optimizedText);
    } catch {
      parsed = { optimizedText: optimizedText };
    }

    // Store PDF in files collection
    const filesCollection = db.collection('files');
    const fileResult = await filesCollection.insertOne({
      _id: new ObjectId(),
      fileName: pdfFile.name,
      mimeType: pdfFile.type,
      size: pdfFile.size,
      fileType: 'resume',
      data: pdfBuffer,
      uploadedBy: authResult.userId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      isActive: true,
    });

    // Store optimized resume
    const resumesCollection = db.collection('user_resumes');
    const result = await resumesCollection.insertOne({
      userId: authResult.userId,
      originalPdfFileId: fileResult.insertedId,
      optimizedText: parsed.optimizedText || optimizedText,
      jobDescription,
      createdAt: new Date(),
      type: 'optimized'
    });

    return NextResponse.json({
      success: true,
      resumeId: result.insertedId,
      pdfFileId: fileResult.insertedId,
      optimizedText: parsed.optimizedText || optimizedText
    });
  } catch (err: any) {
    console.error('Resume optimize error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
