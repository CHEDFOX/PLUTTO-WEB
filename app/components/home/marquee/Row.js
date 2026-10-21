import Image from 'next/image';
import { cardSrc } from '../../../lib/content/decks';

export function Row({ items, dur, reverse }) {
  return (
    <div className="marquee overflow-hidden">
      <div
        className="marquee-track flex w-max gap-4"
        style={{ '--dur': dur, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {[...items, ...items].map(([d, c, name], i) => (
          <figure key={`${d}-${c}-${i}`} className="w-[92px] flex-none md:w-[120px]" aria-hidden={i >= items.length}>
            <Image src={cardSrc(d, c)} alt={i < items.length ? name : ''} width={120} height={211}
                   sizes="120px" className="aspect-[300/527] w-full rounded-[7px] object-cover ring-1 ring-white/10" />
          </figure>
        ))}
      </div>
    </div>
  );
}
