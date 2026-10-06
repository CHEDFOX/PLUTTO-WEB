/** THE LIBRARY 01 · ONE SHELF — the brand film: every tradition in the atlas as a spine, panning past under a lamp. */
import { LIB, atlas, night, shelves, lines, caps, libEnd, libScore, el, set, prog, ease } from '../library.js';

// The litany: what people have asked, each over the word for it in its own script.
const ASKED = [
  ['the stars', 'ज्योतिष', 'Deva', 230], ['the bones', '卜', 'CJK', 420], ['the runes', 'ᚹᚣᚱᛞ', 'Runic', 300],
  ['the lots', 'גורל', 'Hebrew', 300], ['the omens', '𒉆𒋻', 'Cunei', 300], ['the trees', '᚛ᚑᚌᚐᚋ᚜', 'Ogham', 230],
  ['the oracle', 'γνῶθι', 'InterGreek', 250], ['fate itself', 'قسمة', 'Arabic', 300],
];
const A0 = 3.9, STEP = 0.45, SHELF = A0 + ASKED.length * STEP + 0.25, STATS = SHELF + 2.5, END = 13.6;
const S = {};

export default {
  duration: 16.6,
  poster: 9.3,
  score() {
    return libScore({ duration: this.duration, end: END, hits: [0.4, SHELF, SHELF + 0.4, STATS], flips: ASKED.map((_, i) => A0 + i * STEP), turns: [A0 - 0.1] });
  },
  async setup(stage) {
    await Promise.all(['600 30px Cormorant', 'italic 500 90px Cormorant', '500 26px Mono', ...ASKED.map(([, , f]) => `600 100px ${f}`)].map((f) => document.fonts.load(f)));
    const a = await atlas();
    night(stage);
    const books = a.list.map((t) => ({ name: t.name, color: a.cloth(t) }));
    S.n = a.traditions.length; S.regions = a.regions.length;
    S.shelf = shelves(stage, books, [
      { y: -60, h: 520, speed: 34, seed: 3, offset: 900 },
      { y: 520, h: 520, speed: 46, seed: 5, offset: 2600 },
      { y: 1100, h: 520, speed: 58, seed: 9, offset: 4100 },
      { y: 1560, h: 520, speed: 120, seed: 11, offset: 300, scale: 1.5, blur: 7 },
    ]);
    // a dark band behind the words, so the shelves never fight them
    S.band = el('div', 'layer', { background: 'linear-gradient(transparent 22%, rgba(8,9,14,0.78) 38%, rgba(8,9,14,0.78) 62%, transparent 78%)', opacity: 0 }, stage);
    S.l1 = lines(stage, ['Every way', 'humankind has asked', 'what comes next —'], { top: 690, size: 108, italic: true });
    S.asked = ASKED.map(([w, g, f, size]) => {
      const box = el('div', 'layer', { opacity: 0 }, stage);
      el('div', 'abs center', { top: `${960 - size * 0.6}px`, font: `600 ${size}px/1.2 ${f}`, color: `rgba(${LIB.lamp},0.22)`, whiteSpace: 'nowrap' }, box, g);
      el('div', 'abs center', { top: '890px', font: 'italic 500 132px/1 Cormorant', color: LIB.cream }, box, w);
      return box;
    });
    S.l2 = lines(stage, ['— all of it,', 'on one shelf.'], { top: 760, size: 136, gap: 0.4 });
    S.stats = el('div', 'abs center', { top: '900px', opacity: 0 }, stage);
    S.count = el('div', '', { font: '500 300px/1 Cormorant', color: LIB.cream }, S.stats, '0');
    caps(S.stats, `traditions · ${S.regions} regions · one library`, { position: 'relative', marginTop: '46px', fontSize: '30px', textAlign: 'center' });
    S.end = libEnd(stage, { line: 'The library of divination.' });
  },
  async frame(t) {
    S.shelf.draw(t);
    S.band.style.opacity = t < END ? ease.outCubic(prog(t, 0, 1.2)) : 0;
    S.l1.show(t, 0.4, A0 - 0.6);
    S.asked.forEach((b, i) => {
      const a = A0 + i * STEP, on = t >= a && t < a + STEP;
      b.style.opacity = on ? 1 : 0;
      if (on) set(b, { o: 1, s: 1 + (t - a) * 0.08 });
    });
    S.l2.show(t, SHELF, STATS - 0.5);
    const sp = ease.outCubic(prog(t, STATS, STATS + 0.6));
    set(S.stats, { o: t < END ? sp * (1 - prog(t, END - 0.4, END)) : 0, y: (1 - sp) * 30 });
    S.count.textContent = String(Math.round(ease.outCubic(prog(t, STATS, STATS + 1.6)) * S.n));
    S.end(t - END);
  },
};
