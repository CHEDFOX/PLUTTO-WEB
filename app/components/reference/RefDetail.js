/** Detail page of one reference item in app/lib/content/refpages.js: answer, facts table and FAQ, server markup only. */
import Link from 'next/link';
import { SECTIONS, refPath } from '../../lib/content/refpages';
import { UPDATED } from '../../lib/content/guides';
import { breadcrumbLd, faqLd, articleLd } from '../../lib/seo/structuredData';
import { JsonLd } from '../seo/JsonLd';
import { Doc } from '../doc/Doc';
import { DocDoor } from '../doc/DocDoor';
import { MONO, LINK } from '../doc/classes';
import { cardPath } from '../../lib/seo/shareCards';
import { Val } from './Val';

export function RefDetail({ keyName, slug }) {
  const s = SECTIONS[keyName];
  const i = s.items.findIndex((x) => x.slug === slug);
  const x = s.items[i];
  const p = s.page(x);
  const path = refPath(keyName, slug);
  const prev = s.items[(i - 1 + s.items.length) % s.items.length];
  const next = s.items[(i + 1) % s.items.length];
  return (
    <>
      <JsonLd data={articleLd({ title: p.title, description: p.description, path, updated: UPDATED, image: cardPath(s.base.slice(1), slug) })} />
      <JsonLd data={faqLd(p.faqs)} />
      <JsonLd data={breadcrumbLd([{ name: s.label, path: s.base }, { name: x.name, path }])} />
      <Doc eyebrow={s.label} title={p.h1} crumbs={[{ name: s.label, path: s.base }, { name: x.name, path }]}>
        <p className="speakable !mt-0 max-w-2xl text-[19px] leading-[1.65] text-white/85">{p.answer}</p>

        <table className="mt-10 w-full max-w-2xl border-y border-white/[0.07] text-left text-[15px]">
          <tbody className="divide-y divide-white/[0.06]">
            {p.facts.map(([k, v]) => (
              <tr key={k}>
                <th scope="row" className="w-2/5 py-3 pr-4 align-top font-normal text-white/45">{k}</th>
                <td className="py-3 text-white/85"><Val v={v} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {p.body.map((t, k) => <p key={k}>{t}</p>)}

        {(p.tables || []).map((t) => (
          <div key={t.caption} className="mt-10 max-w-2xl overflow-x-auto">
            <table className="w-full border-y border-white/[0.07] text-left text-[15px]">
              <caption className="pb-3 text-left text-[18px] font-semibold text-white">{t.caption}</caption>
              <thead><tr className="text-white/45">{t.head.map((h) => <th key={h} scope="col" className="py-2 pr-4 font-normal">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-white/[0.06]">
                {t.rows.map((row, i) => (
                  <tr key={i}>{row.map((c, j) => <td key={j} className="py-2.5 pr-4 text-white/85"><Val v={c} /></td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        <h2>Questions</h2>
        {p.faqs.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}

        <nav aria-label={`More ${s.label.toLowerCase()}`} className="mt-14 flex flex-wrap justify-between gap-4 border-t border-white/[0.07] pt-6 text-[15px]">
          <Link href={refPath(keyName, prev.slug)} className={LINK}>← {prev.name}</Link>
          <Link href={s.base} className={LINK}>All {s.label.toLowerCase()}</Link>
          <Link href={refPath(keyName, next.slug)} className={LINK}>{next.name} →</Link>
        </nav>

        <p className="!mt-10"><span className={MONO}>In Plutto</span><br />{s.cta} Background: <Link href={s.guide} className={LINK}>{s.guideName}</Link>.</p>
        <DocDoor links={[{ href: s.base, label: `All ${s.label.toLowerCase()}` }, { href: '/tools', label: 'Free calculators' }]} />
      </Doc>
    </>
  );
}
