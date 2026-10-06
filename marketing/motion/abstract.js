/**
 * ABSTRACT — modern art, set to music. Each film paints in one movement's
 * hand (Kandinsky's Bauhaus compositions, Hilma af Klint's temple paintings,
 * Suprematism's flying planes) on a sheet of paper, and its song is written
 * together with its picture: one function returns the cue list AND the
 * shapes, so every mark lands on the note that made it.
 *
 * The kit: a paper sheet with an ink layer over it (multiplied, with a slight
 * hand-drawn wobble), shape primitives that draw themselves as p goes 0 → 1,
 * lines of type that come and go, and the end card.
 */
import { el, set, prog, ease, lerp, rng, W, H, spring } from './lib.js';
import { paper, filter } from './print.js';

export { el, set, prog, ease, lerp, rng, W, H, spring };

/** Paper and an ink canvas over it. Returns the 2D context the shapes draw on. */
export function sheet(stage, { color = '#efe8d8', fibre = [110, 92, 70], wobble = 1.6, seed = 9 } = {}) {
  paper(stage, { color, fibre, wash: 0.5, seed });
  const url = filter(stage, `wob${seed}`, { freq: 0.03, scale: wobble * 3, seed, oct: 2 });
  const cv = el('canvas', 'layer', { mixBlendMode: 'multiply', filter: url }, stage); cv.width = W; cv.height = H;
  const g = cv.getContext('2d'); g.lineCap = 'round'; g.lineJoin = 'round';
  return g;
}

const TAU = Math.PI * 2;
// shapes: each draws itself as p goes 0 → 1 (p may overshoot a little for a spring)
export const draw = {
  disc(g, { x, y, r, c }, p) { if (p <= 0) return; g.fillStyle = c; g.beginPath(); g.arc(x, y, r * p, 0, TAU); g.fill(); },
  ring(g, { x, y, r, w = 8, c }, p) { if (p <= 0) return; g.strokeStyle = c; g.lineWidth = w; g.beginPath(); g.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + TAU * Math.min(1, p)); g.stroke(); },
  half(g, { x, y, r, c, a = 0 }, p) { if (p <= 0) return; g.fillStyle = c; g.beginPath(); g.arc(x, y, r * Math.min(1.05, p), a, a + Math.PI); g.closePath(); g.fill(); },
  bar(g, { x, y, len, w, a, c }, p) { if (p <= 0) return; g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = c; g.fillRect(0, -w / 2, len * Math.min(1, p), w); g.restore(); },
  line(g, { x, y, len, a, w = 4, c }, p) { if (p <= 0) return; g.strokeStyle = c; g.lineWidth = w; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * len * Math.min(1, p), y + Math.sin(a) * len * Math.min(1, p)); g.stroke(); },
  tri(g, { x, y, r, a = 0, c }, p) { if (p <= 0) return; g.fillStyle = c; g.beginPath(); for (let k = 0; k < 3; k++) { const q = a + (k / 3) * TAU - Math.PI / 2; g.lineTo(x + Math.cos(q) * r * p, y + Math.sin(q) * r * p); } g.closePath(); g.fill(); },
  arc(g, { x, y, r, a0, a1, w = 14, c }, p) { if (p <= 0) return; g.strokeStyle = c; g.lineWidth = w; g.beginPath(); g.arc(x, y, r, a0, a0 + (a1 - a0) * Math.min(1, p)); g.stroke(); },
  rect(g, { x, y, w, h, a = 0, c }, p) { if (p <= 0) return; g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = c; const s = Math.min(1.08, p); g.fillRect((-w / 2) * s, (-h / 2) * s, w * s, h * s); g.restore(); },
  checker(g, { x, y, n = 5, s = 30, c, seed = 1 }, p) {
    if (p <= 0) return; const R = rng(seed); g.fillStyle = c;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if ((i + j) % 2 === 0 && R() < p * 1.2) g.fillRect(x + i * s, y + j * s, s, s);
  },
  spiral(g, { x, y, r, turns = 3, w = 12, c, a = 0 }, p) {
    if (p <= 0) return; g.strokeStyle = c; g.lineWidth = w; g.beginPath();
    const n = Math.floor(240 * Math.min(1, p));
    for (let k = 0; k <= n; k++) { const s = k / 240, q = a + s * turns * TAU, rr = r * s; g.lineTo(x + Math.cos(q) * rr, y + Math.sin(q) * rr); }
    g.stroke();
  },
  petals(g, { x, y, r, n = 8, c, c2, a = 0 }, p) {
    if (p <= 0) return;
    for (let k = 0; k < n; k++) { const q = a + (k / n) * TAU, s = Math.min(1, p * 1.4 - k / n * 0.4); if (s <= 0) continue; g.save(); g.translate(x, y); g.rotate(q); g.fillStyle = k % 2 && c2 ? c2 : c; g.beginPath(); g.ellipse(0, -r * 0.55 * s, r * 0.2 * s, r * 0.45 * s, 0, 0, TAU); g.fill(); g.restore(); }
  },
};

