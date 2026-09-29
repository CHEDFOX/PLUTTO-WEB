/**
 * THE SHOTS — the places the cinematic films happen, drawn on the world
 * canvas. Each is made once (textures are built at setup) and returns
 * draw(g, t, opts), a pure function of time.
 *
 *   clock  — 3:07 on a bedside clock; a phone asleep beside it, then awake
 *   city   — a night skyline through a window; someone standing at it
 *   rain   — rain on glass, a street's lights melting behind it
 *   road   — a night drive; streetlights pass on the beat
 *   wall   — carved script on stone, found by firelight
 *   sky    — star trails over a desert; one figure looking up
 */
import { rng, clamp, lerp, W, H } from './lib.js';

// ── textures ───────────────────────────────────────────────────────────────
/** Fractal value noise in [0,1], w×h. */
export function fbm(w, h, { scale = 64, oct = 5, seed = 1 } = {}) {
  const out = new Float32Array(w * h);
  let amp = 1, tot = 0, s = scale;
  for (let o = 0; o < oct; o++) {
    const R = rng(seed * 97 + o), gw = Math.ceil(w / s) + 2, gh = Math.ceil(h / s) + 2;
    const grid = Float32Array.from({ length: gw * gh }, () => R());
    for (let y = 0; y < h; y++) {
      const gy = y / s, y0 = Math.floor(gy), fy = gy - y0, sy = fy * fy * (3 - 2 * fy);
      for (let x = 0; x < w; x++) {
        const gx = x / s, x0 = Math.floor(gx), fx = gx - x0, sx = fx * fx * (3 - 2 * fx);
        const a = grid[y0 * gw + x0], b2 = grid[y0 * gw + x0 + 1], c = grid[(y0 + 1) * gw + x0], d = grid[(y0 + 1) * gw + x0 + 1];
        out[y * w + x] += amp * lerp(lerp(a, b2, sx), lerp(c, d, sx), sy);
      }
    }
    tot += amp; amp *= 0.5; s = Math.max(1, s / 2);
  }
  for (let i = 0; i < out.length; i++) out[i] /= tot;
  return out;
}
export function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
/** Paint a noise field into a canvas through fn(v, x, y) → [r, g, b, a]. */
export function paint(w, h, field, fn) {
  const c = canvas(w, h), g = c.getContext('2d'), im = g.createImageData(w, h);
  for (let i = 0, p = 0; i < field.length; i++, p += 4) { const [r, gg, bb, a] = fn(field[i], i % w, (i / w) | 0); im.data[p] = r; im.data[p + 1] = gg; im.data[p + 2] = bb; im.data[p + 3] = a; }
  g.putImageData(im, 0, 0);
  return c;
}
/** A soft light: a radial glow sprite of radius r. */
export function glowSprite(r, rgb, { core = 0.9, falloff = 0.35 } = {}) {
  const c = canvas(r * 2, r * 2), g = c.getContext('2d');
  const gr = g.createRadialGradient(r, r, 0, r, r, r);
  gr.addColorStop(0, `rgba(${rgb},${core})`); gr.addColorStop(falloff, `rgba(${rgb},${core * 0.28})`); gr.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = gr; g.fillRect(0, 0, r * 2, r * 2);
  return c;
}
/** An out-of-focus light: a disc, brighter at the rim, as a lens draws it. */
export function bokehSprite(r, rgb) {
  const c = canvas(r * 2 + 4, r * 2 + 4), g = c.getContext('2d'), m = r + 2;
  const gr = g.createRadialGradient(m, m, 0, m, m, r);
  gr.addColorStop(0, `rgba(${rgb},0.30)`); gr.addColorStop(0.78, `rgba(${rgb},0.40)`); gr.addColorStop(0.93, `rgba(${rgb},0.62)`); gr.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = gr; g.beginPath(); g.arc(m, m, r, 0, 6.2832); g.fill();
  return c;
}
const rr = (g, x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };

