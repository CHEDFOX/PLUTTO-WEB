'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { searchPlaces, placeDetails } from '../lib/api';

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

const field =
  'w-full bg-transparent border-b border-mist focus:border-gold/60 outline-none ' +
  'py-3 text-white placeholder:text-white/25 transition-colors';
const label =
  'block text-[10px] uppercase tracking-[0.32em] text-white/40 mb-1';

export default function BirthForm({ onSubmit, busy, error }) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('female');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [unknownTime, setUnknownTime] = useState(false);

  // place search
  const [q, setQ] = useState('');
  const [preds, setPreds] = useState([]);
  const [place, setPlace] = useState(null);
  const [searching, setSearching] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onPlaceInput = (v) => {
    setQ(v);
    setPlace(null);
    clearTimeout(timer.current);
    if (v.trim().length < 2) { setPreds([]); return; }
    setSearching(true);
    timer.current = setTimeout(async () => {
      const p = await searchPlaces(v);
      setPreds(p.slice(0, 5));
      setSearching(false);
    }, 280);
  };

  const choosePlace = async (p) => {
    const desc = p.description || p.name || '';
    setQ(desc);
    setPreds([]);
    const id = p.place_id || p.placeId;
    if (id) {
      const d = await placeDetails(id);
      if (d && d.lat != null) { setPlace({ name: desc, lat: d.lat, lng: d.lng }); return; }
    }
    if (p.lat != null) setPlace({ name: desc, lat: p.lat, lng: p.lng });
  };

  const ready =
    name.trim() &&
    day && month && year &&
    String(year).length === 4 &&
    place;

  const submit = (e) => {
    e.preventDefault();
    if (!ready || busy) return;
    onSubmit({
      name: name.trim(),
      gender,
      date: { day: Number(day), month: Number(month), year: Number(year) },
      // No birth time given → noon, the convention that minimises error.
      time: unknownTime
        ? { hour: 12, minute: 0 }
        : { hour: Number(hour) || 12, minute: Number(minute) || 0 },
      place,
      unknownTime,
    });
  };

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-md">
      <h1 className="font-serif text-4xl md:text-5xl font-light leading-tight">
        Where did you<br />begin?
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-white/45">
        Every tradition reads the same moment differently. Give us yours and
        they all start speaking at once.
      </p>

      <div className="mt-12 space-y-8">
        <div>
          <label className={label} htmlFor="name">Your name</label>
          <input id="name" className={field} value={name} autoComplete="name"
                 onChange={(e) => setName(e.target.value)} placeholder="Ada" />
        </div>

        <div>
          <span className={label}>You are</span>
          <div className="flex gap-2 mt-2">
            {['female', 'male', 'other'].map((g) => (
              <button key={g} type="button" onClick={() => setGender(g)}
                className={`px-4 py-2 text-[11px] uppercase tracking-[0.2em] border rounded-full transition-colors ${
                  gender === g
                    ? 'border-gold/70 text-gold'
                    : 'border-mist text-white/40 hover:text-white/70'
                }`}>
                {g}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className={label}>Date of birth</span>
          <div className="grid grid-cols-3 gap-3 mt-1">
            <input className={field} inputMode="numeric" placeholder="Day" value={day}
                   onChange={(e) => setDay(e.target.value.replace(/\D/g, '').slice(0, 2))} />
            <select className={`${field} appearance-none`} value={month}
                    onChange={(e) => setMonth(e.target.value)}>
              <option value="" className="bg-card">Month</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1} className="bg-card">{m}</option>
              ))}
            </select>
            <input className={field} inputMode="numeric" placeholder="Year" value={year}
                   onChange={(e) => setYear(e.target.value.replace(/\D/g, '').slice(0, 4))} />
          </div>
        </div>

        <div>
          <span className={label}>Time of birth</span>
          <div className="grid grid-cols-2 gap-3 mt-1">
            <input className={field} inputMode="numeric" placeholder="Hour (0–23)"
                   value={hour} disabled={unknownTime}
                   onChange={(e) => setHour(e.target.value.replace(/\D/g, '').slice(0, 2))} />
            <input className={field} inputMode="numeric" placeholder="Minute"
                   value={minute} disabled={unknownTime}
                   onChange={(e) => setMinute(e.target.value.replace(/\D/g, '').slice(0, 2))} />
          </div>
          <button type="button" onClick={() => setUnknownTime((v) => !v)}
            className="mt-3 text-[11px] tracking-wide text-white/35 hover:text-white/60 transition-colors">
            {unknownTime ? '◉' : '○'} I don&rsquo;t know my birth time
          </button>
          {unknownTime && (
            <p className="mt-2 text-[11px] leading-relaxed text-white/30">
              We&rsquo;ll read from noon. Planets and numbers stay accurate; the
              hour-sensitive parts become approximate.
            </p>
          )}
        </div>

        <div className="relative">
          <label className={label} htmlFor="place">Place of birth</label>
          <input id="place" className={field} value={q} autoComplete="off"
                 onChange={(e) => onPlaceInput(e.target.value)} placeholder="Search your city" />
          {place && (
            <span className="absolute right-0 top-8 text-gold text-xs">✓</span>
          )}
          {searching && !preds.length && (
            <p className="mt-2 text-[11px] text-white/25">searching…</p>
          )}
          {preds.length > 0 && (
            <ul className="absolute z-20 left-0 right-0 mt-1 bg-card border border-mist rounded-lg overflow-hidden">
              {preds.map((p, i) => (
                <li key={p.place_id || i}>
                  <button type="button" onClick={() => choosePlace(p)}
                    className="w-full text-left px-4 py-3 text-sm text-white/75 hover:bg-white/5 transition-colors">
                    {p.description || p.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-8 text-sm text-red-300/80">{error}</p>
      )}

      <button type="submit" disabled={!ready || busy}
        className={`mt-12 w-full py-4 rounded-full text-[11px] uppercase tracking-[0.32em] transition-all ${
          ready && !busy
            ? 'bg-gold text-black hover:brightness-110'
            : 'border border-mist text-white/25 cursor-not-allowed'
        }`}>
        {busy ? 'Reading the sky…' : 'Reveal my chart'}
      </button>

      <p className="mt-6 text-[11px] leading-relaxed text-white/25">
        Your details stay in this browser and are sent only to compute your
        readings. Nothing is posted publicly.
      </p>

      {/* Not ready to hand over a birth moment yet? Read what this is first —
          the Why page ends with a Try button that comes straight back here. */}
      <Link
        href="/app/why"
        className="mt-8 block text-center text-[11px] uppercase tracking-[0.28em]
                   text-white/30 hover:text-white/60 transition-colors"
      >
        Skip — first tell me what this is
      </Link>
    </form>
  );
}
