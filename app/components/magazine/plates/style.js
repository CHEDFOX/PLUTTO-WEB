/**
 * THE MAGAZINE'S DRAWN PLATES — the pictures no photograph can give: the week as
 * a star, the two zodiacs on one dial, the sixteen figures of Ifá.
 *
 * Pure SVG, drawn from the facts in the text (nothing here is decorative
 * geometry), in ink on paper with the one sindoor line the eye should follow.
 * `currentColor` is the ink, so a plate sits on any ground the page gives it.
 */

export const INK = 'currentColor';
export const SINDOOR = '#C8341F';
export const MONO = { fontFamily: 'var(--font-mono), IBM Plex Mono, ui-monospace, monospace', letterSpacing: '0.12em' };
export const SERIF = { fontFamily: 'var(--font-display), Bodoni Moda, Georgia, serif' };

export const at = (cx, cy, r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.sin(a), cy - r * Math.cos(a)];
};
export const f = (n) => Math.round(n * 10) / 10;
