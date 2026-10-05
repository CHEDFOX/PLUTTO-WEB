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
  window.__poster = scene.poster;
  window.__frame = async (t) => { await scene.frame(t); drawGrain(Math.round(t * fps)); };
  // Films with a score (the cinematic series) synthesise their soundtrack here; render.mjs muxes it.
  const track = async () => { const { render } = await import('./sound.js'); return render(scene.score(), scene.duration); };
  window.__audio = scene.score ? async () => (await import('./sound.js')).wavBase64(await track()) : null;
  await window.__frame(Number(params.get('t') || 0));
  window.__ready = true;
  if (params.get('play') === '1') {
    let t0 = performance.now();
    const loop = async () => { await window.__frame(((performance.now() - t0) / 1000) % scene.duration); requestAnimationFrame(loop); };
    loop();
    // Click to hear it: browsers only play sound after a gesture. Restarts the film in sync.
    if (scene.score) document.addEventListener('click', async () => {
      const buf = await track(), ac = new AudioContext(), src = ac.createBufferSource();
      src.buffer = buf; src.loop = true; src.connect(ac.destination); src.start(); t0 = performance.now();
    }, { once: true });
  }
}

// ════════════════════════════════════════════════════════════════════════
// PLUTTO POP — the vivid kit. The brand's twelve shelf colours at full
// voltage, ink-black outlines, stickers with hard offset shadows, spinning
// sunbursts, halftone, sparkles, marquee tape, and type that slams in.
// ════════════════════════════════════════════════════════════════════════
export const POP = {
  violet: '#7C3AED', pink: '#FF4FA3', cyan: '#1FC8F0', lime: '#B6F23C', orange: '#FF8A2A', yellow: '#FFE03D',
  blue: '#3355FF', teal: '#10D1B2', red: '#FF4545', magenta: '#E23BD0', ink: '#14102B', cream: '#FFF6E6', white: '#FFFFFF',
};
/** Elastic arrival: 0 → overshoot → 1. */
export const spring = (p) => (p <= 0 ? 0 : p >= 1 ? 1 : 1 - Math.pow(2, -9 * p) * Math.cos(p * Math.PI * 3.2));

/** The backdrop: a colour field, a spinning sunburst, halftone dots. */
export function popBg(stage) {
  const field = el('div', 'layer', {}, stage);
  const burst = el('div', 'abs', { left: '-760px', top: '-460px', width: '2600px', height: '2600px', borderRadius: '50%', opacity: 0.16 }, stage);
  const dots = el('div', 'layer', { opacity: 0.18, backgroundSize: '26px 26px', WebkitMaskImage: 'linear-gradient(160deg, transparent 35%, #000 90%)', maskImage: 'linear-gradient(160deg, transparent 35%, #000 90%)' }, stage);
  return (t, color, { rays = 'rgba(255,255,255,1)', cx = 50, cy = 45, dotColor = POP.ink, spin = 8 } = {}) => {
    field.style.background = color;
    burst.style.background = `repeating-conic-gradient(from ${t * spin}deg at 50% 50%, ${rays} 0deg 7deg, transparent 7deg 18deg)`;
    burst.style.left = `${cx * 10.8 - 1300}px`; burst.style.top = `${cy * 19.2 - 1300}px`;
    dots.style.backgroundImage = `radial-gradient(${dotColor} 26%, transparent 28%)`;
  };
}

/** A sticker: thick ink border, rounded, hard offset shadow. */
export function sticker(parent, html, { bg = POP.white, ink = POP.ink, fg = POP.ink, size = 56, pad = '18px 34px', r = 28, shadow = 12, style = {} } = {}) {
  return el('div', 'abs', { background: bg, color: fg, border: `6px solid ${ink}`, borderRadius: `${r}px`, boxShadow: `${shadow}px ${shadow}px 0 ${ink}`, padding: pad,
    fontSize: `${size}px`, fontWeight: 900, letterSpacing: '-0.02em', whiteSpace: 'nowrap', transformOrigin: '50% 50%', ...style }, parent, html);
}

