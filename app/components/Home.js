'use client';

/**
 * HOME — whatever the catalog says home is, and nothing else.
 *
 * `catalog.home` is a list of blocks, and today it is exactly two: the time
 * wheels, and an SDUI card that sends the reader to Explore. This renders that
 * list rather than a home screen of its own invention, so when the composition
 * changes on the backend it changes here with no release — the same contract the
 * phone's LAYOUTS registry keeps.
 *
 * An unknown block type renders nothing, deliberately. The phone skips one too
 * (templates.js), because a block the client does not understand yet must not
 * take the screen down with it.
 */

import Sdui from './Sdui';
import TimeWheels from './TimeWheels';

/** "id:vedic_wheels" / "ids:a,b" — the catalog's own way of naming sections. */
function resolve(source, catalog) {
  if (!source || !catalog) return [];
  const [kind, rest] = String(source).split(':');
  const all = catalog.sections || [];
  if (kind === 'id') return all.filter((s) => s.id === rest);
  if (kind === 'ids') return (rest || '').split(',').map((id) => all.find((s) => s.id === id.trim())).filter(Boolean);
  return [];
}

export default function Home({ catalog, kundli, language = 'en', onOpen, onTab }) {
  const blocks = Array.isArray(catalog?.home) ? catalog.home : [];
  if (!blocks.length) return null;

  return (
    <div>
      {blocks.map((b, i) => {
        const secs = resolve(b.source, catalog);
        switch (b.type) {
          case 'timewheels':
            return (
              <TimeWheels key={b.id || i} section={secs[0]} kundli={kundli}
                          theme={catalog?.theme} language={language} onOpen={onOpen} />
            );
          case 'sdui': case 'custom': {
            // The tree is either inline in the block's options or fetched from a
            // section's endpoint. Home's is inline today.
            const tree = b.options?.tree || secs[0]?.config?.tree;
            return tree ? (
              <div key={b.id || i} className="-mx-6 md:mx-0">
                <Sdui tree={tree} theme={catalog?.theme} onOpen={onOpen} onTab={onTab} />
              </div>
            ) : null;
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
