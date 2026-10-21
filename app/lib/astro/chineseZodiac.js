import { ANIMALS, yearAnimalIndex, yearElement } from '../content/reference';

// ── Chinese zodiac ─────────────────────────────────────────────────────────
/**
 * The animal of a birth date, as BaZi counts it: the year turns at Li Chun, the
 * start of spring, which falls on 3, 4 or 5 February. A birth on those days is
 * flagged — the exact minute decides it. (The popular zodiac turns at Chinese
 * New Year instead, between 21 January and 20 February; the page says so.)
 */
export function chineseZodiac(y, m, d) {
  const before = m === 1 || (m === 2 && d < 4);
  const year = before ? y - 1 : y;
  const a = ANIMALS[yearAnimalIndex(year)];
  return {
    year, animal: a, element: yearElement(year), polarity: year % 2 === 0 ? 'Yang' : 'Yin',
    cusp: m === 2 && d >= 3 && d <= 5,
    newYearWindow: m === 1 ? d >= 21 : m === 2 && d <= 20,
    previous: ANIMALS[yearAnimalIndex(y - 1)],
    calendar: ANIMALS[yearAnimalIndex(y)],
  };
}
