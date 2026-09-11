'use client';

/**
 * EXPLORE — the app's own feed, not a list this file decides on.
 *
 * The tab used to show a "get the app" card, which is the one thing Explore is
 * not: it is where the reader finds what to read next, and the backend composes
 * it — the cards, the order, the quiet tradition rows between them, the globe.
 * `/api/public/explore-feed` returns a node tree; Sdui draws it. Adding a card
 * to the feed is a backend edit and this file never hears about it, which is the
 * whole point of the contract.
 *
 * The section to call comes from the catalog (`explore_home`) rather than a URL
 * written here, so the endpoint, its cache version and its config stay the
 * backend's business. If the catalog has no such section — an older server — the
 * Library grid is still the honest fallback, and it is what the tab did before.
 */

import { useEffect, useState } from 'react';
import Sdui from './Sdui';
import Library from './Library';
import { runFeature } from '../lib/api';
import { isGated } from '../lib/entitlement';

const FEED_ID = 'explore_home';

export default function Explore({ catalog, kundli, entitled, language = 'en', onOpen }) {
  const section = (catalog?.sections || []).find((s) => s.id === FEED_ID);
  const [state, setState] = useState({ loading: !!section, tree: null, failed: false });

  useEffect(() => {
    if (!section?.endpoint) return;
    let live = true;
    setState({ loading: true, tree: null, failed: false });
    runFeature(section.endpoint, kundli, { language })
      .then((d) => live && setState({ loading: false, tree: d?.tree || null, failed: !d?.tree }))
      .catch(() => live && setState({ loading: false, tree: null, failed: true }));
    return () => { live = false; };
  }, [section?.endpoint, kundli, language]);

  // No feed on this server, or it could not be drawn — the Library is every
  // section the catalog exposes, which is the same content in a plainer order.
  if (!section || state.failed) {
    return <Library catalog={catalog} onOpen={onOpen} isLocked={(x) => isGated(x, catalog, entitled)} />;
  }

  if (state.loading) {
    return (
      <div className="py-24 text-center">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-gold/70" />
        <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-white/30">Explore</p>
      </div>
    );
  }

  return (
    <div className="-mx-6 md:mx-0">
      <Sdui tree={state.tree} theme={catalog?.theme} onOpen={onOpen} />
    </div>
  );
}
