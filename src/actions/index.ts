import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';

function isQualified(size: string, height: number): boolean {
  const qualifiedSizes = ['xs', 's', 'm'];
  return qualifiedSizes.includes(size.toLowerCase()) && height <= 165;
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
      const pat = import.meta.env.AIRTABLE_PAT;
      const baseId = import.meta.env.AIRTABLE_BASE_ID;
      const tableId = import.meta.env.AIRTABLE_LANDING_TABLE_ID;

      if (!pat || !baseId || !tableId) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Brak konfiguracji Airtable',
        });
      }

      const qualified = isQualified(size, height);

      // Check if email already exists
      const checkRes = await fetch(
        `https://api.airtable.com/v0/${baseId}/${tableId}?filterByFormula=${encodeURIComponent(`{Email}="${email}"`)}`,
        {
          headers: { Authorization: `Bearer ${pat}` },
        },
      );

      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData.records?.length > 0) {
          // Already exists — return qualified status based on existing record
          return { success: true, qualified, alreadyExists: true };
        }
      }

      // Create new record
      const res = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${pat}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            Name: name,
            Email: email,
            Size: size.toUpperCase(),
            Height: height,
            Qualified: qualified,
            'Preorder Interest': false,
          },
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: { message: 'Unknown error' } }));
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Nie udało się zapisać: ${error.error?.message || res.statusText}`,
        });
      }

      const record = await res.json();

      return { success: true, qualified, alreadyExists: false, recordId: record.id };
    },
  }),
};
