/**
 * 04 · MERCURY RETROGRADE — the next one and the three after it, from the
 * site's Swiss Ephemeris data (app/lib/data/ephemeris.json): stations
 * 24 Oct 2026 07:12 UTC and 13 Nov 2026 15:53 UTC, in tropical Scorpio /
 * sidereal Libra; 2027: 9 Feb–3 Mar, 10 Jun–4 Jul, 7–28 Oct. The loop is what
 * retrograde looks like from Earth: the planet slows, backs up, and goes on.
 */
import { ASSET, el, set, words, rise, haze, stars, vignette, img, endCard, prog, ease, inOut, lerp, W } from '../lib.js';

const END = 11.9;
let S = {};

// The apparent path: forward, a loop back, forward again.
// A prolate cycloid — the true shape of apparent retrograde motion: the
// planet's own orbit (radius d) seen from an observer moving at speed r < d.
const TH0 = 0.75 * Math.PI, TH1 = 3.25 * Math.PI, R0 = 118, D0 = 210;
const cyc = (th) => [R0 * th - D0 * Math.sin(th), -D0 * Math.cos(th)];
const [XA] = cyc(TH0), [XB] = cyc(TH1);
const PATH = (u) => {
  const [x, y] = cyc(TH0 + u * (TH1 - TH0));
  return [90 + ((x - XA) / (XB - XA)) * 900, 150 + y * 0.52];
};
// Where the planet stands still: dx/dθ = r − d·cos θ = 0 — first the loop's
// right extreme (it stations retrograde, having moved right), then its left.
const STILL = [2 * Math.PI - Math.acos(R0 / D0), 2 * Math.PI + Math.acos(R0 / D0)].map((th) => (th - TH0) / (TH1 - TH0));

