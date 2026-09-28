/**
 * THE CALCULATORS' ARITHMETIC — pure functions, shared by the tools at /tools
 * and by nothing else, so what a page explains is exactly what it computes.
 */
import { ANIMALS, yearAnimalIndex, yearElement } from './reference';

const MASTER = new Set([11, 22, 33]);
const digitSum = (n) => String(n).split('').reduce((s, d) => s + Number(d), 0);

/** Reduce to one digit, keeping 11, 22 and 33 (master numbers). Returns the chain. */
export function reduce(n, keepMaster = true) {
  const chain = [n];
  while (n > 9 && !(keepMaster && MASTER.has(n))) { n = digitSum(n); chain.push(n); }
  return chain;
}

/**
 * Life path — the usual method: reduce the month, the day and the year each on
 * its own (keeping master numbers), then add the three and reduce again.
 */
export function lifePath(y, m, d) {
  const parts = [['Month', m], ['Day', d], ['Year', y]].map(([label, v]) => ({ label, value: v, chain: reduce(v) }));
  const total = parts.reduce((s, p) => s + p.chain[p.chain.length - 1], 0);
  const chain = reduce(total);
  return { parts, total, chain, number: chain[chain.length - 1] };
}

export const LIFE_PATH = {
  1: 'The initiator — independence, drive and the courage to go first.',
  2: 'The partner — cooperation, sensitivity and a gift for bringing people together.',
  3: 'The communicator — expression, creativity and joy in being heard.',
  4: 'The builder — structure, patience and work that lasts.',
  5: 'The explorer — freedom, change and appetite for experience.',
  6: 'The carer — responsibility, home and the people who depend on you.',
  7: 'The seeker — inquiry, solitude and the need to understand.',
  8: 'The executive — ambition, authority and mastery of the material world.',
  9: 'The humanitarian — compassion, completion and a wide view of the world.',
  11: 'Master number 11: intuition and inspiration — a heightened 2.',
  22: 'Master number 22: the master builder — vision made real at scale, a heightened 4.',
  33: 'Master number 33: the master teacher — service and compassion, a heightened 6.',
};

// ── Names ────────────────────────────────────────────────────────────────────
const PYTH = Object.fromEntries('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((c, i) => [c, (i % 9) + 1]));
const CHALD = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 8, G: 3, H: 5, I: 1, J: 1, K: 2, L: 3, M: 4, N: 5, O: 7, P: 8, Q: 1, R: 2, S: 3, T: 4, U: 6, V: 6, W: 6, X: 5, Y: 1, Z: 7 };
const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);
const letters = (name) => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z]/g, '').split('');

export function nameNumbers(name) {
  const L = letters(name);
  if (!L.length) return null;
  const pyth = L.reduce((s, c) => s + PYTH[c], 0);
  const soul = L.filter((c) => VOWELS.has(c)).reduce((s, c) => s + PYTH[c], 0);
  const pers = L.filter((c) => !VOWELS.has(c)).reduce((s, c) => s + PYTH[c], 0);
  const chald = L.reduce((s, c) => s + CHALD[c], 0);
  const last = (c) => c[c.length - 1];
  return {
    letters: L.length,
    pythagorean: { total: pyth, expression: last(reduce(pyth)), soulUrge: soul ? last(reduce(soul)) : null, personality: pers ? last(reduce(pers)) : null },
    chaldean: { compound: chald, single: last(reduce(chald, false)) },
    table: L.map((c) => ({ c, p: PYTH[c], ch: CHALD[c] })),
  };
}

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
