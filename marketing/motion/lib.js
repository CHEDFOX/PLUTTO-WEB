/**
 * THE MOTION KIT — everything the films share, in the site's own language:
 * black, a slow violet haze, heavy tight Inter, the four-colour gradient, a
 * handwritten aside, real app footage in a phone. Every function is a pure
 * function of time: frame(t) always draws the same picture for the same t.
 */
export const ASSET = '../../public';
export const W = 1080, H = 1920;

// ── time ───────────────────────────────────────────────────────────────────
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, p) => a + (b - a) * p;
export const prog = (t, a, b) => clamp((t - a) / (b - a));
export const ease = {
  outExpo: (p) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p)),
  outCubic: (p) => 1 - Math.pow(1 - p, 3),
  inCubic: (p) => p * p * p,
  inOutCubic: (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
  inOutSine: (p) => -(Math.cos(Math.PI * p) - 1) / 2,
  outBack: (p) => { const c = 1.4; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); },
};
/** In at [a, a+d], out at [b, b+d]: 0 → 1 → 0, eased. */
export const inOut = (t, a, b, d = 0.5, e = ease.outCubic) => e(prog(t, a, a + d)) * (1 - ease.inCubic(prog(t, b, b + d)));

export function rng(seed) {
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let x = Math.imul(seed ^ (seed >>> 15), 1 | seed); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
}

// ── DOM ────────────────────────────────────────────────────────────────────
export function el(tag, cls = '', style = {}, parent = null, html = '') {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  Object.assign(e.style, style);
  if (html) e.innerHTML = html;
  if (parent) parent.appendChild(e);
  return e;
}
export function set(e, { o, x = 0, y = 0, s = 1, r = 0, blur = 0 } = {}) {
  if (o !== undefined) e.style.opacity = o;
  e.style.transform = `translate(${x}px, ${y}px) scale(${s}) rotate(${r}deg)`;
  e.style.filter = blur > 0.05 ? `blur(${blur}px)` : 'none';
}

/** A line of words that rise out of their own masks, as on plutto.space. */
export function words(parent, text, cls = '', style = {}) {
  const root = el('div', cls, style, parent);
  const spans = [];
  text.split(' ').forEach((w, i, all) => {
    const mask = el('span', 'w', {}, root);
    const inner = el('span', '', {}, mask);
    inner.textContent = w;
    spans.push(inner);
    if (i < all.length - 1) root.appendChild(document.createTextNode(' '));
  });
  return { root, spans };
}
/** p is seconds since the line started; each word lands `stagger` s after the last. */
export function rise(spans, p, { stagger = 0.07, dur = 0.9, dist = 1.05, out = null } = {}) {
  spans.forEach((s, i) => {
    const k = ease.outExpo(prog(p, i * stagger, i * stagger + dur));
    const o = out === null ? 0 : ease.inCubic(prog(p, out + i * 0.03, out + i * 0.03 + 0.45));
    s.style.transform = `translateY(${(1 - k) * dist * 100 + o * -dist * 100}%)`;
  });
}

// ── atmosphere ─────────────────────────────────────────────────────────────
export function haze(stage, { color = '124,58,237', x = 0.3, y = 0.28, size = 1500, alpha = 0.22 } = {}) {
  const e = el('div', 'layer', { background: `radial-gradient(${size}px ${size * 0.8}px at ${x * 100}% ${y * 100}%, rgba(${color},${alpha}), transparent 70%)` }, stage);
  return (t) => { e.style.transform = `translate(${Math.sin(t * 0.35) * 40}px, ${Math.cos(t * 0.27) * 50}px) scale(${1 + Math.sin(t * 0.2) * 0.04})`; };
}

export function stars(stage, { seed = 7, n = 260, speed = 6 } = {}) {
  const c = el('canvas', 'layer', {}, stage);
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  const R = rng(seed);
  const pts = Array.from({ length: n }, () => ({ x: R() * W, y: R() * H, z: 0.2 + R() * 0.8, tw: R() * 6.28, r: R() }));
  return (t) => {
    g.clearRect(0, 0, W, H);
    for (const p of pts) {
      const y = (p.y - t * speed * p.z * 10 + H * 10) % H;
      const a = (0.25 + 0.55 * p.z) * (0.75 + 0.25 * Math.sin(t * 1.6 + p.tw));
      g.fillStyle = `rgba(255,255,255,${a})`;
      g.beginPath(); g.arc(p.x, y, 0.6 + p.z * 1.5 * (p.r > 0.97 ? 1.8 : 1), 0, 6.283); g.fill();
    }
  };
}

