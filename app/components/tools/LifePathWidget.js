'use client';

/**
 * Life path number calculator (app/lib/astro/numerology.js). The widgets are the only client code on the tool
 * pages: method, FAQ and tables are server HTML for crawlers. The result shows the working, to check by hand.
 */

import { useState } from 'react';
import { lifePath, LIFE_PATH } from '../../lib/astro/numerology';
import { LABEL, BOX, BIG } from './widgetClasses';
import { parseDate } from './parseDate';
import { DateField } from './DateField';

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
