'use client';

/**
 * TIME WHEELS — the Home tab's first block, and the app's landing content.
 *
 * `/api/public/time-wheels` returns four wheels (Days, Weeks, Months, Years),
 * each a list of nodes. A node is a period with art, a headline that never names
 * the period, a supporting line and a button — and `open`, the section its
 * reading opens as.
 *
 * The phone spins these as four paged wheels. Here they are four rows the reader
 * scrolls, which is the same content and the same move — pick a period, read the
 * card it puts up, open it — with the gesture a pointer actually has. Selecting a
 * node swaps the card beneath its row, exactly as the wheel does.
 *
 * `current` marks the period the reader is in; it starts selected, because the
 * phone lands on Today.
 */

import { useEffect, useMemo, useState } from 'react';
import { Media } from './Blocks';
import Loader from './Loader';
import { runFeature } from '../lib/api';

function Wheel({ wheel, onOpen }) {
  const nodes = Array.isArray(wheel?.nodes) ? wheel.nodes : [];
  const initial = useMemo(() => {
    const i = nodes.findIndex((n) => n.current);
    return i >= 0 ? i : 0;
  }, [nodes]);
  const [sel, setSel] = useState(initial);
  useEffect(() => setSel(initial), [initial]);

  if (!nodes.length) return null;
  const node = nodes[Math.min(sel, nodes.length - 1)];

  return (
    <section className="mt-12 first:mt-4">
      <p className="text-[10px] uppercase tracking-[0.32em] text-white/35">{wheel.title}</p>

      {/* the wheel itself — the periods, in order, the current one first-lit */}
      <div className="-mx-6 mt-4 flex snap-x gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {nodes.map((n, i) => (
          <button
            key={n.id || i}
            onClick={() => setSel(i)}
            aria-pressed={i === sel}
            className={`shrink-0 snap-start rounded-full border px-4 py-2 text-[12px] transition-colors ${
              i === sel
                ? 'border-gold/70 bg-gold/10 text-white'
                : 'border-mist text-white/45 hover:text-white/80'
            }`}
          >
            {n.short || n.name}
          </button>
        ))}
      </div>

      {/* the card that period puts up */}
      <button
        onClick={() => node.open && onOpen(node.open)}
        className="group mt-4 flex w-full overflow-hidden rounded-2xl border border-mist bg-card text-left transition-colors hover:border-gold/40"
      >
        <div className="relative hidden w-40 shrink-0 sm:block">
          {node.image ? <Media mediaKey={node.image} alt="" /> : null}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card" />
        </div>
        <div className="flex-1 p-5">
          <p className="text-[10px] uppercase tracking-[0.28em] text-gold/70">{node.overline || node.name}</p>
          <p className="mt-3 font-display text-[20px] leading-snug text-white">{node.title}</p>
          {node.support ? (
            <p className="mt-3 max-w-[54ch] text-[14px] leading-relaxed text-white/55">{node.support}</p>
          ) : null}
          {node.cta ? (
            <span className="mt-5 inline-block rounded-full border border-mist px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-white/70 group-hover:border-gold/50 group-hover:text-white">
              {node.cta}
            </span>
          ) : null}
        </div>
      </button>
    </section>
  );
}

export default function TimeWheels({ section, kundli, theme, language = 'en', onOpen }) {
  const [state, setState] = useState({ loading: true, data: null });

  useEffect(() => {
    if (!section?.endpoint) return;
    let live = true;
    runFeature(section.endpoint, kundli, { language })
      .then((d) => live && setState({ loading: false, data: d }))
      .catch(() => live && setState({ loading: false, data: null }));
    return () => { live = false; };
  }, [section?.endpoint, kundli, language]);

  if (state.loading) return <Loader media={section?.config?.loadingMedia} theme={theme} />;

  const wheels = Array.isArray(state.data?.wheels) ? state.data.wheels : [];
  if (!wheels.length) return null;

  return <div>{wheels.map((w) => <Wheel key={w.key} wheel={w} onOpen={onOpen} />)}</div>;
}
