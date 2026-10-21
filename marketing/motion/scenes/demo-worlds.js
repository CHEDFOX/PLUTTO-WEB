/**
 * Demo, Six worlds (demo series): what Plutto does, one idea per chapter, each in one of the asked series' styles
 * (cartoon, editorial, pop, truck art, riso, comic), with the real app in a device dressed for each world.
 */
import { el, prog, ease, lerp, rng } from '../lib.js';
import { device, honest } from '../asked.js';

const DUR = 51, BEAT = 0.5;
const CH = 5.5, C0 = 0.0;                 // eight chapters: 0 → 44
const END = 44.0;
// The same question, in the reader's language: the neon chapter cycles through these.
const LANGS = [['English', 'will i be rich?'], ['हिन्दी', 'क्या मैं अमीर बनूँगा?'], ['Español', '¿seré rico?'], ['中文', '我会有钱吗？'], ['Français', 'serai-je riche ?'],
  ['العربية', 'هل سأصبح غنيًا؟'], ['日本語', 'お金持ちになれる？'], ['Deutsch', 'werde ich reich?'], ['Português', 'vou ficar rico?'], ['Kiswahili', 'nitakuwa tajiri?'], ['Türkçe', 'zengin olacak mıyım?'], ['Hinglish', 'kya main ameer banunga?']];

// Each world: palette, background, type, the phone's skin, the footage, the words.
const W = [
  { id: 'cartoon', bg: '#FF4545', ink: '#14102B', fg: '#FFF6E6', acc: '#FFC93C', skin: 'ink', body: '#FFC93C',
    font: '400 150px/0.95 Anton', up: true, small: '700 64px/1.05 Hand',
    clip: ['tour-home', 0.0, 0.9], k: 'Chapter 1 · What is it', a: 'A sky', b: 'that talks back.', c: 'Ask it anything. It answers you, not your star sign.' },
  { id: 'editorial', bg: '#F3EEE3', ink: '#1C1A17', fg: '#1C1A17', acc: '#B5522F', skin: 'glass',
    font: '500 132px/0.98 Cormorant', up: false, small: 'italic 500 56px/1.15 Cormorant',
    clip: ['feat-library', 11.4, 1.3], k: 'Chapter 2 · Where it comes from', a: 'Every culture', b: 'asked the sky.', c: 'Vedic, Yoruba cowries, Norse runes, Hafez, the Maya count: every tradition, one shelf.' },
  { id: 'pop', bg: '#3355FF', ink: '#14102B', fg: '#FFFFFF', acc: '#FFE03D', skin: 'ink', body: '#FFFFFF',
    font: '400 160px/0.92 Anton', up: true, small: '800 52px/1.1 Inter',
    clip: ['ask-quickfire', 0.9, 1.6], k: 'Chapter 3 · How you use it', a: 'Type it.', b: 'Ask it.', c: 'The question you’d never ask a friend.', chat: true },
  { id: 'neon', bg: '#0A0518', ink: '#0A0518', fg: '#FF4FD8', acc: '#3CF2FF', skin: 'glass',
    font: '400 150px/0.95 Anton', up: true, small: '700 58px/1.15 Inter, Deva, CJK, JP, Arabic',
    clip: ['ask-quickfire', 0.4, 0], k: 'Chapter 4 · Any language', a: 'Ask in', b: 'any language.', c: '', langs: true },
  { id: 'truck', bg: '#1E1650', ink: '#0B0820', fg: '#FFC20E', acc: '#E8262B', skin: 'paint',
    font: '400 150px/0.95 Anton', up: true, small: '700 64px/1.05 Hand',
    clip: ['ask-shaadi', 4.0, 1.25], k: 'Chapter 5 · Your language', a: 'Hinglish?', b: 'Bilkul.', c: 'It answers in the language you asked in.', chat: true },
  { id: 'riso', bg: '#F4EBDD', ink: '#2B3BBF', fg: '#FFF6E6', acc: '#FF4F9A', skin: 'paper',
    font: '400 150px/0.95 Anton', up: true, small: '700 60px/1.05 Hand',
    clip: ['ask-quit', 9.6, 1.3], k: 'Chapter 6 · What it opens', a: 'Answers', b: 'open tools.', c: 'Ask about the job, and sixteen shells get thrown.', chat: true },
  { id: 'bauhaus', bg: '#EFE9DD', ink: '#111111', fg: '#111111', acc: '#D7261E', skin: 'glass',
    font: '900 140px/0.95 Inter', up: false, small: '700 50px/1.15 Inter',
    clip: ['tour-explore', 2.0, 5], k: 'Chapter 7 · Everything else', a: 'Explore', b: 'it all.', c: 'Past lives, places, the planets, the library: one tap each.' },
  { id: 'comic', bg: '#FFF3D6', ink: '#111111', fg: '#FFFFFF', acc: '#00B4F0', skin: 'ink', body: '#FFE03D',
    font: '400 150px/0.95 Anton', up: true, small: '700 60px/1.05 Hand',
    clip: ['ask-fake', 13.6, 1.15], k: 'Chapter 8 · Why trust it', a: 'It keeps', b: 'score.', c: 'Every prediction, marked right or wrong. Out loud.', chat: true },
];
const NS = 'http://www.w3.org/2000/svg';
let S = {};

