/**
 * THE MOON'S READING, AS ARITHMETIC — nakshatra, pada, rashi and the
 * Vimshottari dasha from a sidereal Moon longitude. Pure functions, no
 * astronomy: sky.js supplies the longitude.
 *
 * The dasha follows the backend exactly (app/services/dashas/vimshottari.py):
 * the balance at birth is the lord's years times the part of the nakshatra
 * the Moon has still to cross, and a year is 365.25 days. So the free tool
 * and the app give the same dates.
 */
import { NAKSHATRAS, SIGNS } from './reference';

export const DASHA_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
export const DASHA_YEARS = { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 };
const YEAR_MS = 365.25 * 86400000;
const NAK = 360 / 27;
const PADA = NAK / 4;

export function lunar(sidereal) {
  const n = Math.floor(sidereal / NAK);
  const inNak = sidereal - n * NAK;
  const r = Math.floor(sidereal / 30);
  return {
    nakshatra: NAKSHATRAS[n],
    pada: Math.floor(inNak / PADA) + 1,
    traversed: inNak / NAK,
    sign: SIGNS[r],
    degInSign: sidereal - r * 30,
  };
}

/** Mahadashas from birth, each with its antardashas, as Date ranges. */
export function vimshottari(sidereal, birth) {
  const { nakshatra, traversed } = lunar(sidereal);
  const first = DASHA_ORDER.indexOf(nakshatra.lord);
  const balance = DASHA_YEARS[nakshatra.lord] * (1 - traversed);
  // The first period began before birth; its antardashas run from that
  // notional start and are clipped to the birth.
  let start = birth.getTime() - (DASHA_YEARS[nakshatra.lord] - balance) * YEAR_MS;
  const mahas = [];
  for (let k = 0; k < 9; k++) {
    const lord = DASHA_ORDER[(first + k) % 9];
    const len = DASHA_YEARS[lord] * YEAR_MS;
    const antars = [];
    let a = start;
    for (let j = 0; j < 9; j++) {
      const sub = DASHA_ORDER[(first + k + j) % 9];
      const alen = (len * DASHA_YEARS[sub]) / 120;
      if (a + alen > birth.getTime()) antars.push({ lord: sub, start: new Date(Math.max(a, birth.getTime())), end: new Date(a + alen) });
      a += alen;
    }
    mahas.push({ lord, start: new Date(Math.max(start, birth.getTime())), end: new Date(start + len), antars });
    start += len;
  }
  return { lord: nakshatra.lord, balance, mahas };
}

/** The periods running at `at`, or null outside the 120 years. */
export function runningAt(dasha, at) {
  const t = at.getTime();
  const maha = dasha.mahas.find((m) => m.start.getTime() <= t && t < m.end.getTime());
  if (!maha) return null;
  return { maha, antar: maha.antars.find((x) => x.start.getTime() <= t && t < x.end.getTime()) };
}

export function fmtDeg(x) {
  let d = Math.floor(x), m = Math.round((x - d) * 60);
  if (m === 60) { d += 1; m = 0; }
  return `${d}°${String(m).padStart(2, '0')}′`;
}

export function fmtSpan(years) {
  const y = Math.floor(years);
  const mf = (years - y) * 12;
  const m = Math.floor(mf);
  const d = Math.floor((mf - m) * 30.4375);
  return [y && `${y} year${y === 1 ? '' : 's'}`, m && `${m} month${m === 1 ? '' : 's'}`, d && `${d} day${d === 1 ? '' : 's'}`].filter(Boolean).join(', ') || 'less than a day';
}
