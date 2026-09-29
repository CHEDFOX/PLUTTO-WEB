/**
 * THE SKY CALENDAR — retrogrades, eclipses and sign changes for a year, read
 * from data/ephemeris.json (Swiss Ephemeris, scripts/ephemeris.py). Server
 * only: the pages print these as HTML, so nothing here reaches the browser.
 */
import EPH from './data/ephemeris.json';

export const SOURCE = EPH.generated;
export const CAL_YEARS = [2026, 2027, 2028];
const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const SANSKRIT = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya', 'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];
export const signAt = (lon) => SIGNS[Math.floor(lon / 30)];
export const degIn = (lon) => { const d = lon % 30; const w = Math.floor(d); let m = Math.round((d - w) * 60); return m === 60 ? `${w + 1}°00′` : `${w}°${String(m).padStart(2, '0')}′`; };
export const sanskrit = (sign) => SANSKRIT[SIGNS.indexOf(sign)];

const inYear = (t, y) => t >= Date.UTC(y, 0, 1) && t < Date.UTC(y + 1, 0, 1);

/** Retrograde periods touching `year`, planet by planet (each: from/to stations). */
export function retrogrades(year) {
  const out = {};
  for (const [planet, st] of Object.entries(EPH.stations)) {
    const periods = [];
    st.forEach((s, i) => {
      if (s.kind !== 'retrograde') return;
      const d = st[i + 1];
      if (!d) return;
      if (inYear(s.t, year) || inYear(d.t, year) || (s.t < Date.UTC(year, 0, 1) && d.t >= Date.UTC(year + 1, 0, 1))) {
        periods.push({ from: s.t, to: d.t, startTrop: s.trop, endTrop: d.trop, startSid: s.sid, endSid: d.sid, days: Math.round((d.t - s.t) / 86400000) });
      }
    });
    out[planet] = periods;
  }
  return out;
}

export const eclipses = (year) => EPH.eclipses.filter((e) => inYear(e.t, year));

/** Sign changes in `year`: zodiac 'sidereal' | 'tropical'; Ketu mirrors Rahu. */
export function ingresses(year, zodiac, planet) {
  return (EPH[zodiac][planet] || []).filter((x) => inYear(x.t, year));
}

/** The last ingress before `year` — where a slow planet starts the year. */
export function signAtStart(year, zodiac, planet) {
  const before = (EPH[zodiac][planet] || []).filter((x) => x.t < Date.UTC(year, 0, 1));
  return before.length ? before[before.length - 1].sign : null;
}

export const opposite = (sign) => SIGNS[(SIGNS.indexOf(sign) + 6) % 12];

const fmt = (t, tz, opts) => new Date(t).toLocaleString('en-GB', { timeZone: tz, ...opts });
export const utcDate = (t) => fmt(t, 'UTC', { day: 'numeric', month: 'long', year: 'numeric' });
export const utcShort = (t) => fmt(t, 'UTC', { day: 'numeric', month: 'short' });
export const utcTime = (t) => fmt(t, 'UTC', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
export const istWhen = (t) => `${fmt(t, 'Asia/Kolkata', { day: 'numeric', month: 'short' })}, ${fmt(t, 'Asia/Kolkata', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })}`;
