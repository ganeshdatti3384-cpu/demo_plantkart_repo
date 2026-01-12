const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('Please define MONGODB_URI in .env.local');
  process.exit(1);
}

const consultants = [
  {
    name: 'Dr. Rahul Sharma',
    specialty: 'Student Visas & PR',
    rating: 5.0,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200',
    tags: ['Student Visa', 'Migration'],
    status: 'AVAILABLE'
  },
  {
    name: 'Priya Patel',
    specialty: 'Job Search & Careers',
    rating: 4.8,
    reviews: 92,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
    tags: ['Careers', 'Resume'],
    status: 'AVAILABLE'
  }
];

const cars = [
  {
    title: '2022 Tesla Model 3',
    price: '$120/day',
    location: 'Sydney CBD',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800',
    status: 'APPROVED',
    expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
];

const partners = [
  {
    name: 'Global Bank',
    category: 'Finance',
    discount: '10% off Fees',
    image: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&q=80&w=800'
  }
];

const accommodations = [
  {
    title: 'Luxury Sydney Harbor Apartment',
    price: '$650/week',
    location: 'Circular Quay, Sydney',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
    status: 'APPROVED',
    expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
];

const events = [
  {
    title: 'Melbourne Orientation Hike',
    date: 'Jan 25, 2026',
    location: 'Dandenong Ranges',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800',
    description: 'Join fellow students for a scenic hike.',
    category: 'Social'
  }
];

const users = [
  {
    email: 'veerachakradharpampanaboyina@flyhii.in',
    password: '123456',
    role: 'user',
    createdAt: new Date()
  },
  {
    email: 'veerachakradharpampanaboyina@gmail.com',
    password: '123456',
    role: 'admin',
    createdAt: new Date()
  },
  {
    email: 'superadmin@overseas.com',
    role: 'super_admin',
    createdAt: new Date()
  }
];

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    console.log('Cleaning collections...');
    await db.collection('consultants').deleteMany({});
    await db.collection('accommodation').deleteMany({});
    await db.collection('events').deleteMany({});
    await db.collection('users').deleteMany({});
    await db.collection('car').deleteMany({});
    await db.collection('partners').deleteMany({});

    console.log('Inserting data...');
    await db.collection('consultants').insertMany(consultants);
    await db.collection('accommodation').insertMany(accommodations);
    await db.collection('events').insertMany(events);
    await db.collection('users').insertMany(users);
    await db.collection('car').insertMany(cars);
    await db.collection('partners').insertMany(partners);
    console.log('Seed success!');
  } finally {
    await client.close();
  }
}
seed();
