/**
 * PRINT · CUT-OUTS — papiers découpés, after Matisse's Jazz. Gouache-painted
 * paper cut with scissors, laid on ultramarine: fronds that sway, stars that
 * drop in and settle (their shadows tighten as they land), and every word on
 * its own scrap of paper. A walking bass and brushed swing underneath. At the
 * end a coral ring is laid down: the Plutto ring, cut by hand.
 */
import { el, prog, ease, lerp, rng, W, H, fbm, paint, filter, wordsOf, stamp, stampIn, colophon, colophonIn, voice } from '../print.js';

const ULTRA = '#1C2E9C';
const C = { coral: '#FF5B3A', lemon: '#FFD23F', pink: '#FF8DB3', leaf: '#17A36D', white: '#FBF6EA', ink: '#15151F', cyan: '#39B5E6' };
// Each line: its words, the scraps they're cut from, and a size.
const SAY = [
  { t: 0.6, text: 'you keep a list', size: 92, paper: ['white', 'lemon', 'white', 'pink'] },
  { t: 2.8, text: 'of things you’ll ask / one day.', size: 80, paper: ['white', 'cyan', 'white', 'lemon', 'coral', 'white'] },
  { t: 5.4, text: '‘one day’', size: 176, paper: ['lemon', 'lemon'] },
  { t: 6.9, text: 'is a polite word / for never.', size: 82, paper: ['white', 'white', 'pink', 'white', 'white', 'coral'] },
  { t: 9.4, text: 'ask one tonight.', size: 104, paper: ['lemon', 'white', 'coral'] },
];
const BRAND = 11.6, END = 16;
const BEAT = 0.6, LINE_Y = 1090, STAG = 0.14;
let S = {};

/** A shape cut with scissors: the polygon's points, nudged so no edge is quite straight. */
function cut(pts, R, j = 1.6) { return pts.map(([x, y]) => [x + (R() - 0.5) * j, y + (R() - 0.5) * j]); }
function frondPts(len, wid, lobes, R) {
  const n = 90, L = [], Rt = [], ph = R() * 6;
  for (let i = 0; i <= n; i++) {
    const s = i / n, x = Math.sin(s * Math.PI * 0.9 + ph) * len * 0.07, y = -s * len, taper = Math.pow(1 - s, 0.7) * 0.9 + 0.1;
    const lobe = (o) => 0.18 + 0.82 * Math.pow(Math.abs(Math.sin(s * lobes * Math.PI + o)), 0.45);   // deep, finger-like lobes
    const w = wid * taper * lobe(0), w2 = wid * taper * lobe(1.4);
    L.push([x - w, y]); Rt.push([x + w2, y]);
  }
  return [...L, ...Rt.reverse()];
}
function starPts(r, R, k = 5) { const p = []; for (let i = 0; i < k * 2; i++) { const a = (i / (k * 2)) * 6.2832 - Math.PI / 2 + (R() - 0.5) * 0.12, rr = (i % 2 ? 0.44 : 1) * r * (0.88 + R() * 0.24); p.push([Math.cos(a) * rr, Math.sin(a) * rr]); } return p; }
function circlePts(r, R, n = 80) { const p = []; for (let i = 0; i < n; i++) { const a = (i / n) * 6.2832, rr = r * (1 + (R() - 0.5) * 0.03); p.push([Math.cos(a) * rr, Math.sin(a) * rr]); } return p; }

/** Paint a cut shape onto its own sprite: gouache colour, brush texture, cut edge. */
function sprite(paths, color, tex) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  paths.flat().forEach(([x, y]) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); });
  const pad = 4, c = document.createElement('canvas'); c.width = Math.ceil(x1 - x0 + pad * 2); c.height = Math.ceil(y1 - y0 + pad * 2);
  const g = c.getContext('2d');
  const path = (pts) => { const p = new Path2D(); pts.forEach(([x, y], i) => (i ? p.lineTo(x - x0 + pad, y - y0 + pad) : p.moveTo(x - x0 + pad, y - y0 + pad))); p.closePath(); return p; };
  g.fillStyle = color; g.fill(path(paths[0]));
  g.globalCompositeOperation = 'destination-out'; paths.slice(1).forEach((pts) => g.fill(path(pts)));   // the holes, cut out
  g.globalCompositeOperation = 'source-atop'; g.globalAlpha = 0.5; g.drawImage(tex, (x0 * 0.37) % 200 - 200, (y0 * 0.29) % 200 - 200, 1400, 1400);
  return { c, ox: -x0 + pad, oy: -y0 + pad };
}

