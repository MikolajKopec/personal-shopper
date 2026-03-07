export const prerender = false;

const GETRESPONSE_API = 'https://api.getresponse.com/v3';

export async function POST({ request }: { request: Request }) {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response('Email required', { status: 400 });
    }

    const apiKey = import.meta.env.GETRESPONSE_API_KEY;
    const campaignId = import.meta.env.GETRESPONSE_CAMPAIGN_ID;

    if (!apiKey || !campaignId) {
      return new Response('Missing config', { status: 500 });
    }

    // Find contact
    const contactRes = await fetch(
      `${GETRESPONSE_API}/contacts?query[email]=${encodeURIComponent(email)}&query[campaignId]=${campaignId}`,
      { headers: { 'X-Auth-Token': `api-key ${apiKey}` } },
    );

    if (!contactRes.ok) {
      return new Response('Contact not found', { status: 404 });
    }

    const contacts = await contactRes.json();
    const contactId = contacts[0]?.contactId;

    if (!contactId) {
      return new Response('Contact not found', { status: 404 });
    }

    // Find preorder-interested tag
    const tagRes = await fetch(`${GETRESPONSE_API}/tags?query[name]=preorder-interested`, {
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

    return new Response('OK', { status: 200 });
  } catch {
    return new Response('Error', { status: 500 });
  }
}
