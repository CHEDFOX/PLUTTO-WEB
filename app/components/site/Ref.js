/**
 * THE REFERENCE PAGES — a hub (every item, one table) and a detail page per
 * item, for any section in app/lib/refpages.js. Server markup only, like Doc:
 * every word in the HTML as sent.
 */
import Link from 'next/link';
import { SECTIONS, refPath } from '../../lib/refpages';
import { UPDATED } from '../../lib/guides';
import { pageMeta, breadcrumbLd, faqLd, articleLd, JsonLd, abs } from '../../lib/seo';
import { Doc, DocDoor, MONO, LINK } from './Doc';

export function hubMeta(key) {
  const s = SECTIONS[key];
  return pageMeta({ title: s.hubTitle, description: s.hubDescription, path: s.base });
}

export function detailMeta(key, slug) {
  const s = SECTIONS[key];
  const x = s.items.find((i) => i.slug === slug);
  if (!x) return {};
  const p = s.page(x);
  return pageMeta({ title: p.title, description: p.description, path: refPath(key, slug), type: 'article' });
}

export function RefHub({ keyName }) {
  const s = SECTIONS[keyName];
  const set = {
    '@context': 'https://schema.org', '@type': 'DefinedTermSet', '@id': abs(s.base), name: s.hubTitle,
    hasDefinedTerm: s.items.map((x) => ({ '@type': 'DefinedTerm', name: x.name, url: abs(refPath(keyName, x.slug)), description: s.page(x).answer })),
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
                <p className="!mt-2 text-[14px] text-white/50">{p.facts.slice(0, 4).map(([k, v]) => `${k}: ${v}`).join(' · ')}</p>
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
      <JsonLd data={articleLd({ title: p.title, description: p.description, path, updated: UPDATED })} />
      <JsonLd data={faqLd(p.faqs)} />
      <JsonLd data={breadcrumbLd([{ name: s.label, path: s.base }, { name: x.name, path }])} />
      <Doc eyebrow={s.label} title={p.h1} crumbs={[{ name: s.label, path: s.base }, { name: x.name, path }]}>
        <p className="speakable !mt-0 max-w-2xl text-[19px] leading-[1.65] text-white/85">{p.answer}</p>

        <table className="mt-10 w-full max-w-2xl border-y border-white/[0.07] text-left text-[15px]">
          <tbody className="divide-y divide-white/[0.06]">
            {p.facts.map(([k, v]) => (
              <tr key={k}>
                <th scope="row" className="w-2/5 py-3 pr-4 align-top font-normal text-white/45">{k}</th>
                <td className="py-3 text-white/85">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {p.body.map((t, k) => <p key={k}>{t}</p>)}

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
