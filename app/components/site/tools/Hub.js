/**
 * /tools — the calculators, listed. Kept apart from Tool.js so the hub imports
 * no widget code at all.
 */
import Link from 'next/link';
import { TOOLS, toolPath } from '../../../lib/tools';
import { breadcrumbLd, JsonLd, abs } from '../../../lib/seo';
import { Doc, DocDoor, LINK } from '../Doc';

export function ToolsHub() {
  const list = {
    '@context': 'https://schema.org', '@type': 'ItemList', name: 'Free astrology and numerology calculators',
    itemListElement: TOOLS.map((t, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(toolPath(t.slug)), name: t.name })),
  };
  return (
    <>
      <JsonLd data={list} />
      <JsonLd data={breadcrumbLd([{ name: 'Tools', path: '/tools' }])} />
      <Doc eyebrow="Free" title="Astrology and numerology calculators" crumbs={[{ name: 'Tools', path: '/tools' }]}
        lead="Free, no sign-up, and every one shows its working. They run in your browser: nothing you type is sent anywhere.">
        <ul className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {TOOLS.map((t) => (
            <li key={t.slug} className="py-6">
              <Link href={toolPath(t.slug)} className="text-[18px] font-semibold text-white hover:underline hover:decoration-white/40 hover:underline-offset-4">{t.name}</Link>
              <p className="!mt-2 max-w-2xl text-[15px] text-white/55">{t.answer}</p>
            </li>
          ))}
        </ul>
        <h2>Sky calendar</h2>
        <p>
          <Link href="/panchang" className={LINK}>Today’s panchang</Link> · <Link href="/sky-calendar" className={LINK}>Retrogrades, eclipses and transits</Link> · <Link href="/tools/embed" className={LINK}>Embed a calculator on your site</Link>
        </p>
        <h2>Reference</h2>
        <p>
          <Link href="/nakshatras" className={LINK}>The 27 nakshatras</Link> · <Link href="/chinese-zodiac" className={LINK}>The 12 Chinese zodiac animals</Link> · <Link href="/grahas" className={LINK}>The 9 grahas</Link> · <Link href="/zodiac-signs" className={LINK}>The 12 zodiac signs</Link>
        </p>
        <DocDoor links={[{ href: '/guides', label: 'Guides' }, { href: '/faq', label: 'FAQ' }]} />
      </Doc>
    </>
  );
}
