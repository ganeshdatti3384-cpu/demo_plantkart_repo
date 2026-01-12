import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '../../../../lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { amount, name, requestId, type } = await req.json();
    
    // In a real app, you should verify the amount from the DB using requestId
    
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host');
    const baseUrl = `${protocol}://${host}`;

    const session = await createCheckoutSession({
      amount: parseFloat(amount),
      name,
      requestId,
      type,
      successUrl: `${baseUrl}/payments?status=success`,
      cancelUrl: `${baseUrl}/payments?status=cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
