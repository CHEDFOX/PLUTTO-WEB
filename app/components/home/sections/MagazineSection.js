import Link from 'next/link';
import FadeUp from '../../motion/FadeUp';
import { ArticleCard } from '../../magazine/ArticleCard';
import { ARTICLE_BY_SLUG } from '../../../lib/content/magazine';
import { H2 } from '../H2';

// Three stories from the magazine, the cover first (app/lib/magazine.js).
const FROM_THE_MAGAZINE = ['leibniz-binary-i-ching', 'the-computer-that-predicted-eclipses', 'ifa-256-signs-and-a-byte'];

export default function MagazineSection() {
  return (
    <section id="magazine" className="lazy-section scroll-mt-20 border-t border-white/[0.08] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <FadeUp>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sindoor">From the magazine</p>
              <H2 className="mt-3 max-w-[18ch]">Stories the sky left behind.</H2>
            </div>
            <Link href="/magazine" className="font-mono text-[12px] uppercase tracking-[0.18em] text-white underline decoration-white/30 underline-offset-[6px] hover:decoration-white">
              The whole issue →
            </Link>
          </div>
        </FadeUp>
        <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-3">
          {FROM_THE_MAGAZINE.map((slug) => <ArticleCard key={slug} a={ARTICLE_BY_SLUG[slug]} />)}
        </div>
      </div>
    </section>
  );
}
