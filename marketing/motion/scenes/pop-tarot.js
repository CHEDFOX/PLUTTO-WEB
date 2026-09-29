/** POP 09 · DRAW A CARD — the real tarot screen in a chunky phone, the deck fanning out in ink frames. */
import { ASSET, el, set, img, phone, prog, ease, lerp, POP, spring, popBg, sticker, slab, sparkles, marquee, popEnd } from '../lib.js';

const CARDS = ['cups_ace', 'cups_queen', 'cups_knight', 'cups_king', 'cups_page', 'cups_seven'];
const END = 11.2;
let S = {};
export default {
  duration: 13.6,
  async setup(stage) {
    S.bg = popBg(stage);
    S.spark = sparkles(stage, 9, 99, [POP.yellow, POP.white, POP.pink]);
    S.tape = marquee(stage, ['Tarot', 'Lenormand', 'Runes', 'I Ching', 'Ogham', 'Geomancy'], { y: 1560, rot: 7, bg: POP.pink, size: 64 });
    S.cards = CARDS.map((c) => img(stage, `${ASSET}/library/tarot/${c}.webp`, { left: '390px', top: '700px', width: '300px', height: '520px', objectFit: 'cover', borderRadius: '22px', border: `7px solid ${POP.ink}`, boxShadow: `12px 12px 0 ${POP.ink}`, opacity: 0 }));
    S.ph = phone(stage, 'tarot', { left: '260px', top: '560px', border: `9px solid ${POP.ink}`, boxShadow: `20px 20px 0 ${POP.ink}` });
    S.a = slab(stage, 'Draw a card.', { size: 150, style: { top: '190px' } });
    S.b = slab(stage, 'No sign-up.', { size: 150, color: POP.yellow, echoes: 2, echoColor: POP.white, style: { top: '350px' } });
    S.end = popEnd(stage, { line: 'Draw a card. No sign-up.', punch: 'Try it now.', cta: 'plutto.space', sub: 'Tarot · runes · I Ching · and 99 more traditions', bg: POP.blue });
  },
  async frame(t) {
    S.bg(t, POP.teal, { rays: POP.white, spin: 10 });
    S.spark(t, t < END ? 1 : 0);
    const on = t < END;
    const pk = spring(prog(t, 0.3, 1.1));
    set(S.ph.el, { o: on ? 1 : 0, y: (1 - Math.min(1, pk)) * 900, s: 0.84, r: -4 + Math.sin(t) * 1.5 });
    S.ph.el.style.zIndex = 2;
    await S.ph.at(Math.min(12.5, Math.max(0, (t - 0.8) * 1.2)));
    S.cards.forEach((c, i) => {
      const k = spring(prog(t, 1.3 + i * 0.12, 2.0 + i * 0.12)); const side = i % 2 ? 1 : -1, n = Math.floor(i / 2) + 1;
      set(c, { o: on && t > 1.3 + i * 0.12 ? 1 : 0, x: side * n * 150 * k, y: n * 40 * k + Math.sin(t * 2 + i) * 10, r: side * (8 + n * 9) * k });
    });
    set(S.a.box, { o: on ? 1 : 0, s: spring(prog(t, 0.2, 0.8)), r: -3 }); S.a.box.style.zIndex = 3;
    set(S.b.box, { o: on && t > 0.6 ? 1 : 0, s: spring(prog(t, 0.6, 1.3)), r: 2 }); S.b.box.style.zIndex = 3;
    S.b.echo.forEach((e, k) => { e.style.transform = `translate(${(k + 1) * 14}px, ${(k + 1) * 14}px)`; });
    S.tape(t, on && t > 5.5 ? 1 : 0);
    S.end(t - END);
  },
};
