/** Shared ink, sindoor, fonts and geometry helpers for the plates. */

export const INK = 'currentColor';
export const SINDOOR = '#C8341F';
export const MONO = { fontFamily: 'var(--font-mono), IBM Plex Mono, ui-monospace, monospace', letterSpacing: '0.12em' };
export const SERIF = { fontFamily: 'var(--font-display), Bodoni Moda, Georgia, serif' };

export const at = (cx, cy, r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.sin(a), cy - r * Math.cos(a)];
};
export const f = (n) => Math.round(n * 10) / 10;
