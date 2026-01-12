import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent } from '../../../../lib/stripe';

export async function POST(req: NextRequest) {
  const { amount, currency } = await req.json();
  const paymentIntent = await createPaymentIntent(amount, currency);
  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
