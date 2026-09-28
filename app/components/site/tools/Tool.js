/**
 * A CALCULATOR PAGE — the answer, the form, the method in full, the questions.
 * Server markup around one client widget: a crawler that runs no JavaScript
 * still reads what the tool does and exactly how it computes.
 */
import Link from 'next/link';
import { TOOLS, toolPath, toolBySlug } from '../../../lib/tools';
import { pageMeta, breadcrumbLd, faqLd, JsonLd, abs, SITE } from '../../../lib/seo';
import { Doc, DocDoor, LINK, MONO } from '../Doc';
import { cardPath } from '../../../lib/cards';

export function toolMeta(slug) {
  const t = toolBySlug(slug);
  return pageMeta({ title: t.title, description: t.description, path: toolPath(slug), image: cardPath('tools', slug) });
}

function toolLd(t) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.name,
    url: abs(toolPath(t.slug)),
    description: t.description,
    image: abs(cardPath('tools', t.slug)),
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Any (runs in the browser)',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: SITE.currency },
    publisher: { '@id': `${SITE.url}/#organization` },
    inLanguage: 'en',
  };
}

/** The page around one calculator; the route passes its own widget in, so no
 *  page ships another tool's code. */
export function ToolPage({ slug, children }) {
  const t = toolBySlug(slug);
  const path = toolPath(slug);
  const others = TOOLS.filter((x) => x.slug !== slug);
  return (
    <>
      <JsonLd data={toolLd(t)} />
      <JsonLd data={faqLd(t.faqs)} />
      <JsonLd data={breadcrumbLd([{ name: 'Tools', path: '/tools' }, { name: t.short, path }])} />
      <Doc eyebrow="Free calculator" title={t.name} crumbs={[{ name: 'Tools', path: '/tools' }, { name: t.short, path }]}>
        <p className="speakable !mt-0 max-w-2xl text-[19px] leading-[1.65] text-white/85">{t.answer}</p>
        <div className="mt-10">{children}</div>

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
