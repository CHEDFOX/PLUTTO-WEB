/** POP 08 · 36 GUNAS — eight chunky bars fill to the classical maxima; the total counts to 36. */
import { el, set, prog, ease, POP, spring, popBg, sticker, slab, sparkles, popEnd, popScore } from '../lib.js';

const K = [['Varna', 1], ['Vashya', 2], ['Tara', 3], ['Yoni', 4], ['Graha Maitri', 5], ['Gana', 6], ['Bhakoot', 7], ['Nadi', 8]];
const COLS = [POP.cyan, POP.yellow, POP.lime, POP.orange, POP.pink, POP.teal, POP.violet, POP.red];
const END = 11.2;
let S = {};
export default {
  duration: 13.6,
  score() { return popScore({ duration: this.duration, end: END, hits: [0.1, 0.6, ...K.map((_, i) => 1.2 + i * 0.62), 7.1], cuts: [6.3] }); },
  async setup(stage) {
    S.bg = popBg(stage);
    S.spark = sparkles(stage, 8, 88, [POP.yellow, POP.white]);
    S.h = slab(stage, '36 gunas.', { size: 190, color: POP.yellow, echoes: 2, echoColor: POP.white, style: { top: '170px' } });
    S.sub = sticker(stage, 'Kundli matching, the classical way', { size: 48, pad: '12px 30px', style: { left: '50%', top: '400px' } });
    S.rows = K.map(([n, max], i) => {
      const r = el('div', 'abs', { left: '80px', right: '80px', top: `${540 + i * 122}px`, opacity: 0 }, stage);
      const head = el('div', '', { display: 'flex', justifyContent: 'space-between', fontSize: '40px', fontWeight: 900, color: POP.white, textShadow: `4px 4px 0 ${POP.ink}`, WebkitTextStroke: `2px ${POP.ink}`, paintOrder: 'stroke fill' }, r);
      el('div', '', {}, head, n.toUpperCase());
      const pts = el('div', '', { fontFamily: 'Mono' }, head, `0/${max}`);
      const track = el('div', '', { height: '34px', marginTop: '8px', border: `5px solid ${POP.ink}`, borderRadius: '99px', background: POP.white, overflow: 'hidden', width: `${30 + (max / 8) * 70}%`, boxShadow: `6px 6px 0 ${POP.ink}` }, r);
      const bar = el('div', '', { height: '100%', background: COLS[i], borderRight: `5px solid ${POP.ink}`, transformOrigin: '0 50%', transform: 'scaleX(0)' }, track);
      return { r, pts, bar, max };
    });
    S.tot = slab(stage, '0/36', { size: 170, style: { top: '1540px' } });
    S.hand = sticker(stage, 'every table shown. free.', { bg: POP.yellow, size: 46, pad: '8px 26px', r: 12, shadow: 8, style: { left: '50%', top: '1730px', fontFamily: 'Hand', fontWeight: 700, letterSpacing: 0, opacity: 0 } });
    S.end = popEnd(stage, { line: 'Match two charts.', punch: 'Free.', cta: 'plutto.space/tools', sub: 'Guna Milan · Nadi and Bhakoot dosha · every table', bg: POP.violet });
  },
  async frame(t) {
    S.bg(t, POP.pink, { rays: POP.white, spin: 10 });
    S.spark(t, t < END ? 1 : 0);
    const on = t < END;
    set(S.h.box, { o: on ? 1 : 0, s: spring(prog(t, 0.1, 0.7)), r: -2 });
    S.h.echo.forEach((e, k) => { e.style.transform = `translate(${(k + 1) * 14}px, ${(k + 1) * 14}px)`; });
    S.sub.style.opacity = on && t > 0.6 ? 1 : 0; S.sub.style.transform = `translateX(-50%) scale(${spring(prog(t, 0.6, 1.1))}) rotate(1deg)`;
    let sum = 0;
    S.rows.forEach((row, i) => {
      const a = 1.2 + i * 0.62, fill = ease.inOutCubic(prog(t, a + 0.15, a + 0.8));
      row.r.style.opacity = on && t > a ? 1 : 0;
      row.r.style.transform = `translateX(${(1 - spring(prog(t, a, a + 0.5))) * -80}px)`;
      row.bar.style.transform = `scaleX(${fill})`;
      row.pts.textContent = `${Math.round(fill * row.max)}/${row.max}`;
      sum += fill * row.max;
    });
    S.tot.main.textContent = `${Math.round(sum)}/36`; S.tot.echo.forEach((e) => { e.textContent = S.tot.main.textContent; });
    const done = sum > 35.9;
    set(S.tot.box, { o: on && t > 1.2 ? 1 : 0, s: done ? spring(prog(t, 6.3, 6.9)) * 1.0 : 1, r: done ? -3 : 0 });
    S.tot.main.style.color = done ? POP.yellow : POP.white;
    S.hand.style.opacity = on && t > 7.1 ? 1 : 0; S.hand.style.transform = `translateX(-50%) scale(${spring(prog(t, 7.1, 7.6))}) rotate(-3deg)`;
    S.end(t - END);
  },
};
