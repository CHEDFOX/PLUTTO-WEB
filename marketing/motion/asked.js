/**
 * ASKED — the shared kit for the "Asked Plutto" series (scenes/asked-*.js).
 *
 * Each film is a question someone would never ask a friend, typed into the REAL
 * app: the Oracle answers word by word, and the chip under its reply opens the
 * real feature (a room drawn from the reader's own chart). The footage is a
 * recording of the app's web build (public/app/screens/ask-*.webm, 590×1280,
 * 30 fps); only the reply is scripted, so every film carries the `honest()` tag.
 *
 * Every film keeps the app INSIDE A DEVICE — never full screen — and dresses the
 * device in its own art style (`device(…, { skin })`).
 *
 *   const ev = await events('ask-toxic');      // when things happen in the recording (s)
 *   const d = device(stage, 'ask-toxic', { skin: 'ink' });
 *   const clock = remap([[0, ev.type_0 - 0.3], [2.4, ev.send_0, 1.6], …]);   // film t → footage t
 *   await d.at(clock(t)); d.pose(t, { ry: -8 });
 */
import { el, set, footage, lerp, prog, ease, clamp } from './lib.js';

/** The recording's moments, in seconds from its first frame (written by the recorder). */
export async function events(name) {
  return (await fetch(`asked/${name}.events.json`)).json();
}

/**
 * Film time → footage time, piecewise: each segment [filmT, footT, rate=1] starts
 * playing the footage from footT at filmT, at `rate`× speed, until the next
 * segment. A rate of 0 holds a frame (a freeze for a callout). Speeding through
 * typing or the loading orbit keeps a film tight without lying about the app.
 */
export function remap(segments) {
  const s = segments.map(([ft, ct, r = 1]) => ({ ft, ct, r })).sort((a, b) => a.ft - b.ft);
  return (t) => {
    let k = s[0];
    for (const x of s) if (t >= x.ft) k = x;
    return Math.max(0, k.ct + (t - k.ft) * k.r);
  };
}

/** The recording's frame size; a device screen keeps this aspect. */
export const SRC = { w: 590, h: 1280 };

/**
 * The phone, holding the real app. Skins:
 *   'glass' — a real phone, dark aluminium and glass, soft shadow (studio/editorial, pop)
 *   'ink'   — a cartoon phone: flat body, thick ink outline, hard offset shadow (cartoon, comic)
 *   'paper' — a cut-paper phone: torn edge, paper shadow, slight tilt (cutout, print)
 *   'paint' — a hand-painted phone for folk/truck art: a painted frame of colour bands
 * Options: w (screen width, px), body (body colour), ink (outline colour), shadow, frame (array of colours for 'paint').
 * pose(t, { x, y, s, rx, ry, rz, o }) — 3D placement around the stage centre.
 */
