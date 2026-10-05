/** POP 07 · 27 NAKSHATRAS — a colour wheel of the lunar mansions, one popping out at a time. */
import { el, set, prog, ease, W, POP, spring, popBg, sticker, slab, sparkles, popEnd, popScore } from '../lib.js';

const NAMES = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
const COLS = [POP.pink, POP.yellow, POP.cyan, POP.lime, POP.orange, POP.white, POP.magenta, POP.teal, POP.red];
const END = 11.2;
let S = {};
function wheel(g, t, sweep) {
  g.clearRect(0, 0, W, W);
  const cx = 540, cy = 540, R1 = 520, R0 = 250;
  g.save(); g.translate(cx, cy); g.rotate(-t * 0.08);
  for (let i = 0; i < 27; i++) {
    const a0 = (i / 27) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / 27) * Math.PI * 2 - Math.PI / 2, m = (a0 + a1) / 2;
    const d = Math.abs(((sweep - i) % 27 + 27) % 27), hot = Math.max(0, 1 - Math.min(d, 27 - d) / 1.2);
    const push = hot * 26;
    g.save(); g.translate(Math.cos(m) * push, Math.sin(m) * push);
    g.beginPath(); g.arc(0, 0, R1, a0, a1); g.arc(0, 0, R0, a1, a0, true); g.closePath();
    g.fillStyle = COLS[i % COLS.length]; g.fill(); g.strokeStyle = POP.ink; g.lineWidth = 6; g.stroke();
    g.rotate(m); g.fillStyle = POP.ink; g.font = `900 ${hot > 0.5 ? 30 : 25}px Inter`; g.textAlign = 'left'; g.textBaseline = 'middle';
    g.fillText(NAMES[i].toUpperCase(), R0 + 16, 0);
    g.restore();
  }
  g.restore();
  g.beginPath(); g.arc(cx, cy, R0 - 6, 0, 6.283); g.fillStyle = POP.ink; g.fill();
}
export default {
  duration: 13.6,
  score() { return popScore({ duration: this.duration, end: END, hits: [0.6, 0.9, 1.6, 2.2, 4.8, 5.4], tick: [0.1, 4.6] }); },
  async setup(stage) {
    S.bg = popBg(stage);
    S.spark = sparkles(stage, 8, 77, [POP.yellow, POP.white, POP.pink]);
    const c = el('canvas', 'abs', { left: 0, top: '430px' }, stage); c.width = W; c.height = W; S.g = c.getContext('2d'); S.c = c;
    S.num = slab(stage, '27', { size: 250, color: POP.yellow, style: { top: '840px' } });
    S.lab = el('div', 'abs center', { top: '1080px', fontSize: '38px', fontWeight: 900, color: POP.white, letterSpacing: '0.08em' }, stage, 'NAKSHATRAS');
    S.q = sticker(stage, 'The Moon was in one of these', { size: 58, style: { left: '50%', top: '200px' } });
    S.q2 = el('div', 'abs center hand', { top: '325px', fontSize: '74px', fontWeight: 700, color: POP.ink }, stage, 'the moment you were born.');
    S.d = sticker(stage, 'It sets your dasha', { bg: POP.yellow, size: 60, style: { left: '50%', top: '1560px' } });
    S.d2 = el('div', 'abs center hand', { top: '1690px', fontSize: '70px', fontWeight: 700, color: POP.ink }, stage, 'the chapters of your life.');
    S.end = popEnd(stage, { line: 'Find yours.', punch: 'Free.', cta: 'plutto.space/tools', sub: 'Moon sign · nakshatra · pada · dasha', bg: POP.pink });
  },
  async frame(t) {
    S.bg(t, POP.violet, { rays: POP.white, spin: 8 });
    S.spark(t, t < END ? 1 : 0);
    wheel(S.g, t, t * 2.6);
    set(S.c, { o: t < END ? 1 : 0, s: spring(prog(t, 0.1, 1)) });
    set(S.num.box, { o: t < END ? 1 : 0, s: spring(prog(t, 0.6, 1.2)) * (1 + 0.04 * Math.sin(t * 4)), r: -3 });
    set(S.lab, { o: t > 0.9 && t < END ? 1 : 0 });
    S.q.style.opacity = t > 1.6 && t < END ? 1 : 0; S.q.style.transform = `translateX(-50%) scale(${spring(prog(t, 1.6, 2.1))}) rotate(-2deg)`;
    set(S.q2, { o: t > 2.2 && t < END ? 1 : 0, r: -1 });
    S.d.style.opacity = t > 4.8 && t < END ? 1 : 0; S.d.style.transform = `translateX(-50%) scale(${spring(prog(t, 4.8, 5.3))}) rotate(2deg)`;
    set(S.d2, { o: t > 5.4 && t < END ? 1 : 0, r: -1 });
    S.end(t - END);
  },
};
