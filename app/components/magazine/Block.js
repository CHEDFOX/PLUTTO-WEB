import { LABEL } from '../site/magazine/Parts';

export function Block({ b, first }) {
  if (b.h) return <h2 className="mt-14 font-display text-[clamp(1.5rem,2.6vw,1.9rem)] leading-tight text-white">{b.h}</h2>;
  if (b.quote) {
    return (
      <blockquote className="my-12 border-l-2 border-sindoor pl-6 md:-ml-8">
        <p className="font-display text-[clamp(1.55rem,3.2vw,2.15rem)] italic leading-[1.22] text-white">{b.quote}</p>
      </blockquote>
    );
  }
  if (b.fact) {
    return (
      <aside className="my-12 border-y border-white py-6">
        <p className={LABEL}>Did you know</p>
        <p className="mt-3 text-[17px] leading-[1.65] text-white/90">{b.fact}</p>
      </aside>
    );
  }
  return (
    <p className={`mt-6 ${first ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[4.4em] first-letter:leading-[0.82] first-letter:text-white' : ''}`}>
      {b.p}
    </p>
  );
}
