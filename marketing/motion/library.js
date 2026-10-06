/**
 * THE LIBRARY — Plutto as what it is: the library of every way humankind has
 * asked what comes next. A reading room at night: cloth-bound spines under a
 * lamp, a card catalogue, museum plates, script on old paper. Serif and quiet,
 * the opposite of the Pop series' shout — it should feel like the place.
 *
 * The kit the five library-* scenes are made from:
 *   shelves()   — endless bookshelves, one spine per tradition in the atlas
 *   lines()     — serif lines that rise out of a blur
 *   libEnd()    — the end card (the one hairline of gold in the series)
 *   libScore()  — felt piano, a slow pad, soft taiko, page turns, the sting
 *
 * The atlas (app/lib/atlas.json) is the site's own list: 102 traditions in 12
 * regions. Every number a film shows comes from it.
 */
import { el, set, prog, ease, lerp, rng, W, H, ASSET } from './lib.js';

export const LIB = {
  night: '#0b0d14', deep: '#141826', cream: '#efe6d2', dim: 'rgba(239,230,210,0.58)', faint: 'rgba(239,230,210,0.28)',
  brass: '#b39b63', ink: '#1b1712', red: '#a3322a', blue: '#6d8db5', gold: '#D4AF37', lamp: '255,186,108',
};
// Cloth bindings, one per region, in the atlas's region order.
const CLOTH = ['#6e1f22', '#1d2c55', '#1f4a36', '#8c6526', '#4d2347', '#1d5a5c', '#8a3b1e', '#3b4250', '#5b5a2a', '#2b2463', '#5a1730', '#3d5a2c'];

export async function atlas() {
  const a = await (await fetch('../../app/lib/atlas.json')).json();
  const order = a.regions.map((r) => r.id);
  a.list = a.regions.flatMap((r) => a.traditions.filter((x) => x.region === r.id));
  a.cloth = (t) => CLOTH[order.indexOf(t.region) % CLOTH.length];
  a.title = (id) => (a.regions.find((r) => r.id === id) || {}).title || id;
  return a;
}

export function night(stage) {
  stage.style.background = LIB.night;
  return el('div', 'layer', { background: `radial-gradient(70% 45% at 50% 18%, rgba(${LIB.lamp},0.16), transparent 70%), linear-gradient(${LIB.deep}, ${LIB.night})` }, stage);
}

/** One row of spines, drawn once to a long strip. */
function strip(books, { h, seed }) {
  const R = rng(seed);
  const specs = books.map((b) => ({ b, w: Math.round(54 + R() * 40), hh: Math.round(h * (0.74 + R() * 0.22)), band: R() < 0.5 }));
  const width = specs.reduce((a, s) => a + s.w + 3, 0);
  const c = document.createElement('canvas'); c.width = width; c.height = h + 40;
  const g = c.getContext('2d');
  let x = 0;
  for (const { b, w, hh, band } of specs) {
    const y = h - hh;
    const grd = g.createLinearGradient(x, 0, x + w, 0);
    grd.addColorStop(0, 'rgba(0,0,0,0.45)'); grd.addColorStop(0.18, 'rgba(255,255,255,0.10)'); grd.addColorStop(0.5, 'rgba(0,0,0,0)'); grd.addColorStop(1, 'rgba(0,0,0,0.55)');
    g.fillStyle = b.color; g.fillRect(x, y, w, hh);
    g.fillStyle = grd; g.fillRect(x, y, w, hh);
    g.strokeStyle = LIB.brass; g.globalAlpha = 0.7; g.lineWidth = 2;
    [y + 26, y + 34, h - 30, h - 22].forEach((yy) => { g.beginPath(); g.moveTo(x + 4, yy); g.lineTo(x + w - 4, yy); g.stroke(); });
    if (band) { g.globalAlpha = 0.35; g.fillStyle = LIB.ink; g.fillRect(x, y + 52, w, 70); }
    g.globalAlpha = 1;
    // the title, up the spine
    const size = Math.min(30, w * 0.42);
    g.save(); g.translate(x + w / 2, h - 52); g.rotate(-Math.PI / 2);
    g.font = `600 ${size}px Cormorant`; g.fillStyle = LIB.cream; g.globalAlpha = 0.88; g.textBaseline = 'middle';
    let label = b.name.toUpperCase();
    while (g.measureText(label).width > hh - 120 && label.length > 4) label = `${label.slice(0, -2)}…`;
    g.fillText(label, 0, 0);
    g.restore();
    x += w + 3;
  }
  // the shelf board
  const wood = g.createLinearGradient(0, h, 0, h + 40);
  wood.addColorStop(0, '#5a3a22'); wood.addColorStop(0.25, '#3b2414'); wood.addColorStop(1, '#140b05');
  g.fillStyle = wood; g.fillRect(0, h, width, 40);
  return { c, width };
}

