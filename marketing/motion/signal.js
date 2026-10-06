/**
 * SIGNAL — generative light set to music. Five thousand particles of light
 * drift as a nebula, gather into a symbol, get sucked into a vortex on the
 * build, burst on the drop and snap into a new sign on every bar, breathing
 * with the kick; the last bar they become Plutto's ring.
 *
 * The music comes first: each film writes a real song (sound.js's music
 * instruments — supersaws, vocal chops, plucks, 808s, a pumping bus) and the
 * picture reads its kicks and claps off the same cue list, so every pulse
 * and flash is on the beat by construction.
 *
 * Every particle's position is a closed-form function of t (no simulation),
 * so any frame renders on its own and stills are exact. Each is drawn as a
 * streak from t − 1/30 s to t, added in light, then bloomed.
 *
 *   signal({ duration, end, palette: [a, b, c, bgA, bgB], keys: [{ t, s, m, stagger, spin }],
 *            texts: [{ t0, t1, html, y, kind }], song(), endLine, endSub })
 */
import { el, set, prog, ease, lerp, rng, W, H } from './lib.js';

const N = 5200, CX = 540, CY = 860, DT = 1 / 30, MAX = 46;

// ── shapes, drawn white on a 1080² canvas and sampled to N points ─────────
const ray = (g, a, r0, r1) => { g.beginPath(); g.moveTo(540 + Math.cos(a) * r0, 540 + Math.sin(a) * r0); g.lineTo(540 + Math.cos(a) * r1, 540 + Math.sin(a) * r1); g.stroke(); };
const circle = (g, r, fill = false, x = 540, y = 540) => { g.beginPath(); g.arc(x, y, r, 0, 6.2832); fill ? g.fill() : g.stroke(); };
export const SHAPES = {
  eye(g) {
    g.lineWidth = 24; g.beginPath(); g.moveTo(120, 560); g.quadraticCurveTo(540, 170, 960, 560); g.quadraticCurveTo(540, 950, 120, 560); g.stroke();
    g.lineWidth = 18; circle(g, 150, false, 540, 560); circle(g, 72, true, 540, 560);
    g.lineWidth = 14; for (let k = 0; k <= 8; k++) ray(g, -Math.PI * (0.18 + 0.64 * (k / 8)), 360, k % 2 ? 430 : 470);
  },
  hexagram(g) {
    [1, 0, 1, 1, 0, 1].forEach((solid, i) => { const y = 230 + i * 116; solid ? g.fillRect(170, y, 740, 64) : (g.fillRect(170, y, 320, 64), g.fillRect(590, y, 320, 64)); });
  },
  moon(g) {
    circle(g, 340, true); g.globalCompositeOperation = 'destination-out'; circle(g, 310, true, 680, 460); g.globalCompositeOperation = 'source-over';
    [[760, 300, 16], [860, 520, 11], [700, 720, 13], [900, 360, 8]].forEach(([x, y, r]) => circle(g, r, true, x, y));
  },
  saturn(g) {
    circle(g, 205, true);
    g.save(); g.translate(540, 540); g.rotate(-0.38); g.scale(1, 0.3); g.lineWidth = 60; g.beginPath(); g.arc(0, 0, 420, 0, 6.2832); g.stroke(); g.restore();
  },
  sun(g) {
    circle(g, 175, true); g.lineWidth = 22; for (let k = 0; k < 16; k++) ray(g, (k / 16) * 6.2832, 240, k % 2 ? 360 : 440);
  },
  wheel(g) {
    g.lineWidth = 16; circle(g, 430); circle(g, 340); circle(g, 120);
    g.lineWidth = 10; for (let k = 0; k < 12; k++) ray(g, (k / 12) * 6.2832, 120, 430);
    for (let k = 0; k < 12; k++) { const a = ((k + 0.5) / 12) * 6.2832; circle(g, 17, true, 540 + Math.cos(a) * 385, 540 + Math.sin(a) * 385); }
  },
  star(g) {
    g.beginPath(); for (let k = 0; k < 16; k++) { const a = (k / 16) * 6.2832 - Math.PI / 2, r = k % 2 ? 175 : 440; g.lineTo(540 + Math.cos(a) * r, 540 + Math.sin(a) * r); } g.closePath();
    g.lineWidth = 22; g.stroke(); circle(g, 85, true);
  },
  galaxy(g) {
    for (let arm = 0; arm < 3; arm++) for (let s = 0; s < 1; s += 0.004) {
      const r = 30 + 430 * s, a = arm * 2.094 + s * 5.6;
      circle(g, 20 * (1 - s * 0.7), true, 540 + Math.cos(a) * r, 540 + Math.sin(a) * r);
    }
    circle(g, 70, true);
  },
  lotus(g) {
    g.lineWidth = 14;
    for (let k = 0; k < 10; k++) { g.save(); g.translate(540, 540); g.rotate((k / 10) * 6.2832); g.beginPath(); g.ellipse(0, -235, 95, 215, 0, 0, 6.2832); g.stroke(); g.restore(); }
    circle(g, 95, true); g.lineWidth = 9; circle(g, 470);
  },
};
/** A word in any script, as a shape. */
export const word = (text, font, size = 260) => (g) => { g.font = `600 ${size}px ${font}`; g.textAlign = 'center'; g.textBaseline = 'middle'; let s = size; while (g.measureText(text).width > 900) { s *= 0.92; g.font = `600 ${s}px ${font}`; } g.fillText(text, 540, 560); };

