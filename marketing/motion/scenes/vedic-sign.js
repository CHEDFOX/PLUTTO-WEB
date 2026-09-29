/**
 * 03 · YOUR VEDIC SIGN IS PROBABLY DIFFERENT — the hook everyone argues
 * about, explained in one picture: two zodiacs, 24° apart. The numbers are
 * the site's: Lahiri ayanamsa 24°13′ in 2026; the Sun enters sidereal Leo on
 * 17 August 2026 (computed with Swiss Ephemeris).
 */
import { el, set, words, rise, haze, stars, vignette, scribble, endCard, prog, ease, inOut, lerp, W } from '../lib.js';

const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const AYAN = 24 + 13 / 60;
const END = 12.6;
let S = {};

function wheel(g, cx, cy, rot, t, focus, arcAlpha = 1) {
  g.clearRect(0, 0, W, 1200);
  const R1 = 470, R2 = 390, R3 = 300;
  const seg = (r0, r1, a0, a1) => { g.beginPath(); g.arc(cx, cy, r1, a0, a1); g.arc(cx, cy, r0, a1, a0, true); g.closePath(); };
  const ang = (deg) => (-90 - deg) * Math.PI / 180;   // 0° at the top, counter-clockwise like a chart
  // Outer: tropical (Western). Inner: sidereal (Vedic), turned by the ayanamsa.
  for (const [r0, r1, off, label, color] of [[R2, R1, 0, 'W', 'rgba(255,255,255,'], [R3, R2 - 8, rot, 'V', 'rgba(167,139,250,']]) {
    for (let i = 0; i < 12; i++) {
      const a0 = ang(i * 30 + off), a1 = ang((i + 1) * 30 + off);
      seg(r0, r1, a1, a0);
      const on = SIGNS[i] === 'Leo' && focus > 0;
      g.fillStyle = `${color}${on ? 0.16 + 0.1 * focus : 0.035})`;
      g.fill();
      g.strokeStyle = `${color}0.35)`; g.lineWidth = 2; g.stroke();
      const mid = ang(i * 30 + 15 + off), rr = (r0 + r1) / 2;
      g.save(); g.translate(cx + Math.cos(mid) * rr, cy + Math.sin(mid) * rr); g.rotate(mid + Math.PI / 2);
      g.fillStyle = `${color}${on ? 1 : 0.8})`;
      g.font = `${label === 'W' ? 600 : 600} ${label === 'W' ? 30 : 26}px Inter`;
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(SIGNS[i], 0, 0); g.restore();
    }
  }
  // The gap: an arc from the tropical 0° to the sidereal 0°, in the brand gradient.
  if (rot > 0.2 && arcAlpha > 0.01) {
    g.save(); g.globalAlpha = arcAlpha;
    const grad = g.createLinearGradient(cx - 200, 0, cx + 200, 0);
    grad.addColorStop(0, '#7dd3fc'); grad.addColorStop(0.5, '#c4b5fd'); grad.addColorStop(1, '#f9a8d4');
    g.strokeStyle = grad; g.lineWidth = 10; g.lineCap = 'round';
    g.beginPath(); g.arc(cx, cy, R1 + 34, ang(rot), ang(0)); g.stroke();
    g.fillStyle = '#fff'; g.font = '800 44px Inter'; g.textAlign = 'center';
    const m = ang(rot / 2);
    const mins = Math.round(rot * 60);
    g.fillText(`${Math.floor(mins / 60)}°${String(mins % 60).padStart(2, '0')}′`, cx + Math.cos(m) * (R1 + 92), cy + Math.sin(m) * (R1 + 92));
    g.restore();
  }
  // Legend.
  g.font = '500 24px Mono'; g.textAlign = 'center'; g.fillStyle = 'rgba(255,255,255,0.55)';
  g.fillText('OUTER · WESTERN (TROPICAL)', cx, cy - 18);
  g.fillStyle = 'rgba(167,139,250,0.9)'; g.fillText('INNER · VEDIC (SIDEREAL)', cx, cy + 22);
}

