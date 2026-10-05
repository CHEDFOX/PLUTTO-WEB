/** POP 04 · MERCURY RETROGRADE — 24 Oct → 13 Nov 2026 (UTC), then 2027; the true loop drawn. */
import { el, set, prog, ease, lerp, W, POP, spring, popBg, sticker, slab, sparkles, badge, popEnd, popScore } from '../lib.js';

const TH0 = 0.75 * Math.PI, TH1 = 3.25 * Math.PI, R0 = 118, D0 = 210;
const cyc = (th) => [R0 * th - D0 * Math.sin(th), -D0 * Math.cos(th)];
const [XA] = cyc(TH0), [XB] = cyc(TH1);
const PATH = (u) => { const [x, y] = cyc(TH0 + u * (TH1 - TH0)); return [90 + ((x - XA) / (XB - XA)) * 900, 150 + y * 0.52]; };
const STILL = [2 * Math.PI - Math.acos(R0 / D0), 2 * Math.PI + Math.acos(R0 / D0)].map((th) => (th - TH0) / (TH1 - TH0));
const END = 12.0;
let S = {};
export default {
  duration: 14.4,
  score() { return popScore({ duration: this.duration, end: END, hits: [0.5, 0.8, 1.05, 1.4, 1.9, ...S.rows.map((_, i) => 6.7 + i * 0.35), 7.9], cuts: [6.4], tick: [2.0, 6.0] }); },
  async setup(stage) {
    S.bg = popBg(stage);
    S.spark = sparkles(stage, 8, 44, [POP.yellow, POP.white, POP.pink]);
    S.planet = badge(stage, 'mercury', { size: 520, style: { left: '280px', top: '170px' } });
    S.tag = el('div', 'abs', { left: '50%', top: '760px', background: POP.ink, color: POP.yellow, padding: '12px 28px', fontFamily: 'Mono', fontSize: '34px', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }, stage, 'Next Mercury retrograde');
    S.d1 = slab(stage, '24 Oct →', { size: 176, style: { top: '850px' } });
    S.d2 = slab(stage, '13 Nov', { size: 176, style: { top: '1015px' } });
    S.yr = sticker(stage, '2026', { bg: POP.yellow, size: 90, pad: '4px 36px', style: { left: '50%', top: '1190px' } });
    S.sign = sticker(stage, 'in Scorpio (Western) · Libra (Vedic)', { size: 38, pad: '12px 26px', r: 999, shadow: 8, style: { left: '50%', top: '1340px' } });
    const c = el('canvas', 'abs', { left: 0, top: '1440px' }, stage); c.width = W; c.height = 320; S.g = c.getContext('2d');
    S.then = el('div', 'abs', { left: '50%', top: '330px', background: POP.ink, color: POP.white, padding: '12px 28px', fontFamily: 'Mono', fontSize: '38px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0 }, stage, 'Then, in 2027');
    S.rows = [['9 Feb → 3 Mar', POP.yellow], ['10 Jun → 4 Jul', POP.pink], ['7 Oct → 28 Oct', POP.cyan]].map(([d, bg], i) => sticker(stage, d, { bg, size: 100, pad: '14px 44px', style: { left: '50%', top: `${520 + i * 260}px`, opacity: 0 } }));
    S.utc = el('div', 'abs', { left: '50%', top: '1330px', background: POP.ink, color: POP.white, padding: '10px 22px', fontFamily: 'Mono', fontSize: '26px', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0 }, stage, 'Dates in UTC · Swiss Ephemeris');
    S.end = popEnd(stage, { line: 'Every date.', punch: 'To the minute.', cta: 'plutto.space/sky-calendar', sub: 'Retrogrades · eclipses · transits · free', bg: POP.blue });
  },
  async frame(t) {
    const A = t < 6.4;
    S.bg(t, A ? POP.cyan : POP.orange, { rays: POP.white, spin: 12 });
    S.spark(t, t < END ? 1 : 0);
    set(S.planet, { o: A ? 1 : 0, s: spring(prog(t, 0, 0.8)), r: t * 12 });
    S.tag.style.opacity = A ? 1 : 0; S.tag.style.transform = `translateX(-50%) rotate(-2deg) scaleX(${ease.outExpo(prog(t, 0.5, 0.9))})`;
    set(S.d1.box, { o: A && t > 0.8 ? 1 : 0, s: spring(prog(t, 0.8, 1.3)), r: -2 });
    set(S.d2.box, { o: A && t > 1.05 ? 1 : 0, s: spring(prog(t, 1.05, 1.6)), r: 2 });
    S.yr.style.opacity = A && t > 1.4 ? 1 : 0; S.yr.style.transform = `translateX(-50%) scale(${spring(prog(t, 1.4, 1.9))}) rotate(-4deg)`;
    S.sign.style.opacity = A && t > 1.9 ? 1 : 0; S.sign.style.transform = `translateX(-50%) scale(${spring(prog(t, 1.9, 2.4))}) rotate(1deg)`;
    const g = S.g; g.clearRect(0, 0, W, 320);
    const draw = ease.inOutSine(prog(t, 2.0, 6.0));
    if (A && draw > 0) {
      const pts = []; for (let u = 0; u <= draw; u += 0.004) pts.push(PATH(u));
      const line = (w, c) => { g.lineWidth = w; g.strokeStyle = c; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); };
      line(18, POP.ink); line(8, POP.white);
      const [px, py] = PATH(draw);
      g.fillStyle = POP.yellow; g.strokeStyle = POP.ink; g.lineWidth = 6; g.beginPath(); g.arc(px, py, 20, 0, 6.283); g.fill(); g.stroke();
      const [a, b] = STILL.map(PATH);
      const tagAt = (txt, x, y, left) => { g.font = '900 26px Inter'; const w = g.measureText(txt).width + 26; const x0 = left ? x + 30 : x - 30 - w; g.fillStyle = POP.ink; g.fillRect(x0, y - 22, w, 44); g.fillStyle = POP.yellow; g.textBaseline = 'middle'; g.textAlign = 'left'; g.fillText(txt, x0 + 13, y + 1); };
      if (draw > STILL[0]) tagAt('STATIONS RETROGRADE', a[0], a[1], true);
      if (draw > STILL[1]) tagAt('STATIONS DIRECT', b[0], b[1] + 60, false);
    }
    const B = t >= 6.4 && t < END;
    S.then.style.opacity = B ? 1 : 0; S.then.style.transform = `translateX(-50%) rotate(-2deg) scaleX(${ease.outExpo(prog(t, 6.4, 6.8))})`;
    S.rows.forEach((r, i) => { r.style.opacity = B && t > 6.7 + i * 0.35 ? 1 : 0; r.style.transform = `translateX(-50%) scale(${spring(prog(t, 6.7 + i * 0.35, 7.3 + i * 0.35))}) rotate(${[-3, 2, -1][i]}deg)`; });
    S.utc.style.opacity = B && t > 7.9 ? 1 : 0; S.utc.style.transform = 'translateX(-50%) rotate(1deg)';
    S.end(t - END);
  },
};