export default {
  duration: 14.2,
  async setup(stage) {
    S.haze = haze(stage, { color: '56,189,248', x: 0.5, y: 0.25, alpha: 0.16 });
    S.haze2 = haze(stage, { x: 0.3, y: 0.7, alpha: 0.18 });
    S.stars = stars(stage, { seed: 44, n: 240, speed: 5 });
    // The render has a wide black margin; drawn large so the body itself is the hero.
    S.planet = img(stage, `${ASSET}/planets/mercury.png`, { left: '-760px', top: '-1150px', width: '2600px', height: '3343px', mixBlendMode: 'screen', opacity: 0 });
    S.pname = el('div', 'abs center caps', { top: '760px', fontSize: '24px', opacity: 0 }, stage, 'Mercury');
    S.eyebrow = el('div', 'abs center eyebrow', { top: '860px', fontSize: '40px', opacity: 0 }, stage, 'Next Mercury retrograde');
    S.dates = el('div', 'abs center', { top: '930px' }, stage);
    S.d1 = words(S.dates, '24 Oct → 13 Nov', 'h1', { fontSize: '128px' });
    S.d1.spans.forEach((s) => { s.classList.add('grad'); s.style.paddingRight = '0.04em'; });
    S.year = words(S.dates, '2026', 'h1', { fontSize: '128px' });
    S.signs = el('div', 'abs center', { top: '1230px', fontSize: '40px', fontWeight: 600, color: 'rgba(255,255,255,0.75)', opacity: 0 }, stage, 'in Scorpio (Western) · Libra (Vedic)');
    const c = el('canvas', 'abs', { left: 0, top: '1370px' }, stage);
    c.width = W; c.height = 320; S.g = c.getContext('2d');
    S.next = el('div', 'abs center', { top: '900px', opacity: 0 }, stage);
    el('div', 'eyebrow', { fontSize: '40px' }, S.next, 'Then, in 2027');
    S.rows = ['9 Feb → 3 Mar', '10 Jun → 4 Jul', '7 Oct → 28 Oct'].map((r) => el('div', 'h1', { fontSize: '104px', marginTop: '18px', opacity: 0 }, S.next, r));
    S.note = el('div', 'abs center caps', { top: '1316px', fontSize: '22px', opacity: 0 }, stage, 'Dates in UTC · stations to the minute, Swiss Ephemeris');
    vignette(stage);
    S.end = endCard(stage, { line: 'Every date. To the minute.', grad: 'To the minute.', cta: 'plutto.space/sky-calendar', sub: 'Retrogrades · eclipses · transits · free' });
  },
  async frame(t) {
    S.haze(t); S.haze2(t); S.stars(t);
    const pin = ease.outExpo(prog(t, 0, 1.6)), pout = ease.inCubic(prog(t, END - 0.6, END));
    set(S.planet, { o: pin * (1 - pout), s: lerp(0.8, 1, pin) + t * 0.01, r: t * 3, y: (1 - pin) * -80 });
    set(S.eyebrow, { o: inOut(t, 0.8, 6.2, 0.5) });
    set(S.pname, { o: inOut(t, 0.8, END - 0.6, 0.6) * 0.8 });
    rise(S.d1.spans, t - 1.0, { stagger: 0.09, out: 5.3 });
    rise(S.year.spans, t - 1.35, { stagger: 0.09, out: 5.0 });
    S.d1.spans.forEach((s) => { s.style.backgroundPosition = `${ease.inOutCubic(prog(t, 1.6, 4)) * 150}% 0`; });
    set(S.signs, { o: inOut(t, 1.9, 6.2, 0.5) });
    // The loop, drawn as the planet travels it.
    const g = S.g; g.clearRect(0, 0, W, 320);
    const draw = ease.inOutSine(prog(t, 1.4, 6.0)), fade = 1 - ease.inCubic(prog(t, 6.0, 6.5));
    if (draw > 0) {
      g.lineWidth = 5; g.lineCap = 'round';
      const grad = g.createLinearGradient(80, 0, 1000, 0);
      grad.addColorStop(0, 'rgba(125,211,252,0.1)'); grad.addColorStop(0.5, 'rgba(196,181,253,0.95)'); grad.addColorStop(1, 'rgba(249,168,212,0.2)');
      g.strokeStyle = grad; g.globalAlpha = fade;
      g.beginPath();
      for (let u = 0; u <= draw; u += 0.004) { const [x, y] = PATH(u); u === 0 ? g.moveTo(x, y) : g.lineTo(x, y); }
      g.stroke();
      const [px, py] = PATH(draw);
      g.fillStyle = '#fff'; g.shadowColor = '#c4b5fd'; g.shadowBlur = 30;
      g.beginPath(); g.arc(px, py, 13, 0, 6.283); g.fill(); g.shadowBlur = 0;
      g.font = '500 22px Mono'; g.fillStyle = 'rgba(255,255,255,0.6)'; g.textAlign = 'center';
      const [a, b] = STILL.map(PATH);
      if (draw > STILL[0]) { g.fillStyle = '#fff'; g.beginPath(); g.arc(a[0], a[1], 6, 0, 6.283); g.fill(); g.fillStyle = 'rgba(255,255,255,0.65)'; g.textAlign = 'left'; g.fillText('STATIONS RETROGRADE', a[0] + 26, a[1] + 8); }
      if (draw > STILL[1]) { g.fillStyle = '#fff'; g.beginPath(); g.arc(b[0], b[1], 6, 0, 6.283); g.fill(); g.fillStyle = 'rgba(255,255,255,0.65)'; g.textAlign = 'right'; g.fillText('STATIONS DIRECT', b[0] - 26, b[1] + 8); }
      g.textAlign = 'center';
      g.globalAlpha = 1;
    }
    // 2027.
    set(S.next, { o: inOut(t, 6.4, END - 0.6, 0.3) });
    S.rows.forEach((r, i) => set(r, { o: ease.outCubic(prog(t, 6.7 + i * 0.35, 7.3 + i * 0.35)), y: (1 - ease.outExpo(prog(t, 6.7 + i * 0.35, 7.6 + i * 0.35))) * 50 }));
    set(S.note, { o: inOut(t, 2.2, END - 0.6, 0.6) * 0.9 });
    S.end(t - END);
  },
};
