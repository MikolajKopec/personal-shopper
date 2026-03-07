import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';

const GETRESPONSE_API = 'https://api.getresponse.com/v3';

function isQualified(size: string, height: number): boolean {
  const qualifiedSizes = ['xs', 's', 'm'];
  return qualifiedSizes.includes(size.toLowerCase()) && height <= 165;
}

async function findContactByEmail(apiKey: string, campaignId: string, email: string): Promise<string | null> {
  const res = await fetch(
    `${GETRESPONSE_API}/contacts?query[email]=${encodeURIComponent(email)}&query[campaignId]=${campaignId}`,
    { headers: { 'X-Auth-Token': `api-key ${apiKey}` } },
  );
  if (!res.ok) return null;
  const contacts = await res.json();
  return contacts[0]?.contactId || null;
}

async function findTagId(apiKey: string, tagName: string): Promise<string | null> {
  const res = await fetch(`${GETRESPONSE_API}/tags?query[name]=${tagName}`, {
    headers: { 'X-Auth-Token': `api-key ${apiKey}` },
  });
  if (!res.ok) return null;
  const tags = await res.json();
  return tags[0]?.tagId || null;
}

async function addTagToContact(apiKey: string, contactId: string, tagId: string) {
  await fetch(`${GETRESPONSE_API}/contacts/${contactId}/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': `api-key ${apiKey}`,
    },
    body: JSON.stringify({ tags: [{ tagId }] }),
  });
}

export const server = {
  signup: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(1, 'Imię jest wymagane'),
      email: z.string().email('Podaj prawidłowy adres email'),
      size: z.enum(['xs', 's', 'm', 'l', 'xl'], {
        errorMap: () => ({ message: 'Wybierz rozmiar' }),
      }),
      height: z.coerce
        .number({ errorMap: () => ({ message: 'Podaj wzrost w cm' }) })
        .min(100, 'Podaj prawidłowy wzrost')
        .max(220, 'Podaj prawidłowy wzrost'),
    }),
    handler: async ({ name, email, size, height }) => {
      const apiKey = import.meta.env.GETRESPONSE_API_KEY;
      const campaignId = import.meta.env.GETRESPONSE_CAMPAIGN_ID;

      if (!apiKey || !campaignId) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Brak konfiguracji GetResponse',
        });
      }

      const qualified = isQualified(size, height);

      // Build custom field values
      const customFieldValues: { customFieldId: string; value: string[] }[] = [];

      const sizeFieldId = import.meta.env.GETRESPONSE_FIELD_SIZE;
      const heightFieldId = import.meta.env.GETRESPONSE_FIELD_HEIGHT;

      if (sizeFieldId) {
        customFieldValues.push({ customFieldId: sizeFieldId, value: [size.toUpperCase()] });
      }
      if (heightFieldId) {
        customFieldValues.push({ customFieldId: heightFieldId, value: [String(height)] });
      }

      const body: Record<string, unknown> = {
        email,
        name,
        campaign: { campaignId },
      };

      if (customFieldValues.length > 0) {
        body.customFieldValues = customFieldValues;
      }

      // Create contact
      const res = await fetch(`${GETRESPONSE_API}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': `api-key ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      const alreadyExists = res.status === 409;

      if (!alreadyExists && res.status !== 202) {
        const error = await res.json().catch(() => ({ message: 'Unknown error' }));
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Nie udało się zapisać: ${error.message || res.statusText}`,
        });
      }

      // Tag the contact (best-effort — don't fail signup if tagging fails)
      try {
        await new Promise((r) => setTimeout(r, 1000));

        const contactId = await findContactByEmail(apiKey, campaignId, email);
        if (contactId) {
          const waitlistTagId = await findTagId(apiKey, 'waitlist');
          if (waitlistTagId) await addTagToContact(apiKey, contactId, waitlistTagId);

          const qualTagName = qualified ? 'qualified' : 'expansion-waitlist';
          const qualTagId = await findTagId(apiKey, qualTagName);
          if (qualTagId) await addTagToContact(apiKey, contactId, qualTagId);
        }
      } catch {
        // Tagging is best-effort
      }

      return { success: true, qualified, alreadyExists };
    },
  }),
};