// ── clock ──────────────────────────────────────────────────────────────────
const SEG = { 0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
function segments(g, x, y, w, h, th, lit, on, off) {
  const hw = th / 2, m = y + h / 2;
  const hor = (cx, cy, len) => { g.beginPath(); g.moveTo(cx - len / 2, cy); g.lineTo(cx - len / 2 + hw, cy - hw); g.lineTo(cx + len / 2 - hw, cy - hw); g.lineTo(cx + len / 2, cy); g.lineTo(cx + len / 2 - hw, cy + hw); g.lineTo(cx - len / 2 + hw, cy + hw); g.closePath(); };
  const ver = (cx, cy, len) => { g.beginPath(); g.moveTo(cx, cy - len / 2); g.lineTo(cx + hw, cy - len / 2 + hw); g.lineTo(cx + hw, cy + len / 2 - hw); g.lineTo(cx, cy + len / 2); g.lineTo(cx - hw, cy + len / 2 - hw); g.lineTo(cx - hw, cy - len / 2 + hw); g.closePath(); };
  const L = w - th * 0.9, V = h / 2 - th * 0.9;
  const segs = { a: () => hor(x + w / 2, y, L), g: () => hor(x + w / 2, m, L), d: () => hor(x + w / 2, y + h, L),
    f: () => ver(x, y + h / 4, V), b: () => ver(x + w, y + h / 4, V), e: () => ver(x, y + h * 0.75, V), c: () => ver(x + w, y + h * 0.75, V) };
  for (const k of 'abcdefg') { segs[k](); g.fillStyle = lit.includes(k) ? on : off; g.fill(); }
}
export async function clockShot() {
  const R = rng(3);
  const motes = Array.from({ length: 90 }, () => ({ x: R(), y: R(), z: 0.4 + R() * 0.6, ph: R() * 6.28, sp: 0.2 + R() * 0.6 }));
  const wood = paint(540, 380, fbm(540, 380, { scale: 90, oct: 5, seed: 8 }), (v, x, y) => { const s = 0.6 + 0.8 * v + 0.12 * Math.sin(x * 0.09 + v * 9); return [18 * s, 13 * s, 11 * s, 255]; });
  const mote = glowSprite(8, '200,215,255', { core: 1, falloff: 0.3 });
  const DIG = [{ x: 262, d: '3' }, { x: 520, d: '0' }, { x: 712, d: '7' }];
  const digits = (g, str, on, off, glow) => {
    g.save(); g.transform(1, 0, -0.07, 1, 70, 0);
    g.shadowColor = glow; g.shadowBlur = 42;
    DIG.forEach((p, i) => segments(g, p.x, 900, 132, 232, 26, SEG[str[i]], on, off));
    g.restore();
  };
  return (g, t, { wake = 0, str = '307', colon = true } = {}) => {
    const wallG = g.createLinearGradient(0, 0, 0, 1190);
    wallG.addColorStop(0, '#020306'); wallG.addColorStop(1, '#07080c');
    g.fillStyle = wallG; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'lighter';
    let rg = g.createRadialGradient(540, 1010, 0, 540, 1010, 950);
    rg.addColorStop(0, 'rgba(255,36,26,0.20)'); rg.addColorStop(0.5, 'rgba(255,30,20,0.05)'); rg.addColorStop(1, 'rgba(255,30,20,0)');
    g.fillStyle = rg; g.fillRect(0, 0, W, H);
    if (wake > 0) {
      rg = g.createRadialGradient(770, 1500, 0, 770, 1500, 1500);
      rg.addColorStop(0, `rgba(120,160,255,${0.34 * wake})`); rg.addColorStop(0.45, `rgba(90,120,255,${0.08 * wake})`); rg.addColorStop(1, 'rgba(90,120,255,0)');
      g.fillStyle = rg; g.fillRect(0, 0, W, H);
    }
    // Moonlight through blinds, across the wall.
    for (let i = 0; i < 8; i++) {
      const y0 = 250 + i * 92, sl = g.createLinearGradient(0, y0 - 40, 0, y0 + 40);
      sl.addColorStop(0, 'rgba(150,175,235,0)'); sl.addColorStop(0.5, `rgba(150,175,235,${0.075 - i * 0.006})`); sl.addColorStop(1, 'rgba(150,175,235,0)');
      g.fillStyle = sl; g.beginPath(); g.moveTo(-60, y0 + 60); g.lineTo(820, y0 - 190); g.lineTo(820, y0 - 150); g.lineTo(-60, y0 + 100); g.fill();
    }
    g.globalCompositeOperation = 'source-over';
    // A glass of water, catching the red.
    g.fillStyle = 'rgba(255,255,255,0.025)'; g.fillRect(52, 1010, 96, 180);
    g.strokeStyle = 'rgba(255,90,80,0.32)'; g.lineWidth = 3; g.beginPath(); g.moveTo(146, 1012); g.lineTo(140, 1188); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,0.10)'; g.lineWidth = 2; g.beginPath(); g.moveTo(54, 1012); g.lineTo(60, 1188); g.stroke();
    g.beginPath(); g.ellipse(100, 1010, 48, 9, 0, 0, 6.2832); g.stroke();
    g.strokeStyle = 'rgba(255,90,80,0.22)'; g.beginPath(); g.ellipse(100, 1068, 46, 8, 0, 0, 6.2832); g.stroke();
    // The nightstand.
    g.drawImage(wood, 0, 1190, W, H - 1190);
    const top = g.createLinearGradient(0, 1190, 0, H); top.addColorStop(0, 'rgba(0,0,0,0)'); top.addColorStop(1, 'rgba(0,0,0,0.75)');
    g.fillStyle = top; g.fillRect(0, 1190, W, H - 1190);
    g.fillStyle = `rgba(255,70,60,0.30)`; g.fillRect(0, 1188, W, 3);
    if (wake > 0) { g.fillStyle = `rgba(150,180,255,${0.35 * wake})`; g.fillRect(420, 1188, 660, 3); }
    // Reflections of the digits in the varnish.
    g.save(); g.translate(0, 2 * 1190); g.scale(1, -0.55); g.globalAlpha = 0.16;
    digits(g, str, '#ff3b30', 'rgba(0,0,0,0)', 'rgba(255,40,30,1)'); g.restore();
    // The clock.
    const body = g.createLinearGradient(0, 830, 0, 1190); body.addColorStop(0, '#141418'); body.addColorStop(1, '#070709');
    rr(g, 175, 830, 730, 362, 38); g.fillStyle = body; g.fill();
    g.fillStyle = 'rgba(255,255,255,0.07)'; g.fillRect(213, 832, 654, 2);
    rr(g, 205, 858, 670, 306, 22); g.fillStyle = '#030304'; g.fill();
    digits(g, str, '#ff3b30', 'rgba(255,50,40,0.05)', 'rgba(255,40,30,0.95)');
    if (colon) {
      g.save(); g.shadowColor = 'rgba(255,40,30,0.95)'; g.shadowBlur = 30; g.fillStyle = '#ff3b30';
      [[472, 975], [464, 1085]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 13, 0, 6.2832); g.fill(); });
      g.restore();
    }
    // Dust in the phone's light.
    if (wake > 0.02) {
      g.globalCompositeOperation = 'lighter';
      for (const m of motes) {
        const x = 440 + m.x * 640 + Math.sin(t * m.sp + m.ph) * 30, y = (m.y * 1200 - t * 14 * m.sp + 1200) % 1200;
        const beam = clamp(1 - Math.abs(x - 770) / (380 - y * 0.18)) * clamp((y - 80) / 400);
        const a = wake * beam * m.z * (0.5 + 0.5 * Math.sin(t * 2 + m.ph));
        if (a < 0.02) continue;
        g.globalAlpha = a; const s = 6 + 10 * m.z; g.drawImage(mote, x - s, y - s, s * 2, s * 2);
      }
      g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    }
  };
}