/** Big ink type with a hard shadow and optional outlined echoes behind it. */
export function slab(parent, text, { size = 220, color = POP.white, ink = POP.ink, shadow = 14, echoes = 0, echoColor = POP.ink, style = {} } = {}) {
  const box = el('div', 'abs', { left: 0, right: 0, textAlign: 'center', ...style }, parent);
  const echo = [];
  for (let i = echoes; i >= 1; i--) {
    echo.push(el('div', '', { position: 'absolute', left: 0, right: 0, fontSize: `${size}px`, fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.92, color: 'transparent',
      WebkitTextStroke: `3px ${echoColor}`, opacity: 0.55 - i * 0.12, textTransform: 'uppercase' }, box, text));
  }
  const main = el('div', '', { position: 'relative', fontSize: `${size}px`, fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.92, color, textTransform: 'uppercase',
    textShadow: shadow ? `${shadow}px ${shadow}px 0 ${ink}` : 'none', WebkitTextStroke: shadow ? `4px ${ink}` : '0', paintOrder: 'stroke fill' }, box, text);
  return { box, main, echo };
}

/** A four-point sparkle ✦. */
export function sparkle(parent, { size = 60, color = POP.yellow, ink = POP.ink, style = {} } = {}) {
  const s = el('div', 'abs', { width: `${size}px`, height: `${size}px`, ...style }, parent);
  s.innerHTML = `<svg viewBox="-50 -50 100 100" width="${size}" height="${size}" style="overflow:visible"><path d="M0 -48 C 6 -10, 10 -6, 48 0 C 10 6, 6 10, 0 48 C -6 10, -10 6, -48 0 C -10 -6, -6 -10, 0 -48 Z" fill="${color}" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/></svg>`;
  return s;
}
export function sparkles(parent, n, seed, colors) {
  const R = rng(seed);
  const list = Array.from({ length: n }, (_, i) => ({ e: sparkle(parent, { size: 34 + R() * 60, color: colors[i % colors.length] }), x: 40 + R() * 1000, y: 180 + R() * 1560, ph: R() * 6.28, sp: 0.6 + R() * 1.4 }));
  return (t, on = 1) => list.forEach((s) => set(s.e, { o: on, x: s.x, y: s.y + Math.sin(t * s.sp + s.ph) * 14, s: (0.55 + 0.45 * Math.abs(Math.sin(t * s.sp * 1.3 + s.ph))) * on, r: t * 40 * s.sp }));
}

/** Diagonal marquee tape: repeating words scrolling along a tilted band. */
export function marquee(parent, words, { y = 1600, rot = -8, bg = POP.yellow, fg = POP.ink, size = 58, speed = 180 } = {}) {
  const band = el('div', 'abs', { left: '-300px', width: '1700px', top: `${y}px`, background: bg, borderTop: `6px solid ${POP.ink}`, borderBottom: `6px solid ${POP.ink}`, overflow: 'hidden', transform: `rotate(${rot}deg)`, padding: '14px 0' }, parent);
  const track = el('div', '', { whiteSpace: 'nowrap', width: 'max-content', fontSize: `${size}px`, fontWeight: 900, color: fg, letterSpacing: '-0.01em', textTransform: 'uppercase' }, band, `${words.join(' ✦ ')} ✦ `.repeat(8));
  return (t, o = 1) => { track.style.transform = `translateX(${-((t * speed) % 2400)}px)`; band.style.opacity = o; };
}

/** A soft blob that breathes: a closed curve with a wobbling radius. */
export function blob(parent, { size = 700, color = POP.pink, seed = 1, style = {} } = {}) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '-100 -100 200 200');
  Object.assign(svg.style, { position: 'absolute', width: `${size}px`, height: `${size}px`, overflow: 'visible', ...style });
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('fill', color); p.setAttribute('stroke', POP.ink); p.setAttribute('stroke-width', '3');
  svg.appendChild(p); parent.appendChild(svg);
  const R = rng(seed); const ph = Array.from({ length: 4 }, () => R() * 6.28);
  return (t) => {
    const pts = Array.from({ length: 48 }, (_, i) => {
      const a = (i / 48) * Math.PI * 2;
      const r = 80 + 8 * Math.sin(a * 3 + t * 1.3 + ph[0]) + 6 * Math.sin(a * 5 - t * 0.9 + ph[1]) + 4 * Math.sin(a * 2 + t * 1.7 + ph[2]);
      return [Math.cos(a) * r, Math.sin(a) * r];
    });
    p.setAttribute('d', `M ${pts.map((q) => q.map((v) => v.toFixed(1)).join(' ')).join(' L ')} Z`);
  };
}

/** Where each render's disc sits (fractions of width/height; radius of width), measured. */
export const DISC = { sun: { cx: 0.498, cy: 0.503, r: 0.333 }, mercury: { cx: 0.533, cy: 0.486, r: 0.095 }, venus: { cx: 0.438, cy: 0.5, r: 0.194 },
  mars: { cx: 0.543, cy: 0.476, r: 0.127 }, rahu: { cx: 0.502, cy: 0.503, r: 0.233 }, ketu: { cx: 0.493, cy: 0.485, r: 0.168 }, Neptune: { cx: 0.396, cy: 0.497, r: 0.19 }, Uranus: { cx: 0.491, cy: 0.505, r: 0.157 } };
