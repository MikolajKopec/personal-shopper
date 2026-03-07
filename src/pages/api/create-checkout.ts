export const prerender = false;

import Stripe from 'stripe';

export async function POST({ request }: { request: Request }) {
  const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);
  const siteUrl = import.meta.env.SITE_URL || 'http://localhost:4321';

  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'p24', 'blik'],
      customer_email: email,
      line_items: [{ price: import.meta.env.STRIPE_PRICE_ID, quantity: 1 }],
      mode: 'payment',
      success_url: `${siteUrl}?preorder=success`,
      cancel_url: `${siteUrl}?preorder=cancel`,
      metadata: { email },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
