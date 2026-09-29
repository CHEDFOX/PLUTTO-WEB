/**
 * PLUTTO CINEMA — the kit for the cinematic series. A world drawn on one
 * canvas (the shots in shots.js), a camera that pushes and shakes, highlight
 * bloom, a colour grade, letterbox bars that snap open on the drop, serif
 * titles that settle like a trailer's, flash frames, the real app in a 3D
 * phone, and the end card. Every function is a pure function of time.
 *
 * Music and picture share one clock: 100 BPM, a beat every 0.6 s. Films place
 * cuts and cues with b(n) — n beats in — so the score (sound.js) and the
 * pictures can't drift apart.
 */
import { el, set, clamp, lerp, prog, ease, rng, W, H, footage } from './lib.js';

export const BEAT = 0.6;
export const b = (n) => Math.round(n * BEAT * 1000) / 1000;

/** Decaying envelope of the most recent of `hits` (seconds) at t. */
export function impulse(t, hits, dur = 0.45) {
  let v = 0;
  for (const h of hits) if (t >= h && t < h + dur) v = Math.max(v, Math.pow(1 - (t - h) / dur, 2));
  return v;
}

/**
 * The cinema. Layers, bottom to top: the world (canvas + props such as
 * phones, inside the camera), bloom, grade, vignette, titles, bars, flash,
 * fade, grain.
 */
export function cinema(stage, { bloom = 0.85 } = {}) {
  const cam = el('div', 'layer', { transformOrigin: '50% 50%' }, stage);
  const c = el('canvas', 'layer', {}, cam); c.width = W; c.height = H;
  const g = c.getContext('2d');
  const bl = el('canvas', 'layer', { mixBlendMode: 'screen', opacity: bloom, pointerEvents: 'none' }, cam);
  const props = el('div', 'layer', {}, cam);   // above the bloom, so the world's glow doesn't haze a phone
  bl.width = 270; bl.height = 480; bl.style.width = `${W}px`; bl.style.height = `${H}px`;
  const bg = bl.getContext('2d');
  const small = document.createElement('canvas'); small.width = 68; small.height = 120; const sg = small.getContext('2d');
  const tiny = document.createElement('canvas'); tiny.width = 17; tiny.height = 30; const tg = tiny.getContext('2d');
  [bg, sg, tg].forEach((x) => { x.imageSmoothingQuality = 'high'; });

  const grade = el('div', 'layer', { mixBlendMode: 'soft-light', opacity: 0.55, pointerEvents: 'none' }, stage);
  el('div', 'layer', { background: 'radial-gradient(120% 75% at 50% 48%, transparent 50%, rgba(0,0,0,0.82))', pointerEvents: 'none' }, stage);
  const titles = el('div', 'layer', {}, stage);
  const barT = el('div', 'abs', { left: 0, right: 0, top: 0, height: 0, background: '#000' }, stage);
  const barB = el('div', 'abs', { left: 0, right: 0, bottom: 0, height: 0, background: '#000' }, stage);
  const over = el('div', 'layer', { pointerEvents: 'none' }, stage);   // titles that sit in the bars
  const flash = el('div', 'layer', { background: '#fff', opacity: 0, pointerEvents: 'none' }, stage);
  const fade = el('div', 'layer', { background: '#000', opacity: 0, pointerEvents: 'none' }, stage);
  const R = rng(99);
  const weave = Array.from({ length: 64 }, () => [R() - 0.5, R() - 0.5]);

  return {
    g, c, props, titles, over,
    /** Apply the camera and the post for this frame, after the shot has drawn. */
    post(t, { zoom = 1, x = 0, y = 0, ox = 50, oy = 50, shake = 0, bars = 0, flash: fl = 0, flashColor = '#fff', fade: fd = 0,
      tint = ['rgba(0,90,120,1)', 'rgba(255,140,60,1)'], tintOpacity = 0.5, bloom: bk = 1 } = {}) {
      const f = Math.round(t * 30), w = weave[f % 64];
      const sx = shake * 26 * (Math.sin(t * 71) + 0.6 * Math.sin(t * 131 + 1)), sy = shake * 22 * (Math.cos(t * 83) + 0.6 * Math.sin(t * 149));
      cam.style.transformOrigin = `${ox}% ${oy}%`;
      cam.style.transform = `translate(${x + sx + w[0] * 1.4}px, ${y + sy + w[1] * 1.4}px) scale(${zoom * (1 + shake * 0.035)})`;
      // Bloom: downsample, square twice (keeps only the highlights), blur by up- and downsampling.
      bg.globalCompositeOperation = 'copy'; bg.drawImage(c, 0, 0, 270, 480);
      bg.globalCompositeOperation = 'multiply'; bg.drawImage(bl, 0, 0); bg.drawImage(bl, 0, 0);
      sg.globalCompositeOperation = 'copy'; sg.drawImage(bl, 0, 0, 68, 120);
      tg.globalCompositeOperation = 'copy'; tg.drawImage(small, 0, 0, 17, 30);
      bg.globalCompositeOperation = 'copy'; bg.drawImage(small, 0, 0, 270, 480);
      bg.globalCompositeOperation = 'lighter'; bg.globalAlpha = 0.9; bg.drawImage(tiny, 0, 0, 270, 480); bg.globalAlpha = 1;
      bl.style.opacity = bloom * bk;
      grade.style.background = `linear-gradient(180deg, ${tint[0]}, ${tint[1]})`;
      grade.style.opacity = tintOpacity;
      const bh = Math.round(bars);
      barT.style.height = `${bh}px`; barB.style.height = `${bh}px`;
      flash.style.opacity = fl; flash.style.background = flashColor;
      fade.style.opacity = fd;
    },
  };
}