function sample(draw, seed) {
  const c = document.createElement('canvas'); c.width = c.height = 1080;
  const g = c.getContext('2d', { willReadFrequently: true }); g.fillStyle = g.strokeStyle = '#fff'; g.lineCap = 'round'; g.lineJoin = 'round';
  draw(g);
  const d = g.getImageData(0, 0, 1080, 1080).data, pts = [];
  for (let y = 0; y < 1080; y += 3) for (let x = 0; x < 1080; x += 3) if (d[(y * 1080 + x) * 4 + 3] > 128) pts.push(x - 540, y - 540);
  const m = pts.length / 2, R = rng(seed), perm = Array.from({ length: m }, (_, i) => i);
  for (let i = m - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
  const out = new Float32Array(N * 2);
  for (let i = 0; i < N; i++) { const k = perm[i % m]; out[2 * i] = pts[2 * k] + (R() - 0.5) * 3; out[2 * i + 1] = pts[2 * k + 1] + (R() - 0.5) * 3; }
  return out;
}

/** The beat grid: G.t(bar, beat, sixteenth) in seconds. */
export function grid(bpm) {
  const st = 60 / bpm / 4;
  return { bpm, st, beat: st * 4, bar: st * 16, t: (bar, beat = 0, six = 0) => (bar * 16 + beat * 4 + six) * st };
}
/** Every sixteenth marked 'x' in a pattern string, as times from t0. */
export const hits = (pat, t0, st) => [...pat].flatMap((c, i) => (c === 'x' ? [t0 + i * st] : []));

export function signal({ duration, end, palette, keys, texts = [], song, endLine = 'Ask the signs.', endSub = 'plutto.space', poster, fonts = [] }) {
  const [A, B, C, BGA, BGB] = palette;
  const S = {};
  let cues = null;
  const music = () => (cues ??= song());
  return {
    duration, poster: poster ?? end - 2.5,
    score: () => music(),
    async setup(stage) {
      await Promise.all(['900 100px Inter', '800 40px Inter', '700 120px Inter', '600 40px Inter', '500 26px Mono', ...fonts].map((f) => (Array.isArray(f) ? document.fonts.load(...f) : document.fonts.load(f))));
      const cs = music();
      S.kicks = cs.filter((c) => c.i === 'kick' && (c.g ?? 1) > 0.5).map((c) => c.t).sort((a, b) => a - b);
      S.flashes = cs.filter((c) => (c.i === 'clap' && (c.g ?? 1) > 0.5) || c.i === 'boom').map((c) => [c.t, c.i === 'boom' ? 1 : 0.35]).sort((a, b) => a[0] - b[0]);
      S.booms = cs.filter((c) => c.i === 'boom').map((c) => c.t);
      // particles
      const R = rng(77);
      S.P = Array.from({ length: N }, () => ({ r1: R(), a: R() * 6.2832, w: (0.04 + R() * 0.12) * (R() < 0.5 ? 1 : -1), r3: R(), r4: R(), r5: R(), grp: R() < 0.46 ? 0 : R() < 0.62 ? 1 : 2 }));
      S.shapes = {};
      keys.forEach((k, i) => { if (!['cloud', 'vortex', 'burst', 'ring'].includes(k.s) && !S.shapes[k.s]) S.shapes[k.s] = sample(k.draw || SHAPES[k.s], 100 + i); });
      // the room: two coloured glows and a field of dust
      stage.style.background = '#030308';
      S.glow = el('div', 'layer', {}, stage);
      const dust = el('canvas', 'layer', {}, stage); dust.width = W; dust.height = H;
      const dg = dust.getContext('2d'), DR = rng(5);
      for (let i = 0; i < 420; i++) { dg.fillStyle = `rgba(255,255,255,${0.08 + DR() * 0.3})`; dg.beginPath(); dg.arc(DR() * W, DR() * H, 0.4 + DR() * 1.4, 0, 6.2832); dg.fill(); }
      S.cv = el('canvas', 'layer', {}, stage); S.cv.width = W; S.cv.height = H; S.g = S.cv.getContext('2d');
      S.bl = el('canvas', 'layer', { width: '100%', height: '100%', mixBlendMode: 'screen', opacity: 0.95 }, stage); S.bl.width = W / 2; S.bl.height = H / 2; S.bg = S.bl.getContext('2d');
      S.flash = el('div', 'layer', { background: '#fff', opacity: 0, mixBlendMode: 'overlay' }, stage);
      // words
      S.texts = texts.map((x) => {
        const big = x.kind === 'big', cap = x.kind === 'cap';
        const e = el('div', 'abs center', {
          top: `${x.y}px`, padding: '0 60px', opacity: 0, color: '#fff', textShadow: '0 0 40px rgba(0,0,0,0.6)',
          font: big ? '900 112px/1.0 Inter' : cap ? '600 30px/1.3 Mono' : '800 64px/1.1 Inter', letterSpacing: big ? '-0.045em' : cap ? '0.3em' : '-0.02em', textTransform: cap ? 'uppercase' : 'none',
        }, stage, x.html);
        return { ...x, e };
      });
      // the end: wordmark, line, address
      S.end = el('div', 'abs center', { top: '1250px', opacity: 0 }, stage);
      el('div', '', { font: '700 132px/1 Inter', letterSpacing: '-0.035em', color: '#fff' }, S.end, 'Plutto');
      el('div', '', { font: '800 60px/1.15 Inter', letterSpacing: '-0.02em', marginTop: '36px', color: '#fff', opacity: 0.92 }, S.end, endLine);
      el('div', '', { display: 'inline-block', marginTop: '54px', font: '600 42px/1 Inter', color: '#08080c', background: '#fff', borderRadius: '999px', padding: '26px 54px' }, S.end, 'plutto.space');
      if (endSub && endSub !== 'plutto.space') el('div', '', { marginTop: '30px', font: '500 24px/1.4 Mono', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }, S.end, endSub);
    },
    async frame(t) {
      // the glows breathe with the bar and flare on the drop
      const flare = S.booms.reduce((a, b) => (t >= b ? Math.max(a, Math.exp(-(t - b) * 1.5)) : a), 0);
      S.glow.style.background = `radial-gradient(60% 40% at ${50 + Math.sin(t * 0.4) * 18}% ${38 + Math.cos(t * 0.3) * 8}%, ${BGA}, transparent 70%), radial-gradient(70% 45% at ${50 - Math.sin(t * 0.33) * 22}% ${70 + Math.sin(t * 0.5) * 6}%, ${BGB}, transparent 72%)`;
      S.glow.style.opacity = 0.6 + 0.4 * flare;
      const kick = S.kicks.reduce((a, k) => (t >= k ? Math.exp(-(t - k) * 9) : a), 0);
      const shake = flare > 0.2 ? (flare - 0.2) * 14 : 0;
      const ox = CX + Math.sin(t * 91) * shake, oy = CY + Math.cos(t * 77) * shake;
      const g = S.g;
      g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, W, H);
      g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
      const k1 = keyAt(t), k0 = keyAt(t - DT);
      const paths = [new Path2D(), new Path2D(), new Path2D()];
      const scale = 1 + kick * 0.05 + flare * 0.05;
      for (let i = 0; i < N; i++) {
        const p = S.P[i];
        const [x1, y1] = pos(i, p, t, k1), [x0, y0] = pos(i, p, t - DT, k0);
        // a streak from where it was a frame ago, never longer than MAX
        let dx = (x1 - x0) * scale, dy = (y1 - y0) * scale; const len = Math.hypot(dx, dy);
        if (len > MAX) { dx *= MAX / len; dy *= MAX / len; }
        const ex = ox + x1 * scale, ey = oy + y1 * scale, path = paths[p.grp];
        path.moveTo(ex - dx, ey - dy); path.lineTo(ex + 0.01, ey);
      }
      [A, B, C].forEach((col, j) => { g.strokeStyle = col; g.lineWidth = j === 2 ? 3.2 : 2.3; g.globalAlpha = (0.72 + kick * 0.2) * (1 - flare * 0.35); g.stroke(paths[j]); });
      g.globalAlpha = 1;
      const b = S.bg; b.globalCompositeOperation = 'source-over'; b.clearRect(0, 0, W / 2, H / 2);
      b.filter = 'blur(9px)'; b.globalAlpha = 0.85 + kick * 0.15; b.drawImage(S.cv, 0, 0, W / 2, H / 2); b.filter = 'none';
      b.globalCompositeOperation = 'lighter'; b.filter = 'blur(26px)'; b.globalAlpha = 0.6; b.drawImage(S.cv, 0, 0, W / 2, H / 2); b.filter = 'none'; b.globalAlpha = 1;
      const fl = S.flashes.reduce((a, [ft, amt]) => (t >= ft ? amt * Math.exp(-(t - ft) * 12) : a), 0);
      S.flash.style.opacity = fl * 0.5;
      // words
      for (const x of S.texts) {
        const p = ease.outCubic(prog(t, x.t0, x.t0 + 0.22)), o = 1 - ease.inCubic(prog(t, x.t1 - 0.18, x.t1));
        set(x.e, { o: t >= x.t0 && t < x.t1 ? p * o : 0, y: (1 - p) * 26, s: x.kind === 'big' ? 1 + kick * 0.03 : 1, blur: (1 - p) * 10 + (1 - o) * 6 });
      }
      const ep = ease.outCubic(prog(t, end + 0.35, end + 1.0));
      set(S.end, { o: ep, y: (1 - ep) * 40, blur: (1 - ep) * 10 });
    },
  };

  function keyAt(t) { let k = 0; for (let i = 0; i < keys.length; i++) if (keys[i].t <= t) k = i; return k; }
  function state(name, i, p, t, spin = 0) {
    if (name === 'cloud') { const r = 240 + 720 * Math.pow(p.r1, 0.8), a = p.a + t * p.w; return [Math.cos(a) * r, Math.sin(a) * r * 1.5 + Math.sin(t * 0.7 + p.r3 * 6) * 30]; }
    if (name === 'vortex') { const r = 26 + 260 * p.r1 * p.r1, a = p.a + t * (2.2 + 4 * p.r3); return [Math.cos(a) * r, Math.sin(a) * r]; }
    if (name === 'burst') { const r = 380 + 1250 * p.r1; return [Math.cos(p.a) * r, Math.sin(p.a) * r * 1.3]; }
    if (name === 'ring') { const r = 290 + (p.r1 - 0.5) * 80 + Math.sin(t * 2 + p.r3 * 9) * 4, a = p.a + t * 0.35; return [Math.cos(a) * r, Math.sin(a) * r]; }
    const s = S.shapes[name];
    let x = s[2 * i] + Math.sin(t * 1.7 + p.r3 * 9) * 3.5, y = s[2 * i + 1] + Math.cos(t * 1.3 + p.r4 * 9) * 3.5;
    if (spin) { const a = t * spin, c = Math.cos(a), sn = Math.sin(a); [x, y] = [x * c - y * sn, x * sn + y * c]; }
    return [x, y];
  }
  function pos(i, p, t, k) {
    const cur = keys[k];
    if (k === 0) return state(cur.s, i, p, t, cur.spin);
    const prev = keys[k - 1];
    const d = p.r5 * (cur.stagger ?? 0.3);
    const q = ease.inOutCubic(prog(t, cur.t + d, cur.t + d + (cur.m ?? 0.6)));
    const b = state(cur.s, i, p, t, cur.spin);
    if (q >= 1) return b;
    const a = state(prev.s, i, p, t, prev.spin);
    return [lerp(a[0], b[0], q), lerp(a[1], b[1], q)];
  }
}
