/**
 * 08 · 36 GUNAS — kundli matching, koota by koota: each bar fills to its
 * classical maximum while the total counts to 36. (The maxima are the
 * Ashtakoota's: Varna 1 … Nadi 8.)
 */
import { el, set, words, rise, haze, stars, vignette, endCard, prog, ease, inOut, lerp } from '../lib.js';

const KOOTAS = [['Varna', 1, 'temperament'], ['Vashya', 2, 'attraction'], ['Tara', 3, 'birth stars'], ['Yoni', 4, 'intimacy'],
  ['Graha Maitri', 5, 'meeting of minds'], ['Gana', 6, 'nature'], ['Bhakoot', 7, 'family, fortune'], ['Nadi', 8, 'health, children']];
const END = 11.2;
let S = {};

export default {
  duration: 13.6,
  async setup(stage) {
    S.haze = haze(stage, { x: 0.3, y: 0.3, alpha: 0.22 });
    S.haze2 = haze(stage, { color: '244,114,182', x: 0.8, y: 0.8, alpha: 0.12 });
    S.stars = stars(stage, { seed: 88, n: 180, speed: 2 });
    S.head = el('div', 'abs center', { top: '210px' }, stage);
    S.h1 = words(S.head, 'Kundli matching,', 'h1', { fontSize: '96px' });
    S.h2 = words(S.head, 'the classical way.', 'h1', { fontSize: '96px' });
    S.h2.spans.forEach((s) => { s.classList.add('grad'); s.style.paddingRight = '0.04em'; });
    S.rows = KOOTAS.map(([name, max, what], i) => {
      const r = el('div', 'abs', { left: '90px', right: '90px', top: `${520 + i * 118}px`, opacity: 0 }, stage);
      const top = el('div', '', { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }, r);
      el('div', '', { fontSize: '40px', fontWeight: 700 }, top, `${name} <span style="font-weight:500;color:rgba(255,255,255,0.45);font-size:30px">· ${what}</span>`);
      const pts = el('div', '', { fontFamily: 'Mono', fontSize: '32px', color: 'rgba(255,255,255,0.8)' }, top, `0 / ${max}`);
      const track = el('div', '', { height: '14px', marginTop: '14px', borderRadius: '99px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }, r);
      const bar = el('div', '', { height: '100%', width: `${(max / 8) * 100}%`, borderRadius: '99px', background: 'linear-gradient(90deg, #7dd3fc, #c4b5fd, #f9a8d4)', transformOrigin: '0 50%', transform: 'scaleX(0)' }, track);
      return { r, pts, bar, max };
    });
    S.total = el('div', 'abs center', { top: '1490px', opacity: 0 }, stage);
    S.num = el('span', 'h1', { fontSize: '150px' }, S.total, '0');
    el('span', 'h1', { fontSize: '70px', color: 'rgba(255,255,255,0.45)' }, S.total, ' / 36');
    S.hand = el('div', 'abs center hand', { top: '1680px', fontSize: '56px', opacity: 0 }, stage, 'every table shown. free.');
    vignette(stage);
    S.end = endCard(stage, { line: 'Match two charts. Free.', grad: 'Free.', cta: 'plutto.space/tools', sub: 'Guna Milan · Nadi and Bhakoot dosha · every table' });
  },
  async frame(t) {
    S.haze(t); S.haze2(t); S.stars(t);
    const out = ease.inCubic(prog(t, END - 0.6, END));
    rise(S.h1.spans, t - 0.2, { stagger: 0.08, out: END - 0.9 });
    rise(S.h2.spans, t - 0.5, { stagger: 0.08, out: END - 1.2 });
    S.h2.spans.forEach((s) => { s.style.backgroundPosition = `${ease.inOutCubic(prog(t, 0.9, 3)) * 150}% 0`; });
    let sum = 0;
    S.rows.forEach((row, i) => {
      const a = 1.4 + i * 0.62;
      const k = ease.outCubic(prog(t, a, a + 0.4));
      const fill = ease.inOutCubic(prog(t, a + 0.15, a + 0.85));
      set(row.r, { o: k * (1 - out), x: (1 - ease.outExpo(prog(t, a, a + 0.9))) * 60 });
      row.bar.style.transform = `scaleX(${fill})`;
      const got = Math.round(fill * row.max);
      row.pts.textContent = `${got} / ${row.max}`;
      sum += fill * row.max;
    });
    set(S.total, { o: ease.outCubic(prog(t, 1.4, 2)) * (1 - out) });
    S.num.textContent = String(Math.round(sum));
    set(S.hand, { o: inOut(t, 7.0, END - 0.6, 0.5), r: -3 });
    S.end(t - END);
  },
};
