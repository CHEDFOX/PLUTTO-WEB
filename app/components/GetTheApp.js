'use client';

/**
 * GET THE APP — what the Chart and Explore tabs show on the web.
 *
 * The browser carries the Oracle; everything else — the charts, the wheels, the
 * readings across every tradition — lives in the app. Rather than half-render
 * those here, the tab states the trade honestly and sends the visitor to the
 * right store for the device in their hand.
 */

import { useEffect, useState } from 'react';
import { detectPlatform, storeUrl, storeLabel } from '../lib/appStore';

export default function GetTheApp({ store, title, body, points }) {
  // Platform detection must run on the client — on the server there is no
  // navigator, and guessing would render the wrong button in the HTML.
  const [platform, setPlatform] = useState(null);
  useEffect(() => setPlatform(detectPlatform()), []);

  const isMobile = platform === 'ios' || platform === 'android';
  const href = storeUrl(platform || 'desktop', store);

  return (
    <div className="py-16 md:py-24 text-center">
      <p className="text-[10px] uppercase tracking-[0.32em] text-gold/70">
        In the app
      </p>

      <h2 className="mt-5 mx-auto max-w-xl font-serif text-3xl md:text-[40px] font-light leading-tight text-white">
        {title || (
          <>
            Download the app for the
            <br />
            <em className="italic text-white/85">complete divine experience.</em>
          </>
        )}
      </h2>

      <p className="mt-6 mx-auto max-w-md text-[15px] leading-relaxed text-white/50">
        {body ||
          'The Oracle speaks here. Everything else — your full chart, the wheels of time, and every reading across every tradition — waits in the app.'}
      </p>

      {points?.length > 0 && (
        <ul className="mt-10 mx-auto max-w-sm space-y-2.5 text-left">
          {points.map((p) => (
            <li key={p} className="flex gap-3 text-[14px] leading-relaxed text-white/45">
              <span className="text-gold/60 select-none">·</span>
              {p}
            </li>
          ))}
        </ul>
      )}

      <a
        href={href}
        target={isMobile ? undefined : '_blank'}
        rel="noreferrer"
        className="mt-12 inline-block rounded-full bg-white px-10 py-4 text-[11px]
                   uppercase tracking-[0.32em] text-black hover:brightness-110
                   transition-all"
      >
        {storeLabel(platform || 'desktop')}
      </a>

      {/* On a laptop there is no store to open, so say where it lives instead of
          pretending the button will install something. */}
      {platform === 'desktop' && (
        <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-white/25">
          iOS &amp; Android
        </p>
      )}
    </div>
  );
}
