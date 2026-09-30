/**
 * ORB · THE SHEET — a risograph. The orb is Plutto's voice, and it never says
 * what Plutto is: it notices the viewer, names the question they carry and the
 * reason they haven't asked it, and invites them — the brand line resolves it.
 * A sheet of paper; the voice orb is PRINTED
 * on it: three fluorescent ink plates (pink, blue, yellow), each a halftone
 * screen at its own angle, overprinting into the orb's own colours (pink+blue =
 * violet, blue+yellow = green, pink+yellow = orange). When it speaks the plates
 * shake out of register. Every word arrives as two ink plates that slam into
 * register — a print pass — and the sheet fills into a finished poster of what
 * it said. At the end the orb rises, swells, and its screens open into the
 * Plutto ring — a finished riso poster: the mark overprinted across the print,
 * the line it speaks, the address stamped, the printer's colophon.
 */
import { el, prog, ease, lerp, rng, W, H } from '../lib.js';
import { fbm, paint } from '../shots.js';

const PAPER = '#F6F1E7';
const INK = { pink: '#FF48B0', blue: '#2F6FE0', yellow: '#FFD900' };
const STAG = 0.12;
// One line on the sheet at a time, small, with the paper around it. em: the
// word printed hot (pink + yellow). ' / ' is a line break.
const SAY = [
  { t: 0.9, text: 'you almost scrolled past.', font: 'g', size: 58, em: 3 },
  { t: 3.0, text: 'you do that / right before something matters.', font: 'i', size: 60, em: 6 },
  { t: 5.3, text: 'there’s a question / you keep not asking.', font: 'g', size: 56, em: 2 },
  { t: 7.6, text: 'too heavy for friends. / too strange for a search bar.', font: 'i', size: 64, em: 5 },
  { t: 9.9, text: 'say it here, / out loud.', font: 'g', size: 60, em: 4 },
  { t: 12.2, text: 'i’ll know what you mean.', font: 'i', size: 76, em: 1 },
];
const BRAND = 14.4, END = 19;
const HX = 540, HY = 700, HR = 270;   // the orb, at the end: the poster's print
const AGE = BRAND + 1.6;   // the label: five thousand years old
const TAG = { t: BRAND + 2.05, text: 'talks back.', font: 'i', size: 132, em: [0, 1] };
const STAMP = BRAND + 2.75, LISTEN = [BRAND + 2.6, BRAND + 3.6];
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
    if (gone > 0.01) d = Math.sqrt(rr) < 0.44 * Math.min(gone, 1.05) ? 0 : lerp(d, p.ring ? Math.min(1, 0.3 + 1.15 * d) : 0.75 * d, Math.min(1, gone));   // opening into the ring: a paper hole, the ink still lit like a ball
    if (d < 0.03) continue;
    const rad = spacing * 0.64 * Math.sqrt(Math.min(1, d)), X = cx + x, Y = cy + y;
    g.moveTo(X + rad, Y); g.arc(X, Y, rad, 0, 6.2832);
  }
  g.fill();
}