export function device(parent, name, { skin = 'glass', w = 520, body = null, ink = '#14102B', shadow = null, frame = null, persp = 2400, crop = null } = {}) {
  const h = Math.round(w * SRC.h / SRC.w);
  const box = el('div', 'layer', { perspective: `${persp}px`, perspectiveOrigin: '50% 45%', pointerEvents: 'none' }, parent);
  const bez = skin === 'ink' ? Math.round(w * 0.05) : skin === 'paint' ? Math.round(w * 0.085) : Math.round(w * 0.03);
  const R = skin === 'ink' ? w * 0.16 : w * 0.13;
  const outer = { left: '50%', top: '50%', width: `${w + bez * 2}px`, height: `${h + bez * 2}px`, marginLeft: `${-(w / 2 + bez)}px`, marginTop: `${-(h / 2 + bez)}px`,
    borderRadius: `${R}px`, padding: `${bez}px`, boxSizing: 'border-box', transformStyle: 'preserve-3d' };
  let bodyStyle;
  if (skin === 'ink') {
    bodyStyle = { background: body || '#FFF6E6', border: `${Math.round(w * 0.016)}px solid ${ink}`, boxShadow: shadow || `${Math.round(w * 0.04)}px ${Math.round(w * 0.04)}px 0 ${ink}` };
  } else if (skin === 'paper') {
    bodyStyle = { background: body || '#F3EBDD', boxShadow: shadow || '0 18px 0 -6px rgba(0,0,0,0.18), 0 30px 60px rgba(0,0,0,0.28)',
      clipPath: 'polygon(1% 2%, 12% 0.6%, 31% 1.8%, 55% 0.3%, 78% 1.6%, 99% 0.4%, 99.6% 22%, 98.7% 47%, 99.8% 71%, 98.9% 99.2%, 72% 99.8%, 44% 98.6%, 19% 99.7%, 0.4% 98.8%, 1.2% 74%, 0.2% 49%, 1.1% 24%)' };
  } else if (skin === 'paint') {
    const c = frame || ['#E8262B', '#FFC20E', '#0B8F4D', '#1B4DB1'];
    bodyStyle = { background: `repeating-linear-gradient(45deg, ${c[0]} 0 14px, ${c[1]} 14px 28px, ${c[2]} 28px 42px, ${c[3]} 42px 56px)`,
      border: `6px solid ${ink}`, boxShadow: shadow || `0 30px 60px rgba(0,0,0,0.35)` };
  } else {
    bodyStyle = { background: body || 'linear-gradient(150deg, #2a2b31, #0b0b0e 40%, #16171b)',
      boxShadow: shadow || `0 0 0 2px rgba(255,255,255,0.10), 0 ${w * 0.12}px ${w * 0.3}px rgba(0,0,0,0.55)` };
  }
  const bodyEl = el('div', 'abs', { ...outer, ...bodyStyle }, box);
  const scr = el('div', '', { position: 'relative', width: `${w}px`, height: `${h}px`, borderRadius: `${R * 0.82}px`, overflow: 'hidden', background: '#000',
    border: skin === 'ink' ? `${Math.round(w * 0.01)}px solid ${ink}` : 'none', boxSizing: 'border-box' }, bodyEl);
  const f = footage(scr, name, { w, h, crop: crop || [0, 0, SRC.w, SRC.h], style: { left: 0, top: 0 } });
  const glare = skin === 'glass' ? el('div', 'layer', { background: 'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.07) 48%, rgba(255,255,255,0.02) 53%, transparent 60%)', backgroundSize: '300% 300%' }, scr) : null;
  return {
    el: box, body: bodyEl, screen: scr, w, h,
    at: f.at,
    pose(t, { x = 0, y = 0, s = 1, rx = 0, ry = 0, rz = 0, o = 1 } = {}) {
      box.style.opacity = o;
      bodyEl.style.transform = `translate3d(${x}px, ${y}px, 0) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s})`;
      if (glare) glare.style.backgroundPosition = `${lerp(100, 0, (t * 0.12) % 1)}% 0`;
    },
  };
}

/**
 * The honesty line every film carries: the screens are the real app; the reply
 * is an example (the app writes its own each time). Small, legible, never hidden.
 */
export function honest(stage, { text = 'Real app · example reply', color = 'rgba(255,255,255,0.62)', bg = 'rgba(0,0,0,0.35)', bottom = 300, style = {} } = {}) {
  const e = el('div', 'abs', { left: '50%', bottom: `${bottom}px`, transform: 'translateX(-50%)', fontFamily: 'Mono', fontWeight: 500, fontSize: '24px',
    letterSpacing: '0.12em', textTransform: 'uppercase', color, background: bg, padding: '10px 20px', borderRadius: '999px', whiteSpace: 'nowrap', zIndex: 35, ...style }, stage, text);
  return (o) => { e.style.opacity = o; };
}

/** A short pulse, 0 → 1 → 0, around time a (for a tap ring or a hit). */
export const pulse = (t, a, d = 0.5) => { const p = prog(t, a, a + d); return p <= 0 || p >= 1 ? 0 : Math.sin(p * Math.PI); };

/** A tap: a ring that grows and fades at (x, y) on the stage, at time a. */
export function tapRing(parent, { color = '#fff', size = 120 } = {}) {
  const r = el('div', 'abs', { width: `${size}px`, height: `${size}px`, marginLeft: `${-size / 2}px`, marginTop: `${-size / 2}px`, borderRadius: '50%',
    border: `6px solid ${color}`, opacity: 0, zIndex: 36 }, parent);
  return (t, a, x, y) => {
    const p = prog(t, a, a + 0.55);
    r.style.left = `${x}px`; r.style.top = `${y}px`;
    set(r, { o: p > 0 && p < 1 ? (1 - p) : 0, s: lerp(0.4, 1.4, ease.outCubic(p)) });
  };
}

export { clamp, lerp, prog, ease };
