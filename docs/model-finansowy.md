# Model Finansowy V3 — Săn Style

## Zmienne kluczowe

| Symbol | Nazwa | Wartość bazowa | Opis |
|--------|-------|---------------|------|
| P1 | Cena usługi stylistycznej | 990 PLN | Jednorazowa opłata za konsultację |
| K | Koszt pozyskania ubrań | 3000 PLN | Średni koszt zakupu zestawu w Wietnamie |
| M% | Marża na ubraniach | 50% | Markup na P2 |
| P2 | Cena ubrań dla klientki | K × (1 + M%) | np. 3000 × 1.5 = 4500 PLN |
| N | Liczba klientek/miesiąc | zmienna | Główny driver modelu |
| S | Koszt wysyłki/szt | ~200 PLN | Lotnicza z Wietnamu |
| C | Cło + VAT | ~15-20% wartości | Wliczone w P2 |

## Przychód per klientka

```
Przychód = P1 + P2
         = 990 + (K × 1.5)
         = 990 + 4500
         = 5490 PLN (przykład dla K=3000)

Marża brutto = P1 + (K × M%) - S - C
             = 990 + 1500 - 200 - ~500
             = ~1790 PLN/klientkę
```

## Koszty stałe (miesięczne)

| Pozycja | Koszt |
|---------|-------|
| Hosting (Vercel free / Hetzner) | 0-50 PLN |
| Narzędzia (Canva, etc.) | ~100 PLN |
| Telefon/internet | ~100 PLN |
| Księgowość | ~300 PLN |
| **Razem** | **~550 PLN/mies** |

## Scenariusze miesięczne

### Pesymistyczny: 1 klientka/mies
- Przychód: 5490 PLN
- Koszty zmienne: ~3700 PLN (K + S + C)
- Marża brutto: ~1790 PLN
- Minus koszty stałe: ~1240 PLN netto

### Realistyczny: 5 klientek/mies
- Przychód: 27 450 PLN
- Koszty zmienne: ~18 500 PLN
- Marża brutto: ~8 950 PLN
- Minus koszty stałe: ~8 400 PLN netto

### Optymistyczny: 10 klientek/mies
- Przychód: 54 900 PLN
- Koszty zmienne: ~37 000 PLN
- Marża brutto: ~17 900 PLN
- Minus koszty stałe: ~17 350 PLN netto

## Break-even

```
Break-even = Koszty stałe / Marża per klientka
           = 550 / 1790
           ≈ 0.31 klientki → zaokrąglając: 1 klientka/mies
```

Realny break-even uwzględniający czas pracy: **~3 klientki/miesiąc**
(przy założeniu, że czas Mikołaja i Nikoli ma wartość alternatywną)

## Projekcja roczna (scenariusz optymalny)

| Miesiąc | Klientki | Przychód | Marża netto |
|---------|----------|----------|-------------|
| Kwiecień 2026 | 3 | 16 470 | 4 820 |
| Maj | 5 | 27 450 | 8 400 |
| Czerwiec | 7 | 38 430 | 12 000 |
| Lipiec | 8 | 43 920 | 13 800 |
| Sierpień | 10 | 54 900 | 17 350 |
| Wrzesień | 10 | 54 900 | 17 350 |
| Październik | 12 | 65 880 | 21 000 |
| Listopad | 12 | 65 880 | 21 000 |
| Grudzień | 15 | 82 350 | 26 500 |
| **Razem Y1** | **~82** | **~450K** | **~142K** |

Uwaga: scenariusz optymalny zakłada stały wzrost i brak churnu. Realistycznie oczekujemy 50-70% tych wartości.

## Wrażliwość modelu

### Na marżę (M%):
- M% = 30%: marża per klientka ~890 PLN (nieopłacalne przy <5 klientek)
- M% = 50%: marża per klientka ~1790 PLN (bazowy)
- M% = 70%: marża per klientka ~2690 PLN (ambitne)

### Na koszt pozyskania (K):
- K = 2000: P2 = 3000, marża = ~1290
- K = 3000: P2 = 4500, marża = ~1790 (bazowy)
- K = 5000: P2 = 7500, marża = ~2790

### Na liczbę klientek (N):
- Poniżej 3/mies: projekt nie jest opłacalny jako full-time
- 3-5/mies: pokrywa koszty, generuje skromny dochód
- 5-10/mies: komfortowa rentowność
- 10+/mies: wymaga skalowania operacji (druga stylistka)

## Próg skalowania

Przy ~10 klientkach/miesiąc:
- Jedna stylistka jest obciążona na ~80%
- Potrzeba: druga stylistka lub automatyzacja procesu
- Koszt drugiej stylistki: do ustalenia (prowizja vs stała)

## Koszty startowe (jednorazowe)

| Pozycja | Koszt |
|---------|-------|
| Bilety lotnicze Wietnam (2 os.) | ~6000 PLN |
| Zakupy na content w HCMC | ~3000 PLN |
| Rejestracja JDG | ~0 PLN (CEIDG) |
| Domena + setup | ~100 PLN |
| Gimbal + akcesoria | ~500 PLN |
| **Razem startup** | **~9600 PLN** |

---

*Model V3 — ostatnia aktualizacja: 7 lutego 2026*
*Pełny arkusz kalkulacyjny: model_finansowy_v3.xlsx (generowany przez build_v3.py)*
