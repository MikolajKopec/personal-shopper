export const prerender = false;

export async function GET() {
  const apiKey = import.meta.env.GETRESPONSE_API_KEY;
  const campaignId = import.meta.env.GETRESPONSE_CAMPAIGN_ID;

  if (!apiKey || !campaignId) {
    return new Response(JSON.stringify({ count: 0 }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const res = await fetch(
      `https://api.getresponse.com/v3/contacts?query[campaignId]=${campaignId}&perPage=1`,
      { headers: { 'X-Auth-Token': `api-key ${apiKey}` } },
    );

    const count = parseInt(res.headers.get('TotalCount') || '0', 10);

    return new Response(JSON.stringify({ count }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch {
    return new Response(JSON.stringify({ count: 0 }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
