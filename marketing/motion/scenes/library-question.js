/** THE LIBRARY 03 · ONE QUESTION — the same question put to six traditions, hung like museum plates. */
import { LIB, night, lines, caps, libEnd, libScore, el, set, prog, ease, ASSET } from '../library.js';

const PLATES = [
  ['iching/qian', 'I Ching', 'China · c. 1000 BCE'], ['runes/jera', 'Runes', 'The North · c. 150 CE'], ['ogham/beith', 'Ogham', 'Ireland · c. 400 CE'],
  ['tarot/wheel_of_fortune', 'Tarot', 'Europe · 1400s'], ['geomancy/fortuna_major', 'Geomancy', 'Arab world · c. 900 CE'], ['lenormand/clover', 'Lenormand', 'Germany · 1799'],
];
const P0 = 1.5, STEP = 0.9, ONE = P0 + PLATES.length * STEP + 0.3, ALL = ONE + 2.3, END = 12.2;
const S = {};

export default {
  duration: 14.8,
  poster: ONE - 0.4,
  score() {
    return libScore({ duration: this.duration, end: END, hits: [0.3, ...PLATES.map((_, i) => P0 + i * STEP), ONE, ALL], turns: [ONE - 0.1] });
  },
  async setup(stage) {
    await Promise.all(['italic 500 120px Cormorant', '600 40px Cormorant', '500 26px Mono'].map((f) => document.fonts.load(f)));
    night(stage);
    S.q = el('div', 'layer', {}, stage);
    S.label = caps(S.q, 'The question', { left: 0, right: 0, top: '200px', textAlign: 'center', opacity: 0 });
    S.ql = lines(S.q, ['“Will it work out?”'], { top: 260, size: 124, italic: true });
    S.wall = el('div', 'layer', {}, stage);
    S.plates = PLATES.map(([src, name, where], i) => {
      const col = i % 3, row = Math.floor(i / 3);
      const x = 60 + col * 340, y = 540 + row * 600;
      const box = el('div', 'abs', { left: `${x}px`, top: `${y}px`, width: '280px', opacity: 0 }, S.wall);
      const glow = el('div', 'abs', { left: '-90px', top: '-120px', width: '460px', height: '700px', background: `radial-gradient(50% 50% at 50% 45%, rgba(${LIB.lamp},0.24), transparent 70%)`, opacity: 0 }, box);
      const im = el('img', '', { position: 'relative', display: 'block', width: '280px', height: '492px', objectFit: 'cover', borderRadius: '10px', boxShadow: '0 24px 50px rgba(0,0,0,0.6)' }, box);
      im.src = `${ASSET}/library/${src}.webp`;
      el('div', '', { position: 'relative', marginTop: '22px', textAlign: 'center', font: '600 40px/1 Cormorant', color: LIB.cream }, box, name);
      el('div', '', { position: 'relative', margin: '8px -40px 0', whiteSpace: 'nowrap', textAlign: 'center', font: '500 18px/1.2 Mono', letterSpacing: '0.12em', textTransform: 'uppercase', color: LIB.dim }, box, where);
      return { box, glow, at: P0 + i * STEP };
    });
    S.one = lines(stage, ['One question.', '102 ways to ask it.'], { top: 800, size: 128, gap: 0.55 });
    S.all = caps(stage, 'Plutto reads them all', { left: 0, right: 0, top: '1180px', textAlign: 'center', fontSize: '32px', color: LIB.cream, opacity: 0 });
    S.end = libEnd(stage, { line: 'Ask it every way there is.', sub: 'I Ching · Runes · Ogham · Tarot · and 98 more' });
  },
  async frame(t) {
    const out = ease.inOutCubic(prog(t, ONE - 0.2, ONE + 0.5));
    S.label.style.opacity = ease.outCubic(prog(t, 0.2, 0.7)) * (1 - out);
    S.ql.show(t, 0.3, ONE - 0.3);
    S.plates.forEach(({ box, glow, at }, i) => {
      const p = ease.outCubic(prog(t, at, at + 0.7));
      set(box, { o: p * (1 - out * 0.85), y: (1 - p) * 50 + out * 40, blur: (1 - p) * 12 + out * 6 });
      glow.style.opacity = Math.max(0, 1 - Math.abs(t - at - 0.4) / 0.9) * (1 - out);
    });
    S.one.show(t, ONE, END - 0.4);
    const ap = ease.outCubic(prog(t, ALL, ALL + 0.6));
    set(S.all, { o: t < END ? ap * (1 - prog(t, END - 0.4, END)) : 0, y: (1 - ap) * 20 });
    S.end(t - END);
  },
};
