/**
 * /tools/embed — the calculators, free for any site to embed. The credit link
 * sits in the snippet itself, outside the frame, so it is a real link on the
 * host's page; the frame is just the tool.
 */
import Link from 'next/link';
import { pageMeta, breadcrumbLd, JsonLd } from '../../../lib/seo';
import { cardPath } from '../../../lib/cards';
import { EMBEDS, snippet } from '../../../lib/embeds';
import { Doc, DocDoor, LINK } from '../../../components/site/Doc';
import CopyBox from '../../../components/site/CopyBox';

export const metadata = pageMeta({
  title: 'Embed a Free Astrology Calculator on Your Site',
  description: 'Add Plutto’s free Moon sign, nakshatra and dasha calculator or kundli matching calculator to your own website with one line of HTML. No sign-up, no tracking, nothing sent.',
  path: '/tools/embed',
  image: cardPath('tools'),
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Tools', path: '/tools' }, { name: 'Embed', path: '/tools/embed' }])} />
      <Doc eyebrow="For site owners" title="Put a calculator on your site" crumbs={[{ name: 'Tools', path: '/tools' }, { name: 'Embed', path: '/tools/embed' }]}
        lead="Free to use, on any site. The calculators run entirely in your visitor’s browser: no sign-up, no cookies, no tracking, and nothing your visitors type is sent to Plutto or anyone else.">
        {Object.entries(EMBEDS).map(([tool, e]) => (
          <section key={tool}>
            <h2>{e.title}</h2>
            <p>Paste this where the calculator should appear. <Link href={`/embed/${tool}`} className={LINK}>Preview it</Link>, or see <Link href={e.page} className={LINK}>the full page</Link>.</p>
            <CopyBox text={snippet(tool)} label={e.credit.toLowerCase()} />
          </section>
        ))}
        <h2>Terms</h2>
        <p>Use it on any site, commercial or not. Please keep the credit line under the frame. The calculators are for reflection and education; like the rest of Plutto, they make no claim to predict events.</p>
        <DocDoor links={[{ href: '/tools', label: 'All calculators' }, { href: '/editorial-standards', label: 'How they are checked' }]} />
      </Doc>
    </>
  );
}
