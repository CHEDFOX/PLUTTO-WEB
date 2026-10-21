/**
 * LOCAL BIRTH TIME → THE INSTANT. A birth certificate gives a wall-clock time
 * in a place, and that place's offset from UTC has changed over the years
 * (India ran +6:30 war time from 1942 to 1945; Britain kept summer time all
 * year from 1968 to 1971). The browser ships the IANA time-zone history, so
 * the offset is read from it for that exact date rather than assumed.
 */

function partsIn(tz, ms) {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
  });
  const p = Object.fromEntries(f.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
}

/**
 * The zone's offset from UTC at an instant, in milliseconds — to the second,
 * not the minute: before standard time a zone kept local mean time, and
 * Kolkata's was +5:21:10.
 */
const offsetMs = (tz, ms) => partsIn(tz, ms) - Math.floor(ms / 1000) * 1000;

/**
 * The UTC instant of a local wall-clock time in `tz`. `gap` is true when that
 * time never existed (the hour skipped when clocks went forward): the result
 * is then the moment after the jump, and the page says so.
 */
export function zonedToUtc(y, mo, d, h, mi, tz) {
  const wall = Date.UTC(y, mo - 1, d, h, mi);
  let t = wall - offsetMs(tz, wall);
  t = wall - offsetMs(tz, t);
  const gap = partsIn(tz, t) !== wall;
  return { date: new Date(t), offset: offsetMs(tz, t) / 60000, gap };
}

export function fmtOffset(min) {
  const s = min < 0 ? '−' : '+';
  const a = Math.round(Math.abs(min) * 60);
  const [h, m, sec] = [Math.floor(a / 3600), Math.floor((a % 3600) / 60), a % 60];
  return `UTC${s}${h}${m || sec ? `:${String(m).padStart(2, '0')}` : ''}${sec ? `:${String(sec).padStart(2, '0')}` : ''}`;
}

// Browsers list ICU's canonical IDs, some of them names a city dropped long
// ago: India is only "Asia/Calcutta" in Chrome's list. Offer the name people
// know; both spellings carry the same history.
const MODERN = {
  'Asia/Calcutta': 'Asia/Kolkata', 'Asia/Saigon': 'Asia/Ho_Chi_Minh', 'Asia/Katmandu': 'Asia/Kathmandu', 'Asia/Rangoon': 'Asia/Yangon',
  'Asia/Dacca': 'Asia/Dhaka', 'Asia/Thimbu': 'Asia/Thimphu', 'Asia/Ulan_Bator': 'Asia/Ulaanbaatar', 'Europe/Kiev': 'Europe/Kyiv',
  'America/Godthab': 'America/Nuuk', 'America/Buenos_Aires': 'America/Argentina/Buenos_Aires', 'Atlantic/Faeroe': 'Atlantic/Faroe',
  'Pacific/Truk': 'Pacific/Chuuk', 'Pacific/Ponape': 'Pacific/Pohnpei', 'Pacific/Enderbury': 'Pacific/Kanton',
};
const valid = (z) => { try { new Intl.DateTimeFormat('en-US', { timeZone: z }); return true; } catch { return false; } };
const modern = (z) => (MODERN[z] && valid(MODERN[z]) ? MODERN[z] : z);

export function zones() {
  let list;
  try { list = Intl.supportedValuesOf('timeZone'); } catch { list = ['UTC']; }
  return [...new Set(list.map(modern).concat('UTC'))].sort((a, b) => zoneLabel(a).localeCompare(zoneLabel(b)));
}

export function localZone() {
  try { return modern(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'); } catch { return 'UTC'; }
}

/** "Asia/Kolkata" → "Kolkata — Asia", the way a person scans a long list. */
export const zoneLabel = (z) => {
  const i = z.indexOf('/');
  return i < 0 ? z : `${z.slice(z.lastIndexOf('/') + 1).replace(/_/g, ' ')} — ${z.slice(0, i).replace(/_/g, ' ')}`;
};