// ── city ───────────────────────────────────────────────────────────────────
function skyline(seed, { w = 1500, top = [900, 1100], bottom = 1400, color, win, cell, lit = 0.25, dim = 1 }) {
  const c = canvas(w, H), g = c.getContext('2d'), R = rng(seed), beacons = [];
  let x = -20;
  while (x < w) {
    const bw = cell[0] * (3 + Math.floor(R() * 7)), y = top[0] + R() * (top[1] - top[0]);
    g.fillStyle = color; g.fillRect(x, y, bw, bottom - y + 600);
    if (R() < 0.35) { g.fillRect(x + bw * 0.4, y - 24 - R() * 60, 4, 90); beacons.push([x + bw * 0.4 + 2, y - 60 - R() * 20, R() * 6.28]); }
    const p = lit * (0.4 + R() * 1.2), warm = R() < 0.7;
    for (let wy = y + cell[1]; wy < bottom + 500; wy += cell[1]) for (let wx = x + cell[0] * 0.6; wx < x + bw - cell[0]; wx += cell[0]) {
      if (R() > p) continue;
      const a = (0.35 + R() * 0.6) * dim;
      g.fillStyle = warm ? `rgba(255,${190 + R() * 40},${120 + R() * 50},${a})` : `rgba(${180 + R() * 30},${205 + R() * 30},255,${a})`;
      g.fillRect(wx, wy, win[0], win[1]);
    }
    x += bw + cell[0] * (R() < 0.3 ? 2 : 0.5);
  }
  return { c, beacons };
}
/** A figure from behind, head and shoulders. */
function figure() {
  const p = new Path2D();
  p.moveTo(40, 1920); p.bezierCurveTo(50, 1700, 70, 1560, 150, 1515);
  p.bezierCurveTo(215, 1478, 262, 1470, 290, 1440); p.bezierCurveTo(300, 1410, 296, 1385, 286, 1360);
  p.bezierCurveTo(250, 1330, 238, 1270, 246, 1225); p.bezierCurveTo(256, 1150, 312, 1118, 350, 1120);
  p.bezierCurveTo(400, 1118, 446, 1160, 452, 1224); p.bezierCurveTo(458, 1272, 446, 1325, 414, 1360);
  p.bezierCurveTo(404, 1385, 402, 1410, 412, 1440); p.bezierCurveTo(440, 1470, 488, 1478, 552, 1515);
  p.bezierCurveTo(632, 1560, 652, 1700, 662, 1920); p.closePath();
  return p;
}
export async function cityShot() {
  const far = skyline(11, { top: [860, 1080], bottom: 1300, color: '#0c1424', win: [4, 5], cell: [9, 13], lit: 0.2, dim: 0.55 });
  const mid = skyline(12, { top: [930, 1220], bottom: 1500, color: '#070b14', win: [6, 8], cell: [14, 20], lit: 0.24, dim: 0.8 });
  const near = skyline(13, { top: [1120, 1420], bottom: 1920, color: '#030509', win: [10, 13], cell: [22, 30], lit: 0.2 });
  const fogT = paint(360, 240, fbm(360, 240, { scale: 60, oct: 4, seed: 5 }), (v) => [90, 110, 150, clamp((v - 0.42) * 2.2) * 255]);
  const red = glowSprite(26, '255,60,50', { core: 1, falloff: 0.2 });
  const lamp = glowSprite(420, '255,170,110', { core: 0.10, falloff: 0.4 });
  const man = figure();
  return (g, t, { phone = 0 } = {}) => {
    const sky = g.createLinearGradient(0, 0, 0, 1300);
    sky.addColorStop(0, '#010207'); sky.addColorStop(0.55, '#07101f'); sky.addColorStop(0.86, '#1b1a2a'); sky.addColorStop(1, '#3a2420');
    g.fillStyle = sky; g.fillRect(0, 0, W, H);
    const o = t * 7;
    g.drawImage(far.c, -140 - o * 0.3, 0);
    g.globalAlpha = 0.5; g.drawImage(fogT, -200 - (t * 10) % 400, 900, 1800, 520); g.globalAlpha = 1;
    g.drawImage(mid.c, -200 - o * 0.6, 0);
    g.globalAlpha = 0.35; g.drawImage(fogT, -300 + (t * 6) % 400, 1050, 1900, 600); g.globalAlpha = 1;
    g.drawImage(near.c, -260 - o, 0);
    g.globalCompositeOperation = 'lighter';
    [[far, 0.3, -140], [mid, 0.6, -200], [near, 1, -260]].forEach(([L, k, x0]) => L.beacons.forEach(([bx, by, ph]) => {
      const a = Math.pow(Math.max(0, Math.sin(t * 2.4 + ph)), 6); if (a < 0.02) return;
      g.globalAlpha = a; g.drawImage(red, x0 - o * k + bx - 26, by - 26);
    }));
    g.globalAlpha = 1;
    g.drawImage(lamp, -260, 180);                 // a lamp behind us, reflected in the glass
    g.globalCompositeOperation = 'source-over';
    // The window frame.
    g.fillStyle = '#010102'; g.fillRect(790, 0, 30, H); g.fillRect(0, 630, W, 24);
    g.fillStyle = 'rgba(160,180,220,0.10)'; g.fillRect(790, 0, 2, H); g.fillRect(0, 630, W, 2);
    // Someone at the window.
    g.save(); g.translate(40, 0);
    g.translate(350, 1920); g.scale(1, 1 + 0.004 * Math.sin(t * 1.5)); g.translate(-350, -1920);
    g.shadowColor = 'rgba(140,175,255,0.8)'; g.shadowBlur = 18; g.strokeStyle = 'rgba(150,185,255,0.55)'; g.lineWidth = 5; g.stroke(man);
    g.shadowBlur = 0; g.fillStyle = '#010102'; g.fill(man);
    if (phone > 0) {                              // a phone lit in their hands: the glow comes round the shoulder
      g.globalCompositeOperation = 'lighter';
      const pg = g.createRadialGradient(350, 1560, 0, 350, 1560, 520);
      pg.addColorStop(0, `rgba(120,150,255,${0.30 * phone})`); pg.addColorStop(1, 'rgba(120,150,255,0)');
      g.fillStyle = pg; g.fillRect(-200, 1000, 1100, 920);
      g.globalCompositeOperation = 'source-over';
    }
    g.restore();
  };
}

