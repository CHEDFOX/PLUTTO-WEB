'use client';
/**
 * One person's birth as the Guna Milan and Sade Sati calculators ask for it (date, time or "don't know", the
 * birthplace's time zone) and the sidereal Moon it gives. MoonWidget has its own richer copy of these steps.
 */
import { zonedToUtc } from '../../lib/astro/zone';

export const FIELD = 'h-12 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 text-[16px] text-white outline-none focus:border-white/50 [color-scheme:dark]';
export const LABEL = 'block text-[13px] font-semibold text-white/55';

export const emptyBirth = () => ({ date: '', time: '', unknown: false, zone: 'UTC' });

/** A form's problem, in words, or null. */
export function birthError(b, who = '') {
  const m = /^(\d{4})-\d{2}-\d{2}$/.exec(b.date);
  if (!m || +m[1] < 1800 || +m[1] > 2199) return `Enter ${who ? `${who}’s` : 'the'} date of birth (1800–2199).`;
  if (!b.unknown && !/^\d{2}:\d{2}/.test(b.time)) return `Enter ${who ? `${who}’s` : 'the'} time of birth, or tick “I don’t know the time”.`;
  return null;
}

/**
 * The sidereal Moon for a birth. Without a time, noon is used and the whole
 * local day is checked: `changes` lists what the Moon changed that day
 * (nakshatra, sign), so a result can say when it is not certain.
 */
export function birthMoon(sky, b) {
  const [y, mo, d] = b.date.split('-').map(Number);
  const [h, mi] = b.unknown ? [12, 0] : b.time.slice(0, 5).split(':').map(Number);
  const at = zonedToUtc(y, mo, d, h, mi, b.zone);
  const moon = sky.moon(at.date);
  const changes = [];
  if (b.unknown) {
    const a = sky.moon(zonedToUtc(y, mo, d, 0, 0, b.zone).date).sidereal;
    const z = sky.moon(new Date(zonedToUtc(y, mo, d, 23, 59, b.zone).date.getTime() + 59999)).sidereal;
    if (Math.floor(a / (360 / 27)) !== Math.floor(z / (360 / 27))) changes.push('nakshatra');
    if (Math.floor(a / 30) !== Math.floor(z / 30)) changes.push('sign');
  }
  return { at, sidereal: moon.sidereal, changes };
}