export default {
  duration: 15,
  async setup(stage) {
    S.haze = haze(stage, { x: 0.5, y: 0.5, alpha: 0.2 });
    S.stars = stars(stage, { seed: 33, n: 180, speed: 2 });
    S.hook = el('div', 'abs center', { top: '250px' }, stage);
    S.h1 = words(S.hook, 'You’re a Leo.', 'h1', { fontSize: '150px' });
    S.strike = scribble(S.hook, 'M 560 90 C 640 70, 760 96, 860 72', { left: 0, top: 0, width: '1080px', height: '200px' }, { width: 9, color: '#f9a8d4' });
    S.nope = el('div', 'abs hand', { left: '600px', top: '400px', fontSize: '96px', color: '#f9a8d4', transform: 'rotate(-6deg)', opacity: 0 }, stage, 'probably not.');
    const c = el('canvas', 'abs', { left: 0, top: '600px' }, stage);
    c.width = W; c.height = 1200;
    S.g = c.getContext('2d'); S.canvas = c;
    S.caps = [
      ['Western astrology measures the zodiac', 'from the spring equinox.', 3.0, 5.0],
      ['Vedic astrology measures it', 'against the stars.', 5.1, 7.1],
      ['Over the centuries', 'they’ve drifted 24° apart.', 7.2, 9.4],
    ].map(([a, b, t0, t1]) => { const box = el('div', 'abs center', { top: '400px', opacity: 0 }, stage); el('div', 'h1', { fontSize: '56px', fontWeight: 700, color: 'rgba(255,255,255,0.72)' }, box, a); el('div', 'h1', { fontSize: '64px' }, box, b); return { box, t0, t1 }; });
    S.eg = el('div', 'abs center', { top: '330px', opacity: 0 }, stage);
    el('div', 'h1', { fontSize: '50px', fontWeight: 700, color: 'rgba(255,255,255,0.72)' }, S.eg, 'Born 23 July – 16 August?');
    el('div', 'h1', { fontSize: '64px', marginTop: '6px' }, S.eg, 'Western Leo. <span class="grad" style="padding-right:0.05em">Vedic Cancer.</span>');
    el('div', 'hand', { fontSize: '54px', marginTop: '8px' }, S.eg, 'same sky. different ruler.');
    vignette(stage);
    S.end = endCard(stage, { line: 'Find your real sign. Free.', grad: 'Free.', cta: 'plutto.space/tools', sub: 'Moon sign · nakshatra · dasha · in your browser' });
  },
  async frame(t) {
    S.haze(t); S.stars(t);
    rise(S.h1.spans, t - 0.2, { stagger: 0.1, out: 2.6 });
    S.strike(ease.inOutCubic(prog(t, 1.05, 1.45)) * (1 - ease.inCubic(prog(t, 2.6, 2.9))));
    set(S.nope, { o: inOut(t, 1.3, 2.6, 0.3), s: lerp(1.25, 1, ease.outBack(prog(t, 1.3, 1.8))), r: -6 });
    const wIn = ease.outExpo(prog(t, 2.6, 3.8)), wOut = ease.inCubic(prog(t, END - 0.6, END));
    const rot = AYAN * ease.inOutCubic(prog(t, 5.6, 8.4));
    wheel(S.g, 540, 600, rot, t, prog(t, 9.3, 10), 1 - ease.inOutCubic(prog(t, 9.2, 9.6)));
    set(S.canvas, { o: wIn * (1 - wOut), s: lerp(0.86, 1, wIn), r: (1 - wIn) * -20 + t * 0.6 });
    S.caps.forEach(({ box, t0, t1 }) => set(box, { o: inOut(t, t0, t1 - 0.4, 0.4), y: (1 - ease.outExpo(prog(t, t0, t0 + 0.8))) * 30 }));
    set(S.eg, { o: inOut(t, 9.5, END - 0.6, 0.5), y: (1 - ease.outExpo(prog(t, 9.5, 10.3))) * 30 });
    S.eg.querySelector('.grad').style.backgroundPosition = `${ease.inOutCubic(prog(t, 9.9, 11.8)) * 150}% 0`;
    S.end(t - END);
  },
};
