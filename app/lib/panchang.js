/**
 * THE PANCHANG — the five limbs of the Hindu day (tithi, nakshatra, yoga,
 * karana, vara) with the instant each one ends, plus sunrise, sunset and
 * Rahu Kaal. `sky` is lib/sky.js, passed in so the browser can load it lazily;
 * the server page imports it directly. Verified against Swiss Ephemeris.
 *
 * Tithi and karana come from the Moon's elongation from the Sun (the same in
 * either zodiac); nakshatra and yoga from sidereal (Lahiri) longitudes.
 */
import { NAKSHATRAS } from './reference';
import { zonedToUtc } from './zone';

export const TITHIS = ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi'];
export const YOGAS = ['Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyana', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'];
const MOVABLE = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti (Bhadra)'];
export const VARAS = ['Ravivara (Sunday)', 'Somavara (Monday)', 'Mangalavara (Tuesday)', 'Budhavara (Wednesday)', 'Guruvara (Thursday)', 'Shukravara (Friday)', 'Shanivara (Saturday)'];
// Which eighth of the daytime is Rahu Kaal, Sunday first.
const RAHU_KAAL = [8, 2, 7, 5, 6, 4, 3];
const SIGNS = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya', 'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];

const norm = (x) => ((x % 360) + 360) % 360;
export const tithiName = (i) => (i === 14 ? 'Purnima' : i === 29 ? 'Amavasya' : TITHIS[i % 15]);
export const karanaName = (k) => (k === 0 ? 'Kimstughna' : k >= 57 ? ['Shakuni', 'Chatushpada', 'Naga'][k - 57] : MOVABLE[(k - 1) % 7]);

/** Every limb's index at one instant. */
export function limbs(sky, t) {
  const d = new Date(t);
  const s = sky.sun(d), m = sky.moon(d);
  const elong = norm(m.tropical - s.tropical);
  return {
    tithi: Math.floor(elong / 12),
    karana: Math.floor(elong / 6),
    nakshatra: Math.floor(m.sidereal / (360 / 27)),
    yoga: Math.floor(norm(s.sidereal + m.sidereal) / (360 / 27)),
    moonSign: Math.floor(m.sidereal / 30),
    sunSign: Math.floor(s.sidereal / 30),
  };
}

/** When limb `key` next changes after t, to the second (searching up to 3 days). */
export function endOf(sky, t, key) {
  const v = limbs(sky, t)[key];
  let a = t, b = t;
  const HOUR = 3600000;
  for (let i = 0; i < 80; i++) { b = a + HOUR; if (limbs(sky, b)[key] !== v) break; a = b; }
  while (b - a > 1000) { const mid = (a + b) / 2; if (limbs(sky, mid)[key] === v) a = mid; else b = mid; }
  return b;
}

/** Each value `key` takes from `from` to `to`, with the instant it ends. */
function sequence(sky, from, to, key, name) {
  const out = [];
  let t = from;
  for (let n = 0; n < 6 && t < to; n++) {
    const ends = endOf(sky, t, key);
    out.push({ name: name(limbs(sky, t)[key]), ends });
    t = ends + 1000;
  }
  return out;
}

/**
 * The panchang of a local calendar day at a place, the way a panchang prints
 * it: each limb as it stands at sunrise, and every change before the next
 * sunrise. Vara is the weekday of the sunrise.
 */
export function panchang(sky, y, m, d, place) {
  const midnight = zonedToUtc(y, m, d, 0, 0, place.zone).date.getTime();
  const rise = sky.sunEvent(place.lat, place.lon, midnight, +1);
  if (!rise) return null;
  const set = sky.sunEvent(place.lat, place.lon, rise, -1);
  const next = sky.sunEvent(place.lat, place.lon, rise + 3600000, +1);
  const wd = weekdayIn(rise, place.zone);
  const part = (set - rise) / 8, k = RAHU_KAAL[wd] - 1;
  const L = limbs(sky, rise);
  return {
    place, sunrise: rise, sunset: set, nextSunrise: next, vara: VARAS[wd],
    rahuKaal: { from: rise + k * part, to: rise + (k + 1) * part },
    paksha: L.tithi < 15 ? 'Shukla paksha (waxing)' : 'Krishna paksha (waning)',
    tithi: sequence(sky, rise, next, 'tithi', tithiName),
    nakshatra: sequence(sky, rise, next, 'nakshatra', (i) => NAKSHATRAS[i]),
    yoga: sequence(sky, rise, next, 'yoga', (i) => YOGAS[i]),
    karana: sequence(sky, rise, next, 'karana', karanaName),
    moonSign: SIGNS[L.moonSign], sunSign: SIGNS[L.sunSign],
  };
}

const weekdayIn = (t, zone) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(new Date(t).toLocaleDateString('en-US', { weekday: 'short', timeZone: zone }));

export const CITIES = [
  { name: 'New Delhi', lat: 28.6139, lon: 77.2090, zone: 'Asia/Kolkata' },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777, zone: 'Asia/Kolkata' },
  { name: 'Bengaluru', lat: 12.9716, lon: 77.5946, zone: 'Asia/Kolkata' },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707, zone: 'Asia/Kolkata' },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639, zone: 'Asia/Kolkata' },
  { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, zone: 'Asia/Kolkata' },
  { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714, zone: 'Asia/Kolkata' },
  { name: 'Pune', lat: 18.5204, lon: 73.8567, zone: 'Asia/Kolkata' },
  { name: 'Jaipur', lat: 26.9124, lon: 75.7873, zone: 'Asia/Kolkata' },
  { name: 'Lucknow', lat: 26.8467, lon: 80.9462, zone: 'Asia/Kolkata' },
  { name: 'Varanasi', lat: 25.3176, lon: 82.9739, zone: 'Asia/Kolkata' },
  { name: 'Kathmandu', lat: 27.7172, lon: 85.3240, zone: 'Asia/Kathmandu' },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708, zone: 'Asia/Dubai' },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198, zone: 'Asia/Singapore' },
  { name: 'London', lat: 51.5074, lon: -0.1278, zone: 'Europe/London' },
  { name: 'New York', lat: 40.7128, lon: -74.0060, zone: 'America/New_York' },
  { name: 'San Francisco', lat: 37.7749, lon: -122.4194, zone: 'America/Los_Angeles' },
  { name: 'Toronto', lat: 43.6532, lon: -79.3832, zone: 'America/Toronto' },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093, zone: 'Australia/Sydney' },
];