/** Each world's backdrop, drawn once. */
function backdrop(stage, w) {
  const b = el('div', 'layer', { background: w.bg, opacity: 0 }, stage);
  if (w.id === 'cartoon') el('div', 'layer', { background: `repeating-conic-gradient(from 0deg at 50% 62%, rgba(255,255,255,0.10) 0 6deg, transparent 6deg 15deg)` }, b);
  if (w.id === 'editorial') {
    el('div', 'abs', { left: '96px', right: '96px', top: '96px', height: '1px', background: w.ink, opacity: 0.6 }, b);
    el('div', 'abs', { left: '96px', right: '96px', bottom: '96px', height: '1px', background: w.ink, opacity: 0.6 }, b);
    const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 1080 1920'); Object.assign(s.style, { position: 'absolute', inset: 0, width: '100%', height: '100%' });
    s.innerHTML = `<circle cx="880" cy="1460" r="120" fill="none" stroke="${w.ink}" stroke-width="3"/><path d="M 600 1640 Q 740 1600 880 1640 T 1160 1640" fill="none" stroke="${w.ink}" stroke-width="3"/><circle cx="880" cy="1460" r="10" fill="${w.acc}"/>`;
    b.appendChild(s); b.querySelector('svg').classList.add('draw');
  }
  if (w.id === 'pop') {
    el('div', 'layer', { background: `repeating-conic-gradient(from 0deg at 50% 60%, rgba(255,255,255,0.13) 0 9deg, transparent 9deg 18deg)` }, b);
    el('div', 'layer', { backgroundImage: 'radial-gradient(rgba(20,16,43,0.25) 2.5px, transparent 3px)', backgroundSize: '22px 22px', maskImage: 'linear-gradient(transparent 55%, #000)' }, b);
  }
  if (w.id === 'truck') {
    const band = (top) => el('div', 'abs', { left: 0, right: 0, top, height: '46px', background: 'repeating-linear-gradient(45deg, #E8262B 0 18px, #FFC20E 18px 36px, #0B8F4D 36px 54px, #1B4DB1 54px 72px)', borderTop: '5px solid #0B0820', borderBottom: '5px solid #0B0820' }, b);
    band('0px'); band('1874px');
    el('div', 'layer', { backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,194,14,0.18) 0 7px, transparent 8px)', backgroundSize: '90px 90px' }, b);
    const garland = el('div', 'abs', { left: 0, right: 0, top: '46px', height: '60px', display: 'flex', justifyContent: 'space-around' }, b);
    for (let i = 0; i < 12; i++) el('div', '', { width: '26px', height: '40px', borderRadius: '0 0 50% 50%', background: i % 2 ? '#FF7A00' : '#FFC20E', border: '3px solid #0B0820' }, garland);
  }
  if (w.id === 'neon') {
    el('div', 'abs', { left: '-400px', right: '-400px', top: '1150px', height: '900px', transform: 'perspective(500px) rotateX(62deg)', transformOrigin: '50% 0',
      backgroundImage: 'linear-gradient(rgba(60,242,255,0.55) 2px, transparent 2px), linear-gradient(90deg, rgba(255,79,216,0.55) 2px, transparent 2px)', backgroundSize: '90px 90px' }, b);
    el('div', 'abs', { left: '240px', top: '760px', width: '600px', height: '600px', borderRadius: '50%', background: 'linear-gradient(#FFB74F, #FF4FD8 60%, transparent 61%)', opacity: 0.35, filter: 'blur(2px)' }, b);
  }
  if (w.id === 'bauhaus') {
    el('div', 'abs', { left: '-140px', top: '1180px', width: '620px', height: '620px', borderRadius: '50%', background: '#D7261E' }, b);
    el('div', 'abs', { right: '-60px', top: '980px', width: '420px', height: '420px', background: '#1F3FA8', transform: 'rotate(12deg)' }, b);
    el('div', 'abs', { right: '120px', top: '1560px', width: 0, height: 0, borderLeft: '200px solid transparent', borderRight: '200px solid transparent', borderBottom: '340px solid #F2B705' }, b);
    el('div', 'abs', { left: '90px', top: '560px', width: '900px', height: '16px', background: '#111' }, b);
  }
  if (w.id === 'riso') {
    el('div', 'abs', { left: '-80px', top: '1180px', width: '760px', height: '760px', borderRadius: '50%', background: '#FF4F9A', mixBlendMode: 'multiply', opacity: 0.85 }, b);
    el('div', 'abs', { left: '520px', top: '1320px', width: '620px', height: '620px', borderRadius: '50%', background: '#2B3BBF', mixBlendMode: 'multiply', opacity: 0.55 }, b);
    el('div', 'layer', { backgroundImage: 'radial-gradient(rgba(43,59,191,0.18) 1.2px, transparent 1.6px)', backgroundSize: '7px 7px' }, b);
  }
  if (w.id === 'comic') {
    el('div', 'layer', { backgroundImage: 'radial-gradient(rgba(0,180,240,0.35) 3px, transparent 3.5px)', backgroundSize: '26px 26px' }, b);
    el('div', 'abs', { left: '40px', right: '40px', top: '40px', bottom: '40px', border: '10px solid #111' }, b);
    el('div', 'abs', { left: '40px', right: '40px', top: '520px', height: '10px', background: '#111' }, b);
  }
  return b;
}

