'use client';

/**
 * LOADER — the app's own, not a dot the web invented.
 *
 * Every waiting state on web was a small gold dot pulsing on black. The phone
 * has never shown that: the catalog says what a loader is (theme.loader), and a
 * feature can name its own media (config.loadingMedia, usually
 * loaders/language_transition). Two products, two idle states, for no reason.
 *
 * The order here is the phone's order:
 *   1. `media` — what the feature asked for, resolved through the same manifest
 *      the app resolves it through, so it is the same file.
 *   2. theme.loader.native — the app draws its own orbit rather than downloading
 *      a GIF, and this is the same figure in CSS: a body going round a still
 *      centre. `nativeSize` sizes it, as it does on the phone.
 *   3. Failing both, the orbit anyway. There is no case where a bare dot is the
 *      better answer.
 *
 * `prefers-reduced-motion` stops the orbit and leaves the ring — the animation
 * is decoration, and a spinning thing is exactly what that setting is about.
 */

import { useEffect, useState } from 'react';
import { mediaUrl, isVideo, resolveMedia } from '../lib/media';

function Orbit({ size = 96, accent = '#D4AF37' }) {
  const r = size / 2;
  return (
    <div className="pl-orbit" style={{ width: size, height: size }} aria-hidden="true">
      <div className="pl-ring" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
      <div className="pl-spin">
        <span className="pl-body" style={{ background: accent, left: r - 3, top: -3 }} />
      </div>
      <style jsx>{`
        .pl-orbit { position: relative; display: grid; place-items: center; }
        .pl-ring { position: absolute; inset: 0; border-radius: 9999px; border-width: 1px; border-style: solid; }
        .pl-spin { position: absolute; inset: 0; animation: pl-rot 1.6s linear infinite; }
        .pl-body { position: absolute; width: 6px; height: 6px; border-radius: 9999px; }
        @keyframes pl-rot { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) { .pl-spin { animation: none; } }
      `}</style>
    </div>
  );
}

export default function Loader({ media, theme, label, size }) {
  const cfg = theme?.loader || {};
  const [url, setUrl] = useState(() => (media ? mediaUrl(media) : null));

  useEffect(() => {
    let live = true;
    if (media && !url) resolveMedia(media).then((u) => live && setUrl(u));
    return () => { live = false; };
  }, [media, url]);

  const px = size || cfg.nativeSize || 96;

  return (
    <div className="flex flex-col items-center justify-center py-16">
      {url && !cfg.native ? (
        isVideo(url)
          ? <video src={url} width={px} height={px} autoPlay muted loop playsInline className="rounded-full" />
          : <img src={url} alt="" width={px} height={px} className="rounded-full opacity-90" />
      ) : (
        <Orbit size={px} accent={theme?.accent || '#D4AF37'} />
      )}
      {label ? (
        <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-white/30">{label}</p>
      ) : null}
    </div>
  );
}
