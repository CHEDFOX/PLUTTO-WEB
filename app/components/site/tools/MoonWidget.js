'use client';
/**
 * MOON SIGN, NAKSHATRA AND DASHA — computed in the browser, nothing sent.
 *
 * The astronomy (lib/sky.js, astronomy-engine) is imported only when someone
 * asks, so the page itself stays light. Local time becomes UTC through the
 * browser's own time-zone history (lib/zone.js); the dasha is the app's
 * (lib/vedic.js). Without a birth time the whole day is checked, and the
 * result says whether the answer depends on the hour — and if so, at what
 * minute the Moon changed nakshatra or sign.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { slugify } from '../../../lib/reference';
import { lunar, vimshottari, runningAt, fmtDeg, fmtSpan, DASHA_YEARS } from '../../../lib/vedic';
import { zonedToUtc, fmtOffset, zones, localZone, zoneLabel } from '../../../lib/zone';

const FIELD = 'h-12 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 text-[16px] text-white outline-none focus:border-white/50 [color-scheme:dark]';
const LABEL = 'block text-[13px] font-semibold text-white/55';
const A = 'text-white underline decoration-white/30 underline-offset-4 hover:decoration-white';
const SIGN_NAMES = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const day = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const grahaHref = (k) => `/grahas/${slugify(k)}`;

/** First instant in [a, b] where key(moonAt(t)) changes, to the second. */
function edge(sky, a, b, key) {
  const k0 = key(sky.moon(new Date(a)).sidereal);
  while (b - a > 1000) {
    const m = (a + b) / 2;
    if (key(sky.moon(new Date(m)).sidereal) === k0) a = m; else b = m;
  }
  return new Date(b);
}

function compute(sky, input) {
  const [y, mo, d] = input.date.split('-').map(Number);
  const known = !!input.time;
  const [h, mi] = known ? input.time.split(':').map(Number) : [12, 0];
  const at = zonedToUtc(y, mo, d, h, mi, input.zone);
  const m = sky.moon(at.date), s = sky.sun(at.date);
  const L = lunar(m.sidereal);
  const out = { at, known, m, s, L, dasha: vimshottari(m.sidereal, at.date) };
  if (!known) {
    // The whole local day: does the nakshatra or the sign change inside it?
    const a = zonedToUtc(y, mo, d, 0, 0, input.zone).date.getTime();
    const b = zonedToUtc(y, mo, d, 23, 59, input.zone).date.getTime() + 59999;
    const nakOf = (lon) => Math.floor(lon / (360 / 27));
    const signOf = (lon) => Math.floor(lon / 30);
    const tropOf = (t) => Math.floor(sky.moon(new Date(t)).tropical / 30);
    const m0 = sky.moon(new Date(a)), m1 = sky.moon(new Date(b));
    out.day = {
      nak: nakOf(m0.sidereal) !== nakOf(m1.sidereal) ? { from: lunar(m0.sidereal).nakshatra, to: lunar(m1.sidereal).nakshatra, at: edge(sky, a, b, nakOf) } : null,
      sign: signOf(m0.sidereal) !== signOf(m1.sidereal) ? { from: lunar(m0.sidereal).sign, to: lunar(m1.sidereal).sign, at: edge(sky, a, b, signOf) } : null,
      trop: tropOf(a) !== tropOf(b) ? { from: SIGN_NAMES[tropOf(a)], to: SIGN_NAMES[tropOf(b)] } : null,
    };
  }
  return out;
}

const localClock = (date, zone) => date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: zone });

