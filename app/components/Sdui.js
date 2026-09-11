'use client';

/**
 * SDUI — the backend's node trees, drawn in a browser.
 *
 * Explore is not a list of features the web app decides how to show: it is a
 * tree the backend composes and can change without either client shipping. The
 * phone has had this renderer for a long time (src/render/sdui.js); web did not,
 * so the Explore tab showed a "get the app" card instead of the app's own feed.
 *
 * The vocabulary here is the one the backend actually emits — box, row, scroll,
 * text, heading, paragraph, overline, image, spacer, divider, button, embed —
 * and unknown types render their children rather than nothing, which is the same
 * forward-compatibility contract the phone keeps: the backend can ship a node
 * type before this file knows the word, and the tree still renders.
 *
 * ACTIONS. `{kind:'open', section}` is the only one Explore uses, and it opens a
 * section exactly as tapping a card in the Library does. A node with an action
 * becomes a button so it is reachable from a keyboard — the phone gets that for
 * free from Pressable and a div does not.
 */

import { useEffect, useState } from 'react';
import { css, clamp } from '../lib/sdui';
import { mediaUrl, isVideo, resolveMedia } from '../lib/media';

function Img({ mediaKey, style, fit = 'cover', alt = '' }) {
  const [url, setUrl] = useState(() => mediaUrl(mediaKey));
  useEffect(() => {
    let live = true;
    if (!url && mediaKey) resolveMedia(mediaKey).then((u) => live && setUrl(u));
    return () => { live = false; };
  }, [mediaKey, url]);
  if (!url) return <div style={style} />;
  const s = { ...style, objectFit: fit };
  return isVideo(url)
    ? <video style={s} src={url} autoPlay muted loop playsInline />
    : <img style={s} src={url} alt={alt} loading="lazy" />;
}

/**
 * A horizontal deck — `{type:'embed', layout:'deck', sections:[…]}`.
 *
 * On the phone this is a cover-flow the cards rake away from. Here it is a
 * scroll-snapping row: the same cards, the same order, the same tap, moved with
 * whatever the reader has. A pointer has no thumb to swipe with, and a fake
 * turntable driven by a scrollbar is worse than an honest row.
 */
function Deck({ node, onOpen }) {
  const sections = Array.isArray(node.sections) ? node.sections : [];
  if (!sections.length) return null;
  const opt = node.options || {};
  const ratio = opt.card?.ratio || 1.3;
  return (
    <div
      className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ scrollPaddingLeft: 24 }}
    >
      {sections.map((s, i) => (
        <button
          key={s.id || i}
          onClick={() => onOpen && onOpen(s)}
          className="relative shrink-0 snap-start overflow-hidden rounded-2xl border border-mist bg-card text-left transition-colors hover:border-gold/40"
          style={{ width: 'min(74vw, 300px)', aspectRatio: `1 / ${ratio}` }}
        >
          {s.media ? (
            <Img mediaKey={s.media} alt={s.title || ''}
                 style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
          <p className="absolute inset-x-0 bottom-0 p-5 font-display text-[19px] leading-tight text-white">
            {s.title}
          </p>
        </button>
      ))}
    </div>
  );
}

function Node({ node, theme, onOpen, depth = 0 }) {
  if (!node || typeof node !== 'object') return null;
  const p = node.props || {};
  const style = css(node.style, theme);
  const kids = Array.isArray(node.children)
    ? node.children.map((c, i) => <Node key={i} node={c} theme={theme} onOpen={onOpen} depth={depth + 1} />)
    : null;

  // A tappable node. Rendered as a real button, so it is focusable and
  // announced; `text-left` because a button centres its content by default and
  // every one of these is a card full of prose.
  const open = node.action && node.action.kind === 'open' ? node.action.section : null;
  const wrap = (content, extra) => {
    const s = { ...style, ...extra };
    if (!open) return <div style={s}>{content}</div>;
    return (
      <button type="button" onClick={() => onOpen && onOpen(open)}
              className="block w-full text-left transition-opacity hover:opacity-95"
              style={s}>
        {content}
      </button>
    );
  };

  switch (node.type) {
    case 'box': case 'view': case 'stack': case 'card':
      return wrap(kids, { position: style?.position || 'relative' });

    case 'row':
      return wrap(kids, { display: 'flex', flexDirection: 'row', alignItems: 'center' });

    case 'scroll':
      return (
        <div style={style} className={p.horizontal ? 'flex overflow-x-auto' : undefined}>
          {kids}
        </div>
      );

    case 'text': case 'paragraph': case 'heading': case 'overline': {
      const t = node.text != null ? String(node.text) : '';
      if (!t) return null;
      const s = { ...style, ...clamp(p.lines) };
      return <p style={s}>{t}</p>;
    }

    case 'image': case 'media': case 'video':
      return <Img mediaKey={node.src} style={style} fit={p.fit || 'cover'} alt={p.alt || ''} />;

    case 'spacer':
      return <div style={{ height: p.height != null ? `${p.height}px` : '16px' }} />;

    case 'divider':
      return <div style={{ ...style, height: 1, backgroundColor: 'rgba(255,255,255,0.12)' }} />;

    case 'button':
      return (
        <button type="button" onClick={() => open && onOpen && onOpen(open)}
                style={style}
                className="rounded-full border border-mist px-5 py-2 text-[11px] uppercase tracking-[0.28em] text-white/80 hover:border-gold/50 hover:text-white">
          {node.text}
        </button>
      );

    case 'embed':
      if ((node.layout || node.template) === 'deck') {
        return <div style={style}><Deck node={node} onOpen={onOpen} /></div>;
      }
      // Any other home layout is a native composition with no web equivalent
      // yet. Its sections are still real, so they are shown as the deck's row
      // rather than dropped on the floor.
      return node.sections?.length
        ? <div style={style}><Deck node={{ ...node, options: {} }} onOpen={onOpen} /></div>
        : null;

    // THE GLOBE IS NOT HERE YET. It is a turning earth drawn on the GPU with a
    // hundred and two lit traditions on it, and there is no honest two-line
    // version. Rendering nothing is deliberate: the feed reads correctly without
    // it, and a grey box apologising for itself would be worse than its absence.
    case 'globe':
      return null;

    default:
      return kids ? <div style={style}>{kids}</div> : null;
  }
}

export default function Sdui({ tree, theme, onOpen }) {
  if (!tree) return null;
  if (Array.isArray(tree)) {
    return <>{tree.map((n, i) => <Node key={i} node={n} theme={theme} onOpen={onOpen} />)}</>;
  }
  return <Node node={tree} theme={theme} onOpen={onOpen} />;
}
