/**
 * ORB · THE SHEET — a plain white sheet of paper; Plutto's own voice orb (the
 * real recording, keyed off its black) sits near the bottom, breathing. What it
 * says arrives as small, funky type on the sheet, a word at a time, and stays —
 * older lines soften to grey as new ones land, so the sheet fills like a note.
 * Each word is a blip of the orb's voice (sound.js `blip`) and a pulse of the
 * orb; each line sends a ring across the paper. The brand lands last, in ink.
 */
import { el, set, words, rise, prog, ease, lerp, rng, W, H, FRAMES } from '../lib.js';
import { b, title, show } from '../cine.js';

const C = { magenta: '#FF3FA0', violet: '#7C3AED', cyan: '#12BFE8', ink: '#101018', paper: '#FBFAF7' };
// The voice-over, as the sheet receives it. `font`: i = Cormorant italic, s = Cormorant, b = Inter black.
// `em`: a word set in colour. `blob`: a soft colour behind that word.
const SAY = [
  { t: 0.9, text: 'hey.', font: 'b', size: 76, color: C.magenta, rot: -2 },
  { t: 2.3, text: 'you took the long way home again.', font: 'i', size: 66, color: C.ink },
  { t: 5.4, text: 'radio off. still thinking about it.', font: 's', size: 62, color: C.violet, rot: 1 },
  { t: 8.6, text: 'say it out loud.', font: 'b', size: 78, color: C.ink, em: [3], emColor: C.cyan, blob: 3 },
  { t: 11.3, text: 'i’m listening.', font: 'i', size: 82, color: C.magenta, rot: -1.5 },
];
const STAG = 0.13;
const BRAND = 14.4, END = 18;
const PITCH = [74, 77, 81, 79, 76, 84, 81, 77];   // the orb's tune, one note per word
let S = {};

/** The real orb, keyed: the recording's black becomes transparent, so it can sit on paper. */
function orb(parent, { size = 470, crop = [120, 465, 350, 350] } = {}) {
  const c = el('canvas', 'abs', { left: 0, top: 0, width: `${size}px`, height: `${size}px` }, parent);
  c.width = size; c.height = size;
  const g = c.getContext('2d');
  const src = document.createElement('canvas'); src.width = size; src.height = size;
  const sg = src.getContext('2d'); sg.imageSmoothingQuality = 'high';
  const im = new Image(); let last = -1;
  const count = FRAMES.voice || 301;
  return {
    el: c,
    async at(time) {
      // Ping-pong through the recording so a 10 s clip never jumps.
      const n0 = Math.floor(time * 30), span = count - 1, k = n0 % (span * 2);
      const n = 1 + (k <= span ? k : span * 2 - k);
      if (n === last) return;
      last = n;
      im.src = `frames/voice/${String(n).padStart(4, '0')}.jpg`;
      await im.decode();
      sg.clearRect(0, 0, size, size);
      sg.drawImage(im, crop[0], crop[1], crop[2], crop[3], 0, 0, size, size);
      const d = sg.getImageData(0, 0, size, size), p = d.data;
      for (let i = 0; i < p.length; i += 4) {
        const m = Math.max(p[i], p[i + 1], p[i + 2]);
        const a = Math.min(255, Math.round(m * 1.12));
        if (a < 6) { p[i + 3] = 0; continue; }
        const k = 255 / a;                    // un-premultiply: keep the colour, drop the black
        p[i] = Math.min(255, p[i] * k); p[i + 1] = Math.min(255, p[i + 1] * k); p[i + 2] = Math.min(255, p[i + 2] * k);
        p[i + 3] = a;
      }
      g.putImageData(d, 0, 0);
    },
  };
}

