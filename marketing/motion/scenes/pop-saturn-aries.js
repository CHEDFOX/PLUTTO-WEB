/** POP 06 · SATURN ENTERS ARIES — 3 June 2027, 04:43 IST (sidereal); what it does to Sade Sati. */
import { el, set, prog, ease, lerp, W, POP, spring, popBg, sticker, slab, sparkles, popEnd, popScore } from '../lib.js';

const END = 12.4;
let S = {};
function saturn(g, t) {
  g.clearRect(0, 0, W, 900);
  const cx = 540, cy = 430, r = 200, tilt = -0.38;
  const ring = (front) => {
    g.save(); g.translate(cx, cy); g.rotate(tilt);
    for (const [rx, ry, col, w] of [[430, 120, POP.ink, 64], [430, 120, POP.cyan, 46], [340, 92, POP.ink, 14]]) {
      g.beginPath(); g.ellipse(0, 0, rx, ry, 0, front ? 0 : Math.PI, front ? Math.PI : 2 * Math.PI); g.strokeStyle = col; g.lineWidth = w; g.stroke();
    }
    g.restore();
  };
  ring(false);
  g.save(); g.beginPath(); g.arc(cx, cy, r, 0, 6.283); g.fillStyle = POP.cream; g.fill(); g.clip();
  g.translate(cx, cy); g.rotate(tilt);
  const bands = [[-150, 40, POP.orange], [-70, 34, POP.pink], [10, 44, POP.yellow], [95, 30, POP.pink], [150, 40, POP.orange]];
  bands.forEach(([y, h, c], i) => { g.fillStyle = c; g.fillRect(-r, y + Math.sin(t * 1.5 + i) * 4, 2 * r, h); });
  g.restore();
  g.beginPath(); g.arc(cx, cy, r, 0, 6.283); g.strokeStyle = POP.ink; g.lineWidth = 10; g.stroke();
  g.beginPath(); g.arc(cx - 70, cy - 80, 40, 0, 6.283); g.fillStyle = 'rgba(255,255,255,0.7)'; g.fill();
  ring(true);
}
export default {
  duration: 14.8,
  score() { return popScore({ duration: this.duration, end: END, hits: [0.6, 0.9, 2.2, ...S.rows.map((_, i) => 6.8 + i * 0.4), 8.6], cuts: [1.3, 6.4] }); },
  async setup(stage) {
    S.bg = popBg(stage);
    S.spark = sparkles(stage, 9, 66, [POP.yellow, POP.white, POP.cyan]);
    const c = el('canvas', 'abs', { left: 0, top: '130px' }, stage); c.width = W; c.height = 900; S.g = c.getContext('2d'); S.c = c;
    S.date = el('div', 'abs', { left: '50%', top: '1000px', background: POP.ink, color: POP.yellow, padding: '12px 28px', fontFamily: 'Mono', fontSize: '38px', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }, stage, '3 June 2027 · 04:43 IST');
    S.h1 = slab(stage, 'Saturn enters', { size: 132, style: { top: '1110px' } });
    S.h2 = slab(stage, 'Aries.', { size: 220, color: POP.yellow, echoes: 3, echoColor: POP.white, style: { top: '1250px' } });
    S.mesha = sticker(stage, 'Mesha, in Vedic astrology', { bg: POP.pink, size: 50, pad: '10px 30px', style: { left: '50%', top: '1500px', fontFamily: 'Hand', fontWeight: 700, letterSpacing: 0 } });
    S.head = sticker(stage, 'What it means for Sade Sati', { bg: POP.yellow, size: 58, style: { left: '50%', top: '250px', opacity: 0 } });
    S.rows = [['Taurus Moon', 'begins', POP.cyan], ['Aries Moon', 'the peak', POP.pink], ['Pisces Moon', 'final phase', POP.lime], ['Aquarius Moon', 'ends Feb 2028', POP.white]].map(([a, b, bg], i) =>
      sticker(stage, `${a} <span style="font-weight:700;opacity:.75">→ ${b}</span>`, { bg, size: 58, pad: '18px 34px', style: { left: '50%', top: `${470 + i * 250}px`, opacity: 0 } }));
    S.sid = el('div', 'abs', { left: '50%', top: '1500px', background: POP.ink, color: POP.white, padding: '10px 22px', fontFamily: 'Mono', fontSize: '26px', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0 }, stage, 'Sidereal (Lahiri) · Swiss Ephemeris');
    S.end = popEnd(stage, { line: 'Is it your turn?', punch: 'Check free.', cta: 'plutto.space/tools/sade-sati', sub: 'Every Sade Sati of your life · exact dates', bg: POP.violet });
  },
  async frame(t) {
    const A = t < 6.4;
    S.bg(t, A ? POP.orange : POP.violet, { rays: POP.white, spin: 10 });
    S.spark(t, t < END ? 1 : 0);
    saturn(S.g, t);
    set(S.c, { o: A ? 1 : 0, s: spring(prog(t, 0, 0.9)) * (1 + Math.sin(t * 1.2) * 0.015), r: Math.sin(t * 0.7) * 4, y: Math.sin(t * 1.1) * 10 });
    S.date.style.opacity = A && t > 0.6 ? 1 : 0; S.date.style.transform = `translateX(-50%) rotate(-2deg) scaleX(${ease.outExpo(prog(t, 0.6, 1))})`;
    set(S.h1.box, { o: A && t > 0.9 ? 1 : 0, s: spring(prog(t, 0.9, 1.4)), r: -2 });
    set(S.h2.box, { o: A && t > 1.3 ? 1 : 0, s: lerp(2, 1, Math.min(1, spring(prog(t, 1.3, 1.9)))), r: 3 });
    S.h2.echo.forEach((e, k) => { e.style.transform = `translate(${(k + 1) * 16 * ease.outCubic(prog(t, 1.5, 2))}px, ${(k + 1) * 16 * ease.outCubic(prog(t, 1.5, 2))}px)`; });
    S.mesha.style.opacity = A && t > 2.2 ? 1 : 0; S.mesha.style.transform = `translateX(-50%) scale(${spring(prog(t, 2.2, 2.7))}) rotate(-3deg)`;
    const B = t >= 6.4 && t < END;
    S.head.style.opacity = B ? 1 : 0; S.head.style.transform = `translateX(-50%) scale(${spring(prog(t, 6.4, 6.9))}) rotate(-2deg)`;
    S.rows.forEach((r, i) => { r.style.opacity = B && t > 6.8 + i * 0.4 ? 1 : 0; r.style.transform = `translateX(-50%) scale(${spring(prog(t, 6.8 + i * 0.4, 7.4 + i * 0.4))}) rotate(${[-2, 2, -1, 1][i]}deg)`; });
    S.sid.style.opacity = B && t > 8.6 ? 1 : 0; S.sid.style.transform = 'translateX(-50%) rotate(1deg)';
    S.end(t - END);
  },
};
