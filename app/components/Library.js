'use client';

/**
 * LIBRARY — every catalog feature, grouped exactly as the backend groups them.
 *
 * The mobile home/explore compositions are bespoke native layouts (animated
 * spines, strands, vinyl wave). Rather than imitate those gestures on a pointer
 * device, web renders the SAME CONTENT — every section the catalog exposes, in
 * the backend's group order — as a grid. Add a section in the catalog and it
 * appears here with no web release, which is the point of the SDUI contract.
 */

import { Media } from './Blocks';

function Card({ section, locked, onOpen }) {
  return (
    <button
      onClick={() => onOpen(section)}
      className="group relative text-left overflow-hidden rounded-xl border border-mist
                 bg-card hover:border-gold/40 transition-colors"
    >
      <div className="aspect-[4/3] overflow-hidden bg-mediaBg">
        {section.media ? (
          <Media mediaKey={section.media} alt={section.title || ''} />
        ) : null}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-serif text-lg leading-tight text-white">{section.title}</p>
          {locked && (
            <span className="mt-1 shrink-0 text-[9px] uppercase tracking-[0.2em] text-gold/80">
              ★
            </span>
          )}
        </div>
        {section.subtitle && (
          <p className="mt-1 text-[12px] leading-snug text-white/40">{section.subtitle}</p>
        )}
      </div>
    </button>
  );
}

export default function Library({ catalog, onOpen, isLocked }) {
  const groups = [...(catalog?.groups || [])].sort(
    (a, b) => (a.position ?? 99) - (b.position ?? 99)
  );
  const sections = (catalog?.sections || []).filter(
    (s) => s && s.visible !== false && s.hidden !== true
  );

  const byGroup = {};
  for (const s of sections) {
    const g = s.group || 'special';
    (byGroup[g] ||= []).push(s);
  }
  for (const g of Object.keys(byGroup)) {
    byGroup[g].sort((a, b) => (a.position ?? 99) - (b.position ?? 99));
  }

  const rendered = groups.filter((g) => byGroup[g.id]?.length);

  if (!rendered.length) {
    return (
      <p className="py-20 text-center text-sm text-white/40">
        Nothing to explore yet.
      </p>
    );
  }

  return (
    <div className="pb-24">
      {rendered.map((g) => (
        <section key={g.id} className="mt-14 first:mt-0">
          <h2 className="text-[10px] uppercase tracking-[0.32em] text-white/40 mb-5">
            {g.label}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {byGroup[g.id].map((s) => (
              <Card
                key={s.id}
                section={s}
                locked={isLocked?.(s)}
                onOpen={onOpen}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