/**
 * Bookshelves. rows: [{ y, h, speed, seed, scale, blur }]. draw(t) pans each
 * row left at its own speed (parallax), under a moving lamp.
 */
export function shelves(stage, books, rows, { lamp = true } = {}) {
  const box = el('div', 'layer', { overflow: 'hidden' }, stage);
  const rs = rows.map((r) => {
    const s = strip(books, { h: r.h, seed: r.seed ?? 1 });
    const scale = r.scale ?? 1;
    const c = el('canvas', 'abs', { left: 0, top: `${r.y}px`, width: `${W}px`, height: `${(r.h + 40) * scale}px`, filter: r.blur ? `blur(${r.blur}px)` : 'none', opacity: r.alpha ?? 1 }, box);
    c.width = Math.ceil(W / scale); c.height = r.h + 40;
    return { ...r, s, g: c.getContext('2d'), cw: c.width, off: r.offset ?? 0 };
  });
  const shade = el('div', 'layer', {}, box);
  return {
    el: box,
    draw(t) {
      for (const r of rs) {
        const x = -((r.off + t * r.speed) % r.s.width);
        r.g.clearRect(0, 0, r.cw, r.s.c.height);
        r.g.drawImage(r.s.c, x, 0); if (x + r.s.width < r.cw) r.g.drawImage(r.s.c, x + r.s.width, 0);
      }
      if (lamp) {
        const lx = 50 + Math.sin(t * 0.35) * 14;
        shade.style.background = `radial-gradient(55% 38% at ${lx}% 42%, rgba(${LIB.lamp},0.16), transparent 70%), radial-gradient(120% 80% at 50% 45%, transparent 35%, rgba(5,6,10,0.88))`;
      }
    },
  };
}

/** A block of serif lines; show(t, at, out) brings each line up out of a blur, a beat apart. */
export function lines(parent, rows, { top, size = 104, gap = 0.32, color = LIB.cream, italic = false, weight = 500, lh = 1.08, style = {} } = {}) {
  const box = el('div', 'abs center', { top: `${top}px`, padding: '0 60px', ...style }, parent);
  const ls = rows.map((r) => el('div', '', { font: `${italic ? 'italic ' : ''}${weight} ${size}px/${lh} Cormorant`, color, letterSpacing: '-0.01em', opacity: 0 }, box, r));
  return {
    box, ls,
    show(t, at, out = 1e9) {
      const o = 1 - ease.inCubic(prog(t, out, out + 0.5));
      ls.forEach((l, i) => {
        const p = ease.outCubic(prog(t, at + i * gap, at + i * gap + 0.9));
        set(l, { o: p * o, y: (1 - p) * 34 - (1 - o) * 30, blur: (1 - p) * 14 + (1 - o) * 8 });
      });
    },
  };
}

/** Small mono caps, the catalogue's voice. */
export function caps(parent, text, style = {}) {
  return el('div', 'abs', { font: '500 26px/1.3 Mono', letterSpacing: '0.2em', textTransform: 'uppercase', color: LIB.dim, ...style }, parent, text);
}