export default {
  duration: END,
  poster: END - 0.3,
  score() {
    const c = [{ i: 'room', t: 0, end: END, g: 0.03 }];
    const walk = [38, 41, 43, 45, 46, 45, 43, 41, 38, 40, 41, 43, 45, 48, 46, 45];
    for (let k = 0; k * BEAT < BRAND + 0.2; k++) {       // brushed swing: a walking bass, swung hats, brushes on 2 and 4
      const t = k * BEAT;
      c.push({ i: 'bass', t, n: walk[k % walk.length], dur: 0.45, g: 0.55 });
      c.push({ i: 'hat', t, g: 0.07, p: -0.2 }, { i: 'hat', t: t + BEAT * 0.66, g: 0.05, p: 0.2 });
      if (k % 2) c.push({ i: 'snare', t, g: 0.07, verb: 0.3 });
      if (k % 4 === 0) c.push({ i: 'kick', t, g: 0.18 });
    }
    c.push({ i: 'whoosh', t: BRAND - 0.2, dur: 0.6, g: 0.18, from: -0.5, to: 0.5 });
    c.push({ i: 'sting', t: BRAND + 0.25, g: 0.7 });
    [50, 57, 62, 65, 69, 76].forEach((n, i) => c.push({ i: 'pluck', t: BRAND + 0.25 + i * 0.03, n, g: 0.1, dur: 3.5 }));   // a D minor 9, let ring
    [0.95, 1.05, 1.15, 1.25, 1.35, 1.45].forEach((d, i) => c.push({ i: 'tom', t: BRAND + d, f: 150 + i * 12, g: 0.12, verb: 0.2, d: 0.08 }));   // the letters, laid down
    c.push({ i: 'tom', t: BRAND + 2.62, f: 190, g: 0.22, verb: 0.2, d: 0.1 });
    return voice(c, SAY, { stag: STAG, inst: 'pluck', scale: [74, 77, 79, 81, 84, 86], g: 0.16, thock: 0 });
  },
  async setup(stage) {
    stage.style.background = ULTRA;
    const R = rng(33);
    // The ground: ultramarine gouache, brushed.
    const bg = el('canvas', 'layer', {}, stage); bg.width = W; bg.height = H; const b = bg.getContext('2d');
    b.fillStyle = ULTRA; b.fillRect(0, 0, W, H);
    b.globalAlpha = 0.6; b.drawImage(paint(270, 480, fbm(270, 480, { scale: 4, oct: 4, seed: 5 }), (v) => [10, 10, 60, Math.round(v * 90)]), 0, 0, W, H);
    b.globalAlpha = 0.4; b.drawImage(paint(270, 480, fbm(270, 480, { scale: 30, oct: 3, seed: 6 }), (v) => [255, 255, 255, Math.round(v * 22)]), 0, 0, W, H);
    b.globalAlpha = 1;
    const tex = paint(350, 350, fbm(350, 350, { scale: 12, oct: 4, seed: 7 }), (v) => (v > 0.5 ? [255, 255, 255, Math.round((v - 0.5) * 120)] : [0, 0, 0, Math.round((0.5 - v) * 110)]));
    const cv = el('canvas', 'layer', {}, stage); cv.width = W; cv.height = H; S.g = cv.getContext('2d');
    // The cut-outs. at: when it's laid down; from: where it falls from.
    const F = (len, wid, lobes, color, x, y, ang, at, sway) => ({ kind: 'frond', ...sprite([cut(frondPts(len, wid, lobes, R), R)], C[color], tex), x, y, ang, at, sway, ph: R() * 6 });
    const St = (r, color, x, y, at, out = 99) => ({ kind: 'drop', ...sprite([cut(starPts(r, R), R)], C[color], tex), x, y, ang: (R() - 0.5) * 0.5, at, out, spin: (R() - 0.5) * 2 });
    const D = (r, color, x, y, at, out = 99) => ({ kind: 'drop', ...sprite([cut(circlePts(r, R), R)], C[color], tex), x, y, ang: 0, at, out, spin: 0 });
    const moon = sprite([cut(circlePts(70, R), R), cut(circlePts(62, R).map(([x, y]) => [x + 42, y - 30]), R)], C.cyan, tex);
    S.items = [
      F(820, 125, 6, 'leaf', 130, 1990, -0.14, 0.0, 0.05),
      F(700, 110, 5, 'pink', 960, 1990, 0.2, 0.15, 0.06),
      F(600, 100, 5, 'coral', 1030, -50, Math.PI + 0.38, 0.3, 0.05),
      F(460, 86, 4, 'lemon', -40, 330, 1.3, 0.45, 0.07),
      F(360, 70, 4, 'white', 1110, 820, -1.45, 0.6, 0.06),
      { kind: 'drop', ...moon, x: 830, y: 560, ang: 0.3, at: 3.4, out: BRAND, spin: 0.4 },
      St(58, 'lemon', 230, 330, 0.9, BRAND), St(40, 'white', 800, 250, 1.8, 99), St(46, 'coral', 180, 760, 3.0, BRAND),
      St(36, 'white', 880, 1440, 5.5, BRAND), St(52, 'lemon', 260, 1470, 7.1, 99), St(30, 'pink', 720, 820, 8.2, BRAND),
      D(16, 'white', 420, 250, 1.3, BRAND), D(12, 'ink', 640, 380, 2.4, BRAND), D(20, 'coral', 120, 1180, 4.6, BRAND),
      D(14, 'white', 960, 1120, 6.2, BRAND), D(18, 'lemon', 590, 1520, 8.8, BRAND), D(11, 'white', 90, 560, 9.9, 99),
    ];
    // The ring, laid down at the end.
    S.ring = { kind: 'drop', ...sprite([cut(circlePts(205, R, 120), R), cut(circlePts(112, R, 90), R)], C.coral, tex), x: 540, y: 575, ang: 0.1, at: BRAND + 0.25, out: 99, spin: -0.8 };
    S.items.push(S.ring);
    // Words, each on its own scrap: a jagged clip, the cut filter, a paper shadow.
    const cutF = filter(stage, 'cut', { freq: 0.035, scale: 5, seed: 3, oct: 1 });
    const scrap = (parent, w, color, size, font) => {
      const wrap = el('div', '', { display: 'inline-block', filter: 'drop-shadow(5px 8px 6px rgba(5,8,40,0.4))', opacity: 0 }, parent);
      const pts = []; const jag = () => `${(R() * 2.5).toFixed(1)}%`;
      for (let i = 0; i <= 6; i++) pts.push(`${(i / 6 * 100).toFixed(1)}% ${jag()}`);
      for (let i = 6; i >= 0; i--) pts.push(`${(i / 6 * 100).toFixed(1)}% ${(100 - R() * 2.5).toFixed(1)}%`);
      el('div', '', { background: C[color], color: color === 'white' || color === 'lemon' ? C.ink : C.white, padding: `${size * 0.1}px ${size * 0.26}px ${size * 0.14}px`, fontSize: `${size}px`, lineHeight: 1,
        clipPath: `polygon(${pts.join(',')})`, filter: cutF, ...font }, wrap, w);
      return wrap;
    };
    const inter = { fontFamily: 'Inter', fontWeight: 900, letterSpacing: '-0.03em' }, serif = { fontFamily: 'Cormorant', fontStyle: 'italic', fontWeight: 600 };
    S.lines = SAY.map((l) => {
      const box = el('div', 'abs', { left: '90px', right: '90px', top: `${LINE_Y}px`, transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }, stage);
      const scraps = [];
      l.text.split(' / ').forEach((row) => {
        const r = el('div', '', { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }, box);
        row.split(' ').forEach((w) => { const i = scraps.length; scraps.push({ e: scrap(r, w, l.paper[i] || 'white', l.size, i % 3 === 2 ? serif : inter), rot: (R() - 0.5) * 7, fx: (R() - 0.5) * 900, fr: (R() - 0.5) * 70 }); });
      });
      return { box, scraps };
    });
    // The poster: the letters of the name, cut from white paper; the line; the address.
    S.name = el('div', 'abs', { left: 0, right: 0, top: '818px', display: 'flex', justifyContent: 'center', fontFamily: 'Inter', fontWeight: 900, fontSize: '206px', letterSpacing: '-0.04em', lineHeight: 1, color: C.white }, stage);
    S.letters = [...'Plutto'].map((ch, i) => ({ e: el('div', '', { filter: `${cutF} drop-shadow(6px 10px 8px rgba(5,8,40,0.45))`, opacity: 0 }, S.name, ch), rot: [-4, 3, -2, 5, -3, 2][i] }));
    S.tagBox = el('div', 'abs', { left: 0, right: 0, top: '1090px', display: 'flex', justifyContent: 'center', gap: '12px' }, stage);
    S.tag = ['ask', 'one', 'tonight.'].map((w, i) => ({ e: scrap(S.tagBox, w, ['lemon', 'white', 'coral'][i], 78, i === 2 ? serif : inter), rot: [-3, 2, -2][i] }));
    S.stamp = stamp(stage, 'PLUTTO.SPACE', { top: 1270, ink: C.white, style: { mixBlendMode: 'normal' } });
    S.colo = colophon(stage, 'PAPIERS DÉCOUPÉS — SCISSORS & GOUACHE', 'N° 003', { ink: C.white });
  },
  async frame(t) {
    const g = S.g; g.clearRect(0, 0, W, H);
    // The paper: laid down, then the fronds sway; stars and dots drop in, settle, and are swept off at the end.
    S.items.forEach((it) => {
      let x = it.x, y = it.y, a = it.ang, s = 1, lift = 0, alpha = 1;
      if (it.kind === 'frond') {
        const grow = ease.outBack(prog(t, it.at, it.at + 1.1));
        if (grow <= 0) return;
        s = grow; a += Math.sin(t * 1.3 + it.ph) * it.sway + Math.sin(t * 2.1 + it.ph * 2) * it.sway * 0.4;
      } else {
        const p = prog(t, it.at, it.at + 0.5); if (p <= 0) return;
        const f = ease.outBack(p); lift = 1 - Math.min(1, p * 1.2);
        y -= (1 - Math.min(1, f)) * 260; a += (1 - Math.min(1, f)) * it.spin + Math.sin(t * 0.9 + it.x) * 0.03; s = lerp(1.25, 1, Math.min(1, f));
        const o = ease.inCubic(prog(t, it.out, it.out + 0.5));
        if (o > 0) { x += (it.x < 540 ? -1 : 1) * o * 700; y -= o * 300; a += o * 2; alpha = 1 - o; }
      }
      g.save(); g.globalAlpha = alpha; g.translate(x, y); g.rotate(a); g.scale(s, s);
      g.shadowColor = 'rgba(5,8,40,0.42)'; g.shadowBlur = lerp(9, 30, lift); g.shadowOffsetX = lerp(5, 22, lift); g.shadowOffsetY = lerp(8, 34, lift);
      g.drawImage(it.c, -it.ox, -it.oy); g.restore();
    });
    // The words: each scrap drops in and lands askew; the line is swept off when the next comes.
    const drop = (e, rot, w) => {
      const p = prog(t, w, w + 0.4); if (p <= 0) { e.style.opacity = 0; return; }
      const f = ease.outBack(p), fc = Math.min(1, f);
      e.style.opacity = Math.min(1, p * 5);
      e.style.transform = `translateY(${(1 - fc) * -140}px) rotate(${rot + (1 - fc) * 24}deg) scale(${lerp(1.3, 1, fc)})`;
    };
    S.lines.forEach(({ scraps }, li) => {
      const l = SAY[li], next = SAY[li + 1]?.t ?? BRAND;
      scraps.forEach((sc, i) => {
        drop(sc.e, sc.rot, l.t + i * STAG);
        const o = ease.inCubic(prog(t, next - 0.25 + i * 0.03, next + 0.25 + i * 0.03));
        if (o > 0) { sc.e.style.opacity = 1 - o; sc.e.style.transform = `translate(${sc.fx * o}px, ${-500 * o}px) rotate(${sc.rot + sc.fr * o}deg)`; }
      });
    });
    S.letters.forEach(({ e, rot }, i) => drop(e, rot, BRAND + 0.8 + i * 0.1));
    S.tag.forEach(({ e, rot }, i) => drop(e, rot, BRAND + 1.7 + i * STAG));
    stampIn(S.stamp, t, BRAND + 2.5);
    colophonIn(S.colo, t, BRAND + 2.8, 0.7);
  },
};
