/**
 * 10 · 102 TRADITIONS — one dot per tradition on Plutto's globe, gathering
 * into a ring coloured by its region (the site's twelve shelf colours), while
 * the names pass. Everything is read from app/lib/atlas.json.
 */
import { el, set, words, rise, haze, stars, vignette, endCard, prog, ease, inOut, lerp, rng, W } from '../lib.js';

const COLORS = { south_asia: '#E9A13B', himalaya: '#E0C24A', china: '#DC4B3E', east_asia: '#D9497A', pacific: '#C059C6', persia: '#9061E0', letters: '#5B77E8', sky: '#3FA3DD', folk: '#27AFA6', americas: '#2FB884', africa: '#77B93F', body: '#C3C43C' };
const END = 11.6;
let S = {};

export default {
  duration: 14,
  async setup(stage) {
    const atlas = await (await fetch('../../app/lib/atlas.json')).json();
    const byRegion = atlas.regions.map((r) => atlas.traditions.filter((t) => t.region === r.id));
    S.list = byRegion.flat();
    S.regions = atlas.regions;
    const R = rng(5);
    S.dots = S.list.map((t, i) => ({ t, i, a: (i / S.list.length) * Math.PI * 2 - Math.PI / 2, sx: R() * W, sy: 400 + R() * 1100, d: R() * 0.8, color: COLORS[t.region] || '#fff' }));
    S.haze = haze(stage, { x: 0.5, y: 0.47, alpha: 0.2 });
    S.stars = stars(stage, { seed: 101, n: 160, speed: 2 });
    const c = el('canvas', 'abs', { left: 0, top: '340px' }, stage);
    c.width = W; c.height = W; S.g = c.getContext('2d');
    S.count = el('div', 'abs center h1', { top: '740px', fontSize: '230px', opacity: 0 }, stage, '0');
    S.cap = el('div', 'abs center', { top: '980px', fontSize: '44px', fontWeight: 700, opacity: 0 }, stage, 'traditions');
    S.name = el('div', 'abs center', { top: '1450px', fontSize: '58px', fontWeight: 700, opacity: 0 }, stage, '');
    S.place = el('div', 'abs center caps', { top: '1535px', fontSize: '24px', opacity: 0 }, stage, '');
    S.head = el('div', 'abs center', { top: '190px' }, stage);
    S.h1 = words(S.head, `${atlas.traditions.length} traditions.`, 'h1', { fontSize: '100px' });
    S.h2 = words(S.head, `${atlas.regions.length} regions. Your chart.`, 'h1', { fontSize: '100px' });
    S.h2.spans.slice(-2).forEach((s) => { s.classList.add('grad'); s.style.paddingRight = '0.04em'; });
    S.total = atlas.traditions.length;
    vignette(stage);
    S.end = endCard(stage, { line: 'Every reading. Every system.', grad: 'Every system.', cta: 'plutto.space' });
  },
  async frame(t) {
    S.haze(t); S.stars(t);
    const g = S.g; g.clearRect(0, 0, W, W);
    const out = ease.inCubic(prog(t, END - 0.6, END));
    const cx = 540, cy = 540, R = 430;
    let shown = 0;
    for (const d of S.dots) {
      const a0 = 0.6 + d.i * 0.045;
      const k = ease.inOutCubic(prog(t, a0, a0 + 1.4));
      if (k <= 0) continue;
      if (k >= 1) shown++;
      const ang = d.a + t * 0.05;
      const x = lerp(d.sx, cx + Math.cos(ang) * R, k), y = lerp(d.sy - 340, cy + Math.sin(ang) * R, k);
      g.globalAlpha = Math.min(1, k * 2) * (1 - out);
      g.fillStyle = d.color; g.shadowColor = d.color; g.shadowBlur = 18;
      g.beginPath(); g.arc(x, y, 9 + 3 * Math.sin(t * 2 + d.i), 0, 6.283); g.fill();
    }
    g.shadowBlur = 0; g.globalAlpha = 1;
    S.count.textContent = String(Math.min(S.total, shown));
    set(S.count, { o: ease.outCubic(prog(t, 0.6, 1.2)) * (1 - out) });
    set(S.cap, { o: ease.outCubic(prog(t, 0.9, 1.5)) * (1 - out) });
    // The names, one after another as their dots land.
    const idx = Math.min(S.list.length - 1, Math.max(0, shown - 1));
    const tr = S.list[idx];
    if (tr && t > 0.9) { S.name.textContent = tr.name; S.name.style.color = COLORS[tr.region] || '#fff'; S.place.textContent = tr.place || ''; }
    set(S.name, { o: inOut(t, 1.2, 6.8, 0.4) });
    set(S.place, { o: inOut(t, 1.3, 6.8, 0.4) });
    rise(S.h1.spans, t - 6.9, { stagger: 0.08, out: END - 7.5 });
    rise(S.h2.spans, t - 7.3, { stagger: 0.08, out: END - 7.9 });
    S.h2.spans.forEach((s) => { s.style.backgroundPosition = `${ease.inOutCubic(prog(t, 7.8, 10)) * 150}% 0`; });
    S.end(t - END);
  },
};
