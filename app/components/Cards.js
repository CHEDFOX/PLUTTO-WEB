'use client';

/**
 * CARDS — the `hdeck` response, which is thirteen of the catalog's sections.
 *
 * Transits, aspects, profections, the Chinese pillars and animals, the elements,
 * hard aspects, luck — every one of them answers `{cards: [...]}`, and the web
 * adapter knew none of it, so all thirteen opened as their own title and nothing
 * else. A card is `{id, title, number|info, image, reading, sections[]}`.
 *
 * The phone runs them as a deck along the top with the reading beneath the one
 * you land on. Here they are read down the page: the marker, the title, the art,
 * and the reading — because on a pointer a deck of thirteen cards is a lot of
 * clicking to read a page of prose, and the prose is the point.
 *
 * `sections` is the rich form (a title and a body per movement) and `reading` is
 * the plain one; both exist on the wire, and a card that has sections is the
 * same card written better, so it wins.
 */

import { Media } from './Blocks';
import { titleCaseWords } from '../lib/blocks';

export default function Cards({ cards, theme, intro }) {
  const list = (Array.isArray(cards) ? cards : []).filter(
    (c) => c && (c.title || c.reading || (c.sections || []).length)
  );
  if (!list.length) return null;

  // THE FIRST CARD IS SOMETIMES AN INTRODUCTION, not a card: no number and no
  // art. conceptData() on the phone decides that the same way, and it matters,
  // because an intro set as a card reads as a first item in a list of many.
  const hasIntro = intro != null ? !!intro : (!!list[0] && !list[0].number && !list[0].image);
  const head = hasIntro ? list[0] : null;
  const rest = hasIntro ? list.slice(1) : list;

  return (
    <div className="pb-10">
      {head ? (
        <section className="border-b border-mist pb-10">
          {head.title ? (
            <h2 className="font-display text-[26px] leading-tight text-white md:text-[32px]">{head.title}</h2>
          ) : null}
          {head.reading ? (
            <p className="mt-5 max-w-[62ch] whitespace-pre-line font-serif text-[16px] leading-[1.72] text-white/70">
              {titleCaseWords(head.reading, theme)}
            </p>
          ) : null}
        </section>
      ) : null}

      {rest.map((c, i) => {
        const secs = Array.isArray(c.sections) ? c.sections.filter((s) => s && (s.title || s.body)) : [];
        return (
          <section key={c.id || i} className="mt-12 first:mt-8">
            <div className="flex items-baseline gap-4">
              {c.number || c.info ? (
                <span className="font-mono text-[11px] tracking-[0.2em] text-gold/70">{c.number || c.info}</span>
              ) : null}
              {c.title ? (
                <h3 className="font-display text-[21px] leading-tight text-white md:text-[24px]">{c.title}</h3>
              ) : null}
            </div>

            {c.image ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-mist">
                <Media mediaKey={c.image} alt={c.title || ''} />
              </div>
            ) : null}

            {secs.length ? (
              secs.map((s, j) => (
                <div key={j} className="mt-6">
                  {s.title ? (
                    <p className="text-[9.5px] uppercase tracking-[0.24em] text-gold/70">{s.title}</p>
                  ) : null}
                  {s.body ? (
                    <p className="mt-2 max-w-[62ch] whitespace-pre-line font-serif text-[16px] leading-[1.72] text-white/72">
                      {s.body}
                    </p>
                  ) : null}
                </div>
              ))
            ) : c.reading ? (
              <p className="mt-5 max-w-[62ch] whitespace-pre-line font-serif text-[16px] leading-[1.72] text-white/72">
                {titleCaseWords(c.reading, theme)}
              </p>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
