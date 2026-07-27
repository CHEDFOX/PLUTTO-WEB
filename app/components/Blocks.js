'use client';

/**
 * BLOCKS — renders the backend's block envelope.
 *
 * One case per block `type`, matching the mobile renderer's vocabulary so any
 * feature the backend can express renders identically on web. Unknown types are
 * skipped rather than crashing the page — the backend can ship a new block type
 * before the web app knows it.
 */

import { useEffect, useState } from 'react';
import { mediaUrl, isVideo, resolveMedia } from '../lib/media';
import { titleCaseWords } from '../lib/blocks';

function Media({ mediaKey, rounded, alt = '' }) {
  const [url, setUrl] = useState(() => mediaUrl(mediaKey));
  useEffect(() => {
    let live = true;
    if (!url && mediaKey) resolveMedia(mediaKey).then((u) => live && setUrl(u));
    return () => { live = false; };
  }, [mediaKey, url]);

  if (!url) return null;
  const cls = `w-full object-cover ${rounded ? 'rounded-2xl' : ''}`;
  if (isVideo(url)) {
    return <video className={cls} src={url} autoPlay muted loop playsInline />;
  }
  return <img className={cls} src={url} alt={alt} loading="lazy" />;
}

function Block({ block, theme }) {
  if (!block || typeof block !== 'object') return null;
  const tc = (t) => titleCaseWords(t, theme);

  switch (block.type) {
    case 'overline':
      return (
        <p className="text-[10px] uppercase tracking-[0.32em] text-gold/70 mt-8 mb-2">
          {block.text}
        </p>
      );

    case 'heading':
      return (
        <h2 className="font-serif text-2xl md:text-3xl font-light text-white mt-10 mb-3 leading-snug">
          {tc(block.text)}
        </h2>
      );

    case 'paragraph':
      return (
        <p className="font-serif text-[17px] leading-[1.75] text-white/85 mb-5">
          {tc(block.text)}
        </p>
      );

    case 'quote':
      return (
        <blockquote className="border-l border-gold/50 pl-5 my-8">
          <p className="font-serif italic text-xl leading-relaxed text-white/80">
            {tc(block.text)}
          </p>
        </blockquote>
      );

    case 'badge':
      return (
        <span className="inline-block px-3 py-1 my-2 rounded-full border border-gold/50 text-[10px] uppercase tracking-[0.28em] text-gold">
          {block.text}
        </span>
      );

    case 'divider':
      return <hr className="my-10 border-0 border-t border-mist" />;

    case 'image':
    case 'media':
      return (
        <figure className="my-8">
          <Media mediaKey={block.media || block.src} rounded={block.rounded} alt={block.alt} />
          {block.caption && (
            <figcaption className="mt-3 text-[11px] tracking-wide text-white/35">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'story':
      return (
        <div className="my-6 space-y-5">
          {(block.segments || []).map((s, i) => (
            <p key={i} className="font-serif text-[17px] leading-[1.75] text-white/85">
              {tc(s)}
            </p>
          ))}
        </div>
      );

    case 'list':
      return (
        <ul className="my-6 space-y-3">
          {(block.items || []).map((it, i) => {
            const text = typeof it === 'string' ? it : it?.text || it?.label;
            const sub = typeof it === 'object' ? it?.sub || it?.value : null;
            return (
              <li key={i} className="flex gap-3">
                <span className="text-gold/60 select-none">·</span>
                <div>
                  <p className="text-[15px] leading-relaxed text-white/85">{tc(text)}</p>
                  {sub && <p className="text-[13px] text-white/45 mt-0.5">{tc(sub)}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      );

    case 'columns':
      return (
        <div className="my-8 grid grid-cols-2 md:grid-cols-3 gap-6">
          {(block.items || block.columns || []).map((c, i) => (
            <div key={i}>
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">
                {c?.label || c?.title}
              </p>
              <p className="mt-1 font-serif text-lg text-white">{c?.value || c?.text}</p>
            </div>
          ))}
        </div>
      );

    case 'keyValue':
      return (
        <div className="my-6">
          {(block.items || block.rows || []).map((kv, i) => (
            <div key={i} className="flex items-baseline justify-between border-b border-white/5 py-2.5 gap-6">
              <span className="text-[13px] text-white/45">{kv?.key || kv?.label}</span>
              <span className="font-serif text-[15px] text-white/90 text-right">
                {kv?.value}
              </span>
            </div>
          ))}
        </div>
      );

    case 'footer':
      return (
        <p className="mt-10 text-[12px] leading-relaxed text-white/35">{block.text}</p>
      );

    case 'reveal':
      // A reveal wraps nested blocks behind a tap on mobile; on web we simply
      // show the content — no gesture needed on a pointer device.
      return <Blocks blocks={block.blocks || block.children} theme={theme} />;

    case 'collage':
      return (
        <div className="my-8 grid grid-cols-2 gap-3">
          {(block.items || []).map((it, i) => (
            <Media key={i} mediaKey={it?.media || it} rounded />
          ))}
        </div>
      );

    default:
      // Unknown type — render its text if it has any, else skip silently.
      return block.text ? (
        <p className="font-serif text-[17px] leading-[1.75] text-white/85 mb-5">{tc(block.text)}</p>
      ) : null;
  }
}

export default function Blocks({ blocks, theme }) {
  if (!Array.isArray(blocks)) return null;
  return (
    <>
      {blocks.map((b, i) => (
        <Block key={i} block={b} theme={theme} />
      ))}
    </>
  );
}

export { Media };
