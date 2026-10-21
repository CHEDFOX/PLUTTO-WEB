'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { zonedToUtc, zones, localZone, zoneLabel } from '../../lib/astro/zone';
import { FIELD, LABEL } from './widgetClasses';

/**
 * Born on 3, 4 or 5 February: Li Chun decides the animal, to the minute. The
 * Sun's position settles it (lib/sky.js, loaded only when asked).
 */
export function CuspCheck({ d, r }) {
  const [time, setTime] = useState('');
  const [zone, setZone] = useState('UTC');
  const [list, setList] = useState(['UTC']);
  const [res, setRes] = useState(null);
  useEffect(() => { setZone(localZone()); setList(zones()); }, []);
  useEffect(() => setRes(null), [d.y, d.m, d.d]);
  async function check(e) {
    e.preventDefault();
    if (!/^\d{2}:\d{2}/.test(time)) return;
    const sky = await import('../../lib/astro/sky');
    const [h, mi] = time.split(':').map(Number);
    const birth = zonedToUtc(d.y, d.m, d.d, h, mi, zone).date;
    const lc = sky.liChun(d.y);
    setRes({ after: birth >= lc, at: new Date(Math.round(lc.getTime() / 60000) * 60000).toLocaleString('en-GB', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: zone }) });
  }
  const who = res && (res.after ? r.calendar : r.previous);
  return (
    <div className="!mt-4 text-[15px]">
      <p className="text-graphite">You were born on the Li Chun cusp: depending on the minute, you are the {r.previous.name} or the {r.calendar.name}. Add your birth time to settle it.</p>
      <form onSubmit={check} className="mt-4 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="cz-time" className={LABEL}>Time of birth</label>
          <input id="cz-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className={`${FIELD} mt-2 w-36`} />
        </div>
        <div className="min-w-0 flex-1">
          <label htmlFor="cz-zone" className={LABEL}>Birthplace time zone</label>
          <select id="cz-zone" value={zone} onChange={(e) => setZone(e.target.value)} className={`${FIELD} mt-2`}>
            {list.map((z) => <option key={z} value={z}>{zoneLabel(z)}</option>)}
          </select>
        </div>
        <button type="submit" className="h-12 rounded-[2px] bg-white px-6 font-mono text-[13px] uppercase tracking-[0.18em] text-black hover:opacity-90">Check</button>
      </form>
      {res ? (
        <p className="!mt-4 text-white/85">
          Li Chun {d.y} fell at {res.at} in that zone. You were born {res.after ? 'after' : 'before'} it, so your year animal is the <b className="text-white">{who.name}</b>{' '}
          (<Link href={`/chinese-zodiac/${who.slug}`} className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">read about the {who.name}</Link>).
        </p>
      ) : null}
    </div>
  );
}
