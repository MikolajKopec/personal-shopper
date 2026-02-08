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

      // 1. Save contact in Resend
      const { error: contactError } = await resend.contacts.create({
        email,
        firstName: name,
        unsubscribed: false,
      });

      if (contactError) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Nie udało się zapisać kontaktu: ${contactError.message}`,
        });
      }

      // 2. Notification email to team
      const { error: notifyError } = await resend.emails.send({
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

      if (notifyError) {
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Nie udało się wysłać powiadomienia: ${notifyError.message}`,
        });
      }

      // 3. Confirmation email to subscriber
      // NOTE: This will only work after verifying sanstyle.pl domain in Resend.
      // Until then, Resend blocks sending to non-owner emails.
      // When domain is verified, change from to: 'Săn Style <hello@sanstyle.pl>'
      await resend.emails.send({
        from: 'Săn Style <onboarding@resend.dev>',
        to: email,
        subject: 'Jesteś na liście Săn Style! 🎋',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #2D2926;">
            <div style="text-align: center; padding: 40px 20px 30px;">
              <span style="font-size: 28px; color: #B8956E;">山</span>
              <h1 style="font-size: 24px; font-weight: 400; margin: 12px 0 0;">Săn Style</h1>
            </div>
            <div style="padding: 0 20px 40px;">
              <p style="font-size: 16px; line-height: 1.6;">Cześć ${name}!</p>
              <p style="font-size: 16px; line-height: 1.6;">
                Super, że jesteś z nami! Właśnie zapisałaś się na listę Săn Style
                — osobistego stylingu z Wietnamu.
              </p>
              <p style="font-size: 16px; line-height: 1.6;">
                <strong>Co dalej?</strong> Odezwiemy się w ciągu 48h z krótką ankietą
                o Twoim stylu i preferencjach. Na tej podstawie dopasujemy dla Ciebie stylistkę.
              </p>
              <p style="font-size: 16px; line-height: 1.6;">
                Pierwsza grupa startuje w <strong>marcu 2026</strong>. Limit: 15 osób.
              </p>
              <div style="margin: 30px 0; padding: 20px; background: #F5F0EB; border-left: 3px solid #B8956E;">
                <p style="font-size: 14px; line-height: 1.6; margin: 0; color: #766B5E;">
                  Masz pytania? Odpowiedz na tego maila lub napisz do nas na
                  <a href="mailto:hello@sanstyle.pl" style="color: #B8956E;">hello@sanstyle.pl</a>
                </p>
              </div>
              <p style="font-size: 16px; line-height: 1.6;">
                Do zobaczenia!<br>
                <strong>Mikołaj & Nikola</strong><br>
                <span style="font-size: 13px; color: #766B5E;">Założyciele Săn Style</span>
              </p>
            </div>
            <div style="text-align: center; padding: 20px; border-top: 1px solid #E8E0D5; font-size: 12px; color: #766B5E;">
              © 2026 Săn Style · Personal styling z Wietnamu
            </div>
          </div>
        `,
      }).catch(() => {
        // Silently fail — confirmation emails require verified domain.
        // Will work after sanstyle.pl is verified in Resend.
      });

      return { success: true };
    },
  }),
};
