'use client';

import { useState } from 'react';
import Link from 'next/link';
import { chineseZodiac } from '../../lib/astro/chineseZodiac';
import { LABEL, BOX, BIG } from './widgetClasses';
import { parseDate } from './parseDate';
import { DateField } from './DateField';
import { CuspCheck } from './CuspCheck';

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
            <CuspCheck d={d} r={r} />
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
