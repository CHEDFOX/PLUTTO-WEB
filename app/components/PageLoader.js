'use client';

import { useEffect, useState } from 'react';

const PageLoader = () => {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem('plutto:loaded');
  });
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!show) return;
    const fadeTimer = setTimeout(() => setFadeOut(true), 1500);
    const hideTimer = setTimeout(() => {
      sessionStorage.setItem('plutto:loaded', '1');
      setShow(false);
    }, 2200);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [show]);

  const letters = 'PLUTTO'.split('');

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black transition-opacity duration-[900ms] ease-out"
      style={{
        opacity: fadeOut ? 0 : 1,
        pointerEvents: show ? 'auto' : 'none',
        visibility: show ? 'visible' : 'hidden',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(41,98,255,0.08) 0%, transparent 55%)',
        }}
      />

      <div className="relative flex flex-col items-center gap-6">
        {/* Wordmark */}
        <div
          className="flex font-display font-light text-[#F0F0F0]"
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            letterSpacing: '0.55em',
            paddingLeft: '0.55em',
          }}
        >
          {letters.map((ch, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                opacity: 0,
                transform: 'translateY(8px)',
                animation: 'pl-letter 700ms cubic-bezier(0.22,1,0.36,1) forwards',
                animationDelay: `${150 + i * 90}ms`,
              }}
            >
              {ch}
            </span>
          ))}
        </div>

        {/* Hairline in cool celestial blue */}
        <div
          className="relative h-px overflow-hidden"
          style={{ width: 'clamp(120px, 18vw, 220px)' }}
        >
          <div
            className="absolute inset-y-0 left-0"
            style={{
              width: '100%',
              background: '#2962FF',
              transformOrigin: 'left center',
              transform: 'scaleX(0)',
              animation: 'pl-line 1100ms cubic-bezier(0.22,1,0.36,1) forwards',
              animationDelay: '200ms',
              opacity: 0.7,
            }}
          />
        </div>

        {/* Tagline */}
        <span
          className="uppercase text-[#666]"
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: '0.65rem',
            letterSpacing: '0.4em',
            opacity: 0,
            animation: 'pl-fade 800ms ease-out forwards',
            animationDelay: '900ms',
          }}
        >
          An Oracle That Speaks Back
        </span>
      </div>

      <style>{`
        @keyframes pl-letter { to { opacity: 1; transform: translateY(0); } }
        @keyframes pl-line   { to { transform: scaleX(1); } }
        @keyframes pl-fade   { to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default PageLoader;
