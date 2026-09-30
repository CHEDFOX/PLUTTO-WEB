/**
 * ORB · THE SHEET — v3, a risograph. A sheet of paper; the voice orb is PRINTED
 * on it: three fluorescent ink plates (pink, blue, yellow), each a halftone
 * screen at its own angle, overprinting into the orb's own colours (pink+blue =
 * violet, blue+yellow = green, pink+yellow = orange). When it speaks the plates
 * shake out of register. Every word arrives as two ink plates that slam into
 * register — a print pass — and the sheet fills into a finished poster of what
 * it said. At the end the orb's screens close into the Plutto ring.
 */
import { el, prog, ease, lerp, rng, W, H } from '../lib.js';
import { fbm, paint } from '../shots.js';

const PAPER = '#F6F1E7';
const INK = { pink: '#FF48B0', blue: '#2F6FE0', yellow: '#FFD900' };
const STAG = 0.12;
// One line on the sheet at a time, small, with the paper around it. em: the
// word printed hot (pink + yellow). ' / ' is a line break.
const SAY = [
  { t: 0.9, text: 'hey.', font: 'g', size: 64, em: 0 },
  { t: 2.2, text: 'you took the long way / home again.', font: 'i', size: 66, em: 4 },
  { t: 5.0, text: 'radio off.', font: 'g', size: 56, em: 1 },
  { t: 6.4, text: 'still thinking about it.', font: 'i', size: 66, em: 1 },
  { t: 8.6, text: 'say it out loud.', font: 'g', size: 58, em: 3 },
  { t: 11.3, text: 'i’m listening.', font: 'i', size: 72, em: 1 },
];
const BRAND = 14.4, END = 18;
const OX = 540, OY = 1400, OR = 150;
const LINE_Y = 720;   // where each line is printed
const PENTA = [72, 74, 76, 79, 81, 84, 86, 88];
// Three plates: colour, screen angle, resting misregistration, the way it shakes.
const PLATES = [
  { ink: INK.pink, ang: 75, off: [-2.5, 1.5], dir: [-1, -0.4], seed: 1, w: 0.9, ring: true },
  { ink: INK.blue, ang: 15, off: [2.5, -1], dir: [0.9, 0.6], seed: 2, w: 0.85, ring: true },
  { ink: INK.yellow, ang: 0, off: [0, 2.5], dir: [0.2, -1], seed: 3, w: 0.7, ring: false },
];
let S = {};

/** Ink density of a plate at a point on the sphere: lit like a ball, stirred by moving blobs. */
function makeDensity(seed, weight) {
  const R = rng(seed * 17), blobs = Array.from({ length: 3 }, () => ({ a: 0.4 + R() * 0.7, b: 0.3 + R() * 0.8, pa: R() * 6.28, pb: R() * 6.28, w: 0.18 + R() * 0.14 }));
  return (u, v, rr, t) => {
    const nz = Math.sqrt(Math.max(0, 1 - rr));
    const lam = Math.max(0, -0.45 * u - 0.55 * v + 0.7 * nz);
    const tone = 0.16 + 0.62 * (1 - lam) + (rr > 0.86 ? (rr - 0.86) * 1.6 : 0);   // shadow side and rim carry more ink
    const spec = Math.exp(-((u + 0.38) ** 2 + (v + 0.44) ** 2) / 0.035);              // the highlight is bare paper
    let b = 0;
    for (const k of blobs) {
      const bx = Math.sin(t * k.a + k.pa) * 0.55, by = Math.cos(t * k.b + k.pb) * 0.55;
      b += Math.exp(-((u - bx) ** 2 + (v - by) ** 2) / k.w);
    }
    return weight * tone * (0.06 + 0.94 * Math.min(1, b * 0.8)) * (1 - spec);
  };
}

