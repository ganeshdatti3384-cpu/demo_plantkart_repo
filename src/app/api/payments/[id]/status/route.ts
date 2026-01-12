import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15',
});

export async function GET(req: NextRequest, { params }) {
  const paymentIntent = await stripe.paymentIntents.retrieve(params.id);
  return NextResponse.json({ status: paymentIntent.status });
}
