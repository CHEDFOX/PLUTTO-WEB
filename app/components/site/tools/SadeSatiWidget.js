'use client';
/**
 * SADE SATI — from a birth (the Moon computed in the browser) or straight from
 * a Moon sign, against Saturn's real ingresses (lib/sadesati.js).
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BirthFields, emptyBirth, useZones, birthError, birthMoon, FIELD, LABEL } from './birth';
import { sadeSati, kantaka, ashtama, PHASE } from '../../../lib/sadesati';
import { SIGNS } from '../../../lib/reference';

const day = (t) => new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const YEAR = 365.25 * 86400000;

function report(moon, bornAt) {
  const now = Date.now();
  const from = bornAt ?? now - 30 * YEAR, to = (bornAt ?? now) + 90 * YEAR;
  const within = (p) => p.to > from && p.from < to;
  const ss = sadeSati(moon).filter(within);
  const cur = ss.find((p) => p.from <= now && now < p.to);
  const phase = cur?.phases.find((q) => q.from <= now && now < q.to);
  const dh = [...kantaka(moon).map((p) => ({ ...p, kind: 'Kantaka Shani (4th)' })), ...ashtama(moon).map((p) => ({ ...p, kind: 'Ashtama Shani (8th)' }))];
  return { moon, ss, cur, phase, next: ss.find((p) => p.from > now), dhNow: dh.find((p) => p.from <= now && now < p.to), dhNext: dh.filter((p) => p.from > now).sort((a, b) => a.from - b.from)[0] };
}

export default function SadeSatiWidget() {
  const { list, local } = useZones();
  const [mode, setMode] = useState('birth');
  const [birth, setBirth] = useState(emptyBirth());
  const [sign, setSign] = useState('0');
  const [r, setR] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { setBirth((b) => (b.zone === 'UTC' ? { ...b, zone: local } : b)); }, [local]);

  async function go(e) {
    e.preventDefault();
    setErr('');
    if (mode === 'sign') { setR(report(+sign, null)); return; }
    const problem = birthError(birth);
    if (problem) { setErr(problem); return; }
    const sky = await import('../../../lib/sky');
    const m = birthMoon(sky, birth);
    setR({ ...report(Math.floor(m.sidereal / 30), m.at.date.getTime()), uncertain: m.changes.includes('sign') });
  }

  const s = r && SIGNS[r.moon];
  return (
    <section aria-label="Calculator" className="not-prose">
      <form onSubmit={go} className="max-w-2xl space-y-6">
        <div role="radiogroup" aria-label="Start from" className="flex flex-wrap gap-3 text-[14px]">
          {[['birth', 'My birth details'], ['sign', 'I know my Moon sign']].map(([k, label]) => (
            <label key={k} className={`cursor-pointer rounded-full border px-4 py-2 ${mode === k ? 'border-white bg-white text-black' : 'border-white/20 text-white/70'}`}>
              <input type="radio" name="mode" value={k} checked={mode === k} onChange={() => setMode(k)} className="sr-only" />{label}
            </label>
          ))}
        </div>
        {mode === 'birth' ? (
          <BirthFields id="ss" value={birth} onChange={setBirth} zoneList={list} />
        ) : (
          <div className="max-w-xs">
            <label htmlFor="ss-sign" className={LABEL}>Moon sign (Vedic, rashi)</label>
            <select id="ss-sign" value={sign} onChange={(e) => setSign(e.target.value)} className={`${FIELD} mt-2`}>
              {SIGNS.map((x, i) => <option key={x.name} value={i}>{x.name} ({x.sanskrit})</option>)}
            </select>
          </div>
        )}
        <div>
          <button type="submit" className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-[15px] font-semibold text-black hover:opacity-90">Check Sade Sati</button>
          {err ? <p role="alert" className="!mt-3 text-[14px] text-[#F87171]">{err}</p> : null}
        </div>
      </form>

      {r ? (
        <div aria-live="polite" className="mt-10 max-w-2xl space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-[13px] font-semibold text-white/55">Moon sign <Link href={`/zodiac-signs/${s.slug}`} className="text-white underline decoration-white/30 underline-offset-4">{s.name} ({s.sanskrit})</Link></p>
            <p className="mt-3 text-[30px] font-semibold leading-[1.15] tracking-[-0.03em] text-white">
              {r.cur ? 'You are in Sade Sati now.' : 'You are not in Sade Sati now.'}
            </p>
            <p className="!mt-3 text-[16px] leading-[1.6] text-white/80">
              {r.cur
                ? <>It runs {day(r.cur.from)} – {day(r.cur.to)}; today is the {{ 12: 'rising', 1: 'peak', 2: 'setting' }[r.phase?.house] ?? 'middle'} phase ({PHASE[r.phase?.house]?.split(' (')[1]?.replace(')', '') ?? 'between phases'}).</>
                : r.next ? <>The next one begins {day(r.next.from)} and ends {day(r.next.to)}.</> : null}
              {r.dhNow ? <> Saturn is also in your {r.dhNow.kind} until {day(r.dhNow.to)} — a small panoti (Dhaiya).</> : r.dhNext ? <> Next small panoti (Dhaiya): {r.dhNext.kind}, from {day(r.dhNext.from)}.</> : null}
            </p>
            {r.uncertain ? <p className="!mt-3 text-[14px] text-[#A78BFA]">Without a birth time: the Moon changed sign on your birth day, so your Moon sign may be the next one. Add the time, or check with “I know my Moon sign”.</p> : null}
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-[13px] font-semibold text-white/55">Every Sade Sati {r.uncertain === undefined ? 'from 30 years ago' : 'in your lifetime'}</p>
            <ul className="mt-4 space-y-4 text-[14px]">
              {r.ss.map((p) => (
                <li key={p.from} className={r.cur === p ? 'text-white' : 'text-white/70'}>
                  <span className="tabular-nums text-[15px]">{day(p.from)} – {day(p.to)}</span>{r.cur === p ? ' — now' : ''}
                  <ul className="mt-1 space-y-0.5 text-[13px] text-white/45">
                    {p.phases.map((q) => <li key={q.from} className="tabular-nums">{day(q.from)} – {day(q.to)}: {PHASE[q.house]}</li>)}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  );
}
