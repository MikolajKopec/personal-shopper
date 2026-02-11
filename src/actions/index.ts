import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';

const GETRESPONSE_API = 'https://api.getresponse.com/v3';

export const server = {
  signup: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(1, 'Imię jest wymagane'),
      email: z.string().email('Podaj prawidłowy adres email'),
      instagram: z.string().optional(),
      source: z.enum(['tiktok', 'instagram', 'friend', 'other', '']).optional(),
      consent: z.literal('on', { errorMap: () => ({ message: 'Zgoda na przetwarzanie danych jest wymagana' }) }),
    }),
    handler: async ({ name, email, instagram, source }) => {
      const apiKey = import.meta.env.GETRESPONSE_API_KEY;
      const campaignId = import.meta.env.GETRESPONSE_CAMPAIGN_ID;

      if (!apiKey || !campaignId) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Brak konfiguracji GetResponse (API key lub Campaign ID)',
        });
      }

      const sourceLabels: Record<string, string> = {
        tiktok: 'TikTok',
        instagram: 'Instagram',
        friend: 'Od koleżanki / znajomej',
        other: 'Inne',
      };

      // Build custom fields (instagram, source) — requires fields created in GetResponse
      const customFieldValues: { customFieldId: string; value: string[] }[] = [];

      const instagramFieldId = import.meta.env.GETRESPONSE_FIELD_INSTAGRAM;
      const sourceFieldId = import.meta.env.GETRESPONSE_FIELD_SOURCE;

      if (instagramFieldId && instagram) {
        customFieldValues.push({ customFieldId: instagramFieldId, value: [instagram] });
      }
      if (sourceFieldId && source) {
        customFieldValues.push({ customFieldId: sourceFieldId, value: [sourceLabels[source] || source] });
      }

      const body: Record<string, unknown> = {
        email,
        name,
        campaign: { campaignId },
      };

      if (customFieldValues.length > 0) {
        body.customFieldValues = customFieldValues;
      }

      const res = await fetch(`${GETRESPONSE_API}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': `api-key ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      // 409 = contact already exists — treat as success
      if (res.status === 409) {
        return { success: true, alreadyExists: true };
      }

      if (res.status === 202) {
        return { success: true };
      }

      const error = await res.json().catch(() => ({ message: 'Unknown error' }));
      throw new ActionError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Nie udało się zapisać: ${error.message || res.statusText}`,
      });
    },
  }),
};
