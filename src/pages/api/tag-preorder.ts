export const prerender = false;

export async function POST({ request }: { request: Request }) {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response('Email required', { status: 400 });
    }

    const pat = import.meta.env.AIRTABLE_PAT;
    const baseId = import.meta.env.AIRTABLE_BASE_ID;
    const tableId = import.meta.env.AIRTABLE_LANDING_TABLE_ID;

    if (!pat || !baseId || !tableId) {
      return new Response('Missing config', { status: 500 });
    }

    // Find record by email
    const findRes = await fetch(
      `https://api.airtable.com/v0/${baseId}/${tableId}?filterByFormula=${encodeURIComponent(`{Email}="${email}"`)}`,
      {
        headers: { Authorization: `Bearer ${pat}` },
      },
    );

    if (!findRes.ok) {
      return new Response('Search failed', { status: 500 });
    }

    const findData = await findRes.json();
    const recordId = findData.records?.[0]?.id;

    if (!recordId) {
      return new Response('Record not found', { status: 404 });
    }

    // Update Preorder Interest to true
    const updateRes = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}/${recordId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${pat}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          'Preorder Interest': true,
        },
      }),
    });

    if (!updateRes.ok) {
      return new Response('Update failed', { status: 500 });
    }

    return new Response('OK', { status: 200 });
  } catch {
    return new Response('Error', { status: 500 });
  }
}