// ── titles ─────────────────────────────────────────────────────────────────
/**
 * A title line. kind: 'serif' (Cormorant, the voice of the films), 'italic',
 * 'caps' (small, wide-tracked Inter — the credits register), 'slab' (big
 * serif capitals — the trailer's punch words).
 */
export function title(parent, html, { kind = 'serif', size, top = 900, color = '#F4F1EA', width = 960, style = {} } = {}) {
  const base = {
    serif: { fontFamily: 'Cormorant', fontWeight: 500, fontSize: `${size || 104}px`, lineHeight: 1.04, letterSpacing: '-0.01em' },
    italic: { fontFamily: 'Cormorant', fontStyle: 'italic', fontWeight: 500, fontSize: `${size || 96}px`, lineHeight: 1.08, letterSpacing: '-0.005em' },
    caps: { fontFamily: 'Inter', fontWeight: 500, fontSize: `${size || 26}px`, letterSpacing: '0.42em', textTransform: 'uppercase', color: 'rgba(244,241,234,0.72)' },
    slab: { fontFamily: 'Cormorant', fontWeight: 600, fontSize: `${size || 150}px`, lineHeight: 0.96, letterSpacing: '0.06em', textTransform: 'uppercase' },
  }[kind];
  const e = el('div', 'abs', { left: `${(W - width) / 2}px`, width: `${width}px`, top: `${top}px`, textAlign: 'center', color, opacity: 0,
    textShadow: '0 2px 30px rgba(0,0,0,0.55)', ...base, ...style }, parent, html);
  e.dataset.track = kind === 'caps' ? '0.42' : kind === 'slab' ? '0.06' : '0';
  return e;
}
/**
 * Show a title from a to b. mode: 'settle' (fades in from blur while its
 * tracking closes — the trailer title), 'cut' (hard in with a small scale
 * punch, hard out — for words on hits), 'fade'.
 */
export function show(e, t, a, b, { mode = 'settle', d = 0.9, out = 0.35 } = {}) {
  const on = t >= a && t < b + (mode === 'cut' ? 0 : out);
  if (!on) { e.style.opacity = 0; return; }
  const base = Number(e.dataset.track);
  if (mode === 'cut') {
    const k = ease.outExpo(prog(t, a, a + 0.5));
    e.style.opacity = 1; e.style.filter = 'none';
    e.style.transform = `scale(${lerp(1.1, 1, k)})`;
    e.style.letterSpacing = `${base + (1 - k) * 0.05}em`;
    return;
  }
  const i = ease.outCubic(prog(t, a, a + d)), o = ease.inCubic(prog(t, b, b + out));
  e.style.opacity = i * (1 - o);
  e.style.filter = `blur(${(1 - i) * 10 + o * 8}px)`;
  e.style.transform = `translateY(${(1 - i) * 18 - o * 10}px)`;
  if (mode === 'settle') e.style.letterSpacing = `${base + (1 - ease.outCubic(prog(t, a, a + d * 2.2))) * 0.14}em`;
}

// ── the phone ──────────────────────────────────────────────────────────────
/**
 * The real app in a phone, in 3D. The footage (a decoded recording, see
 * lib.footage) fills the screen; a glare sweeps the glass; the screen can be
 * dark (asleep) and light up.
 */