// ── rain ───────────────────────────────────────────────────────────────────
const RAIN_COLORS = [['255,178,90', 5], ['255,90,70', 3], ['70,210,200', 2], ['255,236,205', 3], ['120,150,255', 2]];
export async function rainShot() {
  const R = rng(21);
  const pick = () => { let k = R() * 15; for (const [c, w] of RAIN_COLORS) { if ((k -= w) < 0) return c; } return RAIN_COLORS[0][0]; };
  const lights = Array.from({ length: 30 }, () => {
    const rgb = pick(), r = 60 + Math.pow(R(), 1.4) * 200;
    return { rgb, r, x: R() * 1300 - 110, y: 520 + R() * 1250, vx: (R() - 0.5) * 22, blink: R() < 0.12 ? 1.4 + R() : 0, ph: R() * 6.28, a: 0.14 + R() * 0.3, spr: bokehSprite(Math.round(r), rgb) };
  });
  // Stationary drops, each tinted by the lights behind it.
  const drops = canvas(W, H), dg = drops.getContext('2d');
  for (let i = 0; i < 1100; i++) {
    const x = R() * W, y = R() * H, r = 1.5 + Math.pow(R(), 3) * 9;
    let col = [180, 195, 225], best = 0;
    for (const L of lights) { const d = Math.hypot(L.x - x, L.y - y); if (d < L.r && L.r - d > best) { best = L.r - d; col = L.rgb.split(',').map(Number); } }
    dg.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${best ? 0.3 : 0.08})`; dg.beginPath(); dg.ellipse(x, y, r, r * 1.08, 0, 0, 6.2832); dg.fill();
    dg.fillStyle = 'rgba(0,0,0,0.35)'; dg.beginPath(); dg.arc(x - r * 0.2, y + r * 0.25, r * 0.8, 0.2, 2.6); dg.fill();
    dg.fillStyle = `rgba(255,255,255,${best ? 0.45 : 0.18})`; dg.beginPath(); dg.arc(x - r * 0.35, y - r * 0.4, Math.max(0.6, r * 0.22), 0, 6.2832); dg.fill();
  }
  const runners = Array.from({ length: 18 }, () => ({ x: 40 + R() * 1000, y0: -200 + R() * 1400, v: 40 + R() * 90, r: 5 + R() * 6, ph: R() * 10, rgb: pick() }));
  const fog = paint(270, 480, fbm(270, 480, { scale: 70, oct: 4, seed: 9 }), (v) => [200, 215, 235, clamp((v - 0.3) * 1.4) * 36]);
  return (g, t, { heavy = 0, hero = 0 } = {}) => {
    const bgG = g.createLinearGradient(0, 0, 0, H); bgG.addColorStop(0, '#04060b'); bgG.addColorStop(1, '#0a0c12');
    g.fillStyle = bgG; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'lighter';
    for (const L of lights) {
      let a = L.a * (0.85 + 0.15 * Math.sin(t * 0.9 + L.ph));
      if (L.blink) a *= Math.sin(t * L.blink * 6.28 + L.ph) > 0 ? 1 : 0.08;
      const x = ((L.x + L.vx * t + 1400) % 1400) - 160;
      g.globalAlpha = a; g.drawImage(L.spr, x - L.r, L.y - L.r);
    }
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    g.drawImage(fog, 0, 0, W, H);
    g.drawImage(drops, 0, 0);
    if (hero > 0) {                                // one drop, dead centre, holding a warm light — the ring comes out of it
      g.globalAlpha = hero;
      const hg = g.createRadialGradient(536, 954, 2, 540, 960, 17); hg.addColorStop(0, 'rgba(255,214,160,1)'); hg.addColorStop(0.7, 'rgba(255,160,90,0.85)'); hg.addColorStop(1, 'rgba(255,140,80,0)');
      g.fillStyle = hg; g.beginPath(); g.ellipse(540, 960, 16, 18, 0, 0, 6.2832); g.fill();
      g.fillStyle = 'rgba(255,255,255,0.9)'; g.beginPath(); g.arc(534, 953, 4, 0, 6.2832); g.fill();
      g.globalAlpha = 1;
    }
    const shade = g.createLinearGradient(0, 0, 0, H); shade.addColorStop(0, 'rgba(0,0,0,0.55)'); shade.addColorStop(0.45, 'rgba(0,0,0,0.15)'); shade.addColorStop(1, 'rgba(0,0,0,0.3)');
    g.fillStyle = shade; g.fillRect(0, 0, W, H);
    // Running drops: stick, slip, leave a trail.
    for (const d of runners) {
      const tt = t * (1 + heavy * 0.8) + d.ph, slip = Math.floor(tt * 1.6) + Math.pow(tt * 1.6 % 1, 5);
      const y = ((d.y0 + slip * d.v) % 2300) - 150, x = d.x + Math.sin(slip * 1.3 + d.ph) * 6;
      const tr = g.createLinearGradient(0, y - 360, 0, y);
      tr.addColorStop(0, `rgba(${d.rgb},0)`); tr.addColorStop(1, `rgba(${d.rgb},0.28)`);
      g.strokeStyle = tr; g.lineWidth = d.r * 0.7; g.lineCap = 'round';
      g.beginPath(); g.moveTo(x - Math.sin(slip) * 4, y - 360); g.quadraticCurveTo(x + 5, y - 180, x, y); g.stroke();
      g.fillStyle = `rgba(${d.rgb},0.45)`; g.beginPath(); g.ellipse(x, y, d.r, d.r * 1.25, 0, 0, 6.2832); g.fill();
      g.fillStyle = 'rgba(255,255,255,0.8)'; g.beginPath(); g.arc(x - d.r * 0.35, y - d.r * 0.45, d.r * 0.25, 0, 6.2832); g.fill();
    }
  };
}

// ── road ───────────────────────────────────────────────────────────────────
/** passes: the seconds at which a streetlight goes overhead — put them on the beat. */
export async function roadShot({ passes = [] } = {}) {
  const VX = 540, VY = 860, F = 900, CH = 1.25, V = 24;
  const lampS = glowSprite(90, '255,170,90', { core: 1, falloff: 0.25 });
  const far = glowSprite(10, '255,190,140', { core: 1, falloff: 0.3 });
  const R = rng(41);
  const town = Array.from({ length: 70 }, () => ({ x: R() * W, y: VY - 6 - R() * 20, a: 0.3 + R() * 0.6 }));
  const P = (x, y, z) => [VX + (F * x) / z, VY + (F * (CH - y)) / z];
  return (g, t, { bump = 1, dist = null } = {}) => {
    const by = bump * (2.5 * Math.sin(t * 9.1) + 1.5 * Math.sin(t * 13.7));
    const D = dist ?? t * V;                       // metres travelled (pass `dist` to slow down or stop)
    g.save(); g.translate(0, by);
    const sky = g.createLinearGradient(0, 0, 0, VY);
    sky.addColorStop(0, '#020308'); sky.addColorStop(0.7, '#0a0f1e'); sky.addColorStop(1, '#3a2418');
    g.fillStyle = sky; g.fillRect(0, -20, W, VY + 20);
    g.fillStyle = '#05060a';                       // hills
    g.beginPath(); g.moveTo(0, VY); for (let x = 0; x <= W; x += 30) g.lineTo(x, VY - 18 - 14 * Math.sin(x * 0.006 + 1) - 8 * Math.sin(x * 0.019)); g.lineTo(W, VY); g.fill();
    g.globalCompositeOperation = 'lighter';
    town.forEach((p) => { g.globalAlpha = p.a; g.drawImage(far, p.x - 5, p.y - 5, 10, 10); });
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    const road = g.createLinearGradient(0, VY, 0, H); road.addColorStop(0, '#07080b'); road.addColorStop(1, '#101115');
    g.fillStyle = road; g.fillRect(0, VY, W, H - VY);
    // Edge lines and the centre dashes.
    const line = (x, z0, z1, w, a) => { const [ax, ay] = P(x - w, 0, z0), [bx] = P(x + w, 0, z0), [cx, cy] = P(x + w, 0, z1), [dx] = P(x - w, 0, z1);
      g.fillStyle = `rgba(235,235,220,${a})`; g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, ay); g.lineTo(cx, cy); g.lineTo(dx, cy); g.fill(); };
    line(2.1, 1.2, 300, 0.07, 0.5); line(-5.6, 1.2, 300, 0.07, 0.35);
    for (let k = 0; k < 25; k++) { const z = ((k * 12 - D) % 300 + 300) % 300 + 1.2; line(-1.75, z, z + 3.2, 0.07, 0.75 * clamp(1 - z / 260)); }
    // Streetlights, one per pass, alternating sides; their pools of light on the wet road.
    g.globalCompositeOperation = 'lighter';
    let sweep = 0;
    passes.forEach((tk, i) => {
      const z = (tk - t) * V + 0.8, side = i % 2 ? -7.6 : 4.6;
      if (z < 0.3 || z > 260) { sweep += Math.exp(-Math.pow((t - tk) / 0.16, 2)); return; }
      const arm = side > 0 ? -1.6 : 1.6;
      const [px, py] = P(side, 0, z), [tx, ty] = P(side, 8, z), [lx, ly] = P(side + arm, 7.8, z);
      const s = clamp(F / z / 2.2, 1.2, 170), a = clamp(1 - z / 240);
      g.strokeStyle = `rgba(40,40,48,${a})`; g.lineWidth = Math.max(1, F * 0.18 / z); g.beginPath(); g.moveTo(px, py); g.lineTo(tx, ty); g.lineTo(lx, ly); g.stroke();
      g.globalAlpha = a; g.drawImage(lampS, lx - s, ly - s, s * 2, s * 2);
      const [rx, ry] = P(side + arm, 0, z), rw = s * 0.9;
      const pool = g.createLinearGradient(0, ry - rw * 0.2, 0, ry + rw * 3);
      pool.addColorStop(0, 'rgba(255,160,80,0.30)'); pool.addColorStop(1, 'rgba(255,160,80,0)');
      g.fillStyle = pool; g.fillRect(rx - rw * 0.35, ry - rw * 0.2, rw * 0.7, rw * 3.2);
      g.globalAlpha = 1;
      sweep += Math.exp(-Math.pow((t - tk) / 0.16, 2));
    });
    // The light washing through the cabin as each one goes over.
    if (sweep > 0.01) {
      const cg = g.createRadialGradient(560, 0, 0, 560, 0, 1300);
      cg.addColorStop(0, `rgba(255,160,90,${0.42 * sweep})`); cg.addColorStop(1, 'rgba(255,160,90,0)');
      g.fillStyle = cg; g.fillRect(0, 0, W, H);
    }
    g.globalCompositeOperation = 'source-over';
    // The car: roof, pillars, mirror, dashboard.
    g.fillStyle = '#020203';
    g.beginPath(); g.moveTo(0, -30); g.lineTo(W, -30); g.lineTo(W, 150); g.quadraticCurveTo(540, 240, 0, 150); g.fill();
    g.beginPath(); g.moveTo(0, 150); g.lineTo(120, 190); g.lineTo(0, 1350); g.fill();
    g.beginPath(); g.moveTo(W, 150); g.lineTo(W - 120, 190); g.lineTo(W, 1350); g.fill();
    rr(g, 440, 214, 200, 70, 24); g.fill();
    g.fillStyle = `rgba(255,170,110,${0.06 + 0.25 * sweep})`; g.fillRect(452, 222, 176, 3);
    g.fillStyle = '#030305';
    g.beginPath(); g.moveTo(0, 1520); g.bezierCurveTo(300, 1440, 780, 1440, W, 1520); g.lineTo(W, H + 40); g.lineTo(0, H + 40); g.fill();
    g.strokeStyle = `rgba(255,190,140,${0.10 + 0.4 * sweep})`; g.lineWidth = 2;
    g.beginPath(); g.moveTo(0, 1520); g.bezierCurveTo(300, 1440, 780, 1440, W, 1520); g.stroke();
    g.restore();
  };
}

// ── wall ───────────────────────────────────────────────────────────────────
/** Carved script on a stone wall, 2500 px wide so the camera can track along it (pan = x - 540 centres one). */
export const CARVINGS = [
  { g: '𓋹', font: 'Hiero', size: 360, x: 560, y: 900 },
  { g: '𒉆𒋻', font: 'Cunei', size: 230, x: 1260, y: 960 },
  { g: 'ᚹᚣᚱᛞ', font: 'Runic', size: 240, x: 1960, y: 900 },
];
export async function wallShot() {
  const WW = 2500, TW = 625;
  const big = fbm(TW, 480, { scale: 60, oct: 5, seed: 17 }), fine = fbm(TW, 480, { scale: 6, oct: 2, seed: 18 });
  const stone = paint(TW, 480, big, (v, x, y) => { const f = fine[y * TW + x]; const s = 0.55 + 0.9 * v + 0.35 * (f - 0.5); return [96 * s, 78 * s, 62 * s, 255]; });
  const wall = canvas(WW, H), g0 = wall.getContext('2d');
  g0.imageSmoothingQuality = 'high'; g0.drawImage(stone, 0, 0, WW, H);
  const R = rng(19);
  g0.strokeStyle = 'rgba(0,0,0,0.45)'; g0.lineWidth = 2;        // cracks
  for (let k = 0; k < 16; k++) { let x = R() * WW, y = R() * H; g0.beginPath(); g0.moveTo(x, y); for (let s = 0; s < 30; s++) { x += (R() - 0.5) * 40; y += R() * 26; g0.lineTo(x, y); } g0.stroke(); }
  // Web fonts load lazily — ask for each glyph explicitly before carving it.
  await Promise.all(CARVINGS.map((c) => document.fonts.load(`${c.size}px ${c.font}`, c.g)));
  for (const c of CARVINGS) {                                      // incised: a lit lower lip, a dark cut
    g0.font = `${c.size}px ${c.font}`; g0.textAlign = 'center'; g0.textBaseline = 'middle';
    g0.fillStyle = 'rgba(255,215,170,0.22)'; g0.fillText(c.g, c.x + 4, c.y + 5);
    g0.fillStyle = 'rgba(8,5,3,0.80)'; g0.fillText(c.g, c.x, c.y);
    g0.fillStyle = 'rgba(0,0,0,0.35)'; g0.fillText(c.g, c.x - 3, c.y - 3);
  }
  const ember = glowSprite(10, '255,150,60', { core: 1, falloff: 0.3 });
  const embers = Array.from({ length: 110 }, () => ({ x: R() * W, y: R() * H, v: 60 + R() * 160, w: R() * 6.28, s: 0.5 + Math.pow(R(), 3) * 3, ph: R() * 6.28 }));
  const smoke = paint(270, 480, fbm(270, 480, { scale: 80, oct: 4, seed: 23 }), (v) => [120, 90, 70, clamp((v - 0.45) * 2) * 90]);
  return (g, t, { pan = 0, lx = 540, ly = 1250, radius = 900, flare = 0, light = 1 } = {}) => {
    g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
    g.drawImage(wall, -pan, 0);
    const fl = light * (0.86 + 0.07 * Math.sin(t * 13.1) + 0.05 * Math.sin(t * 23.7 + 1) + 0.04 * Math.sin(t * 7.3 + 2) + 0.35 * flare);
    g.globalCompositeOperation = 'multiply';
    const r = radius * (0.92 + 0.08 * fl + 0.25 * flare);
    const lg = g.createRadialGradient(lx, ly, 0, lx, ly, r);
    lg.addColorStop(0, `rgb(${255 * Math.min(1, fl)},${205 * fl},${150 * fl})`); lg.addColorStop(0.45, `rgb(${150 * fl},${80 * fl},${36 * fl})`); lg.addColorStop(1, '#000');
    g.fillStyle = lg; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'lighter';
    const hg = g.createRadialGradient(lx, ly + 300, 0, lx, ly + 300, 700);
    hg.addColorStop(0, `rgba(255,120,40,${0.22 * fl})`); hg.addColorStop(1, 'rgba(255,120,40,0)');
    g.fillStyle = hg; g.fillRect(0, 0, W, H);
    g.globalAlpha = 0.5; g.drawImage(smoke, 0, -((t * 40) % H), W, H); g.drawImage(smoke, 0, H - ((t * 40) % H), W, H); g.globalAlpha = 1;
    for (const e of embers) {
      const y = ((e.y - t * e.v) % H + H) % H, x = e.x + Math.sin(t * 1.3 + e.w) * 30 + Math.sin(t * 3.1 + e.ph) * 8;
      const a = clamp(y / H * 1.4) * (0.5 + 0.5 * Math.sin(t * 6 + e.ph)) * light;
      if (a < 0.03) continue;
      g.globalAlpha = a; const s = 7 * e.s; g.drawImage(ember, x - s, y - s, s * 2, s * 2);
    }
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  };
}

// ── sky ────────────────────────────────────────────────────────────────────
export async function skyShot() {
  const R = rng(51), PX = 560, PY = 360;
  const stars = Array.from({ length: 1100 }, () => {
    const b2 = Math.pow(R(), 4), temp = R();
    return { r: 20 + Math.sqrt(R()) * 1900, a0: R() * 6.2832, w: 0.5 + b2 * 2.4, al: 0.18 + b2 * 0.8, col: temp < 0.2 ? '255,210,170' : temp > 0.8 ? '180,205,255' : '235,238,255' };
  });
  const band = paint(270, 480, fbm(270, 480, { scale: 50, oct: 5, seed: 52 }), (v, x, y) => {
    const d = Math.abs((x - 20) * 0.9 - (y - 60) * 0.45) / 70;   // a diagonal band
    return [170, 180, 230, clamp(1 - d) * clamp((v - 0.35) * 2) * 70];
  });
  return (g, t, { exposure = 0, meteor = -1 } = {}) => {
    const sky = g.createLinearGradient(0, 0, 0, 1560);
    sky.addColorStop(0, '#010208'); sky.addColorStop(0.7, '#050b1c'); sky.addColorStop(0.93, '#0f1a30'); sky.addColorStop(1, '#2b2330');
    g.fillStyle = sky; g.fillRect(0, 0, W, H);
    g.drawImage(band, 0, 0, W, H);
    const len = 0.02 + (exposure + t) * 0.03;
    g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
    for (const s of stars) {
      g.strokeStyle = `rgba(${s.col},${s.al})`; g.lineWidth = s.w;
      g.beginPath(); g.arc(PX, PY, s.r, s.a0, s.a0 + len); g.stroke();
    }
    if (meteor >= 0 && t >= meteor && t < meteor + 0.7) {
      const k = (t - meteor) / 0.7, x = lerp(160, 820, k), y = lerp(260, 700, k);
      const mg = g.createLinearGradient(x - 260, y - 175, x, y); mg.addColorStop(0, 'rgba(255,255,255,0)'); mg.addColorStop(1, `rgba(230,240,255,${0.9 * (1 - k)})`);
      g.strokeStyle = mg; g.lineWidth = 4; g.beginPath(); g.moveTo(x - 260, y - 175); g.lineTo(x, y); g.stroke();
    }
    g.globalCompositeOperation = 'source-over';
    // Dunes, and someone on the crest.
    g.fillStyle = '#030305';
    g.beginPath(); g.moveTo(0, 1500);
    for (let x = 0; x <= W; x += 20) g.lineTo(x, 1500 - 70 * Math.exp(-Math.pow((x - 640) / 260, 2)) + 22 * Math.sin(x * 0.004 + 1));
    g.lineTo(W, H); g.lineTo(0, H); g.fill();
    g.fillStyle = '#020203';
    g.beginPath(); g.ellipse(640, 1352, 9, 11, 0, 0, 6.2832); g.fill();
    g.beginPath(); g.moveTo(628, 1366); g.lineTo(652, 1366); g.lineTo(656, 1420); g.lineTo(624, 1420); g.fill();
    g.fillRect(629, 1418, 8, 22); g.fillRect(643, 1418, 8, 22);
    g.fillStyle = '#040407';
    g.beginPath(); g.moveTo(0, 1640); g.bezierCurveTo(300, 1580, 700, 1700, W, 1620); g.lineTo(W, H); g.lineTo(0, H); g.fill();
  };
}
