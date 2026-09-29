/**
 * 06 · SATURN ENTERS ARIES — 3 June 2027, 04:43 IST (2 June 23:13 UTC),
 * sidereal (Lahiri), from the site's Swiss Ephemeris data; a retrograde
 * return to Pisces 20 Oct 2027 and back into Aries 23 Feb 2028. What that
 * does to Sade Sati, sign by sign (Saturn in the 12th/1st/2nd from the Moon).
 * The site has no Saturn render, so Saturn is drawn: a banded sphere, rings.
 */
import { el, set, words, rise, haze, stars, vignette, endCard, prog, ease, inOut, lerp, W } from '../lib.js';

const END = 12.4;
let S = {};

function saturn(g, t, k) {
  g.clearRect(0, 0, W, 900);
  if (k <= 0) return;
  const cx = 540, cy = 430, r = 210;
  g.save(); g.globalAlpha = k;
  const tilt = -0.42, rx = 430, ry = 110;
  const ring = (front) => {
    for (let i = 0; i < 26; i++) {
      const s = 1 + i * 0.022;
      g.beginPath(); g.ellipse(cx, cy, rx * s * 0.62 + 120, ry * s * 0.62 + 30, tilt, front ? 0 : Math.PI, front ? Math.PI : 2 * Math.PI);
      const band = 0.18 + 0.22 * Math.abs(Math.sin(i * 1.7));
      g.strokeStyle = `rgba(226,210,180,${i === 14 || i === 15 ? 0.03 : band})`;
      g.lineWidth = 3.2; g.stroke();
    }
  };
  ring(false);
  // The globe, banded, lit from the upper left.
  g.save(); g.beginPath(); g.arc(cx, cy, r, 0, 6.283); g.clip();
  const base = g.createRadialGradient(cx - 80, cy - 90, 20, cx, cy, r * 1.15);
  base.addColorStop(0, '#f1e3c6'); base.addColorStop(0.55, '#c9ae82'); base.addColorStop(1, '#3b2f22');
  g.fillStyle = base; g.fillRect(cx - r, cy - r, 2 * r, 2 * r);
  g.translate(cx, cy); g.rotate(tilt);
  for (let i = -6; i <= 6; i++) {
    g.fillStyle = `rgba(${i % 2 ? '120,95,60' : '250,235,205'},${0.07 + 0.05 * Math.abs(Math.sin(i + t * 0.3))})`;
    g.fillRect(-r, i * 30 - 8, 2 * r, 16);
  }
  g.restore();
  g.save(); g.beginPath(); g.arc(cx, cy, r, 0, 6.283); g.clip();
  const shade = g.createRadialGradient(cx + 140, cy + 150, 10, cx + 60, cy + 70, r * 1.3);
  shade.addColorStop(0, 'rgba(0,0,0,0.75)'); shade.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = shade; g.fillRect(cx - r, cy - r, 2 * r, 2 * r);
  g.restore();
  ring(true);
  g.restore();
}

export default {
  duration: 14.6,
  async setup(stage) {
    S.haze = haze(stage, { color: '217,180,120', x: 0.5, y: 0.26, size: 1100, alpha: 0.12 });
    S.haze2 = haze(stage, { x: 0.2, y: 0.75, alpha: 0.18 });
    S.stars = stars(stage, { seed: 66, n: 240, speed: 2.5 });
    const c = el('canvas', 'abs', { left: 0, top: '120px' }, stage);
    c.width = W; c.height = 900; S.g = c.getContext('2d'); S.canvas = c;
    S.date = el('div', 'abs center eyebrow', { top: '960px', fontSize: '44px', opacity: 0 }, stage, '3 June 2027 · 04:43 IST');
    S.head = el('div', 'abs center', { top: '1030px' }, stage);
    S.h1 = words(S.head, 'Saturn enters', 'h1', { fontSize: '120px' });
    S.h2 = words(S.head, 'Aries.', 'h1', { fontSize: '120px' });
    S.h2.spans.forEach((s) => { s.classList.add('grad'); s.style.paddingRight = '0.05em'; });
    S.sub = el('div', 'abs center hand', { top: '1330px', fontSize: '60px', opacity: 0 }, stage, 'Mesha, in Vedic astrology.');
    S.list = el('div', 'abs', { left: '90px', right: '90px', top: '960px', opacity: 0 }, stage);
    el('div', 'eyebrow', { fontSize: '40px', marginBottom: '26px', textAlign: 'center' }, S.list, 'What it means for Sade Sati');
    S.rows = [
      ['Taurus Moon', 'Sade Sati begins'],
      ['Aries Moon', 'the peak'],
      ['Pisces Moon', 'the final phase'],
      ['Aquarius Moon', 'ends, finally, Feb 2028'],
    ].map(([a, b]) => {
      const r = el('div', '', { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '26px 6px', borderTop: '1.5px solid rgba(255,255,255,0.12)', opacity: 0 }, S.list);
      el('div', 'h1', { fontSize: '52px', whiteSpace: 'nowrap' }, r, a);
      el('div', '', { fontSize: '36px', fontWeight: 600, color: 'rgba(255,255,255,0.72)', textAlign: 'right' }, r, b);
      return r;
    });
    S.foot = el('div', 'abs center caps', { top: '1600px', fontSize: '22px', opacity: 0 }, stage, 'Sidereal (Lahiri) · Swiss Ephemeris');
    vignette(stage);
    S.end = endCard(stage, { line: 'Is it your turn? Check free.', grad: 'Check free.', cta: 'plutto.space/tools/sade-sati', sub: 'Every Sade Sati of your life · exact dates' });
  },
  async frame(t) {
    S.haze(t); S.haze2(t); S.stars(t);
    const k = ease.outExpo(prog(t, 0, 1.8)) * (1 - ease.inCubic(prog(t, END - 0.6, END)));
    saturn(S.g, t, k);
    set(S.canvas, { s: lerp(0.8, 1, ease.outExpo(prog(t, 0, 2))) + t * 0.006, y: Math.sin(t * 0.8) * 8, r: Math.sin(t * 0.3) * 1.5 });
    set(S.date, { o: inOut(t, 0.9, 5.8, 0.5) });
    rise(S.h1.spans, t - 1.1, { stagger: 0.09, out: 4.9 });
    rise(S.h2.spans, t - 1.45, { stagger: 0.09, out: 4.6 });
    S.h2.spans.forEach((s) => { s.style.backgroundPosition = `${ease.inOutCubic(prog(t, 1.8, 4)) * 150}% 0`; });
    set(S.sub, { o: inOut(t, 2.3, 5.8, 0.5), y: (1 - ease.outExpo(prog(t, 2.3, 3.1))) * 24 });
    set(S.list, { o: inOut(t, 6.6, END - 0.6, 0.3) });
    S.rows.forEach((r, i) => set(r, { o: ease.outCubic(prog(t, 6.8 + i * 0.4, 7.4 + i * 0.4)), x: (1 - ease.outExpo(prog(t, 6.8 + i * 0.4, 7.8 + i * 0.4))) * 60 }));
    set(S.foot, { o: inOut(t, 6.8, END - 0.6, 0.5) * 0.9 });
    S.end(t - END);
  },
};
