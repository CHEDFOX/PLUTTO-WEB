/**
 * SADE SATI — Saturn's seven and a half years over the Moon sign, read from
 * Saturn's own sidereal ingresses 1900–2100 as Swiss Ephemeris computes them
 * (scripts/ephemeris.py → data/saturn.json, 2.7 kB). No approximation: every
 * entry and every retrograde re-entry is a real crossing, to the second.
 *
 * Sade Sati is Saturn in the 12th, 1st and 2nd signs from the Moon; the two
 * "small panotis" (Dhaiya) are Saturn in the 4th (Kantaka) and 8th (Ashtama).
 */
import SATURN from './data/saturn.json';

const YEAR = 365.25 * 86400000;

/** Saturn's sign, interval by interval, from 1900 to 2100. */
function spans() {
  const out = [];
  let sign = SATURN.start, from = Date.UTC(1900, 0, 1);
  for (const [s, to] of SATURN.ingresses.map(([t, x]) => [x, t * 1000])) {
    out.push({ sign, from, to });
    sign = s; from = to;
  }
  out.push({ sign, from, to: Date.UTC(2101, 0, 1) });
  return out;
}
const SPANS = spans();

/**
 * Every period in which Saturn stands in one of `houses` (counted from the
 * Moon sign, 1 = the sign itself). A retrograde step back out and in again
 * within `join` is part of the same period, and each stay is kept as a phase.
 */
function periods(moon, houses, join = 1.5 * YEAR) {
  const signs = houses.map((h) => (moon + h - 1) % 12);
  const out = [];
  for (const s of SPANS) {
    const i = signs.indexOf(s.sign);
    if (i < 0) continue;
    const last = out[out.length - 1];
    const phase = { house: houses[i], from: s.from, to: s.to };
    if (last && s.from - last.to <= join) { last.to = s.to; last.phases.push(phase); } else out.push({ from: s.from, to: s.to, phases: [phase] });
  }
  return out;
}

export const sadeSati = (moon) => periods(moon, [12, 1, 2]);
export const kantaka = (moon) => periods(moon, [4]);
export const ashtama = (moon) => periods(moon, [8]);
export const PHASE = { 12: 'Rising (12th from the Moon)', 1: 'Peak (over the Moon sign)', 2: 'Setting (2nd from the Moon)' };
export const GENERATED = SATURN.generated;