export default {
  duration: END,
  poster: 18.5,
  score() {
    const c = [
      { i: 'pad', t: 0, end: BRAND, ns: [57, 64, 69, 71], g: 0.05, bright: 900, verb: 0.6 },
      { i: 'whoosh', t: 0.05, dur: 0.6, g: 0.16, from: 0, to: 0 },
      { i: 'bell', t: 0.35, n: 88, g: 0.06, dur: 2.5 },
      { i: 'reverse', end: BRAND, dur: 0.8, g: 0.22 },
      { i: 'hit', t: BRAND, g: 0.35 }, { i: 'sting', t: BRAND + 0.05, g: 0.8 },
      { i: 'pad', t: BRAND, end: END, ns: [57, 64, 69], g: 0.04 },
      { i: 'tom', t: BRAND + 0.95, f: 120, g: 0.34, verb: 0.3, d: 0.16 },           // the ring opens
      { i: 'tom', t: BRAND + 1.42, f: 150, g: 0.3, verb: 0.25, d: 0.14 },           // the mark, printed
      { i: 'tom', t: STAMP + 0.12, f: 190, g: 0.26, verb: 0.2, d: 0.1 },            // the address, stamped
      { i: 'bell', t: STAMP + 0.14, n: 81, g: 0.05, dur: 3 },
    ];
    for (let k = 2; k < 24; k++) {                       // a light, dry beat under the voice
      const t = k * 0.6;
      c.push(k % 2 === 0 ? { i: 'kick', t, g: 0.3 } : { i: 'snare', t, g: 0.15, verb: 0.35 });
      c.push({ i: 'hat', t, g: 0.09, p: -0.3 }, { i: 'hat', t: t + 0.3, g: 0.06, p: 0.3 });
    }
    [...SAY, TAG].forEach((line, li) => {
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
    const typeset = (l, parent) => {
      const slot = el('div', '', { position: 'absolute', left: 0, right: 0, top: 0, transform: 'translateY(-50%)', ...style(l) }, parent);
      el('div', '', { visibility: 'hidden' }, slot, l.text.replace(' / ', '<br>'));   // holds the line's height
      const layers = [0, 1].map((k) => {
        const lay = el('div', '', { position: 'absolute', left: 0, top: 0, right: 0, mixBlendMode: 'multiply' }, slot);
        const out = [];
        l.text.split(' ').forEach((w, j, all) => {
          if (w === '/') { lay.appendChild(document.createElement('br')); return; }
          const i = out.length;
          out.push(el('span', '', { display: 'inline-block', opacity: 0, color: k === 0 ? INK.pink : ([].concat(l.em).includes(i) ? INK.yellow : INK.blue) }, lay, w));
          if (j < all.length - 1 && all[j + 1] !== '/') lay.appendChild(document.createTextNode(' '));
        });
        return out;
      });
      return { cfg: l, layers };
    };
    S.lines = SAY.map((l) => typeset(l, S.poster));
    // The poster at the end. The mark: huge, two plates, overprinted across the foot of the print.
    S.wm = el('div', 'abs', { left: 0, right: 0, top: `${HY + HR - 70}px`, textAlign: 'center', fontFamily: 'Inter', fontSize: '232px', fontWeight: 800, letterSpacing: '-0.055em', lineHeight: 1, filter: 'url(#ink)' }, stage);
    el('div', '', { visibility: 'hidden' }, S.wm, 'Plutto');
    S.wmp = [INK.pink, INK.blue].map((c) => el('div', '', { position: 'absolute', left: 0, right: 0, top: 0, color: c, mixBlendMode: 'multiply', opacity: 0 }, S.wm, 'Plutto'));
    // The age, a quiet label between two rules; then what it does, large and hot.
    S.age = el('div', 'abs', { left: 0, right: 0, top: '1196px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '26px', fontFamily: 'Inter', fontWeight: 600, fontSize: '22px', color: INK.blue, mixBlendMode: 'multiply' }, stage);
    S.ageRules = [0, 1].map(() => el('div', '', { width: '64px', height: '2px', background: INK.blue }, S.age));
    S.ageText = el('div', '', { letterSpacing: '0.42em', marginRight: '-0.42em', whiteSpace: 'nowrap' }, S.age, 'FIVE THOUSAND YEARS OLD');
    S.age.insertBefore(S.ageText, S.ageRules[1]);
    S.tagBox = el('div', 'abs', { left: '140px', width: '800px', top: '1330px', textAlign: 'center', filter: 'url(#ink)' }, stage);
    S.tag = typeset(TAG, S.tagBox);
    S.tagBox.style.fontWeight = 600; S.tagBox.firstChild.style.fontWeight = 600;
    // The address, rubber-stamped a little askew.
    S.url = el('div', 'abs', { left: 0, right: 0, top: '1510px', display: 'flex', justifyContent: 'center', opacity: 0, filter: 'url(#ink)' }, stage);
    S.stamp = el('div', '', { padding: '20px 40px 20px 50px', border: `4px solid ${INK.blue}`, borderRadius: '999px', fontFamily: 'Inter', fontWeight: 700, fontSize: '30px', letterSpacing: '0.34em', color: INK.pink, mixBlendMode: 'multiply' }, S.url, 'PLUTTO.SPACE');
    // The printer's colophon along the foot of the sheet.
    S.colo = el('div', 'abs', { left: '120px', right: '120px', top: '1742px', display: 'flex', justifyContent: 'space-between', paddingTop: '18px', borderTop: `2px solid ${INK.blue}`, fontFamily: 'Inter', fontWeight: 600, fontSize: '17px', letterSpacing: '0.3em', color: INK.blue, mixBlendMode: 'multiply', opacity: 0 }, stage);
    el('span', '', {}, S.colo, 'N° 001 — THE QUESTION'); el('span', '', {}, S.colo, '3 INKS · 1 VOICE');
  },
  async frame(t) {
    // The kick of the latest word.
    let hit = 0;
    SAY.forEach((l) => l.text.split(' ').filter((w) => w !== '/').forEach((_, i) => { const w = l.t + i * STAG; if (t >= w && t < w + 0.3) hit = Math.max(hit, Math.pow(1 - (t - w) / 0.3, 2)); }));
    // The orb: rises in; shakes out of register as it speaks; closes into the ring at the end.
    const inK = ease.outCubic(prog(t, 0, 1.2)), gone = ease.inOutCubic(prog(t, BRAND, BRAND + 1.2));
    const open = ease.outBack(prog(t, BRAND + 0.85, BRAND + 1.35));   // the screens part: a paper hole, the ring
    const cx = lerp(OX, HX, gone), cy = lerp(OY + (1 - inK) * 700, HY, gone);
    const r = lerp(OR * (1 + 0.025 * Math.sin(t * 2.4) + 0.05 * hit), HR * (1 + 0.012 * Math.sin(t * 1.6)), gone);
    const fly = 30 * Math.sin(Math.PI * gone);                         // out of register in flight, slammed back on landing
    const g = S.g; g.clearRect(0, 0, W, H);
    PLATES.forEach((p, k) => {
      const c = S.plates[k], pg = c.getContext('2d'); pg.clearRect(0, 0, W, H);
      const shake = (1 - gone) * (16 * hit + 2.5 * Math.sin(t * 1.7 + k * 2)) + fly;
      const rest = 1 - 0.4 * gone;                                    // riso is never quite in register
      halftone(pg, p, cx + p.off[0] * rest + p.dir[0] * shake, cy + p.off[1] * rest + p.dir[1] * shake, r, t, open, lerp(8.5, 11.5, gone));
      // Sound rings: dotted, printed on the pink and blue plates, leaving the orb when a line begins.
      // At the end it keeps listening: two slow rings off the finished print.
      if (k < 2) [...SAY.map((l) => [l.t, 1.8, 520]), ...LISTEN.map((l) => [l, 2.6, 420])].forEach(([at, len, reach]) => {
        const kk = (t - at - k * 0.18) / len; if (kk < 0 || kk > 1) return;
        const rad = r * 1.08 + kk * reach, dots = Math.floor(rad / 10);
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
    const pass = (e, k, w, reg = 1) => {
      if (t < w) { e.style.opacity = 0; return; }
      const f = ease.outBack(prog(t, w, w + 0.42)), fc = Math.min(1, f);
      const from = k === 0 ? [-46, -26] : [42, 30], rest = (k === 0 ? [-1.6, 1] : [1.6, -1]).map((v) => v * reg);
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
    // The poster: the mark prints in two passes, the orb speaks its line, the address is stamped.
    S.wmp.forEach((e, k) => pass(e, k, BRAND + 1.25 + k * 0.1));
    S.tag.layers.forEach((spans, k) => spans.forEach((sp, i) => pass(sp, k, TAG.t + i * STAG, 0.35)));
    const ag = ease.outCubic(prog(t, AGE, AGE + 0.7));
    S.age.style.opacity = ag; S.ageText.style.letterSpacing = `${0.42 + (1 - ag) * 0.25}em`;
    S.ageRules.forEach((e, k) => { e.style.transform = `scaleX(${ag})`; e.style.transformOrigin = k ? 'left' : 'right'; });
    const st = prog(t, STAMP, STAMP + 0.22), sb = ease.outBack(st);
    S.url.style.opacity = Math.min(1, st * 4);
    S.stamp.style.transform = `scale(${lerp(1.5, 1, Math.min(1, sb))}) rotate(${lerp(-9, -2.5, sb)}deg)`;
    const c = ease.outCubic(prog(t, STAMP + 0.4, STAMP + 1.0));
    S.colo.style.opacity = 0.75 * c; S.colo.style.clipPath = `inset(0 ${(1 - c) * 100}% 0 0)`;
  },
};
