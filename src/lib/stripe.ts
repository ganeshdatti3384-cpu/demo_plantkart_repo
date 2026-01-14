import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15',
});
// Payment integration is currently disabled. All Stripe functions are commented out.
// import Stripe from 'stripe';
//
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
//   apiVersion: '2022-11-15',
// });
//
// export async function createPaymentIntent(amount: number, currency = 'inr') {
//   return await stripe.paymentIntents.create({
//     amount,
//     currency,
//   });
// }
//
// export async function createCheckoutSession(params: {
//   amount: number;
//   name: string;
//   requestId: string;
//   type: string;
//   successUrl: string;
//   cancelUrl: string;
// }) {
//   return await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     line_items: [
//       {
//         price_data: {
//           currency: 'aud',
//           product_data: {
//             name: params.name,
//           },
//           unit_amount: Math.round(params.amount * 100), // convert to cents
//         },
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     success_url: params.successUrl + `?session_id={CHECKOUT_SESSION_ID}&requestId=${params.requestId}&type=${params.type}&amount=${params.amount}`,
//     cancel_url: params.cancelUrl,
//     metadata: {
//       requestId: params.requestId,
//       type: params.type,
//     },
//   });
// }

export async function createPaymentIntent(amount: number, currency = 'inr') {
  return await stripe.paymentIntents.create({
    amount,
    currency,
  });
}

export async function createCheckoutSession(params: {
  amount: number;
  name: string;
  requestId: string;
  type: string;
  successUrl: string;
  cancelUrl: string;
}) {
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'aud',
          product_data: {
            name: params.name,
          },
          unit_amount: Math.round(params.amount * 100), // convert to cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: params.successUrl + `?session_id={CHECKOUT_SESSION_ID}&requestId=${params.requestId}&type=${params.type}&amount=${params.amount}`,
    cancel_url: params.cancelUrl,
    metadata: {
      requestId: params.requestId,
      type: params.type,
    },
  });
}