/** One plate of the orb, as a halftone: dot area = ink density at that point. */
function halftone(g, p, cx, cy, r, t, gone, spacing = 9.5) {
  const a = (p.ang * Math.PI) / 180, ca = Math.cos(a), sa = Math.sin(a), n = Math.ceil(r / spacing) + 1;
  g.fillStyle = p.ink; g.beginPath();
  for (let i = -n; i <= n; i++) for (let j = -n; j <= n; j++) {
    const gx = i * spacing, gy = j * spacing, x = gx * ca - gy * sa, y = gx * sa + gy * ca;
    const u = x / r, v = y / r, rr = u * u + v * v;
    if (rr > 1) continue;
    let d = p.density(u, v, rr, t);
    if (gone > 0.02) d = Math.sqrt(rr) < 0.5 * gone ? 0 : lerp(d, p.ring ? 1 : 0, gone);   // closing into the ring: pink over blue, a paper hole
    if (d < 0.03) continue;
    const rad = spacing * 0.64 * Math.sqrt(Math.min(1, d)), X = cx + x, Y = cy + y;
    g.moveTo(X + rad, Y); g.arc(X, Y, rad, 0, 6.2832);
  }
  g.fill();
}

export default {
  duration: END,
  poster: 13.2,
  score() {
    const c = [
      { i: 'pad', t: 0, end: BRAND, ns: [57, 64, 69, 71], g: 0.05, bright: 900, verb: 0.6 },
      { i: 'whoosh', t: 0.05, dur: 0.6, g: 0.16, from: 0, to: 0 },
      { i: 'bell', t: 0.35, n: 88, g: 0.06, dur: 2.5 },
      { i: 'reverse', end: BRAND, dur: 0.8, g: 0.22 },
      { i: 'hit', t: BRAND, g: 0.35 }, { i: 'sting', t: BRAND + 0.05, g: 0.8 },
      { i: 'pad', t: BRAND, end: END, ns: [57, 64, 69], g: 0.04 },
      { i: 'tom', t: BRAND + 1.0, f: 150, g: 0.3, verb: 0.25, d: 0.14 },           // the mark, stamped
    ];
    for (let k = 2; k < 24; k++) {                       // a light, dry beat under the voice
      const t = k * 0.6;
      c.push(k % 2 === 0 ? { i: 'kick', t, g: 0.3 } : { i: 'snare', t, g: 0.15, verb: 0.35 });
      c.push({ i: 'hat', t, g: 0.09, p: -0.3 }, { i: 'hat', t: t + 0.3, g: 0.06, p: 0.3 });
    }
    SAY.forEach((line, li) => {
      const ws = line.text.split(' ').filter((w) => w !== '/');
      ws.forEach((w, i) => {
        const last = i === ws.length - 1;
        c.push({ i: 'blip', t: line.t + i * STAG, n: PENTA[(li * 3 + i * 2) % PENTA.length] - (last ? 5 : 0), g: 0.24, dur: last ? 0.16 : 0.1, slide: last ? -2 : 3 });
      });
      // the print pass lands: a soft drum thock as the line comes into register
      c.push({ i: 'tom', t: line.t + ws.length * STAG + 0.18, f: 170, g: 0.16, verb: 0.2, d: 0.1 });
    });
    return c;
  },
  async setup(stage) {
    stage.style.background = PAPER;
    PLATES.forEach((p) => { p.density = makeDensity(p.seed, p.w); });
    // Paper: fibre, a faint uneven wash, a few specks.
    const R = rng(8);
    const bg = el('canvas', 'layer', {}, stage); bg.width = W; bg.height = H; const b = bg.getContext('2d');
    b.fillStyle = PAPER; b.fillRect(0, 0, W, H);
    b.globalAlpha = 0.5; b.drawImage(paint(270, 480, fbm(270, 480, { scale: 2, oct: 2, seed: 4 }), (v) => [70, 55, 40, Math.round(Math.abs(v - 0.5) * 30)]), 0, 0, W, H);
    b.globalAlpha = 1; b.drawImage(paint(135, 240, fbm(135, 240, { scale: 40, oct: 3, seed: 6 }), (v) => [120, 100, 80, Math.round(v * 14)]), 0, 0, W, H);
    for (let i = 0; i < 260; i++) { b.fillStyle = `rgba(60,45,35,${0.1 + R() * 0.25})`; b.beginPath(); b.arc(R() * W, R() * H, 0.4 + R() * 1.3, 0, 6.2832); b.fill(); }
    // The printer's marks — crop marks at the corners, one registration target — the only other ink on the sheet.
    b.strokeStyle = INK.blue; b.globalAlpha = 0.55; b.lineWidth = 2;
    const m = 72, L = 34;
    [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]].forEach(([x, y, dx, dy]) => {
      b.beginPath(); b.moveTo(x - dx * 14, y); b.lineTo(x - dx * (14 + L), y); b.moveTo(x, y - dy * 14); b.lineTo(x, y - dy * (14 + L)); b.stroke();
    });
    b.beginPath(); b.arc(540, 150, 11, 0, 6.2832); b.moveTo(520, 150); b.lineTo(560, 150); b.moveTo(540, 130); b.lineTo(540, 170); b.stroke();
    b.globalAlpha = 1;
    // The ink layer: plates composited here, multiplied onto the paper.
    const cv = el('canvas', 'layer', { mixBlendMode: 'multiply' }, stage); cv.width = W; cv.height = H; S.g = cv.getContext('2d');
    S.plates = PLATES.map(() => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; });
    // Ink is not a vector: a displacement filter roughens every printed edge.
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.style.position = 'absolute';
    svg.innerHTML = '<filter id="ink" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="2.6"/></filter>';
    stage.appendChild(svg);
    // The poster: every line typeset twice, once per plate, overprinted.
    S.poster = el('div', 'abs', { left: '180px', top: `${LINE_Y}px`, width: '720px', textAlign: 'center', filter: 'url(#ink)' }, stage);
    const style = (l) => ({ fontSize: `${l.size}px`, lineHeight: 1.12,
      ...(l.font === 'g' ? { fontFamily: 'Inter', fontWeight: 600, letterSpacing: '-0.02em' } : { fontFamily: 'Cormorant', fontWeight: 500, fontStyle: 'italic' }) });
    S.lines = SAY.map((l) => {
      const slot = el('div', '', { position: 'absolute', left: 0, right: 0, top: 0, transform: 'translateY(-50%)', ...style(l) }, S.poster);
      el('div', '', { visibility: 'hidden' }, slot, l.text.replace(' / ', '<br>'));   // holds the line's height
      const layers = [0, 1].map((k) => {
        const lay = el('div', '', { position: 'absolute', left: 0, top: 0, right: 0, mixBlendMode: 'multiply' }, slot);
        const out = [];
        l.text.split(' ').forEach((w, j, all) => {
          if (w === '/') { lay.appendChild(document.createElement('br')); return; }
          const i = out.length;
          out.push(el('span', '', { display: 'inline-block', opacity: 0, color: k === 0 ? INK.pink : (i === l.em ? INK.yellow : INK.blue) }, lay, w));
          if (j < all.length - 1 && all[j + 1] !== '/') lay.appendChild(document.createTextNode(' '));
        });
        return out;
      });
      return { cfg: l, layers };
    });
    // The mark, printed at the end.
    S.brand = el('div', 'abs', { left: 0, right: 0, top: '860px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '26px', filter: 'url(#ink)' }, stage);
    S.slot = el('div', '', { width: '84px', height: '84px' }, S.brand);
    S.wm = el('div', '', { position: 'relative', fontFamily: 'Inter', fontSize: '92px', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1 }, S.brand);
    el('div', '', { visibility: 'hidden' }, S.wm, 'Plutto');
    S.wmp = [INK.pink, INK.blue].map((c) => el('div', '', { position: 'absolute', left: 0, top: 0, color: c, mixBlendMode: 'multiply', opacity: 0 }, S.wm, 'Plutto'));
    S.tag = el('div', 'abs', { left: 0, right: 0, top: '990px', textAlign: 'center', fontFamily: 'Cormorant', fontStyle: 'italic', fontWeight: 500, fontSize: '42px', color: INK.blue, mixBlendMode: 'multiply', opacity: 0, filter: 'url(#ink)' }, stage, 'five thousand years old. talks back.');
    S.url = el('div', 'abs', { left: 0, right: 0, top: '1062px', textAlign: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: '20px', letterSpacing: '0.4em', color: INK.pink, mixBlendMode: 'multiply', opacity: 0 }, stage, 'PLUTTO.SPACE');
  },
  async frame(t) {
    // The kick of the latest word.
    let hit = 0;
    SAY.forEach((l) => l.text.split(' ').filter((w) => w !== '/').forEach((_, i) => { const w = l.t + i * STAG; if (t >= w && t < w + 0.3) hit = Math.max(hit, Math.pow(1 - (t - w) / 0.3, 2)); }));
    // The orb: rises in; shakes out of register as it speaks; closes into the ring at the end.
    if (!S.dest) { const r = S.slot.getBoundingClientRect(); S.dest = { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
    const inK = ease.outCubic(prog(t, 0, 1.2)), gone = ease.inOutCubic(prog(t, BRAND, BRAND + 1.0));
    const cx = lerp(OX, S.dest.x, gone), cy = lerp(OY + (1 - inK) * 700, S.dest.y, gone);
    const r = lerp(OR * (1 + 0.025 * Math.sin(t * 2.4) + 0.05 * hit), 42, gone);
    const g = S.g; g.clearRect(0, 0, W, H);
    PLATES.forEach((p, k) => {
      const c = S.plates[k], pg = c.getContext('2d'); pg.clearRect(0, 0, W, H);
      const shake = (1 - gone) * (16 * hit + 2.5 * Math.sin(t * 1.7 + k * 2));
      halftone(pg, p, cx + p.off[0] * (1 - gone) + p.dir[0] * shake, cy + p.off[1] * (1 - gone) + p.dir[1] * shake, r, t, gone, lerp(8.5, 4.2, gone));
      // Sound rings: dotted, printed on the pink and blue plates, leaving the orb when a line begins.
      if (k < 2 && gone < 1) SAY.forEach((l) => {
        const kk = (t - l.t - k * 0.18) / 1.8; if (kk < 0 || kk > 1) return;
        const rad = r * 1.08 + kk * 520, dots = Math.floor(rad / 10);
        pg.fillStyle = p.ink; pg.beginPath();
        for (let i = 0; i < dots; i++) {
          const a = (i / dots) * 6.2832, dr = 2.4 * (1 - kk) * (0.6 + 0.4 * Math.sin(i * 1.7 + t * 6)); if (dr < 0.4) continue;
          const x = cx + Math.cos(a) * rad, y = cy + Math.sin(a) * rad; pg.moveTo(x + dr, y); pg.arc(x, y, dr, 0, 6.2832);
        }
        pg.fill();
      });
      g.globalCompositeOperation = k ? 'multiply' : 'source-over';
      g.drawImage(c, 0, 0);
    });
    g.globalCompositeOperation = 'source-over';
    // The poster: each word's two plates slam into register; the page fills and stays — it is the art.
    const pass = (e, k, w) => {
      if (t < w) { e.style.opacity = 0; return; }
      const f = ease.outBack(prog(t, w, w + 0.42)), fc = Math.min(1, f);
      const from = k === 0 ? [-46, -26] : [42, 30], rest = k === 0 ? [-1.6, 1] : [1.6, -1];
      e.style.opacity = Math.min(1, (t - w) / 0.08);
      e.style.transform = `translate(${lerp(from[0], rest[0], f)}px, ${lerp(from[1], rest[1], f)}px) scale(${lerp(1.12, 1, fc)}) rotate(${(1 - fc) * (k ? 3 : -3)}deg)`;
    };
    S.lines.forEach(({ cfg: l, layers }, li) => {
      const next = SAY[li + 1]?.t ?? BRAND, out = ease.inCubic(prog(t, next - 0.2, next + 0.25));
      layers.forEach((spans, k) => {
        spans.forEach((sp, i) => pass(sp, k, l.t + i * STAG));
        const lay = spans[0].parentNode;
        lay.style.opacity = 1 - out;
        lay.style.transform = `translate(${(k ? 1 : -1) * 14 * out}px, ${-26 * out}px)`;
      });
    });
    // The mark: the ring is the orb, closed; the word prints in two passes; then the line and the address.
    S.wmp.forEach((e, k) => pass(e, k, BRAND + 0.9 + k * 0.1));
    const tg = ease.outCubic(prog(t, BRAND + 1.5, BRAND + 2.1));
    S.tag.style.opacity = tg; S.tag.style.transform = `translateY(${(1 - tg) * 16}px)`;
    const u = ease.outCubic(prog(t, BRAND + 2.0, BRAND + 2.5));
    S.url.style.opacity = u; S.url.style.letterSpacing = `${0.4 + (1 - u) * 0.2}em`;
  },
};