/** Film grain: pre-made noise tiles, a different one each frame, barely there. */
export function grain(stage, { alpha = 0.055 } = {}) {
  const c = el('canvas', 'layer', { opacity: alpha, mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 50 }, stage);
  c.width = W / 2; c.height = H / 2;
  c.style.width = `${W}px`; c.style.height = `${H}px`;
  const g = c.getContext('2d');
  const tiles = Array.from({ length: 6 }, (_, k) => {
    const t = document.createElement('canvas'); t.width = t.height = 256;
    const tg = t.getContext('2d'); const img = tg.createImageData(256, 256); const R = rng(k + 11);
    for (let i = 0; i < img.data.length; i += 4) { const v = R() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    tg.putImageData(img, 0, 0); return t;
  });
  return (frame) => { g.fillStyle = g.createPattern(tiles[frame % tiles.length], 'repeat'); g.fillRect(0, 0, c.width, c.height); };
}

export function vignette(stage) {
  el('div', 'layer', { background: 'radial-gradient(130% 90% at 50% 45%, transparent 55%, rgba(0,0,0,0.75))', zIndex: 40, pointerEvents: 'none' }, stage);
}

// ── media ──────────────────────────────────────────────────────────────────
export function img(parent, src, style = {}) {
  const i = el('img', 'abs', style, parent);
  i.src = src;
  return i;
}
/**
 * Real app footage. The recordings (public/app/screens/*.webm) are decoded
 * once by render.mjs into frames/<name>/NNNN.jpg at 30 fps, and a film draws
 * the frame for time t onto a canvas — whole, or a crop of it. (The renderer's
 * Chromium decodes video but will not hand its frames to a canvas or a
 * screenshot, so a <video> element would record as black.)
 * crop = [sx, sy, sw, sh] in the recording's pixels (590×1280).
 */
export function footage(parent, name, { crop = [0, 0, 590, 1280], w = 560, h = 1215, cls = '', style = {}, fps = 30 } = {}) {
  const box = el('div', cls, { position: 'absolute', width: `${w}px`, height: `${h}px`, overflow: 'hidden', ...style }, parent);
  const c = el('canvas', '', { width: '100%', height: '100%', display: 'block' }, box);
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  const count = FRAMES[name];
  const im = new Image();
  let last = -1;
  return {
    el: box,
    async at(time) {
      const n = Math.min(count, Math.max(1, Math.floor(time * fps) + 1));
      if (n === last) return;
      last = n;
      im.src = `frames/${name}/${String(n).padStart(4, '0')}.jpg`;
      await im.decode();
      g.fillStyle = '#000'; g.fillRect(0, 0, w, h);
      g.drawImage(im, crop[0], crop[1], crop[2], crop[3], 0, 0, w, h);
    },
  };
}
/** Frame counts, written by render.mjs when it decodes the recordings. */
export let FRAMES = {};
/** The whole screen of the app inside a phone body. */
export function phone(parent, name, style = {}) {
  const p = el('div', 'phone', style, parent);
  const f = footage(p, name, { w: 554, h: 1174, style: { inset: '0' } });
  return { el: p, at: f.at };
}

/** A handwritten underline or arrow, drawn on as p goes 0 → 1. */
export function scribble(parent, d, style = {}, { width = 5, color = 'rgba(255,255,255,0.82)' } = {}) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  Object.assign(svg.style, { position: 'absolute', overflow: 'visible', ...style });
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d); path.setAttribute('fill', 'none'); path.setAttribute('stroke', color);
  path.setAttribute('stroke-width', width); path.setAttribute('stroke-linecap', 'round'); path.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(path); parent.appendChild(svg);
  let len = 0;
  return (p) => { if (!len) len = path.getTotalLength(); path.style.strokeDasharray = len; path.style.strokeDashoffset = len * (1 - p); };
}

// ── the end card every film closes on ─────────────────────────────────────
export function endCard(stage, { line = 'Five thousand years old. Talks back.', grad = 'Talks back.', cta = 'plutto.space', sub = 'Free to start · Android · Web' } = {}) {
  const box = el('div', 'layer', { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 30, opacity: 0 }, stage);
  const mark = el('div', '', { display: 'flex', alignItems: 'center', gap: '26px' }, box);
  // The nav's mark: a ring, white to translucent white, with a black core.
  const ring = el('div', '', { width: '104px', height: '104px', borderRadius: '50%', background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.4))', position: 'relative' }, mark);
  el('div', '', { position: 'absolute', inset: '24px', borderRadius: '50%', background: '#000' }, ring);
  el('div', 'h1', { fontSize: '112px', fontWeight: 700, letterSpacing: '-0.035em' }, mark, 'Plutto');
  const plain = line.replace(grad, '').trim();
  const l = el('div', 'h1', { fontSize: '64px', marginTop: '70px', textAlign: 'center', maxWidth: '900px', lineHeight: 1.12 }, box, `${plain}<br><span class="grad" style="white-space:nowrap;padding-right:0.05em">${grad}</span>`);
  const c = el('div', 'chip', { marginTop: '90px', fontSize: '40px', background: '#fff', color: '#000', border: 0, padding: '26px 52px' }, box, cta);
  const s = el('div', 'caps', { marginTop: '38px', fontSize: '24px' }, box, sub);
  const parts = [mark, l, c, s];
  return (t) => {
    box.style.opacity = ease.outCubic(prog(t, 0, 0.4));
    parts.forEach((e, i) => set(e, { o: ease.outCubic(prog(t, 0.1 + i * 0.12, 0.8 + i * 0.12)), y: (1 - ease.outExpo(prog(t, 0.1 + i * 0.12, 1 + i * 0.12))) * 60 }));
    l.querySelector('.grad').style.backgroundPosition = `${ease.inOutCubic(prog(t, 0.6, 2.6)) * 150}% 0`;
    set(ring, { r: t * 20 });
  };
}

// ── boot ───────────────────────────────────────────────────────────────────
export async function boot(params) {
  const stage = document.getElementById('stage');
  const id = params.get('scene') || 'talks-back';
  try { FRAMES = await (await fetch('frames/index.json')).json(); } catch { FRAMES = {}; }
  const scene = (await import(`./scenes/${id}.js`)).default;
  const drawGrain = grain(stage);
  await scene.setup(stage);
  await document.fonts.ready;
  await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
  const fps = 30;
  window.__duration = scene.duration;
  window.__fps = fps;
  window.__frame = async (t) => { await scene.frame(t); drawGrain(Math.round(t * fps)); };
  await window.__frame(Number(params.get('t') || 0));
  window.__ready = true;
  if (params.get('play') === '1') {
    const t0 = performance.now();
    const loop = async () => { await window.__frame(((performance.now() - t0) / 1000) % scene.duration); requestAnimationFrame(loop); };
    loop();
  }
}
