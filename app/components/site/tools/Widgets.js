'use client';
/**
 * THE CALCULATOR FORMS — the only client code on the tool pages. Everything a
 * crawler needs (what the tool does, the method, the questions) is server HTML
 * around these; the result shows the working, so it can be checked by hand.
 */
import { useState } from 'react';
import Link from 'next/link';
import { lifePath, LIFE_PATH, nameNumbers, chineseZodiac } from '../../../lib/calc';

const FIELD = 'h-12 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 text-[16px] text-white outline-none focus:border-white/50 [color-scheme:dark]';
const LABEL = 'block text-[13px] font-semibold text-white/55';
const BOX = 'mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6';
const BIG = 'text-[44px] font-semibold leading-none tracking-[-0.04em] text-white';

function parseDate(v) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || '');
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (y < 1800 || y > 2200 || mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return { y, m: mo, d };
}

function DateField({ id, value, onChange }) {
  return (
    <div className="max-w-xs">
      <label htmlFor={id} className={LABEL}>Date of birth</label>
      <input id={id} type="date" min="1800-01-01" max="2200-12-31" value={value} onChange={(e) => onChange(e.target.value)} className={`${FIELD} mt-2`} />
    </div>
  );
}

export function LifePathWidget() {
  const [v, setV] = useState('');
  const d = parseDate(v);
  const r = d && lifePath(d.y, d.m, d.d);
  return (
    <section aria-label="Calculator" className="not-prose">
      <DateField id="lp-date" value={v} onChange={setV} />
      {r ? (
        <div className={BOX} aria-live="polite">
          <p className={LABEL}>Your life path number</p>
          <p className={`${BIG} mt-3`}>{r.number}</p>
          <p className="!mt-4 text-[16px] text-white/80">{LIFE_PATH[r.number]}</p>
          <ul className="mt-6 space-y-1 font-mono text-[14px] text-white/55">
            {r.parts.map((p) => <li key={p.label}>{p.label}: {p.chain.join(' → ')}</li>)}
            <li>Sum: {r.parts.map((p) => p.chain[p.chain.length - 1]).join(' + ')} = {r.chain.join(' → ')}</li>
          </ul>
        </div>
      ) : null}
    </section>
  );
}

export function ChineseZodiacWidget() {
  const [v, setV] = useState('');
  const d = parseDate(v);
  const r = d && chineseZodiac(d.y, d.m, d.d);
  return (
    <section aria-label="Calculator" className="not-prose">
      <DateField id="cz-date" value={v} onChange={setV} />
      {r ? (
        <div className={BOX} aria-live="polite">
          <p className={LABEL}>Your Chinese zodiac</p>
          <p className={`${BIG} mt-3`}>{r.polarity} {r.element} {r.animal.name}</p>
          <p className="!mt-4 text-[16px] text-white/80">
            Chinese year {r.year}{r.year !== d.y ? ` — born before Li Chun, so the ${d.y - 1} animal` : ''}.
            {' '}Best matches: {r.animal.trine.join(' and ')}, and the {r.animal.friend}. Clashes with the {r.animal.clash}.
          </p>
          {r.cusp ? (
            <p className="!mt-4 text-[15px] text-[#A78BFA]">
              You were born on the Li Chun cusp: depending on the minute, you are the {r.previous.name} or the {r.calendar.name}. A full BaZi chart with your birth time settles it.
            </p>
          ) : r.newYearWindow ? (
            <p className="!mt-4 text-[15px] text-white/55">
              Born between 21 January and 20 February, so a calendar that turns at Chinese New Year may give a different animal. This result uses Li Chun, as BaZi does.
            </p>
          ) : null}
          <p className="!mt-6"><Link href={`/chinese-zodiac/${r.animal.slug}`} className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">Read about the {r.animal.name} →</Link></p>
        </div>
      ) : null}
    </section>
  );
}

export function NameNumerologyWidget() {
  const [v, setV] = useState('');
  const r = nameNumbers(v.slice(0, 120));
  return (
    <section aria-label="Calculator" className="not-prose">
      <div className="max-w-md">
        <label htmlFor="nn-name" className={LABEL}>Full name</label>
        <input id="nn-name" type="text" autoComplete="off" maxLength={120} value={v} onChange={(e) => setV(e.target.value)} placeholder="As you write it" className={`${FIELD} mt-2`} />
      </div>
      {r ? (
        <div className={BOX} aria-live="polite">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              ['Expression', r.pythagorean.expression],
              ['Soul urge', r.pythagorean.soulUrge ?? '—'],
              ['Personality', r.pythagorean.personality ?? '—'],
              ['Chaldean', `${r.chaldean.compound}/${r.chaldean.single}`],
            ].map(([k, n]) => (
              <div key={k}>
                <p className={LABEL}>{k}</p>
                <p className="mt-2 text-[32px] font-semibold leading-none tracking-[-0.03em] text-white">{n}</p>
              </div>
            ))}
          </div>
          <p className="!mt-6 text-[13px] text-white/45">Pythagorean total {r.pythagorean.total}. Chaldean compound {r.chaldean.compound}, reduced to {r.chaldean.single}.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="font-mono text-[13px] text-white/60">
              <tbody>
                <tr><th scope="row" className="pr-3 text-left font-normal text-white/35">Letter</th>{r.table.map((x, i) => <td key={i} className="px-1.5 text-center text-white">{x.c}</td>)}</tr>
                <tr><th scope="row" className="pr-3 text-left font-normal text-white/35">Pyth.</th>{r.table.map((x, i) => <td key={i} className="px-1.5 text-center">{x.p}</td>)}</tr>
                <tr><th scope="row" className="pr-3 text-left font-normal text-white/35">Chald.</th>{r.table.map((x, i) => <td key={i} className="px-1.5 text-center">{x.ch}</td>)}</tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  );
}