/** Paint a list of marks [{ k: kind, at, dur, ...props }] at time t. */
export function paintAll(g, marks, t, { pop = true } = {}) {
  for (const m of marks) {
    if (t < m.at || (m.until !== undefined && t > m.until)) continue;
    const q = prog(t, m.at, m.at + (m.dur ?? 0.22));
    const p = pop ? spring(q) : ease.outCubic(q);
    g.globalAlpha = m.alpha ?? 1;
    draw[m.k](g, m, p);
  }
  g.globalAlpha = 1;
}

/** Lines of type that come in, sit and go. kinds: big, mid, cap, hand, serif. */
export function captions(stage, list, { ink = '#151515' } = {}) {
  const F = { big: '900 120px/0.98 Inter', mid: '800 66px/1.08 Inter', cap: '500 28px/1.3 Mono', hand: '700 84px/1 Hand', serif: 'italic 500 92px/1.08 Cormorant' };
  return list.map((x) => {
    const e = el('div', 'abs', {
      left: `${x.x ?? 70}px`, right: x.right ?? '70px', top: `${x.y}px`, textAlign: x.align ?? 'left', opacity: 0, color: x.ink ?? ink,
      font: F[x.kind ?? 'mid'], letterSpacing: x.kind === 'big' ? '-0.05em' : x.kind === 'cap' ? '0.22em' : '-0.02em', textTransform: x.kind === 'cap' ? 'uppercase' : 'none', ...(x.style || {}),
    }, stage, x.html);
    return { ...x, e };
  });
}
export function showCaptions(cs, t) {
  for (const x of cs) {
    const p = ease.outCubic(prog(t, x.t0, x.t0 + 0.3)), o = 1 - ease.inCubic(prog(t, x.t1 - 0.25, x.t1));
    set(x.e, { o: t >= x.t0 && t < x.t1 ? p * o : 0, y: (1 - p) * 24, blur: (1 - p) * 6 });
  }
}

/** The end card: the composition steps back and Plutto's ring is painted, then the name, the line, the address. */
export function absEnd(stage, { ink = '#151515', paperColor = '#efe8d8', accent = '#d6402b', line = 'Ask yours.', sub } = {}) {
  const box = el('div', 'layer', { zIndex: 30, opacity: 0, background: paperColor }, stage);
  const cv = el('canvas', 'abs', { left: '290px', top: '300px', width: '500px', height: '500px' }, box); cv.width = cv.height = 500;
  const g = cv.getContext('2d'); g.lineCap = 'round';
  const word = el('div', 'abs center', { top: '880px', font: '900 150px/1 Inter', letterSpacing: '-0.055em', color: ink, opacity: 0 }, box, 'Plutto');
  const l = el('div', 'abs center', { top: '1080px', font: '800 66px/1.1 Inter', letterSpacing: '-0.02em', color: ink, opacity: 0 }, box, line);
  const c = el('div', 'abs', { left: '50%', top: '1240px', transform: 'translateX(-50%)', font: '600 42px/1 Inter', color: paperColor, background: ink, borderRadius: '999px', padding: '26px 56px', whiteSpace: 'nowrap', opacity: 0 }, box, 'plutto.space');
  const s = sub ? el('div', 'abs center', { top: '1350px', font: '500 24px/1.4 Mono', letterSpacing: '0.24em', textTransform: 'uppercase', color: ink, opacity: 0 }, box, sub) : null;
  return (t) => {
    box.style.opacity = ease.outCubic(prog(t, 0, 0.3));
    g.clearRect(0, 0, 500, 500);
    const r = ease.outCubic(prog(t, 0.1, 0.9));
    g.strokeStyle = ink; g.lineWidth = 64; g.beginPath(); g.arc(250, 250, 170, -Math.PI / 2, -Math.PI / 2 + TAU * r); g.stroke();
    const d = spring(prog(t, 0.7, 1.1));
    g.fillStyle = accent; g.beginPath(); g.arc(250 + 170 * Math.cos(-0.7), 250 + 170 * Math.sin(-0.7), 38 * d, 0, TAU); g.fill();
    [word, l, c, s].filter(Boolean).forEach((e, i) => { const q = ease.outCubic(prog(t, 0.5 + i * 0.15, 1.0 + i * 0.15)); e.style.opacity = q; e.style.translate = `0 ${(1 - q) * 30}px`; });
  };
}