/** A planet render as a badge: its disc filling an ink ring, on colour. */
export function badge(parent, name, { size = 520, fill = 0.94, bg = POP.ink, style = {} } = {}) {
  const d = DISC[name];
  const b = el('div', 'abs', { width: `${size}px`, height: `${size}px`, borderRadius: '50%', overflow: 'hidden', border: `8px solid ${POP.ink}`, background: bg, boxShadow: `14px 14px 0 ${POP.ink}`, ...style }, parent);
  const w = (size * fill) / 2 / d.r;
  const i = el('img', '', { position: 'absolute', width: `${w}px`, left: `${size / 2 - w * d.cx - 8}px`, top: `${size / 2 - w * 1.2857 * d.cy - 8}px`, maxWidth: 'none' }, b);
  i.src = `${ASSET}/planets/${name}.png`;
  return b;
}

/** The pop end card: logo sticker, the line, a CTA pill, and marquee tape. */
export function popEnd(stage, { line = 'Five thousand years old.', punch = 'Talks back.', cta = 'plutto.space', sub = 'Free to start · Android · Web', bg = POP.violet } = {}) {
  const box = el('div', 'layer', { zIndex: 30, opacity: 0, background: bg, overflow: 'hidden' }, stage);
  const burst = el('div', 'abs', { left: '-760px', top: '-560px', width: '2600px', height: '2600px', borderRadius: '50%', opacity: 0.14 }, box);
  const tape = marquee(box, ['Vedic', 'Western', 'Chinese', 'KP', 'Numerology', 'Tarot', 'Runes', 'I Ching'], { y: 1500, rot: -7 });
  const mark = el('div', 'abs', { left: 0, right: 0, top: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '28px' }, box);
  const ring = el('div', '', { width: '130px', height: '130px', borderRadius: '50%', background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.45))', position: 'relative', border: `6px solid ${POP.ink}`, boxShadow: `10px 10px 0 ${POP.ink}` }, mark);
  el('div', '', { position: 'absolute', inset: '26px', borderRadius: '50%', background: POP.ink }, ring);
  el('div', '', { fontSize: '150px', fontWeight: 900, letterSpacing: '-0.05em', color: '#fff', textShadow: `10px 10px 0 ${POP.ink}`, WebkitTextStroke: `4px ${POP.ink}`, paintOrder: 'stroke fill' }, mark, 'Plutto');
  const l1 = el('div', 'abs center', { top: '660px', fontSize: '76px', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff' }, box, line);
  const l2 = el('div', 'abs center', { top: '750px', fontSize: '130px', fontWeight: 900, letterSpacing: '-0.05em', color: POP.yellow, textShadow: `10px 10px 0 ${POP.ink}`, WebkitTextStroke: `4px ${POP.ink}`, paintOrder: 'stroke fill', textTransform: 'uppercase' }, box, punch);
  const pill = sticker(box, cta, { bg: POP.yellow, size: 60, pad: '26px 56px', r: 999, style: { left: '50%', top: '1010px' } });
  const s = el('div', 'abs center', { top: '1180px', fontSize: '34px', fontWeight: 800, color: '#fff', letterSpacing: '0.02em' }, box, sub);
  return (t) => {
    box.style.opacity = t > 0 ? 1 : 0;
    box.style.clipPath = `circle(${ease.outCubic(prog(t, 0, 0.55)) * 150}% at 50% 60%)`;
    burst.style.background = `repeating-conic-gradient(from ${t * 10}deg at 50% 50%, #fff 0deg 7deg, transparent 7deg 18deg)`;
    tape(t, 1);
    set(mark, { s: spring(prog(t, 0.15, 1.0)), r: (1 - spring(prog(t, 0.15, 1.0))) * -10 });
    set(ring, { r: t * 30 });
    set(l1, { o: ease.outCubic(prog(t, 0.4, 0.7)), y: (1 - ease.outExpo(prog(t, 0.4, 1))) * 40 });
    set(l2, { s: spring(prog(t, 0.55, 1.35)), r: -3 });
    pill.style.transform = `translateX(-50%) scale(${spring(prog(t, 0.8, 1.6))}) rotate(-2deg)`;
    set(s, { o: ease.outCubic(prog(t, 1.1, 1.5)) });
  };
}