/** Each world's type: the kicker, two big lines, the teaching line. */
function words(stage, w) {
  const box = el('div', 'layer', { zIndex: 30, opacity: 0 }, stage);
  const big = (txt, top, color, extra = {}) => el('div', 'abs', { left: '60px', right: '60px', top: `${top}px`, textAlign: 'center', font: w.font, color, textTransform: w.up ? 'uppercase' : 'none',
    letterSpacing: w.up ? '0.01em' : '-0.02em', whiteSpace: 'nowrap', transformOrigin: '50% 90%', ...extra }, box, txt);
  const outline = w.id === 'neon' ? { textShadow: `0 0 18px ${w.fg}, 0 0 48px ${w.fg}` } : w.id === 'bauhaus' ? {} : w.id === 'editorial' ? {} : { WebkitTextStroke: `14px ${w.ink}`, paintOrder: 'stroke fill', textShadow: `14px 14px 0 ${w.ink}` };
  const k = el('div', 'abs center', { top: w.id === 'comic' ? '76px' : '120px', font: '500 26px/1 Mono', letterSpacing: '0.2em', textTransform: 'uppercase', color: w.id === 'truck' ? '#FFC20E' : w.id === 'neon' ? '#3CF2FF' : w.ink, opacity: 0.85 }, box, w.k);
  const a = big(w.a, 170, w.fg, outline);
  const b = big(w.b, 330, w.acc, w.id === 'editorial' ? { fontStyle: 'italic', color: w.acc } : w.id === 'neon' ? { textShadow: `0 0 18px ${w.acc}, 0 0 48px ${w.acc}` } : outline);
  const cbox = w.id === 'editorial'
    ? el('div', 'abs', { left: '120px', right: '120px', top: '1700px', textAlign: 'center', font: w.small, color: w.ink, background: w.bg, padding: '10px 0' }, box, w.c)
    : el('div', 'abs', { left: '100px', right: '100px', top: '1640px', textAlign: 'center', font: w.small, color: w.ink, background: w.id === 'truck' ? '#FFC20E' : w.id === 'pop' ? '#FFE03D' : w.id === 'neon' ? '#0A0518' : '#FFFFFF', color: w.id === 'neon' ? '#FFFFFF' : w.ink,
      border: w.id === 'neon' ? '4px solid #3CF2FF' : `6px solid ${w.ink}`, borderRadius: w.id === 'comic' || w.id === 'bauhaus' ? '0' : '28px', padding: '16px 28px', boxShadow: w.id === 'neon' ? '0 0 30px #3CF2FF, inset 0 0 20px rgba(60,242,255,0.4)' : `10px 10px 0 ${w.ink}` }, box, w.c);
  const lang = w.langs ? el('div', 'abs center', { top: '1580px', font: '500 28px/1 Mono', letterSpacing: '0.2em', color: '#FF4FD8', textShadow: '0 0 12px #FF4FD8' }, box, '') : null;
  return { box, k, a, b, c: cbox, lang };
}

