'use client';

/**
 * FEATURE — open any catalog section: run its endpoint, adapt the response, render.
 *
 * One component covers every reading feature because the backend describes them
 * all the same way (section + endpoint + block envelope). Sections that need an
 * input flow (compatibility partner details, the horary number) are not handled
 * here yet — they report that plainly rather than rendering a broken screen.
 */

import { useEffect, useState } from 'react';
import Blocks from './Blocks';
import Reels from './Reels';
import { Media } from './Blocks';
import { runFeature } from '../lib/api';
import { buildBlocks } from '../lib/blocks';

export default function Feature({ section, kundli, theme, language = 'en', onClose }) {
  const [state, setState] = useState({ loading: true, error: '', data: null });

  useEffect(() => {
    let live = true;
    setState({ loading: true, error: '', data: null });

    // Content tiles carry their copy in the catalog — nothing to fetch.
    if (!section?.endpoint) {
      setState({ loading: false, error: '', data: {} });
      return;
    }

    runFeature(section.endpoint, kundli, { language })
      .then((d) => live && setState({ loading: false, error: '', data: d }))
      .catch(() =>
        live &&
        setState({
          loading: false,
          error: 'This reading could not be drawn right now. Try again in a moment.',
          data: null,
        })
      );
    return () => { live = false; };
  }, [section?.id, section?.endpoint, kundli, language]);

  const needsInput =
    Array.isArray(section?.config?.fields) && section.config.fields.length > 0;

  const envelope =
    state.data && !state.error ? buildBlocks(section, state.data) : null;

  // A PAGED READING TAKES THE WHOLE SCREEN. It carries its own backdrop and its
  // own rhythm, so it is not poured into the article column with a hero image
  // above it — that would put two pictures on the page and read as a header
  // stapled to a story.
  const paged = Array.isArray(envelope?.pages) && envelope.pages.length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-void overflow-y-auto">
      <div className={paged ? 'w-full' : 'mx-auto w-full max-w-2xl px-6 py-8 md:py-12'}>
        <button
          onClick={onClose}
          className={
            paged
              ? 'fixed left-6 top-6 z-10 rounded-full border border-white/15 bg-black/50 px-4 py-2 text-[10px] uppercase tracking-[0.32em] text-white/60 backdrop-blur hover:text-white transition-colors'
              : 'mb-8 text-[10px] uppercase tracking-[0.32em] text-white/40 hover:text-white transition-colors'
          }
        >
          ← Back
        </button>

        {!paged && section?.media && (
          <div className="mb-8 overflow-hidden rounded-2xl">
            <Media mediaKey={section.media} rounded alt={section.title || ''} />
          </div>
        )}

        {!paged && section?.title && (
          <p className="text-[10px] uppercase tracking-[0.32em] text-gold/70">
            {section.title}
          </p>
        )}

        {state.loading && (
          <div className="py-20 text-center">
            <span className="inline-block h-2 w-2 rounded-full bg-gold/70 animate-pulse" />
            <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-white/30">
              Reading
            </p>
          </div>
        )}

        {state.error && <p className="py-10 text-sm text-red-300/80">{state.error}</p>}

        {!state.loading && !state.error && needsInput && !envelope?.blocks?.length && (
          <p className="py-10 text-sm leading-relaxed text-white/50">
            This one needs a few details before it can be read. It&rsquo;s available
            in the Plutto app today — the guided input flow is coming to web shortly.
          </p>
        )}

        {envelope && paged && (
          <Reels pages={envelope.pages} config={envelope.config} theme={theme} title={section?.title} />
        )}

        {envelope && !paged && (
          <article className="pb-24">
            <Blocks blocks={envelope.blocks} theme={theme} />
            {Array.isArray(envelope.sections) &&
              envelope.sections.map((s, i) => (
                <section key={i} className="mt-12">
                  {s?.title && (
                    <p className="text-[10px] uppercase tracking-[0.32em] text-gold/70 mb-2">
                      {s.title}
                    </p>
                  )}
                  <Blocks blocks={s?.blocks} theme={theme} />
                </section>
              ))}
          </article>
        )}
      </div>
    </div>
  );
}