export default function MoonWidget() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [unknown, setUnknown] = useState(false);
  const [zone, setZone] = useState('UTC');
  const [list, setList] = useState(['UTC']);
  const [busy, setBusy] = useState(false);
  const [r, setR] = useState(null);
  const [err, setErr] = useState('');

  // The visitor's own zone is the likeliest birthplace zone; read after mount
  // so the server HTML and the first client render agree.
  useEffect(() => { setZone(localZone()); setList(zones()); }, []);

  async function go(e) {
    e.preventDefault();
    setErr('');
    const ok = /^(\d{4})-\d{2}-\d{2}$/.exec(date);
    if (!ok || +ok[1] < 1800 || +ok[1] > 2199) { setErr('Enter a date of birth between 1800 and 2199.'); return; }
    if (!unknown && !/^\d{2}:\d{2}/.test(time)) { setErr('Enter the time of birth, or tick “I don’t know the time”.'); return; }
    setBusy(true);
    try {
      const sky = await import('../../../lib/sky');
      setR({ ...compute(sky, { date, time: unknown ? '' : time.slice(0, 5), zone }), zone });
    } catch {
      setErr('Something went wrong computing the chart. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  const now = r && runningAt(r.dasha, new Date());

  return (
    <section aria-label="Calculator" className="not-prose">
      <form onSubmit={go} className="grid max-w-2xl gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ms-date" className={LABEL}>Date of birth</label>
          <input id="ms-date" type="date" required min="1800-01-01" max="2199-12-31" value={date} onChange={(e) => setDate(e.target.value)} className={`${FIELD} mt-2`} />
        </div>
        <div>
          <label htmlFor="ms-time" className={LABEL}>Time of birth (local)</label>
          <input id="ms-time" type="time" disabled={unknown} value={unknown ? '' : time} onChange={(e) => setTime(e.target.value)} className={`${FIELD} mt-2 disabled:opacity-40`} />
          <label className="mt-2 flex items-center gap-2 text-[14px] text-white/60">
            <input type="checkbox" checked={unknown} onChange={(e) => setUnknown(e.target.checked)} className="h-4 w-4 accent-white" />
            I don’t know the time
          </label>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="ms-zone" className={LABEL}>Time zone of the birthplace</label>
          <select id="ms-zone" value={zone} onChange={(e) => setZone(e.target.value)} className={`${FIELD} mt-2`}>
            {list.map((z) => <option key={z} value={z}>{zoneLabel(z)}</option>)}
          </select>
          <p className="!mt-2 text-[13px] text-white/40">Pick the city in the same zone as where you were born. Historical rules — summer time, war time, local mean time — are applied for your date.</p>
        </div>
        <div className="sm:col-span-2">
          <button type="submit" disabled={busy} className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-[15px] font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60">
            {busy ? 'Computing…' : 'Calculate'}
          </button>
          {err ? <p role="alert" className="!mt-3 text-[14px] text-[#F87171]">{err}</p> : null}
        </div>
      </form>

      {r ? (
        <div aria-live="polite" className="mt-10 max-w-2xl space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className={LABEL}>Your Moon, in Vedic astrology</p>
            <p className="mt-3 text-[34px] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
              {r.L.nakshatra.name}{r.known ? `, pada ${r.L.pada}` : ''} · {r.L.sign.name} ({r.L.sign.sanskrit})
            </p>
            {r.known ? <p className="!mt-3 text-[15px] text-white/60">Moon at {fmtDeg(r.L.degInSign)} {r.L.sign.name} sidereal. Naming syllable of the pada: <span className="text-white">{r.L.nakshatra.syllables[r.L.pada - 1]}</span>.</p> : null}
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-[15px]">
              <div><dt className="text-white/45">Moon sign (Vedic, rashi)</dt><dd className="text-white"><Link href={`/zodiac-signs/${r.L.sign.slug}`} className={A}>{r.L.sign.name}</Link></dd></div>
              <div><dt className="text-white/45">Nakshatra</dt><dd className="text-white"><Link href={`/nakshatras/${r.L.nakshatra.slug}`} className={A}>{r.L.nakshatra.name}</Link>, ruled by <Link href={grahaHref(r.L.nakshatra.lord)} className={A}>{r.L.nakshatra.lord}</Link></dd></div>
              <div><dt className="text-white/45">Moon sign (Western)</dt><dd className="text-white">{SIGN_NAMES[Math.floor(r.m.tropical / 30)]} {r.known ? fmtDeg(r.m.tropical % 30) : ''}</dd></div>
              <div><dt className="text-white/45">Sun sign</dt><dd className="text-white">Western {SIGN_NAMES[Math.floor(r.s.tropical / 30)]} · Vedic {SIGN_NAMES[Math.floor(r.s.sidereal / 30)]}</dd></div>
            </dl>
            {!r.known ? (
              <div className="mt-6 border-t border-white/[0.08] pt-4 text-[14px] leading-[1.6] text-white/60">
                {!r.day.nak && !r.day.sign ? (
                  <p>The Moon stayed in {r.L.nakshatra.name} ({r.L.sign.name}) all day, so your nakshatra and Moon sign are certain without a birth time. The pada and the exact dasha dates need one; the dates below assume noon.</p>
                ) : (
                  <>
                    {r.day.nak ? <p>The Moon moved from <b className="text-white">{r.day.nak.from.name}</b> into <b className="text-white">{r.day.nak.to.name}</b> at {localClock(r.day.nak.at, r.zone)} local time that day: born before, {r.day.nak.from.name}; after, {r.day.nak.to.name}.</p> : null}
                    {r.day.sign ? <p className="!mt-2">It also changed sign, from {r.day.sign.from.name} to {r.day.sign.to.name}, at {localClock(r.day.sign.at, r.zone)}.</p> : null}
                    <p className="!mt-2">The result above is for noon. Add your birth time for a certain answer.</p>
                  </>
                )}
                {r.day.trop ? <p className="!mt-2">In the Western zodiac the Moon changed sign that day too, from {r.day.trop.from} to {r.day.trop.to}.</p> : null}
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className={LABEL}>Vimshottari dasha</p>
            <p className="!mt-3 text-[16px] leading-[1.6] text-white/80">
              Born in the <Link href={grahaHref(r.dasha.lord)} className={A}>{r.dasha.lord}</Link> mahadasha, with {fmtSpan(r.dasha.balance)} of its {DASHA_YEARS[r.dasha.lord]} years left.
              {now ? <> Today you are in <b className="text-white">{now.maha.lord}</b> mahadasha, <b className="text-white">{now.antar.lord}</b> antardasha, until {day(now.antar.end)}.</> : null}
            </p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-[14px]">
                <thead><tr className="text-white/40"><th scope="col" className="py-1.5 pr-4 font-normal">Mahadasha</th><th scope="col" className="py-1.5 pr-4 font-normal">From</th><th scope="col" className="py-1.5 font-normal">To</th></tr></thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {r.dasha.mahas.map((m) => {
                    const cur = now && now.maha === m;
                    return (
                      <tr key={m.lord} className={cur ? 'text-white' : 'text-white/65'}>
                        <td className="py-2 pr-4">{m.lord}{cur ? ' — now' : ''}</td>
                        <td className="py-2 pr-4 tabular-nums">{day(m.start)}</td>
                        <td className="py-2 tabular-nums">{day(m.end)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {now ? (
              <details className="mt-5 text-[14px] text-white/65">
                <summary className="cursor-pointer text-white/80">Antardashas of the {now.maha.lord} mahadasha</summary>
                <ul className="mt-3 space-y-1 tabular-nums">
                  {now.maha.antars.map((a) => <li key={a.lord} className={now.antar === a ? 'text-white' : ''}>{now.maha.lord}–{a.lord}: {day(a.start)} – {day(a.end)}</li>)}
                </ul>
              </details>
            ) : null}
          </div>

          <p className="text-[13px] leading-[1.6] text-white/40">
            Computed for {r.known ? 'your time' : 'noon'} in {zoneLabel(r.zone)} ({fmtOffset(r.at.offset)}) = {r.at.date.toISOString().slice(0, 16).replace('T', ' ')} UTC. Lahiri ayanamsa {fmtDeg(r.m.ayanamsa)}.
            {r.at.gap ? ' That clock time did not exist on that date (the clocks went forward); the moment just after the change was used.' : ''}
          </p>
        </div>
      ) : null}
    </section>
  );
}