const pop = (p) => (p <= 0 ? 0 : p >= 1 ? 1 : 1 - Math.pow(2, -9 * p) * Math.cos(p * Math.PI * 2.8));

export default {
  duration: DUR,
  poster: 14.5,

  score() {
    const c = [{ i: 'tempo', bpm: 120 }, { i: 'room', t: 0, end: DUR, g: 0.03 }];
    const CHD = [[57, 60, 64], [53, 57, 60], [55, 60, 64], [55, 59, 62]], ROOT = [33, 29, 36, 31];
    const chd = (t) => Math.floor(t / 2) % 4;
    c.push({ i: 'pump', t: 0, end: END, depth: 0.5 });
    // Each world gets its own groove: mallets (cartoon), felt plucks (editorial), saws (pop),
    // dhol-like toms (truck), chops (riso), stabs and claps (comic). Same key, same tempo.
    for (let t = 0, k = 0; t < END - 0.01; t += BEAT, k++) {
      const wi = Math.floor(t / CH), w = W[wi].id;
      c.push({ i: 'kick', t, g: w === 'editorial' ? 0.3 : 0.6 }, { i: 'subb', t: t + BEAT / 2, n: ROOT[chd(t)], dur: BEAT * 0.42, g: 0.36 });
      if (w !== 'editorial') c.push({ i: 'hat', t: t + BEAT / 2, g: 0.1, open: true });
      if (k % 2) c.push({ i: w === 'truck' ? 'conga' : 'clap', t, g: 0.3, f: 180, slap: true });
      const n = CHD[chd(t)][k % 3] + 12;
      if (w === 'cartoon') c.push({ i: 'mallet', t: t + BEAT / 2, n: n + 12, g: 0.16, d: 0.35 });
      if (w === 'editorial') c.push({ i: 'pluck', t, n, g: 0.14, dur: 1.6 });
      if (w === 'pop') c.push({ i: 'saw', t, ns: CHD[chd(t)].map((x) => x + 12), dur: 0.12, cut: 2600, env: 2.6, g: 0.28, echo: 0.1 });
      if (w === 'truck') c.push({ i: 'tom', t: t + BEAT * 0.75, f: 110, g: 0.3, d: 0.4 }, { i: 'conga', t: t + BEAT / 4, f: 260, g: 0.2 });
      if (w === 'riso') c.push({ i: 'chop', t: t + BEAT / 2, n: n + 12, dur: 0.18, g: 0.16, vowel: k % 2 ? 'a' : 'o', echo: 0.3 });
      if (w === 'neon') c.push({ i: 'synth', t: t + BEAT / 2, n: n + 12, dur: 0.14, g: 0.2, echo: 0.3 }, { i: 'blip', t: t, n: 88 + (k % 4) * 2, g: 0.08 });
      if (w === 'bauhaus') c.push({ i: 'rim', t: t + BEAT / 2, g: 0.2 }, { i: 'mallet', t: t + BEAT / 4, n: n, g: 0.14, d: 0.3 });
      if (w === 'comic') c.push({ i: 'saw', t: t + BEAT / 2, ns: CHD[chd(t)].map((x) => x + 12), dur: 0.09, cut: 3000, env: 3, g: 0.24 });
    }
    W.forEach((_, i) => { const t = C0 + i * CH; if (i) c.push({ i: 'whoosh', t: t - 0.2, dur: 0.28, g: 0.3 }); c.push({ i: 'whoosh', t: Math.max(0, t), dur: 0.28, g: 0.3 }, { i: 'hit', t, g: 0.4 }, { i: 'crash', t, g: 0.22 }); });
    c.push({ i: 'riser', t: END - 1.4, end: END, g: 0.3 }, { i: 'boom', t: END, g: 0.8 }, { i: 'sting', t: END + 0.05, g: 0.8 });
    c.push({ i: 'saw', t: END, ns: [57, 60, 64, 69], dur: 2.4, a: 0.02, rel: 1.4, cut: 1500, env: 1.6, g: 0.34, verb: 0.6 }, { i: 'pad', t: END, end: DUR, ns: [57, 64, 69], g: 0.07, bright: 1300 });
    return c;
  },

  async setup(stage) {
    await Promise.all(['400 150px Anton', '700 64px Hand', '500 132px Cormorant', 'italic 500 56px Cormorant', '500 26px Mono', '800 52px Inter'].map((f) => document.fonts.load(f)));
    S.bgs = W.map((w) => backdrop(stage, w));
    S.dev = W.map((w) => {
      const d = device(stage, w.clip[0], { skin: w.skin, w: 520, ink: w.ink, body: w.body || null });
      if (w.id === 'neon') {
        d.body.style.boxShadow = '0 0 0 3px #FF4FD8, 0 0 40px #FF4FD8, 0 0 90px rgba(60,242,255,0.5)';
        // the user's bubble, retyped in each language, over the recording's own bubble
        d.bubble = el('div', 'abs', { right: '14px', top: '22px', maxWidth: '330px', padding: '9px 14px', borderRadius: '16px', background: '#26262b', color: '#fff',
          font: '500 22px/1.3 Inter, Deva, CJK, JP, Arabic', zIndex: 3, boxShadow: '0 0 0 6px #000' }, d.screen);
      }
      return d;
    });
    S.words = W.map((w) => words(stage, w));
    S.honest = honest(stage, { text: 'Real app · example reply', style: { top: '1560px', bottom: 'auto', fontSize: '22px' } });
    S.hon = stage.lastElementChild;
    S.wipe = el('div', 'layer', { zIndex: 40, pointerEvents: 'none' }, stage);
    // End card: all six colours as stripes, then the word.
    S.end = el('div', 'layer', { zIndex: 50, opacity: 0, background: '#14102B' }, stage);
    S.stripes = W.map((w, i) => el('div', 'abs', { left: 0, right: 0, top: `${i * 320}px`, height: '320px', background: w.bg, transformOrigin: i % 2 ? '100% 50%' : '0% 50%' }, S.end));
    S.endBox = el('div', 'layer', { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '40px' }, S.end);
    S.endWord = el('div', '', { font: '400 260px/1 Anton', color: '#FFF6E6', WebkitTextStroke: '18px #14102B', paintOrder: 'stroke fill', textShadow: '18px 18px 0 #14102B', letterSpacing: '0.01em' }, S.endBox, 'PLUTTO');
    S.endLine = el('div', '', { font: '700 76px/1.05 Hand', color: '#14102B', background: '#FFE03D', border: '6px solid #14102B', borderRadius: '28px', padding: '14px 36px', boxShadow: '10px 10px 0 #14102B', textAlign: 'center' }, S.endBox, 'Every way humans asked. One app.');
    S.endCta = el('div', '', { font: '400 92px/1 Anton', color: '#14102B', background: '#FFF6E6', border: '8px solid #14102B', borderRadius: '999px', padding: '18px 60px 22px', boxShadow: '12px 12px 0 #14102B' }, S.endBox, 'plutto.space');
    S.endSub = el('div', '', { font: '500 30px/1 Mono', letterSpacing: '0.14em', color: '#FFF6E6', background: '#14102B', padding: '10px 18px', textTransform: 'uppercase' }, S.endBox, 'Free to start · Android · Web');
  },

  async frame(t) {
    const wi = Math.min(W.length - 1, Math.max(0, Math.floor((t - C0) / CH)));
    const u = t - C0 - wi * CH;
    const live = t < END;

    S.bgs.forEach((b, i) => { b.style.opacity = live && i === wi ? 1 : 0; });
    // Editorial: the drawing draws itself.
    if (W[wi].id === 'editorial') S.bgs[wi].querySelectorAll('svg *').forEach((p, j) => { const L = p.getTotalLength ? p.getTotalLength() : 0; if (L) { p.style.strokeDasharray = L; p.style.strokeDashoffset = L * (1 - ease.outCubic(prog(u, 0.3 + j * 0.2, 1.6 + j * 0.2))); } });
    if (W[wi].id === 'cartoon' || W[wi].id === 'pop') S.bgs[wi].firstChild.style.transform = `rotate(${t * 8}deg) scale(2)`;

    // The phone for this world.
    for (let i = 0; i < W.length; i++) {
      const d = S.dev[i];
      if (!(live && i === wi)) { d.pose(t, { o: 0 }); continue; }
      const [, from, rate] = W[i].clip;
      await d.at(from + u * rate);
      const k = pop(prog(u, 0, 0.6)), out = ease.inCubic(prog(u, CH - 0.18, CH));
      const tilt = [-4, 0, 3, 0, -3, 2, 0, -2][i];
      const neon = W[i].langs;
      const zoom = neon ? lerp(0.86, 1.55, ease.inOutCubic(prog(u, 0.5, 1.1))) : W[i].chat ? lerp(0.86, 1.05, ease.inOutCubic(prog(u, 2.2, 3.2))) : 0.86;
      const fy = neon ? lerp(260, 880, ease.inOutCubic(prog(u, 0.5, 1.1))) : W[i].chat ? lerp(260, 420, ease.inOutCubic(prog(u, 2.2, 3.2))) : 260;
      d.pose(t, { x: (1 - k) * (i % 2 ? -900 : 900) - out * (i % 2 ? 900 : -900), y: fy + Math.sin(t * 2.2) * 6, s: zoom * lerp(0.7, 1, k), rz: tilt + (1 - k) * 12 });
      d.body.style.filter = 'none';
    }

    // The words for this world.
    S.words.forEach((w, i) => {
      if (!(live && i === wi)) { w.box.style.opacity = 0; return; }
      w.box.style.opacity = 1;
      const out = ease.inCubic(prog(u, CH - 0.2, CH));
      const sq = (p, amt = 0.35) => { if (p <= 0) return [0, 0]; if (p >= 1) return [1, 1]; const s = pop(p), q = Math.sin(p * Math.PI * 3) * Math.pow(1 - p, 2) * amt; return [s * (1 - q), s * (1 + q)]; };
      const editorial = W[i].id === 'editorial';
      [[w.a, 0.15], [w.b, 0.45]].forEach(([e, a]) => {
        if (editorial) { const p = ease.outCubic(prog(u, a, a + 0.8)); e.style.opacity = p * (1 - out); e.style.filter = `blur(${(1 - p) * 10}px)`; e.style.transform = `translateY(${(1 - p) * 30}px)`; return; }
        const [sx, sy] = sq(prog(u, a, a + 0.45));
        e.style.opacity = u >= a ? 1 - out : 0; e.style.transform = `scale(${sx}, ${sy}) rotate(${i % 2 ? 2 : -2}deg)`;
      });
      w.k.style.opacity = 0.85 * (1 - out);
      const cp = editorial ? ease.outCubic(prog(u, 1.4, 2.2)) : pop(prog(u, 1.3, 1.8));
      w.c.style.opacity = u >= 1.3 ? (editorial ? cp : 1) * (1 - out) : 0;
      w.c.style.transform = editorial ? `translateY(${(1 - cp) * 20}px)` : `scale(${cp}) rotate(${i % 2 ? -1.5 : 1.5}deg)`;
    });
    if (live && W[wi].langs) {
      const li = Math.max(0, Math.floor((u - 0.9) / 0.38)) % LANGS.length;
      const [ln, q] = LANGS[li];
      const w = S.words[wi];
      if (w.c.textContent !== q) { w.c.textContent = q; w.lang.textContent = ln; S.dev[wi].bubble.textContent = q; }
      const pk = (u - 0.9) % 0.38;
      w.c.style.direction = S.dev[wi].bubble.style.direction = ln === 'العربية' ? 'rtl' : 'ltr';
      w.lang.style.opacity = u > 0.9 ? 1 : 0;
      S.dev[wi].bubble.style.transform = `scale(${u > 0.9 ? 1 + 0.08 * Math.max(0, 1 - pk / 0.12) : 1})`;
    }
    const chat = live && (W[wi].chat || W[wi].langs) && u > 1.0;
    S.honest(chat ? 1 : 0);
    S.hon.style.color = W[wi].ink; S.hon.style.background = W[wi].id === 'truck' ? '#FFC20E' : '#FFFFFF'; S.hon.style.border = `3px solid ${W[wi].ink}`;

    // The wipe between worlds: the next world's colour sweeps across.
    const nb = C0 + (wi + 1) * CH;
    const wp = prog(t, nb - 0.22, nb + 0.12);
    if (wp > 0 && wp < 1 && wi + 1 <= W.length) {
      const col = wi + 1 < W.length ? W[wi + 1].bg : '#14102B';
      const x = lerp(-120, 120, ease.inOutCubic(wp));
      S.wipe.style.background = `linear-gradient(105deg, transparent ${x - 20}%, ${col} ${x - 18}%, ${col} ${x + 18}%, transparent ${x + 20}%)`;
    } else S.wipe.style.background = 'none';

    // The end.
    const te = t - END;
    S.end.style.opacity = te >= 0 ? 1 : 0;
    if (te >= 0) {
      S.stripes.forEach((s, i) => { s.style.transform = `scaleX(${1 - ease.inOutCubic(prog(te, 0.15 + i * 0.05, 0.75 + i * 0.05))})`; });
      [[S.endWord, 0.6], [S.endLine, 0.95], [S.endCta, 1.25], [S.endSub, 1.5]].forEach(([e, a]) => { const p = pop(prog(te, a, a + 0.5)); e.style.opacity = te >= a ? 1 : 0; e.style.transform = `scale(${p}) rotate(${e === S.endLine ? -2 : 0}deg)`; });
    }
  },
};
