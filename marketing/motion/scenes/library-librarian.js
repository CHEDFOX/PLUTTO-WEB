/** THE LIBRARY 05 · THE LIBRARIAN — the app, in front of the shelves: the one who has read every book. */
import { LIB, atlas, night, shelves, lines, libEnd, libScore, el, set, prog, ease } from '../library.js';
import { phone } from '../lib.js';

const UP = 2.8, FREE = 9.0, END = 12.4;
const S = {};

export default {
  duration: 15.0,
  poster: 8.4,
  score() {
    return libScore({ duration: this.duration, end: END, hits: [0.3, 0.75, 1.2, UP + 0.5, FREE], turns: [UP] });
  },
  async setup(stage) {
    await Promise.all(['600 30px Cormorant', 'italic 500 116px Cormorant', '500 116px Cormorant'].map((f) => document.fonts.load(f)));
    const a = await atlas();
    night(stage);
    const books = a.list.map((t) => ({ name: t.name, color: a.cloth(t) }));
    S.shelf = shelves(stage, books, [
      { y: 0, h: 560, speed: 22, seed: 4, offset: 3000, blur: 5, alpha: 0.75 },
      { y: 640, h: 560, speed: 30, seed: 6, offset: 5200, blur: 5, alpha: 0.75 },
      { y: 1280, h: 560, speed: 38, seed: 8, offset: 1200, blur: 5, alpha: 0.75 },
    ]);
    el('div', 'layer', { background: 'linear-gradient(rgba(8,9,14,0.85), rgba(8,9,14,0.35) 40%, rgba(8,9,14,0.6))' }, stage);
    S.l = lines(stage, ['A librarian', 'who has read', 'every book.'], { top: 150, size: 116, gap: 0.45 });
    S.ph = phone(stage, 'chat', { left: '260px', top: '640px', transformOrigin: '50% 0', boxShadow: `0 0 0 10px #0b0b10, 0 40px 140px rgba(${LIB.lamp},0.28)` });
    S.free = el('div', 'abs', { left: '50%', top: '1640px', zIndex: 20, whiteSpace: 'nowrap', font: '600 42px/1 Inter', color: LIB.ink, background: LIB.cream, borderRadius: '999px', padding: '26px 50px', opacity: 0, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }, stage, 'Ask it anything. Free.');
    S.end = libEnd(stage, { line: 'Ask the library.', sub: 'Free to start · Android · Web' });
  },
  async frame(t) {
    S.shelf.draw(t);
    S.l.show(t, 0.3, END - 0.4);
    const p = ease.outCubic(prog(t, UP, UP + 1.0));
    set(S.ph.el, { o: t < END ? p : 0, y: (1 - p) * 700, s: 0.84 });
    await S.ph.at(Math.max(0, (t - UP) * 1.05));
    const fp = ease.outCubic(prog(t, FREE, FREE + 0.5));
    S.free.style.opacity = t < END ? fp : 0;
    S.free.style.transform = `translateX(-50%) translateY(${(1 - fp) * 30}px) scale(${0.9 + fp * 0.1})`;
    S.end(t - END);
  },
};
