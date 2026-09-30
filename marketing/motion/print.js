/**
 * THE PRINT SHOP — the kit for the print series (scenes/print-*.js). Each film
 * is a different hand-print technique, speaks in the orb's indirect voice (it
 * never says what Plutto is; it names what the viewer carries), and ends on a
 * poster frame that stands alone.
 *
 * A poster keeps everything that matters between SAFE.top and SAFE.bottom:
 * clear of the Reels/TikTok UI, and inside the 4:5 feed crop (y 285–1635), so
 * one frame serves the story, the reel cover and the feed post.
 */
import { el, prog, ease, lerp, rng, W, H } from './lib.js';
import { fbm, paint } from './shots.js';

export const SAFE = { top: 290, bottom: 1460 };
export { el, prog, ease, lerp, rng, W, H, fbm, paint };

/** A sheet of paper: its colour, fibre, a faint uneven wash and specks. Returns the canvas context. */
export function paper(stage, { color = '#F4EEE2', fibre = [110, 90, 70], wash = 0.45, specks = 220, seed = 8 } = {}) {
  const R = rng(seed), c = el('canvas', 'layer', {}, stage); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = color; g.fillRect(0, 0, W, H);
  g.globalAlpha = wash; g.drawImage(paint(270, 480, fbm(270, 480, { scale: 2, oct: 2, seed: seed + 1 }), (v) => [...fibre, Math.round(Math.abs(v - 0.5) * 30)]), 0, 0, W, H);
  g.globalAlpha = 1; g.drawImage(paint(135, 240, fbm(135, 240, { scale: 40, oct: 3, seed: seed + 2 }), (v) => [...fibre, Math.round(v * 14)]), 0, 0, W, H);
  for (let i = 0; i < specks; i++) { g.fillStyle = `rgba(${fibre.map((x) => x >> 1)},${0.1 + R() * 0.22})`; g.beginPath(); g.arc(R() * W, R() * H, 0.4 + R() * 1.3, 0, 6.2832); g.fill(); }
  return g;
}

/** Ink is not a vector: an SVG displacement filter, used as filter: url(#id). */
export function filter(stage, id, { freq = 0.85, scale = 2.6, seed = 7, oct = 2 } = {}) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.style.position = 'absolute';
  svg.innerHTML = `<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="${oct}" seed="${seed}"/><feDisplacementMap in="SourceGraphic" scale="${scale}"/></filter>`;
  stage.appendChild(svg);
  return `url(#${id})`;
}

/** The printer's marks: crop marks at the corners and a registration target. */
export function marks(g, color, { alpha = 0.5, m = 72, L = 34, target = [540, 150] } = {}) {
  g.save(); g.strokeStyle = color; g.globalAlpha = alpha; g.lineWidth = 2;
  [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]].forEach(([x, y, dx, dy]) => {
    g.beginPath(); g.moveTo(x - dx * 14, y); g.lineTo(x - dx * (14 + L), y); g.moveTo(x, y - dy * 14); g.lineTo(x, y - dy * (14 + L)); g.stroke();
  });
  if (target) { const [x, y] = target; g.beginPath(); g.arc(x, y, 11, 0, 6.2832); g.moveTo(x - 20, y); g.lineTo(x + 20, y); g.moveTo(x, y - 20); g.lineTo(x, y + 20); g.stroke(); }
  g.restore();
}

/** The words of a line, ' / ' marking a break. */
export const wordsOf = (text) => text.split(' ').filter((w) => w !== '/');

/**
 * A line typeset as two ink plates, overprinted (multiply). inks: [first, second];
 * em: word indexes printed in emInk on the second plate. Returns { slot, layers: [spans[], spans[]] }.
 * The slot is centred on `top` of its parent.
 */
export function plates(parent, text, { style = {}, inks, em = [], emInk, blend = 'multiply' } = {}) {
  const slot = el('div', '', { position: 'absolute', left: 0, right: 0, top: 0, transform: 'translateY(-50%)', ...style }, parent);
  el('div', '', { visibility: 'hidden' }, slot, text.replace(/ \/ /g, '<br>'));
  const layers = inks.map((ink, k) => {
    const lay = el('div', '', { position: 'absolute', left: 0, top: 0, right: 0, mixBlendMode: blend }, slot), out = [];
    text.split(' ').forEach((w, j, all) => {
      if (w === '/') { lay.appendChild(document.createElement('br')); return; }
      const i = out.length;
      out.push(el('span', '', { display: 'inline-block', opacity: 0, color: k && em.includes(i) ? emInk : ink }, lay, w));
      if (j < all.length - 1 && all[j + 1] !== '/') lay.appendChild(document.createTextNode(' '));
    });
    return out;
  });
  return { slot, layers };
}

/** A print pass: plate k of a word flies in off register and slams home at time w. reg scales the resting misregistration. */
export function pass(e, k, t, w, { reg = 1, fly = 1 } = {}) {
  if (t < w) { e.style.opacity = 0; return; }
  const f = ease.outBack(prog(t, w, w + 0.42)), fc = Math.min(1, f);
  const from = (k === 0 ? [-46, -26] : [42, 30]).map((v) => v * fly), rest = (k === 0 ? [-1.6, 1] : [1.6, -1]).map((v) => v * reg);
  e.style.opacity = Math.min(1, (t - w) / 0.08);
  e.style.transform = `translate(${lerp(from[0], rest[0], f)}px, ${lerp(from[1], rest[1], f)}px) scale(${lerp(1.12, 1, fc)}) rotate(${(1 - fc) * (k ? 3 : -3) * fly}deg)`;
}

