'use client';

import { Stroke } from './Stroke';

/** A loose double line under the word that carries the sentence. */
export function Underline({ children, className = '', delay = 0.7 }) {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <Stroke
        box="0 0 200 20"
        d="M4 9 C 50 2, 120 15, 196 6 M 10 15 C 70 8, 130 18, 188 12"
        strokeWidth={3.2}
        className="absolute left-0 top-full h-[0.26em] w-full -translate-y-[0.08em]"
        delay={delay} duration={0.9}
      />
    </span>
  );
}