export function phone3d(parent, name, { w = 560, persp = 2600, lit = 0 } = {}) {
  const h = Math.round(w * 1280 / 590), bez = Math.round(w * 0.028);
  const box = el('div', 'layer', { perspective: `${persp}px`, perspectiveOrigin: '50% 45%' }, parent);
  const glow = el('div', 'abs', { left: '50%', top: '50%', width: `${w * 2.6}px`, height: `${h * 1.5}px`, marginLeft: `${-w * 1.3}px`, marginTop: `${-h * 0.75}px`,
    background: 'radial-gradient(closest-side, rgba(120,150,255,0.30), rgba(90,70,200,0.10) 55%, transparent)', opacity: 0 }, box);
  const body = el('div', 'abs', { left: '50%', top: '50%', width: `${w + bez * 2}px`, height: `${h + bez * 2}px`, marginLeft: `${-(w / 2 + bez)}px`, marginTop: `${-(h / 2 + bez)}px`,
    borderRadius: `${w * 0.13}px`, background: 'linear-gradient(150deg, #2a2b31, #0b0b0e 40%, #16171b)', padding: `${bez}px`,
    boxShadow: `0 0 0 2px rgba(255,255,255,0.10), 0 ${w * 0.12}px ${w * 0.3}px rgba(0,0,0,0.7)`, transformStyle: 'preserve-3d' }, box);
  const screen = el('div', '', { position: 'relative', width: `${w}px`, height: `${h}px`, borderRadius: `${w * 0.105}px`, overflow: 'hidden', background: '#000' }, body);
  const f = footage(screen, name, { w, h, style: { left: 0, top: 0 } });
  // `lit`: light the glass itself (a phone seen from across a room reads as its glow, not its UI).
  const light = el('div', 'layer', { background: 'radial-gradient(90% 70% at 50% 40%, rgba(190,205,255,0.9), rgba(120,140,255,0.5) 60%, rgba(90,100,220,0.3))', opacity: 0 }, screen);
  const sleep = el('div', 'layer', { background: '#000' }, screen);
  const glare = el('div', 'layer', { background: 'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.06) 48%, rgba(255,255,255,0.015) 53%, transparent 60%)', backgroundSize: '300% 300%' }, screen);
  return {
    el: box, body,
    at: f.at,
    pose(t, { x = 0, y = 0, s = 1, rx = 0, ry = 0, rz = 0, on = 1, glow: gl = 1, o = 1 } = {}) {
      box.style.opacity = o;
      body.style.transform = `translate3d(${x}px, ${y}px, 0) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s})`;
      glow.style.transform = `translate(${x}px, ${y + 40}px) scale(${s})`;
      glow.style.opacity = on * gl;
      sleep.style.opacity = 1 - on;
      light.style.opacity = lit * on;
      glare.style.backgroundPosition = `${lerp(100, 0, (t * 0.12) % 1)}% 0`;
    },
  };
}

// ── the end card ───────────────────────────────────────────────────────────
/** Black. The mark and the wordmark, an anamorphic flare, the line, the address. */
export function cineEnd(stage, { line = 'Five thousand years old. Talks back.', cta = 'plutto.space', sub = 'Free to start · Android · Web' } = {}) {
  const box = el('div', 'layer', { background: '#000', opacity: 0, zIndex: 20 }, stage);
  const flare = el('div', 'abs', { left: '-600px', top: '720px', width: '2280px', height: '160px', mixBlendMode: 'screen',
    background: 'radial-gradient(50% 50% at 50% 50%, rgba(170,190,255,0.85), rgba(110,120,255,0.25) 18%, rgba(90,80,220,0.08) 45%, transparent 70%)' }, box);
  const core = el('div', 'abs', { left: '50%', top: '800px', width: '26px', height: '26px', marginLeft: '-13px', marginTop: '-13px', borderRadius: '50%', background: '#fff',
    boxShadow: '0 0 40px 18px rgba(200,210,255,0.8), 0 0 140px 60px rgba(120,130,255,0.35)' }, box);
  const mark = el('div', 'abs', { left: 0, right: 0, top: '728px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px' }, box);
  const ring = el('div', '', { width: '130px', height: '130px', borderRadius: '50%', background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.4))', position: 'relative' }, mark);
  el('div', '', { position: 'absolute', inset: '30px', borderRadius: '50%', background: '#000' }, ring);
  const word = el('div', '', { fontSize: '142px', fontWeight: 700, letterSpacing: '-0.035em', color: '#fff' }, mark, 'Plutto');
  const l = title(box, line, { kind: 'italic', size: 74, top: 960, width: 940 });
  const c = title(box, cta, { kind: 'serif', size: 64, top: 1230, style: { fontFamily: 'Inter', fontWeight: 600, letterSpacing: '-0.01em' } });
  const s = title(box, sub, { kind: 'caps', size: 24, top: 1340 });
  return (t) => {
    box.style.opacity = t < 0 ? 0 : 1;
    if (t < 0) return;
    const f = ease.outCubic(prog(t, 0, 0.35)) * (1 - ease.inOutSine(prog(t, 0.5, 2.2)));
    flare.style.opacity = f; flare.style.transform = `scaleX(${lerp(0.4, 1.3, ease.outCubic(prog(t, 0, 1.4)))})`;
    core.style.opacity = f; core.style.transform = `scale(${lerp(0.2, 1.4, ease.outExpo(prog(t, 0, 0.6)))})`;
    const m = ease.outCubic(prog(t, 0.25, 1.2));
    set(mark, { o: m, s: lerp(1.06, 1, ease.outExpo(prog(t, 0.25, 2))), blur: (1 - m) * 12 });
    set(ring, { r: t * 18 });
    word.style.letterSpacing = `${-0.035 + (1 - ease.outCubic(prog(t, 0.25, 2.2))) * 0.12}em`;
    show(l, t, 0.9, 99, { d: 1 });
    show(c, t, 1.5, 99, { mode: 'fade', d: 0.7 });
    show(s, t, 1.8, 99, { mode: 'fade', d: 0.7 });
  };
}

/** Smooth wobble for a hand-held camera. */
export const drift = (t, a = 1) => ({ x: a * (6 * Math.sin(t * 0.61) + 3 * Math.sin(t * 1.33 + 1)), y: a * (5 * Math.sin(t * 0.47 + 2) + 2.5 * Math.sin(t * 1.21)) });
export { clamp, lerp, prog, ease };
