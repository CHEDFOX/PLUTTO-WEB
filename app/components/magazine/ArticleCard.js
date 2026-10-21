/**
 * A story's card, as the contents page and the home page file it: server markup, every word in the HTML as sent.
 * Only the photograph (Picture) is a client component, so it can fall back to a title plate when Commons does not answer.
 */

import Link from 'next/link';
import { readMinutes } from '../../lib/content/magazine';
import { KICKER, LABEL } from './classes';
import { CardArt } from './CardArt';

/** A story as the contents page files it. `wide` sets it across the page, picture left. */
export function ArticleCard({ a, wide = false, eager = false, headingLevel = 3 }) {
  const H = `h${headingLevel}`;
  return (
    <Link href={`/magazine/${a.slug}`} className={`group block ${wide ? 'grid items-center gap-8 md:grid-cols-2' : ''}`}>
      <div className={`relative overflow-hidden bg-white/[0.04] ring-1 ring-white/15 ${wide ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
        <CardArt a={a} eager={eager} />
      </div>
      <div className={`min-w-0 ${wide ? '' : 'mt-5'}`}>
        <p className={KICKER}>{a.kicker}</p>
        <H className={`mt-2 font-display leading-[1.12] tracking-[-0.01em] text-white decoration-1 underline-offset-4 group-hover:underline ${wide ? 'text-[clamp(1.6rem,3vw,2.3rem)]' : 'text-[23px]'}`}>
          {a.title}
        </H>
        <p className={`mt-3 leading-relaxed text-white/65 ${wide ? 'text-[17px]' : 'text-[15px]'}`}>{a.standfirst}</p>
        <p className={`mt-4 ${LABEL}`}>{readMinutes(a)} min read</p>
      </div>
    </Link>
  );
}
