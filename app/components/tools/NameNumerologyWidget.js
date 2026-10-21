'use client';

import { useState } from 'react';
import { nameNumbers } from '../../lib/astro/numerology';
import { FIELD, LABEL, BOX } from './widgetClasses';

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
