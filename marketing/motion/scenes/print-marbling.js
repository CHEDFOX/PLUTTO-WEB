/**
 * PRINT · MARBLING — ebru, done with the real mathematics of it (Jaffer's
 * marbling maps): every ink drop pushes all the ink before it outward, combs
 * drag parallel tines through the bath, a stylus swirls it. Each pixel is
 * found by running those operations backwards to the drop it came from, so
 * every frame is exact. Over the bath, a label pasted in like a bookplate on a
 * marbled endpaper; at the end two last drops (ink, then clear) print the ring.
 */
import { el, prog, ease, lerp, rng, W, H, fbm, paint, develop, stamp, stampIn, colophon, colophonIn, voice } from '../print.js';

const BATH = [241, 234, 218];
const K = { mag: [226, 0, 122], blue: [43, 59, 209], saff: [255, 176, 0], teal: [0, 160, 152], ink: [28, 24, 58], clear: BATH };
const SAY = [
  { t: 0.9, text: 'you already know / the answer.', em: [3, 4] },
  { t: 3.7, text: 'you just want to hear it / said out loud,', em: [7] },
  { t: 6.7, text: 'by something / with no reason to lie.', em: [6] },
];
const BRAND = 10.8, END = 16;
const RW = 540, RH = 960, SC = W / RW;
const RING = { x: 540, y: 590 };
const STAG = 0.14;
const drop = (x, y, r, col, t0, d = 0.6) => ({ k: 'drop', x, y, r, col: K[col], t0, t1: t0 + d });
// The bath's history, in order.
const OPS = [
  drop(540, 700, 250, 'mag', 0.15), drop(250, 300, 170, 'teal', 0.45), drop(860, 360, 150, 'blue', 0.7), drop(540, 700, 160, 'saff', 0.95),
  drop(210, 1180, 160, 'saff', 1.2), drop(880, 1230, 190, 'mag', 1.45), drop(540, 700, 92, 'blue', 1.7), drop(620, 1540, 130, 'ink', 1.95),
  drop(330, 1660, 170, 'teal', 2.2), drop(860, 360, 80, 'clear', 2.45), drop(250, 300, 70, 'saff', 2.65), drop(880, 1230, 90, 'clear', 2.85),
  drop(540, 700, 40, 'clear', 3.05), drop(160, 760, 120, 'blue', 3.25), drop(940, 820, 110, 'teal', 3.45),
  ...(() => { const R = rng(41), cols = ['teal', 'saff', 'blue', 'mag', 'teal', 'saff', 'ink'];            // then a shower of small drops, until the bath is covered
    return Array.from({ length: 26 }, (_, i) => drop(80 + R() * 920, 90 + R() * 1740, 55 + R() * 60, cols[i % cols.length], 2.2 + i * 0.065, 0.45)); })(),
  { k: 'comb', at: [0, 0], m: [1, 0], space: 120, a: 95, l: 16, t0: 4.0, t1: 6.2 },        // a comb, left to right
  { k: 'comb', at: [0, 40], m: [0, 1], space: 150, a: 70, l: 22, t0: 6.3, t1: 8.3 },       // and down
  { k: 'swirl', c: [540, 760], a: 2.4, f: 320, t0: 8.2, t1: 10.6 },                       // a stylus, round
  drop(RING.x, RING.y, 300, 'ink', BRAND + 0.1, 0.8), drop(RING.x, RING.y, 182, 'clear', BRAND + 0.75, 0.7),   // the ring
];
let S = {};

