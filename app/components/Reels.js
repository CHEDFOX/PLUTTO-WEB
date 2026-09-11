'use client';

/**
 * REELS — the paged reading, read with a pointer instead of a thumb.
 *
 * Most of what the backend writes comes back as `pages`: a tradition on the
 * globe, an observation, your places, a person's profile, a concept. On the
 * phone these are full-screen panels you swipe through. Nothing here imitates
 * that gesture — a swipe deck on a desktop is a worse way to read — but the
 * CONTENT is the same content, in the same order, with the same shape: a kicker,
 * a title, a beat of prose, over one backdrop that holds the whole piece
 * together.
 *
 * The mobile equivalents are the four reel layouts in templates.js. The one that
 * matters is `editorial`, which nearly every reading asks for: a heavy title, a
 * small marker above it, the body in the reading face, and a dimmed, blurred
 * backdrop behind all of it.
 *
 * WHY EACH BEAT GETS ITS OWN PANEL. The backend writes these to be read one at a
 * time — the arc in _base.REEL_ARC escalates, and only the last beat closes. Run
 * together as one column they read as a single essay and the escalation is lost,
 * so each beat gets a tall section and a scroll snap: you land on one, read it,
 * and move. Snapping is `proximity`, not `mandatory`, so a long beat can still be
 * scrolled through normally and nothing fights the wheel.
 */

import { useEffect, useState } from 'react';
import { mediaUrl, isVideo, resolveMedia } from '../lib/media';
import { titleCaseWords } from '../lib/blocks';

/**
 * The backdrop. One image for the whole reading when the backend says so
 * (`config.staticBg`, which every tradition and observation sets), otherwise the
 * page's own. Fixed rather than scrolled: the text moves over it, which is what
 * the phone does with `staticBg` and the reason a reading reads as one piece.
 */
function Backdrop({ mediaKey, dim = 0.5, blur = 22 }) {
  const [url, setUrl] = useState(() => mediaUrl(mediaKey));
  useEffect(() => {
    let live = true;
    if (!url && mediaKey) resolveMedia(mediaKey).then((u) => live && setUrl(u));
    return () => { live = false; };
  }, [mediaKey, url]);

  if (!url) return null;
  // The blur is a backend number in pixels of intensity on the phone; the same
  // value as a CSS blur radius is far heavier, so it is halved and capped. The
  // point of it is to stop the art competing with the words, not to erase it.
  const b = Math.min(24, Math.max(0, Number(blur) || 0) / 2);
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      {isVideo(url) ? (
        <video
          className="h-full w-full object-cover"
          style={{ filter: b ? `blur(${b}px)` : undefined, transform: b ? 'scale(1.06)' : undefined }}
          src={url} autoPlay muted loop playsInline
        />
      ) : (
        <img
          className="h-full w-full object-cover"
          style={{ filter: b ? `blur(${b}px)` : undefined, transform: b ? 'scale(1.06)' : undefined }}
          src={url} alt="" />
      )}
      <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${Math.min(0.92, Math.max(0, Number(dim) || 0))})` }} />
      {/* A little extra weight top and bottom so the chrome and the last line
          never sit on a bright part of the picture. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/75" />
    </div>
  );
}

export default function Reels({ pages, config = {}, theme, title }) {
  const list = (Array.isArray(pages) ? pages : []).filter(
    (p) => p && (p.title || p.body || p.reading || p.overline)
  );
  if (!list.length) return null;

  // One backdrop for the piece, or one per beat. `staticBg` is the backend's own
  // word for this and every reading that sets it sends the same media on every
  // page anyway — so the first page's art is the piece's art.
  const staticBg = config.staticBg !== false;
  const first = list.find((p) => p.media);
  const bgKey = staticBg ? (first?.media || config.media) : null;
  const bgDim = config.dim != null ? config.dim : (first?.dim != null ? first.dim : 0.5);
  const bgBlur = config.blur != null ? config.blur : (first?.blur != null ? first.blur : 22);

  // THE TITLE-CASE RULE IS PER LAYOUT, and getting it wrong is visible in every
  // line. templates.js title-cases the body in `stack` and `numeral` and leaves
  // it verbatim in `editorial` and `chapter` — and editorial is what nearly
  // every reading asks for, so applying it everywhere would have set the phone's
  // ordinary prose in Title Case On Every Word here. `stack` is also the default
  // when no layout is named, exactly as ReelContent has it.
  const layout = config.reelLayout || 'stack';
  const cases = layout === 'stack' || layout === 'numeral';

  return (
    <div className="relative">
      {bgKey ? <Backdrop mediaKey={bgKey} dim={bgDim} blur={bgBlur} /> : null}

      <div className="mx-auto w-full max-w-3xl px-6 md:px-8" style={{ scrollSnapType: 'y proximity' }}>
        {list.map((p, i) => {
          const body = p.body || p.reading || '';
          const pageCases = p.layout ? (p.layout === 'stack' || p.layout === 'numeral') : cases;
          // Per-page art, for a reading that changes picture between beats. It
          // sits behind that beat only, so the two never cross-fade into a mess.
          const own = !staticBg && p.media ? p.media : null;
          return (
            <section
              key={i}
              style={{ scrollSnapAlign: 'start' }}
              className="relative flex min-h-[78vh] flex-col justify-center py-16 md:py-24"
            >
              {own ? <Backdrop mediaKey={own} dim={p.dim != null ? p.dim : 0.5} blur={p.blur != null ? p.blur : 22} /> : null}

              {p.overline ? (
                <p className="text-[10px] uppercase tracking-[0.34em] text-gold/75">
                  {p.overline}
                </p>
              ) : null}

              {p.title ? (
                <h2 className="mt-5 font-display text-[30px] leading-[1.12] tracking-[-0.01em] text-white md:text-[42px]">
                  {p.title}
                </h2>
              ) : null}

              {body ? (
                <p className="mt-7 max-w-[62ch] whitespace-pre-line font-serif text-[17px] leading-[1.72] text-white/80 md:text-[18px]">
                  {pageCases ? titleCaseWords(body, theme) : body}
                </p>
              ) : null}

              {/* The beat count, so a reader knows how much is left — the phone
                  has a dot rail for this and a scrollbar says nothing about how
                  many beats there are. */}
              <p className="mt-10 font-mono text-[10px] tracking-[0.28em] text-white/25">
                {String(i + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}
                {title && i === 0 ? <span className="ml-3 text-white/20">{title}</span> : null}
              </p>
            </section>
          );
        })}
      </div>
    </div>
  );
}