/** The end card: the mark, the wordmark, one hairline of gold, the line, the address. */
export function libEnd(stage, { line = 'The library of divination.', sub = 'Vedic · Tarot · I Ching · Runes · and 98 more', cta = 'plutto.space' } = {}) {
  const box = el('div', 'layer', { zIndex: 100, opacity: 0, background: `radial-gradient(70% 50% at 50% 40%, rgba(${LIB.lamp},0.13), transparent 70%), ${LIB.night}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }, stage);
  const mark = el('img', '', { width: '220px', height: '220px', marginBottom: '-30px', mixBlendMode: 'screen' }, box); mark.src = `${ASSET}/brand/plutto-mark.png`;
  const word = el('div', '', { font: '700 120px/1 Inter', letterSpacing: '-0.035em', color: '#fff' }, box, 'Plutto');
  const rule = el('div', '', { width: '160px', height: '2px', background: LIB.gold, margin: '58px 0 54px', transformOrigin: '50% 50%' }, box);
  const l = el('div', '', { font: 'italic 500 84px/1.1 Cormorant', color: LIB.cream, textAlign: 'center', maxWidth: '920px' }, box, line);
  const c = el('div', '', { marginTop: '84px', font: '600 42px/1 Inter', color: LIB.ink, background: LIB.cream, borderRadius: '999px', padding: '28px 58px' }, box, cta);
  const s = el('div', '', { marginTop: '40px', font: '500 24px/1.4 Mono', letterSpacing: '0.18em', textTransform: 'uppercase', color: LIB.dim, textAlign: 'center', maxWidth: '900px' }, box, sub);
  const parts = [mark, word, l, c, s];
  return (t) => {
    box.style.opacity = ease.outCubic(prog(t, 0, 0.45));
    parts.forEach((e, i) => set(e, { o: ease.outCubic(prog(t, 0.1 + i * 0.14, 0.9 + i * 0.14)), y: (1 - ease.outExpo(prog(t, 0.1 + i * 0.14, 1.1 + i * 0.14))) * 50, blur: (1 - ease.outCubic(prog(t, 0.1 + i * 0.14, 0.8 + i * 0.14))) * 10 }));
    rule.style.transform = `scaleX(${ease.inOutCubic(prog(t, 0.5, 1.3))})`;
  };
}

/**
 * The library's score: a slow felt-piano arpeggio over a dark pad that opens
 * to major on the end card, a soft taiko on every bar. hits: landings (a low
 * drum and a bell); flips: card flicks; turns: page turns; then a riser, the
 * boom and Plutto's sting at `end`.
 */
export function libScore({ duration, end, hits = [], flips = [], turns = [], from = 0 }) {
  const c = [{ i: 'room', t: 0, end: duration, g: 0.04 }, { i: 'pad', t: 0, end, ns: [50, 57, 62, 65], g: 0.09, bright: 700, verb: 0.6 }];
  const E = 60 / 84 / 2, CH = [[50, 57, 62, 65, 69, 65, 62, 57], [46, 53, 58, 62, 65, 62, 58, 53], [53, 57, 60, 65, 69, 65, 60, 57], [48, 55, 60, 64, 67, 64, 60, 55]];
  let k = 0;
  for (let t = from; t < end - 0.6; t += E, k++) {
    const ch = CH[Math.floor(k / 8) % 4];
    c.push({ i: 'pluck', t, n: ch[k % 8] + 12, g: k % 8 === 0 ? 0.15 : 0.1, dur: 2 });
    if (k % 8 === 0) c.push({ i: 'tom', t, f: 58, g: 0.32, verb: 0.6, d: 1.1 }, { i: 'bass', t, n: ch[0] - 12, dur: 1.6, g: 0.18 });
    if (k % 8 === 4) c.push({ i: 'tom', t, f: 72, g: 0.16, verb: 0.5, d: 0.6 });
  }
  hits.forEach((t, i) => c.push({ i: 'tom', t, f: 84, g: 0.38, verb: 0.5, d: 0.5 }, { i: 'bell', t, n: [81, 84, 86, 88, 91][i % 5], g: 0.07, dur: 1.8 }));
  flips.forEach((t) => c.push({ i: 'hat', t, g: 0.13 }, { i: 'whoosh', t: t - 0.03, dur: 0.12, g: 0.07 }));
  turns.forEach((t) => c.push({ i: 'whoosh', t: t - 0.25, dur: 0.7, g: 0.3 }));
  c.push({ i: 'riser', t: end - 1.4, end, g: 0.22 }, { i: 'reverse', end, dur: 1, g: 0.3 });
  c.push({ i: 'boom', t: end, g: 0.6 }, { i: 'sting', t: end + 0.05 });
  c.push({ i: 'pad', t: end, end: duration, ns: [50, 57, 62, 66, 69], g: 0.08, bright: 1600, verb: 0.7 });
  for (let t = end + 0.9, j = 0; t < duration - 0.6; t += E * 2, j++) c.push({ i: 'pluck', t, n: [74, 78, 81, 78][j % 4], g: 0.08, dur: 2.4 });
  return c;
}

export { el, set, prog, ease, lerp, rng, W, H, ASSET };
