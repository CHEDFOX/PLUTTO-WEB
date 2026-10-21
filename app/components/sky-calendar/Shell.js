import { Doc } from '../doc/Doc';
import { DocDoor } from '../doc/DocDoor';
import { MONO } from '../doc/classes';
import { JsonLd } from '../seo/JsonLd';
import { articleLd, faqLd, breadcrumbLd } from '../../lib/seo/structuredData';
import { UPDATED } from '../../lib/content/guides';
import { cardPath } from '../../lib/seo/shareCards';
import { SOURCE } from '../../lib/astro/skycal';
import { YearNav } from './YearNav';

export function Shell({ kind, year, title, h1, description, answer, faqs, children }) {
  const path = `/${kind}/${year}`;
  const label = { 'mercury-retrograde': 'Retrogrades', eclipses: 'Eclipses', transits: 'Transits' }[kind];
  return (
    <>
      <JsonLd data={articleLd({ title, description, path, updated: UPDATED, image: cardPath(kind, String(year)) })} />
      <JsonLd data={faqLd(faqs)} />
      <JsonLd data={breadcrumbLd([{ name: 'Sky calendar', path: '/sky-calendar' }, { name: `${label} ${year}`, path }])} />
      <Doc eyebrow={`Sky calendar · ${year}`} title={h1} crumbs={[{ name: 'Sky calendar', path: '/sky-calendar' }, { name: `${label} ${year}`, path }]}>
        <p className="speakable !mt-0 max-w-2xl text-[19px] leading-[1.65] text-white/85">{answer}</p>
        {children}
        <h2>Questions</h2>
        {faqs.map((f) => <div key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}
        <p className="!mt-10 text-[13px] text-white/40">Computed with {SOURCE}, the engine the Plutto app uses; times to the minute. Sidereal positions use the Lahiri ayanamsa.</p>
        <YearNav base={`/${kind}`} year={year} />
        <p className="!mt-10"><span className={MONO}>In Plutto</span><br />What a transit means depends on where it falls in your own chart — Plutto reads it against your birth chart, out loud.</p>
        <DocDoor links={[{ href: '/sky-calendar', label: 'Sky calendar' }, { href: '/tools/moon-sign-nakshatra', label: 'Your Moon sign' }]} />
      </Doc>
    </>
  );
}
