/**
 * THE SKY-CALENDAR PAGES — retrogrades, eclipses, transits for one year, from
 * Swiss Ephemeris (lib/skycal.js). Answer first, then the tables; every time
 * in UTC as sent, with the reader's local time filled in by LocalTime.
 */

import Link from 'next/link';
import { Doc } from '../doc/Doc';
import { DocDoor } from '../doc/DocDoor';
import { LINK } from '../doc/classes';
import { JsonLd } from '../seo/JsonLd';
import { breadcrumbLd } from '../../lib/seo/structuredData';
import { SOURCE, CAL_YEARS } from '../../lib/astro/skycal';

// ── The hub ───────────────────────────────────────────────────────────────
export function SkyHub() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Sky calendar', path: '/sky-calendar' }])} />
      <Doc eyebrow="Sky calendar" title="Retrogrades, eclipses and transits" crumbs={[{ name: 'Sky calendar', path: '/sky-calendar' }]}
        lead={`Every date on these pages is computed with ${SOURCE} — the engine the Plutto app uses — to the minute, in both the Western and the Vedic zodiac.`}>
        <ul className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {CAL_YEARS.map((y) => (
            <li key={y} className="py-5 text-[16px]">
              <span className="mr-4 font-semibold text-white">{y}</span>
              <Link href={`/mercury-retrograde/${y}`} className={LINK}>Mercury retrograde</Link> · <Link href={`/eclipses/${y}`} className={LINK}>Eclipses</Link> · <Link href={`/transits/${y}`} className={LINK}>Transits (Saturn, Jupiter, Rahu–Ketu)</Link>
            </li>
          ))}
        </ul>
        <p className="!mt-8"><Link href="/panchang" className={LINK}>Today’s panchang</Link> · <Link href="/tools/sade-sati" className={LINK}>Sade Sati calculator</Link></p>
        <DocDoor links={[{ href: '/tools', label: 'Free calculators' }, { href: '/guides', label: 'Guides' }]} />
      </Doc>
    </>
  );
}
