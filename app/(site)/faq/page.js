/**
 * /faq — questions about Plutto, answered in the first sentence
 * (app/lib/faq.js). FAQPage structured data.
 */
import { FAQS } from '../../lib/faq';
import { pageMeta, breadcrumbLd, faqLd, JsonLd } from '../../lib/seo';
import { Doc, DocDoor } from '../../components/site/Doc';

export const metadata = pageMeta({
  title: 'Plutto FAQ: Price, Accuracy, Languages, Systems',
  description: 'Answers about Plutto, the astrology app you can talk to: what it costs, which systems it reads, how it calculates your chart, how accurate it is, and where to get it.',
  path: '/faq',
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqLd(FAQS)} />
      <JsonLd data={breadcrumbLd([{ name: 'FAQ', path: '/faq' }])} />
      <Doc eyebrow="FAQ" title="Questions about Plutto." crumbs={[{ name: 'FAQ', path: '/faq' }]}>
        {FAQS.map((f) => (
          <section key={f.q}>
            <h2>{f.q}</h2>
            <p>{f.a}</p>
          </section>
        ))}
        <DocDoor links={[{ href: '/guides', label: 'Guides' }, { href: '/pricing', label: 'Pricing' }]} />
      </Doc>
    </>
  );
}
