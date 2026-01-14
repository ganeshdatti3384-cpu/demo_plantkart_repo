import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  // Only accessible with a secret or in development
  const client = await clientPromise;
  const db = client.db();

  // 1. Seed Consultants
  const consultantCount = await db.collection('consultants').countDocuments();
  if (consultantCount === 0) {
    await db.collection('consultants').insertMany([
      {
        name: 'Dr. Sarah Wilson',
        specialty: 'Education & Visa Specialist',
        exp: '12+ Years',
        rating: 4.9,
        price: '$150/hr',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        slots: ['Mon 10:00 AM', 'Mon 02:00 PM', 'Wed 11:00 AM', 'Fri 04:00 PM']
      },
      {
        name: 'Michael Chen',
        specialty: 'Career Consultant',
        exp: '8 Years',
        rating: 4.8,
        price: '$120/hr',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
        slots: ['Tue 09:00 AM', 'Tue 01:00 PM', 'Thu 10:00 AM']
      },
      {
        name: 'Emma Rodriguez',
        specialty: 'Migration Strategy',
        exp: '15 Years',
        rating: 5.0,
        price: '$200/hr',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
        slots: ['Mon 09:00 AM', 'Fri 02:00 PM']
      }
    ]);
  }

  // 2. Seed Events
  const eventCount = await db.collection('events').countDocuments();
  if (eventCount === 0) {
    await db.collection('events').insertMany([
      {
        title: 'Student Orientation - Sydney 2024',
        date: 'MAR 25, 2024',
        location: 'Circular Quay, Sydney',
        category: 'ORIENTATION',
        image: 'https://images.unsplash.com/photo-1523050335109-0ef0463b31be?auto=format&fit=crop&q=80&w=800',
        attendees: []
      },
      {
        title: 'Professional Networking Night',
        date: 'APR 12, 2024',
        location: 'Melbourne Central',
        category: 'NETWORKING',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
        attendees: []
      }
    ]);
  }

  return NextResponse.json({ success: true, message: 'Database seeded with sample consultants and events.' });
}
