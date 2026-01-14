import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { personal, education, work, skills } = body;

    if (!personal || !education || !work || !skills) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

    const resumeData = `
Name: ${personal.name}
Phone: ${personal.phone}
Email: ${personal.email}
LinkedIn: ${personal.linkedin}
Location: ${personal.location}

Education:
Degree: ${education.degree}
University: ${education.university}
Year: ${education.year}

Work Experience:
${work.map((w: any) => `
Role: ${w.role}
Company: ${w.company}
Dates: ${w.dates}
Duties: ${w.duties}
`).join('\n')}

Skills: ${skills.join(', ')}
`;

    const prompt = `You are an expert Australian HR consultant. Format this raw resume data into a professional, ATS-friendly Australian resume structure. Use Australian English spelling and professional formatting. Return ONLY valid JSON: { "formattedResume": "..." }

Resume Data:
${resumeData}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    if (!response.ok) return NextResponse.json({ error: 'OpenAI API error' }, { status: 500 });

    const data = await response.json();
    const formattedText = data.choices?.[0]?.message?.content || '';

    let parsed: any = {};
    try {
      parsed = JSON.parse(formattedText);
    } catch {
      parsed = { formattedResume: formattedText };
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('user_resumes').insertOne({
      userId,
      formattedText: parsed.formattedResume || formattedText,
      inputData: body,
      createdAt: new Date(),
      type: 'generated'
    });

    return NextResponse.json({ success: true, resumeId: result.insertedId, formattedText: parsed.formattedResume || formattedText });
  } catch (err: any) {
    console.error('Resume build error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
