import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const server = {
  signup: defineAction({
    accept: 'form',
    input: z.object({
      name: z.string().min(1, 'Imię jest wymagane'),
      email: z.string().email('Podaj prawidłowy adres email'),
      instagram: z.string().optional(),
      source: z.enum(['tiktok', 'instagram', 'friend', 'other', '']).optional(),
    }),
    handler: async ({ name, email, instagram, source }) => {
      const sourceLabels: Record<string, string> = {
        tiktok: 'TikTok',
        instagram: 'Instagram',
        friend: 'Od koleżanki / znajomej',
        other: 'Inne',
      };

      const sourceDisplay = source ? (sourceLabels[source] || '—') : '—';
      const instagramDisplay = instagram || '—';
      const now = new Date().toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' });

      const { error } = await resend.emails.send({
        from: 'Săn Style <onboarding@resend.dev>',
        to: import.meta.env.NOTIFICATION_EMAIL,
        subject: `Nowy zapis: ${name} (${email})`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2D2926; border-bottom: 2px solid #B8956E; padding-bottom: 12px;">
              Nowy zapis na listę Săn Style
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #766B5E; width: 140px;">Imię</td>
                <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #2D2926; font-weight: 500;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #766B5E;">Email</td>
                <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #2D2926; font-weight: 500;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #766B5E;">Instagram</td>
                <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #2D2926;">${instagramDisplay}</td>
              </tr>
              <tr>
                <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #766B5E;">Skąd wie</td>
                <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #2D2926;">${sourceDisplay}</td>
              </tr>
            </table>
            <p style="color: #766B5E; font-size: 13px;">Zapisano: ${now}</p>
          </div>
        `,
      });

      if (error) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Nie udało się wysłać emaila: ${error.message}`,
        });
      }

      return { success: true };
    },
  }),
};
