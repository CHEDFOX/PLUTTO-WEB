/** Hub page of a reference section in app/lib/content/refpages.js: every item in one list, server markup only. */

import Link from 'next/link';
import { SECTIONS, refPath, flat } from '../../lib/content/refpages';
import { breadcrumbLd } from '../../lib/seo/structuredData';
import { JsonLd } from '../seo/JsonLd';
import { abs } from '../../lib/seo/site';
import { Doc } from '../doc/Doc';
import { DocDoor } from '../doc/DocDoor';
import { LINK } from '../doc/classes';

export function RefHub({ keyName }) {
  const s = SECTIONS[keyName];
  const set = {
    '@context': 'https://schema.org', '@type': 'DefinedTermSet', '@id': abs(s.base), name: s.hubTitle,
    hasDefinedTerm: s.items.map((x) => ({ '@type': 'DefinedTerm', name: x.name, url: abs(refPath(keyName, x.slug)), description: s.page(x).answer, inDefinedTermSet: abs(s.base) })),
  };
  return (
    <>
      <JsonLd data={set} />
      <JsonLd data={breadcrumbLd([{ name: s.label, path: s.base }])} />
      <Doc eyebrow="Reference" title={s.hubTitle} lead={s.hubLead} crumbs={[{ name: s.label, path: s.base }]}>
        <ul className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {s.items.map((x) => {
            const p = s.page(x);
            return (
              <li key={x.slug} className="py-5">
                <Link href={refPath(keyName, x.slug)} className="text-[18px] font-semibold text-white hover:underline hover:decoration-white/40 hover:underline-offset-4">{p.h1}</Link>
                <p className="!mt-2 text-[14px] text-white/50">{p.facts.slice(0, 4).map(([k, v]) => `${k}: ${flat(v)}`).join(' · ')}</p>
              </li>
            );
          })}
        </ul>
        <p className="!mt-10">Background: <Link href={s.guide} className={LINK}>{s.guideName} — the guide</Link>.</p>
        <DocDoor links={[{ href: '/guides', label: 'All guides' }, { href: '/tools', label: 'Free calculators' }]} />
      </Doc>
    </>
  );
}
