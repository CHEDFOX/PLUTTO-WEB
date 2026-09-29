'use client';
/**
 * THE PANCHANG FOR YOUR PLACE AND DAY — a city from the list, or the browser's
 * own location (asked for only on a tap, used on the device, never sent).
 */
import { useEffect, useState } from 'react';
import PanchangView from './PanchangView';
import { CITIES } from '../../lib/panchang';
import { localZone } from '../../lib/zone';

const FIELD = 'h-12 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 text-[16px] text-white outline-none focus:border-white/50 [color-scheme:dark]';
const LABEL = 'block text-[13px] font-semibold text-white/55';

const todayIn = (zone) => new Date().toLocaleDateString('en-CA', { timeZone: zone });

export default function PanchangWidget() {
  const [city, setCity] = useState('0');
  const [here, setHere] = useState(null);
  const [date, setDate] = useState('');
  const [p, setP] = useState(null);
  const [note, setNote] = useState('');

  const place = here || CITIES[+city];
  useEffect(() => { setDate(todayIn(localZone())); }, []);
  useEffect(() => {
    if (!date) return;
    let live = true;
    (async () => {
      const [sky, lib] = await Promise.all([import('../../lib/sky'), import('../../lib/panchang')]);
      const [y, m, d] = date.split('-').map(Number);
      const r = lib.panchang(sky, y, m, d, place);
      if (live) { setP(r); setNote(r ? '' : 'The Sun does not rise or set at this place on this date.'); }
    })();
    return () => { live = false; };
  }, [date, place.lat, place.lon, place.zone]);

  function locate() {
    if (!navigator.geolocation) { setNote('This browser cannot share a location.'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => setHere({ name: 'Your location', lat: pos.coords.latitude, lon: pos.coords.longitude, zone: localZone() }),
      () => setNote('Location was not shared — pick a city instead.'),
      { maximumAge: 3600000, timeout: 10000 },
    );
  }

  return (
    <section aria-label="Panchang for your place" className="not-prose">
      <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pc-city" className={LABEL}>Place</label>
          <select id="pc-city" value={here ? 'here' : city} onChange={(e) => { if (e.target.value !== 'here') { setHere(null); setCity(e.target.value); } }} className={`${FIELD} mt-2`}>
            {here ? <option value="here">Your location</option> : null}
            {CITIES.map((c, i) => <option key={c.name} value={i}>{c.name}</option>)}
          </select>
          <button type="button" onClick={locate} className="mt-2 text-[14px] text-white/60 underline decoration-white/30 underline-offset-4 hover:text-white">Use my location</button>
        </div>
        <div>
          <label htmlFor="pc-date" className={LABEL}>Date</label>
          <input id="pc-date" type="date" min="1800-01-01" max="2199-12-31" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} className={`${FIELD} mt-2`} />
        </div>
      </div>
      {note ? <p role="status" className="!mt-4 text-[14px] text-[#A78BFA]">{note}</p> : null}
      {p ? <div className="mt-8" aria-live="polite"><p className="mb-3 text-[14px] text-white/55">{place.name} · {date} · times in {place.zone.replace(/_/g, ' ')}</p><PanchangView p={p} /></div> : null}
    </section>
  );
}
