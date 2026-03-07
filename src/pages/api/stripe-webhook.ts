export const prerender = false;

import Stripe from 'stripe';

const GETRESPONSE_API = 'https://api.getresponse.com/v3';

export async function POST({ request }: { request: Request }) {
  const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);
  const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;

  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig || !webhookSecret) {
    return new Response('Missing signature', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email || session.metadata?.email;

    if (email) {
      const apiKey = import.meta.env.GETRESPONSE_API_KEY;
      const campaignId = import.meta.env.GETRESPONSE_CAMPAIGN_ID;

      try {
        const contactRes = await fetch(
          `${GETRESPONSE_API}/contacts?query[email]=${encodeURIComponent(email)}&query[campaignId]=${campaignId}`,
          { headers: { 'X-Auth-Token': `api-key ${apiKey}` } },
        );
        const contacts = await contactRes.json();
        const contactId = contacts[0]?.contactId;

        if (contactId) {
          const tagRes = await fetch(`${GETRESPONSE_API}/tags?query[name]=preorder-paid`, {
            headers: { 'X-Auth-Token': `api-key ${apiKey}` },
          });
          const tags = await tagRes.json();
          const tagId = tags[0]?.tagId;

          if (tagId) {
            await fetch(`${GETRESPONSE_API}/contacts/${contactId}/tags`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': `api-key ${apiKey}`,
              },
              body: JSON.stringify({ tags: [{ tagId }] }),
            });
          }
        }
      } catch {
        // Best-effort tagging
      }
    }
  }

  return new Response('OK', { status: 200 });
}
