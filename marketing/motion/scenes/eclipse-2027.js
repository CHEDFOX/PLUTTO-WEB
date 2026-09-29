/**
 * 05 · THE ECLIPSE OF 2 AUGUST 2027 — a total solar eclipse, greatest at
 * 10:06 UTC at 25.5°N 33.2°E (Egypt), the Sun in tropical Leo / sidereal
 * Cancer; one of five eclipses in 2027. All from the site's Swiss Ephemeris
 * data. The Moon crosses the Sun art; at totality the corona opens.
 */
import { ASSET, el, set, words, rise, haze, stars, vignette, img, endCard, prog, ease, inOut, lerp, W } from '../lib.js';

const TOT = 5.2, END = 12.2;
let S = {};

export default {
  duration: 14.5,
  async setup(stage) {
    S.haze = haze(stage, { color: '251,146,60', x: 0.5, y: 0.36, size: 1100, alpha: 0.14 });
    S.stars = stars(stage, { seed: 55, n: 260, speed: 1.5 });
    S.stage = stage;
    // The Sun, its corona (a canvas), and the Moon's disc.
    const c = el('canvas', 'abs', { left: 0, top: '200px' }, stage);
    c.width = W; c.height = 1000; S.g = c.getContext('2d'); S.canvas = c;
    S.sun = img(stage, `${ASSET}/planets/sun.png`, { left: '215px', top: '240px', width: '650px', height: '836px', mixBlendMode: 'screen' });
    S.moon = el('div', 'abs', { left: '0', top: '0', width: '468px', height: '468px', borderRadius: '50%', background: 'radial-gradient(circle at 40% 38%, #07070a, #000 70%)', boxShadow: '0 0 0 1px rgba(255,255,255,0.04)' }, stage);
    S.date = el('div', 'abs center eyebrow', { top: '1180px', fontSize: '44px', opacity: 0 }, stage, '2 August 2027');
    S.head = el('div', 'abs center', { top: '1250px' }, stage);
    S.h = words(S.head, 'Total solar eclipse.', 'h1', { fontSize: '112px' });
    S.facts = el('div', 'abs center', { top: '1420px', fontSize: '38px', fontWeight: 600, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, opacity: 0 }, stage,
      'Greatest over Egypt · 10:06 UTC<br>The Sun in Leo (Western) · Cancer (Vedic)');
    S.list = el('div', 'abs center', { top: '1180px', opacity: 0 }, stage);
    el('div', 'eyebrow', { fontSize: '40px', marginBottom: '14px' }, S.list, 'All five eclipses of 2027');
    S.rows = [['6 Feb', 'annular solar'], ['20 Feb', 'penumbral lunar'], ['18 Jul', 'penumbral lunar'], ['2 Aug', 'total solar'], ['17 Aug', 'penumbral lunar']]
      .map(([d, k]) => el('div', 'h1', { fontSize: '58px', marginTop: '10px', fontWeight: k === 'total solar' ? 800 : 700, color: k === 'total solar' ? '#fff' : 'rgba(255,255,255,0.7)', opacity: 0 }, S.list, `${d} <span style="font-weight:600;color:rgba(255,255,255,0.5)">· ${k}</span>`));
    vignette(stage);
    S.end = endCard(stage, { line: 'Every eclipse. Computed.', grad: 'Computed.', cta: 'plutto.space/sky-calendar', sub: 'Swiss Ephemeris · Western and Vedic' });
  },
  async frame(t) {
    S.haze(t); S.stars(t);
    // The Moon's path: from lower right, across the centre, out upper left.
    // Approach, park exactly on the disc for totality, then leave.
    const cx = 534, cy = 664;                               // the Sun's disc on the stage (measured)
    const off = t < TOT ? -(1 - ease.outCubic(prog(t, 0.3, TOT))) : ease.inCubic(prog(t, TOT + 1.2, 9.8));
    const mx = cx - off * 700, my = cy - off * 420;
    const d = Math.hypot(mx - cx, my - cy);
    const cover = 1 - Math.min(1, d / 330);                 // 1 at totality
    const total = Math.max(0, 1 - d / 26);
    const fadeAll = 1 - ease.inCubic(prog(t, END - 0.6, END));
    S.moon.style.transform = `translate(${mx - 234}px, ${my - 234}px)`;
    S.moon.style.opacity = ease.outCubic(prog(t, 0.2, 1.2)) * fadeAll;
    set(S.sun, { o: (0.35 + 0.65 * (1 - cover * 0.85)) * fadeAll, s: 1 + Math.sin(t * 0.8) * 0.01 });
    S.haze(t);
    // Corona and the diamond ring.
    const g = S.g; g.clearRect(0, 0, W, 1000);
    const k = Math.pow(cover, 3) * fadeAll;
    if (k > 0.01) {
      const oy = cy - 200;
      for (let i = 0; i < 90; i++) {
        const a = (i / 90) * Math.PI * 2 + Math.sin(i * 7.3) * 0.05;
        const len = 150 + 170 * Math.abs(Math.sin(i * 2.17 + 1.3)) + 40 * Math.sin(t * 1.5 + i);
        const grd = g.createLinearGradient(cx + Math.cos(a) * 234, oy + Math.sin(a) * 234, cx + Math.cos(a) * (234 + len), oy + Math.sin(a) * (234 + len));
        grd.addColorStop(0, `rgba(255,250,240,${0.5 * k})`); grd.addColorStop(1, 'rgba(255,250,240,0)');
        g.strokeStyle = grd; g.lineWidth = 3 + (i % 3);
        g.beginPath(); g.moveTo(cx + Math.cos(a) * 234, oy + Math.sin(a) * 234); g.lineTo(cx + Math.cos(a) * (234 + len), oy + Math.sin(a) * (234 + len)); g.stroke();
      }
      const halo = g.createRadialGradient(cx, oy, 228, cx, oy, 470);
      halo.addColorStop(0, `rgba(255,255,255,${0.75 * k})`); halo.addColorStop(0.2, `rgba(220,215,255,${0.3 * k})`); halo.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = halo; g.beginPath(); g.arc(cx, oy, 470, 0, 6.283); g.fill();
      const ring = Math.max(0, 1 - Math.abs(t - (TOT + 1.35)) / 0.3) * fadeAll;   // the diamond ring, as the Moon moves off
      if (ring > 0) {
        const bx = cx - 170, by = oy - 150;
        const flare = g.createRadialGradient(bx, by, 0, bx, by, 180);
        flare.addColorStop(0, `rgba(255,255,255,${ring})`); flare.addColorStop(0.15, `rgba(255,245,230,${0.7 * ring})`); flare.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = flare; g.beginPath(); g.arc(bx, by, 180, 0, 6.283); g.fill();
      }
    }
    void total;
    set(S.date, { o: inOut(t, 1.0, 7.4, 0.5) });
    rise(S.h.spans, t - 1.3, { stagger: 0.09, out: 6.0 });
    set(S.facts, { o: inOut(t, 2.2, 7.4, 0.6), y: (1 - ease.outExpo(prog(t, 2.2, 3))) * 24 });
    set(S.list, { o: inOut(t, 7.9, END - 0.6, 0.3) });
    S.rows.forEach((r, i) => set(r, { o: ease.outCubic(prog(t, 8.1 + i * 0.25, 8.6 + i * 0.25)), y: (1 - ease.outExpo(prog(t, 8.1 + i * 0.25, 8.9 + i * 0.25))) * 40 }));
    S.end(t - END);
  },
};
