# Săn Style — Personal Styling z Wietnamu

## Projekt

Landing page + brand dla cross-border personal styling business (Wietnam → Polska).
Klientka dostaje osobistą stylistkę z Wietnamu, która dobiera kompletne stylizacje z lokalnych butików (jedwab, len, bawełna) w cenach niższych niż sieciówki w Polsce.

## Stack techniczny

- **Framework**: Astro 5.1 + @astrojs/vercel (static output)
- **Hosting**: Vercel (free tier) lub Hetzner VPS
- **Fonty**: Playfair Display (display) + DM Sans (body)
- **Paleta**: warm neutrals (ivory/sand/stone/taupe/espresso) + brass/gold accenty
- **Mailing**: jeszcze nie wybrane (formularz loguje do console.log)
- **Domena**: sanstyle.pl (planowana)

## Zespół

- **Mikołaj** (25) — CEO/CTO, programista, 14K PLN salary. Komunikacja: bezpośrednia, konkretna, po polsku.
- **Nikola** (25) — CMO/Brand Face, urodzona i wychowana w Polsce, rodzice Wietnamczycy. Twarz marki, kulturowy bridge.

## Model biznesowy

- **P1 (Usługa stylistyczna)**: 990 PLN — konsultacja, moodboard, do 5 stylizacji, iteracje
- **P2 (Sprzedaż ubrań)**: budżet klientki + 50% markup (M%). Zawiera: ubrania, import, cło, VAT, dostawę
- **K (koszt pozyskania)**: ~3000 PLN/szt przy zakupie w Wietnamie
- **Break-even**: 3 klientki/miesiąc
- **Optymistyczny scenariusz Y1**: ~220K PLN netto

## Brand voice

- **Ton**: affordable luxury, ale naturalny — nie pretensjonalny, nie cold/exclusive
- **Język**: polski z angielskimi wstawkami tam gdzie naturalnie pasują
- **Segmenty**:
  - 16-25 lat (TikTok-first, pieniądze od rodziców, FOMO-driven)
  - 25-35 lat (Instagram, własne zarobki, szukają unikatowości)
- **Unikać**: "luksus", "ekskluzywny", "premium" wprost. Zamiast tego: "wyjątkowy", "unikatowy", "naturalny"
- **Stosować**: luźny, bezpośredni ton jak rozmowa z koleżanką która się zna na modzie

## Kluczowe daty

- **~27 luty 2026**: wylot do Wietnamu
- **Marzec 2026**: 5 dni w Ho Chi Minh City — spotkania ze stylistkami, shop tours, zakupy na content
- **Po powrocie**: start procesu z pierwszymi klientkami (MVP)

## Dokumentacja

Szczegółowe dokumenty w `docs/`:
- `biznesplan.md` — pełny biznesplan
- `model-finansowy.md` — podsumowanie modelu finansowego V3
- `brand-voice.md` — pełny brand voice guide
- `content-plan-hcmc.md` — plan contentowy na 5 dni w HCMC
- `brief-stylistki.md` — brief i scoring dla oceny stylistek
- `tasks.md` — aktualna lista zadań

## Preferencje pracy

- Dokumenty edytuj XML-em (unpack/edit/repack), nie generuj od nowa
- Język: polski (komunikacja), angielski ok w kodzie i tech docs
- Nie generuj osobnych plików CSS/JS — all-in-one w Astro components
- Zapisuj kontekst między sesjami w docs/
