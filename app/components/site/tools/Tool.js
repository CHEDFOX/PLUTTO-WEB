/**
 * A CALCULATOR PAGE — the answer, the form, the method in full, the questions.
 * Server markup around one client widget: a crawler that runs no JavaScript
 * still reads what the tool does and exactly how it computes.
 */
import Link from 'next/link';
import { TOOLS, toolPath, toolBySlug } from '../../../lib/tools';
import { pageMeta, breadcrumbLd, faqLd, JsonLd, abs, SITE } from '../../../lib/seo';
import { Doc, DocDoor, LINK, MONO } from '../Doc';
import { LifePathWidget, ChineseZodiacWidget, NameNumerologyWidget } from './Widgets';

const WIDGETS = { 'life-path-number': LifePathWidget, 'chinese-zodiac': ChineseZodiacWidget, 'name-numerology': NameNumerologyWidget };

export function toolMeta(slug) {
  const t = toolBySlug(slug);
  return pageMeta({ title: t.title, description: t.description, path: toolPath(slug) });
}

function toolLd(t) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.name,
    url: abs(toolPath(t.slug)),
    description: t.description,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Any (runs in the browser)',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: SITE.currency },
    publisher: { '@id': `${SITE.url}/#organization` },
    inLanguage: 'en',
  };
}

export function ToolPage({ slug }) {
  const t = toolBySlug(slug);
  const Widget = WIDGETS[slug];
  const path = toolPath(slug);
  const others = TOOLS.filter((x) => x.slug !== slug);
  return (
    <>
      <JsonLd data={toolLd(t)} />
      <JsonLd data={faqLd(t.faqs)} />
      <JsonLd data={breadcrumbLd([{ name: 'Tools', path: '/tools' }, { name: t.short, path }])} />
      <Doc eyebrow="Free calculator" title={t.name} crumbs={[{ name: 'Tools', path: '/tools' }, { name: t.short, path }]}>
        <p className="speakable !mt-0 max-w-2xl text-[19px] leading-[1.65] text-white/85">{t.answer}</p>
        <div className="mt-10"><Widget /></div>

        <h2>How it is calculated</h2>
        <ol className="mt-4 max-w-2xl list-decimal space-y-2 pl-5">
          {t.method.map((m) => <li key={m}>{m}</li>)}
        </ol>
        <p>{t.note}</p>

        <h2>Questions</h2>
        {t.faqs.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}

        <p className="!mt-12"><span className={MONO}>In Plutto</span><br />
          A calculator gives one number. Plutto reads your whole chart — numerology beside Vedic, Western and Chinese astrology — and lets you ask it about the result, out loud. Background: <Link href={t.guide} className={LINK}>the guide</Link>.
        </p>
        <DocDoor links={[...others.map((x) => ({ href: toolPath(x.slug), label: x.short })), { href: '/tools', label: 'All tools' }]} />
      </Doc>
    </>
  );
}

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
        <h2>Reference</h2>
        <p>
          <Link href="/nakshatras" className={LINK}>The 27 nakshatras</Link> · <Link href="/chinese-zodiac" className={LINK}>The 12 Chinese zodiac animals</Link> · <Link href="/grahas" className={LINK}>The 9 grahas</Link> · <Link href="/zodiac-signs" className={LINK}>The 12 zodiac signs</Link>
        </p>
        <DocDoor links={[{ href: '/guides', label: 'Guides' }, { href: '/faq', label: 'FAQ' }]} />
      </Doc>
    </>
  );
}
