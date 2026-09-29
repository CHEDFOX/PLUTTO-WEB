'use client';
/**
 * ONE PERSON'S BIRTH, AS THE CALCULATORS ASK FOR IT — date, time (or "don't
 * know"), and the birthplace's time zone — and the sidereal Moon it gives.
 * Shared by the Guna Milan and Sade Sati calculators; the Moon calculator has
 * its own richer copy of the same steps.
 */
import { useEffect, useState } from 'react';
import { zonedToUtc, zones, localZone, zoneLabel } from '../../../lib/zone';

export const FIELD = 'h-12 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 text-[16px] text-white outline-none focus:border-white/50 [color-scheme:dark]';
export const LABEL = 'block text-[13px] font-semibold text-white/55';

export const emptyBirth = () => ({ date: '', time: '', unknown: false, zone: 'UTC' });

/** The zone list and the visitor's own zone, read after mount. */
export function useZones() {
  const [list, setList] = useState(['UTC']);
  const [local, setLocal] = useState('UTC');
  useEffect(() => { setList(zones()); setLocal(localZone()); }, []);
  return { list, local };
}

export function BirthFields({ id, title, value, onChange, zoneList }) {
  const set = (k) => (e) => onChange({ ...value, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  return (
    <fieldset className="grid gap-4 sm:grid-cols-2">
      {title ? <legend className="mb-3 text-[16px] font-semibold text-white">{title}</legend> : null}
      <div>
        <label htmlFor={`${id}-date`} className={LABEL}>Date of birth</label>
        <input id={`${id}-date`} type="date" min="1800-01-01" max="2199-12-31" value={value.date} onChange={set('date')} className={`${FIELD} mt-2`} />
      </div>
      <div>
        <label htmlFor={`${id}-time`} className={LABEL}>Time of birth (local)</label>
        <input id={`${id}-time`} type="time" disabled={value.unknown} value={value.unknown ? '' : value.time} onChange={set('time')} className={`${FIELD} mt-2 disabled:opacity-40`} />
        <label className="mt-2 flex items-center gap-2 text-[14px] text-white/60">
          <input type="checkbox" checked={value.unknown} onChange={set('unknown')} className="h-4 w-4 accent-white" />
          I don’t know the time
        </label>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${id}-zone`} className={LABEL}>Time zone of the birthplace</label>
        <select id={`${id}-zone`} value={value.zone} onChange={set('zone')} className={`${FIELD} mt-2`}>
          {zoneList.map((z) => <option key={z} value={z}>{zoneLabel(z)}</option>)}
        </select>
      </div>
    </fieldset>
  );
}

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