export default {
  duration: END,
  poster: END - 0.3,
  score() {
    const c = [
      { i: 'room', t: 0, end: END, g: 0.04 },
      { i: 'pad', t: 0, end: END, ns: [50, 57, 62], g: 0.06, bright: 480, verb: 0.8 },    // a drone, like a tanpura
      { i: 'whoosh', t: 4.0, dur: 2.2, g: 0.08, from: -0.8, to: 0.8 }, { i: 'whoosh', t: 6.3, dur: 2.0, g: 0.07, from: 0.6, to: -0.6 },
      { i: 'riser', t: 8.4, end: BRAND, g: 0.1 },
      { i: 'sting', t: BRAND + 0.1, g: 0.7 },
      { i: 'tom', t: BRAND + 3.12, f: 190, g: 0.22, verb: 0.2, d: 0.1 },
    ];
    OPS.filter((o) => o.k === 'drop').forEach((o, i) => c.push({ i: 'blip', t: o.t0, n: [67, 64, 69, 62, 71, 66, 72][i % 7] - (o.r > 200 ? 7 : 0), g: 0.05 + 0.08 * Math.min(1, o.r / 200), dur: 0.07, slide: -9 }));   // each drop, a plink
    return voice(c, SAY, { stag: STAG, inst: 'pluck', scale: [69, 72, 74, 76, 79, 81], g: 0.12, thock: 0 });
  },
  async setup(stage) {
    stage.style.background = `rgb(${BATH})`;
    // The bath, computed small and laid over the sheet; the paper's grain printed through it.
    S.small = document.createElement('canvas'); S.small.width = RW; S.small.height = RH;
    S.sg = S.small.getContext('2d'); S.img = S.sg.createImageData(RW, RH);
    const cv = el('canvas', 'layer', {}, stage); cv.width = W; cv.height = H; S.g = cv.getContext('2d');
    S.g.imageSmoothingQuality = 'high';
    const grainC = el('canvas', 'layer', { mixBlendMode: 'multiply' }, stage); grainC.width = W; grainC.height = H;
    const gg = grainC.getContext('2d');
    gg.drawImage(paint(135, 240, fbm(135, 240, { scale: 40, oct: 3, seed: 16 }), (v) => [255 - v * 40, 250 - v * 45, 240 - v * 50, 255]), 0, 0, W, H);
    // The label, pasted on like a bookplate: cream card, a double rule, a paper shadow.
    S.card = el('div', 'abs', { left: '140px', width: '800px', top: '1020px', height: '330px', background: '#F7F1E3', boxShadow: '0 18px 40px rgba(20,16,40,0.28), 0 3px 8px rgba(20,16,40,0.2)', transform: 'rotate(-1deg)', opacity: 0 }, stage);
    el('div', 'abs', { left: '16px', right: '16px', top: '16px', bottom: '16px', border: '2px solid #1C183A' }, S.card);
    el('div', 'abs', { left: '24px', right: '24px', top: '24px', bottom: '24px', border: '1px solid #1C183A' }, S.card);
    const line = { fontFamily: 'Cormorant', fontStyle: 'italic', fontWeight: 600, color: '#1C183A', textAlign: 'center', lineHeight: 1.1 };
    S.lines = SAY.map((l) => {
      const box = el('div', 'abs', { left: '40px', right: '40px', top: '50%', transform: 'translateY(-50%)', fontSize: '62px', ...line }, S.card);
      const spans = [];
      l.text.split(' ').forEach((w, j, all) => {
        if (w === '/') { box.appendChild(document.createElement('br')); return; }
        const i = spans.length;
        spans.push(el('span', '', { display: 'inline-block', opacity: 0, color: l.em.includes(i) ? `rgb(${K.mag})` : undefined }, box, w));
        if (j < all.length - 1 && all[j + 1] !== '/') box.appendChild(document.createTextNode(' '));
      });
      return { box, spans };
    });
    S.wm = el('div', 'abs', { left: 0, right: 0, top: '62px', textAlign: 'center', fontFamily: 'Inter', fontWeight: 800, fontSize: '134px', letterSpacing: '-0.05em', lineHeight: 1, color: '#1C183A', opacity: 0 }, S.card, 'Plutto');
    S.tag = el('div', 'abs', { left: 0, right: 0, top: '206px', textAlign: 'center', fontSize: '64px', ...line }, S.card);
    S.tagw = ['hear', 'it', 'said.'].map((w, i) => { if (i) S.tag.appendChild(document.createTextNode(' ')); return el('span', '', { display: 'inline-block', opacity: 0, color: i === 2 ? `rgb(${K.mag})` : undefined }, S.tag, w); });
    S.stamp = stamp(stage, 'PLUTTO.SPACE', { top: 1384, ink: '#1C183A', border: '#1C183A', size: 26, style: { background: '#F7F1E3', mixBlendMode: 'normal' } });
    S.colo = colophon(stage, 'EBRU — INK ON WATER, PULLED ONCE', 'N° 005', { ink: '#1C183A' });
    S.colo.style.background = 'rgba(247,241,227,0.86)'; S.colo.style.padding = '18px 20px 14px'; S.colo.style.left = '100px'; S.colo.style.right = '100px';
  },
  async frame(t) {
    // Which operations have begun, and how far along each is.
    const live = OPS.filter((o) => t >= o.t0).map((o) => ({ ...o, p: ease.outCubic(prog(t, o.t0, o.t1)) })).reverse();
    const d = S.img.data;
    for (let j = 0; j < RH; j++) for (let i = 0; i < RW; i++) {
      let x = (i + 0.5) * SC, y = (j + 0.5) * SC, col = BATH;
      for (const o of live) {                             // run the history backwards to the drop this point came from
        if (o.k === 'drop') {
          const R = o.r * Math.sqrt(o.p); if (R <= 0) continue;
          const dx = x - o.x, dy = y - o.y, dd = dx * dx + dy * dy;
          if (dd < R * R) { col = o.col; break; }
          const f = Math.sqrt(1 - (R * R) / dd); x = o.x + dx * f; y = o.y + dy * f;
        } else if (o.k === 'comb') {
          const nx = -o.m[1], ny = o.m[0], proj = (x - o.at[0]) * nx + (y - o.at[1]) * ny;
          const md = ((proj % o.space) + o.space) % o.space, dist = o.space / 2 - Math.abs(md - o.space / 2);
          const s = (o.a * o.p * o.l) / (dist + o.l); x -= s * o.m[0]; y -= s * o.m[1];
        } else {
          const dx = x - o.c[0], dy = y - o.c[1], r = Math.sqrt(dx * dx + dy * dy), th = -o.a * o.p * Math.exp(-r / o.f);
          const c = Math.cos(th), s = Math.sin(th); x = o.c[0] + dx * c - dy * s; y = o.c[1] + dx * s + dy * c;
        }
      }
      const k = (j * RW + i) * 4; d[k] = col[0]; d[k + 1] = col[1]; d[k + 2] = col[2]; d[k + 3] = 255;
    }
    S.sg.putImageData(S.img, 0, 0);
    S.g.filter = 'blur(0.9px)'; S.g.drawImage(S.small, 0, 0, W, H); S.g.filter = 'none';   // wet ink: no hard pixel edge
    // The label: pasted down; the lines bleed up into it word by word, and fade for the next.
    const cp = ease.outBack(prog(t, 0.3, 0.8));
    S.card.style.opacity = Math.min(1, cp * 3);
    S.card.style.transform = `translateY(${(1 - Math.min(1, cp)) * 60}px) rotate(${lerp(-5, -1, Math.min(1, cp))}deg) scale(${lerp(1.08, 1, Math.min(1, cp))})`;
    S.lines.forEach(({ box, spans }, li) => {
      const l = SAY[li], next = SAY[li + 1]?.t ?? BRAND + 1.2;
      spans.forEach((sp, i) => develop(sp, t, l.t + i * STAG, 0.8));
      const out = ease.inCubic(prog(t, next - 0.3, next + 0.2));
      box.style.opacity = 1 - out; box.style.filter = out > 0 ? `blur(${out * 10}px)` : 'none';
    });
    develop(S.wm, t, BRAND + 1.5, 0.8);
    S.tagw.forEach((e, i) => develop(e, t, BRAND + 2.1 + i * STAG, 0.8));
    stampIn(S.stamp, t, BRAND + 3.0);
    colophonIn(S.colo, t, BRAND + 3.3, 1);
  },
};