/** A developed word (a photographic print): fades up from a blur, no flight. */
export function develop(e, t, w, dur = 0.7) {
  const p = ease.outCubic(prog(t, w, w + dur));
  e.style.opacity = p; e.style.filter = p < 1 ? `blur(${(1 - p) * 10}px)` : 'none';
  e.style.transform = `translateY(${(1 - p) * 8}px)`;
}

/** A line's words out as the next line arrives: the plates slide apart and lift. */
export function leave(lay, k, t, at) {
  const out = ease.inCubic(prog(t, at - 0.2, at + 0.25));
  lay.style.opacity = 1 - out;
  lay.style.transform = `translate(${(k ? 1 : -1) * 14 * out}px, ${-26 * out}px)`;
  return out;
}

/** A rubber stamp: the address in a rounded frame, set down a little askew. Animate with stampIn. */
export function stamp(stage, text, { top, ink, border = ink, size = 30, tilt = -2.5, style = {}, filterUrl } = {}) {
  const wrap = el('div', 'abs', { left: 0, right: 0, top: `${top}px`, display: 'flex', justifyContent: 'center', opacity: 0, ...(filterUrl ? { filter: filterUrl } : {}) }, stage);
  const s = el('div', '', { padding: `${size * 0.66}px ${size * 1.33}px ${size * 0.66}px ${size * 1.66}px`, border: `4px solid ${border}`, borderRadius: '999px', fontFamily: 'Inter', fontWeight: 700, fontSize: `${size}px`, letterSpacing: '0.34em', color: ink, mixBlendMode: 'multiply', ...style }, wrap, text);
  return { wrap, s, tilt };
}
export function stampIn(st, t, at) {
  const p = prog(t, at, at + 0.22), b = ease.outBack(p);
  st.wrap.style.opacity = Math.min(1, p * 4);
  st.s.style.transform = `scale(${lerp(1.5, 1, Math.min(1, b))}) rotate(${lerp(st.tilt * 3.6, st.tilt, b)}deg)`;
}

/** A label between two short rules, in tracked caps. Animate with labelIn. */
export function label(stage, text, { top, ink, size = 22, blend = 'multiply', track = 0.42 } = {}) {
  const box = el('div', 'abs', { left: 0, right: 0, top: `${top}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '26px', fontFamily: 'Inter', fontWeight: 600, fontSize: `${size}px`, color: ink, mixBlendMode: blend, opacity: 0 }, stage);
  const rules = [0, 1].map(() => el('div', '', { width: '64px', height: '2px', background: ink }, box));
  const txt = el('div', '', { letterSpacing: `${track}em`, marginRight: `-${track}em`, whiteSpace: 'nowrap' }, box, text);
  box.insertBefore(txt, rules[1]);
  return { box, rules, txt, track };
}
export function labelIn(l, t, at) {
  const p = ease.outCubic(prog(t, at, at + 0.7));
  l.box.style.opacity = p; l.txt.style.letterSpacing = `${l.track + (1 - p) * 0.25}em`;
  l.rules.forEach((e, k) => { e.style.transform = `scaleX(${p})`; e.style.transformOrigin = k ? 'left' : 'right'; });
}

/** The colophon along the foot of the sheet: two small lines of print, drawn in left to right. */
export function colophon(stage, left, right, { ink, top = 1742 } = {}) {
  const c = el('div', 'abs', { left: '120px', right: '120px', top: `${top}px`, display: 'flex', justifyContent: 'space-between', paddingTop: '18px', borderTop: `2px solid ${ink}`, fontFamily: 'Inter', fontWeight: 600, fontSize: '17px', letterSpacing: '0.3em', color: ink, opacity: 0 }, stage);
  el('span', '', {}, c, left); el('span', '', {}, c, right);
  return c;
}
export function colophonIn(c, t, at, alpha = 0.75) {
  const p = ease.outCubic(prog(t, at, at + 0.6));
  c.style.opacity = alpha * p; c.style.clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`;
}

/**
 * The voice under the words: one note per word (the last falls), and a soft
 * thock as the line lands. `inst` picks the timbre: blip (the orb), pluck, bell.
 */
export function voice(c, lines, { stag = 0.12, scale = [72, 74, 76, 79, 81, 84, 86, 88], inst = 'blip', g = 0.24, thock = 170, drop = 5 } = {}) {
  lines.forEach((line, li) => {
    const ws = wordsOf(line.text);
    ws.forEach((_, i) => {
      const last = i === ws.length - 1, n = scale[(li * 3 + i * 2) % scale.length] - (last ? drop : 0), t = line.t + i * stag;
      c.push(inst === 'blip' ? { i: 'blip', t, n, g, dur: last ? 0.16 : 0.1, slide: last ? -2 : 3 } : { i: inst, t, n, g, dur: last ? 1.6 : 0.9 });
    });
    if (thock) c.push({ i: 'tom', t: line.t + ws.length * stag + 0.18, f: thock, g: 0.16, verb: 0.2, d: 0.1 });
  });
  return c;
}