export default {
  duration: 18,
  poster: 12.2,
  score() {
    const c = [
      { i: 'pad', t: 0, end: BRAND, ns: [57, 64, 69, 71], g: 0.05, bright: 900, verb: 0.6 },
      { i: 'whoosh', t: 0.05, dur: 0.6, g: 0.18, from: 0, to: 0 },
      { i: 'bell', t: 0.35, n: 88, g: 0.06, dur: 2.5 },
      { i: 'reverse', end: BRAND, dur: 0.8, g: 0.22 },
      { i: 'hit', t: BRAND, g: 0.35 },
      { i: 'sting', t: BRAND + 0.05, g: 0.8 },
      { i: 'pad', t: BRAND, end: END, ns: [57, 64, 69], g: 0.04 },
    ];
    // A light, dry beat under the voice: soft kick on 1 and 3, a brushed snare on 2 and 4, hats.
    for (let k = 2; k < 24; k++) {
      const t = b(k);
      if (k % 2 === 0) c.push({ i: 'kick', t, g: 0.32 });
      else c.push({ i: 'snare', t, g: 0.16, verb: 0.35 });
      c.push({ i: 'hat', t, g: 0.09, p: -0.3 }, { i: 'hat', t: t + 0.3, g: 0.06, p: 0.3 });
    }
    // The orb speaks: a blip per word, tuned; the last word of a line dips.
    SAY.forEach((line, li) => {
      const ws = line.text.split(' ');
      ws.forEach((w, i) => {
        const lastW = i === ws.length - 1;
        c.push({ i: 'blip', t: line.t + i * STAG, n: PITCH[(li * 3 + i) % PITCH.length] - (lastW ? 5 : 0), g: 0.26, dur: lastW ? 0.16 : 0.1, slide: lastW ? -2 : 3 });
      });
      c.push({ i: 'bell', t: line.t, n: 93 + li * 2, g: 0.035, dur: 1.6 });
    });
    return c;
  },
  async setup(stage) {
    stage.style.background = C.paper;
    // A whisper of paper: soft fibre grain, plus three watercolour bleeds that drift.
    const R = rng(12);
    S.bleeds = [[C.magenta, 90, 250], [C.cyan, 1010, 1820], [C.violet, 1010, 200]].map(([col, x, y], i) => {
      const e = el('div', 'abs', { left: `${x - 210}px`, top: `${y - 210}px`, width: '420px', height: '420px', borderRadius: '50%', opacity: 0,
        background: `radial-gradient(closest-side, ${col}, transparent 72%)`, filter: 'blur(40px)' }, stage);
      return { e, ph: R() * 6.28, x, y };
    });
    // Sound rings, drawn on paper.
    const cv = el('canvas', 'layer', {}, stage); cv.width = W; cv.height = H; S.g = cv.getContext('2d');
    // The transcript: lines land in a column and stay.
    S.col = el('div', 'abs', { left: '110px', top: '360px', width: '860px' }, stage);
    S.lines = SAY.map((l) => {
      const style = { fontSize: `${l.size}px`, lineHeight: 1.12, color: l.color, marginBottom: '26px', transformOrigin: '0 50%', opacity: 0,
        ...(l.font === 'b' ? { fontFamily: 'Inter', fontWeight: 900, letterSpacing: '-0.03em' }
          : { fontFamily: 'Cormorant', fontWeight: l.font === 'i' ? 500 : 600, fontStyle: l.font === 'i' ? 'italic' : 'normal', letterSpacing: '-0.005em' }) };
      const k = words(S.col, l.text, '', style);
      (l.em || []).forEach((i) => {
        const sp = k.spans[i];
        sp.style.color = l.emColor || C.cyan;
        if (l.blob != null) {
          sp.style.position = 'relative'; sp.style.zIndex = 1;
          const bl = el('span', '', { position: 'absolute', left: '-10%', right: '-10%', top: '18%', bottom: '4%', borderRadius: '40% 60% 55% 45%', background: `${l.emColor || C.cyan}33`, zIndex: -1, transform: 'rotate(-2deg) scaleX(0)', transformOrigin: '0 50%' }, sp);
          k.blob = bl;
        }
      });
      return { ...k, cfg: l };
    });
    // The orb, near the bottom, on its shadow.
    S.shadow = el('div', 'abs', { left: '250px', top: '1690px', width: '580px', height: '120px', borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(60,40,90,0.28), transparent)', filter: 'blur(14px)' }, stage);
    S.orbBox = el('div', 'abs', { left: `${540 - 235}px`, top: `${1480 - 235}px`, width: '470px', height: '470px' }, stage);
    S.orb = orb(S.orbBox);
    S.cap = el('div', 'abs', { left: 0, right: 0, top: '1770px', textAlign: 'center', fontFamily: 'Inter', fontWeight: 500, fontSize: '22px', letterSpacing: '0.42em', textTransform: 'uppercase', color: 'rgba(16,16,24,0.42)', opacity: 0 }, stage, 'listening');
    // The brand, in ink.
    S.brand = el('div', 'abs', { left: 0, right: 0, top: '760px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '26px', opacity: 0 }, stage);
    S.ring = el('div', '', { width: '112px', height: '112px', borderRadius: '50%', background: `linear-gradient(135deg, ${C.ink}, rgba(16,16,24,0.45))`, position: 'relative' }, S.brand);
    el('div', '', { position: 'absolute', inset: '26px', borderRadius: '50%', background: C.paper }, S.ring);
    el('div', '', { fontFamily: 'Inter', fontSize: '124px', fontWeight: 700, letterSpacing: '-0.035em', color: C.ink }, S.brand, 'Plutto');
    S.tag = title(stage, 'Five thousand years old. <em>Talks back.</em>', { kind: 'italic', size: 60, top: 930, color: C.ink, style: { textShadow: 'none', fontStyle: 'normal' } });
    S.tag.querySelector('em').style.color = C.magenta;
    S.cta = title(stage, 'plutto.space', { kind: 'caps', size: 26, top: 1050, color: 'rgba(16,16,24,0.6)', style: { textShadow: 'none', color: 'rgba(16,16,24,0.6)' } });
  },
  async frame(t) {
    // Watercolour bleeds breathe, brighter while the orb speaks.
    const speakingLine = SAY.filter((l) => t >= l.t && t < l.t + l.text.split(' ').length * STAG + 0.5).length ? 1 : 0;
    S.bleeds.forEach((bl, i) => {
      set(bl.e, { o: (0.16 + 0.1 * speakingLine) * ease.outCubic(prog(t, 0.2 + i * 0.3, 1.4 + i * 0.3)) * (t < BRAND ? 1 : 0.5),
        x: Math.sin(t * 0.23 + bl.ph) * 40, y: Math.cos(t * 0.19 + bl.ph) * 30, s: 1 + 0.08 * Math.sin(t * 0.5 + bl.ph) });
    });
    // The orb: rises in from below, breathes, and jumps on every word.
    const inK = ease.outCubic(prog(t, 0, 1.1));
    let hit = 0;
    for (const l of SAY) for (let i = 0; i < l.text.split(' ').length; i++) { const w = l.t + i * STAG; if (t >= w && t < w + 0.3) hit = Math.max(hit, Math.pow(1 - (t - w) / 0.3, 2)); }
    const breathe = 1 + 0.025 * Math.sin(t * 2.4);
    const gone = t >= BRAND ? ease.inOutCubic(prog(t, BRAND, BRAND + 0.8)) : 0;
    const os = breathe * (1 + 0.09 * hit) * lerp(1, 1.5, gone);
    await S.orb.at(t);
    set(S.orbBox, { y: (1 - inK) * 700 + gone * 900, s: os, o: 1 - gone });
    set(S.shadow, { o: inK * (1 - gone), s: os, x: 0 });
    S.shadow.style.transform += ` scaleX(${1 + 0.15 * hit})`;
    set(S.cap, { o: inK * (1 - gone) * (speakingLine ? 0 : 1), y: 0 });
    S.cap.textContent = 'listening';
    // Rings across the paper when a line starts.
    const g = S.g; g.clearRect(0, 0, W, H);
    SAY.forEach((l, li) => {
      const k = (t - l.t) / 1.6;
      if (k < 0 || k > 1) return;
      const col = [C.magenta, C.violet, C.cyan][li % 3];
      for (let r = 0; r < 3; r++) {
        const kk = k - r * 0.12; if (kk < 0) continue;
        g.strokeStyle = col; g.globalAlpha = 0.5 * (1 - kk); g.lineWidth = 3 - r * 0.7;
        g.beginPath(); g.arc(540, 1480, 250 + kk * 900, 0, 6.2832); g.stroke();
      }
    });
    g.globalAlpha = 1;
    // The transcript.
    S.lines.forEach((k, li) => {
      const l = k.cfg, n = k.spans.length, on = t >= l.t - 0.05 && t < BRAND + 0.4;
      const fresh = li === SAY.length - 1 || t < SAY[li + 1].t;
      k.root.style.opacity = on ? ease.outCubic(prog(t, l.t, l.t + 0.25)) * (1 - ease.inCubic(prog(t, BRAND - 0.2, BRAND + 0.4))) : 0;
      if (!on) return;
      rise(k.spans, t - l.t, { stagger: STAG, dur: 0.6, dist: 1.05 });
      // Older lines soften to grey; the live one is in its colour.
      const soft = fresh ? 0 : ease.outCubic(prog(t, SAY[li + 1].t, SAY[li + 1].t + 0.6));
      k.root.style.color = fresh || soft < 1 ? l.color : l.color;
      k.root.style.filter = `grayscale(${soft}) opacity(${1 - 0.5 * soft})`;
      k.root.style.transform = `rotate(${l.rot || 0}deg) translateY(${(1 - ease.outExpo(prog(t, l.t, l.t + 0.5))) * 12}px)`;
      if (k.blob) k.blob.style.transform = `rotate(-2deg) scaleX(${ease.outBack(prog(t, l.t + (l.blob || 0) * STAG + 0.05, l.t + (l.blob || 0) * STAG + 0.45))})`;
      void n;
    });
    // The brand, in ink, once the orb has left.
    const bk = ease.outCubic(prog(t, BRAND + 0.2, BRAND + 1));
    set(S.brand, { o: bk, s: lerp(1.05, 1, ease.outExpo(prog(t, BRAND + 0.2, BRAND + 1.6))), y: (1 - bk) * 30, blur: (1 - bk) * 10 });
    set(S.ring, { r: t * 18 });
    show(S.tag, t, BRAND + 0.9, 99, { d: 0.9 });
    show(S.cta, t, BRAND + 1.4, 99, { mode: 'fade', d: 0.7 });
  },
};
