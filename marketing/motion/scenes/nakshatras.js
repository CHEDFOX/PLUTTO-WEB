/**
 * 07 · 27 NAKSHATRAS — the lunar mansions as a turning wheel; a light sweeps
 * them one by one. The names and order are the site's reference data.
 */
import { el, set, words, rise, haze, stars, vignette, endCard, prog, ease, inOut, lerp, W } from '../lib.js';

const NAMES = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
const END = 11.0;
let S = {};

function wheel(g, t, k, sweep) {
  g.clearRect(0, 0, W, W);
  if (k <= 0) return;
  const cx = 540, cy = 540, R = 470;
  g.save(); g.globalAlpha = k;
  g.translate(cx, cy); g.rotate(-t * 0.06);
  for (let i = 0; i < 27; i++) {
    const a = (i / 27) * Math.PI * 2 - Math.PI / 2;
    const d = Math.abs(((sweep - i) % 27 + 27) % 27);
    const glow = Math.max(0, 1 - Math.min(d, 27 - d) / 2.2);
    g.strokeStyle = `rgba(255,255,255,${0.12 + glow * 0.5})`; g.lineWidth = 2;
    g.beginPath(); g.moveTo(Math.cos(a) * (R - 250), Math.sin(a) * (R - 250)); g.lineTo(Math.cos(a) * (R - 215), Math.sin(a) * (R - 215)); g.stroke();
    const m = a + Math.PI / 27;
    g.save(); g.rotate(m);
    g.font = `${glow > 0.5 ? 700 : 600} ${glow > 0.5 ? 31 : 27}px Inter`;
    g.fillStyle = glow > 0.02 ? `rgba(${Math.round(lerp(255, 196, glow))},${Math.round(lerp(255, 181, glow))},255,${0.55 + glow * 0.45})` : 'rgba(255,255,255,0.5)';
    g.textAlign = 'left'; g.textBaseline = 'middle';
    g.fillText(NAMES[i], R - 205, 0);
    g.restore();
  }
  g.beginPath(); g.arc(0, 0, R - 250, 0, 6.283); g.strokeStyle = 'rgba(167,139,250,0.35)'; g.lineWidth = 2; g.stroke();
  g.restore();
}

export default {
  duration: 13.4,
  async setup(stage) {
    S.haze = haze(stage, { x: 0.5, y: 0.48, alpha: 0.24 });
    S.stars = stars(stage, { seed: 77, n: 220, speed: 2 });
    const c = el('canvas', 'abs', { left: 0, top: '420px' }, stage);
    c.width = W; c.height = W; S.g = c.getContext('2d'); S.canvas = c;
    S.num = el('div', 'abs center h1 grad', { top: '810px', fontSize: '230px', paddingRight: '0.04em', opacity: 0 }, stage, '27');
    S.label = el('div', 'abs center', { top: '1060px', fontSize: '44px', fontWeight: 700, letterSpacing: '0.02em', opacity: 0 }, stage, 'nakshatras');
    S.t1 = el('div', 'abs center', { top: '220px' }, stage);
    S.a = words(S.t1, 'The Moon was in one of these', 'h1', { fontSize: '72px' });
    S.b = words(S.t1, 'the moment you were born.', 'h1 grad', { fontSize: '72px' });
    S.b.spans.forEach((s) => { s.classList.add('grad'); s.style.paddingRight = '0.04em'; });
    S.t2 = el('div', 'abs center', { top: '1560px', opacity: 0 }, stage);
    el('div', 'h1', { fontSize: '60px', fontWeight: 700 }, S.t2, 'It sets your dasha —');
    el('div', 'hand', { fontSize: '68px' }, S.t2, 'the chapters of your life.');
    vignette(stage);
    S.end = endCard(stage, { line: 'Find yours. Free.', grad: 'Free.', cta: 'plutto.space/tools', sub: 'Moon sign · nakshatra · pada · dasha' });
  },
  async frame(t) {
    S.haze(t); S.stars(t);
    const k = ease.outExpo(prog(t, 0.2, 1.8)) * (1 - ease.inCubic(prog(t, END - 0.6, END)));
    wheel(S.g, t, k, t * 2.4);
    set(S.canvas, { s: lerp(0.85, 1, ease.outExpo(prog(t, 0.2, 2))) });
    const s = S.num; S.num.style.backgroundPosition = `${(t * 18) % 300}% 0`;
    set(s, { o: inOut(t, 0.9, END - 0.7, 0.6), s: lerp(1.2, 1, ease.outExpo(prog(t, 0.9, 1.8))) });
    set(S.label, { o: inOut(t, 1.3, END - 0.7, 0.6) });
    rise(S.a.spans, t - 2.0, { stagger: 0.07, out: END - 2.7 });
    rise(S.b.spans, t - 2.4, { stagger: 0.07, out: END - 3.1 });
    set(S.t2, { o: inOut(t, 5.2, END - 0.6, 0.6), y: (1 - ease.outExpo(prog(t, 5.2, 6))) * 30 });
    S.end(t - END);
  },
};
