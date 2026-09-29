/**
 * 09 · DRAW A CARD — the real tarot screen (recorded in the app) in a phone,
 * the deck's own art fanning out behind it, then the other shelves. "Draw a
 * card, no sign-up" is the site's own offer (plutto.space → Try it).
 */
import { ASSET, el, set, words, rise, haze, stars, vignette, phone, img, endCard, prog, ease, inOut, lerp } from '../lib.js';

const CARDS = ['cups_ace', 'cups_queen', 'cups_knight', 'cups_king', 'cups_page', 'cups_seven'];
const SHELVES = ['Tarot', 'Lenormand', 'Runes', 'I Ching', 'Ogham', 'Geomancy'];
const END = 11.2;
let S = {};

export default {
  duration: 13.6,
  async setup(stage) {
    S.haze = haze(stage, { x: 0.5, y: 0.5, alpha: 0.22 });
    S.stars = stars(stage, { seed: 99, n: 200, speed: 3 });
    S.cards = CARDS.map((c) => img(stage, `${ASSET}/library/tarot/${c}.webp`, { left: '390px', top: '640px', width: '300px', height: '520px', objectFit: 'cover', borderRadius: '22px', boxShadow: '0 30px 80px rgba(0,0,0,0.6)', opacity: 0, border: '2px solid rgba(255,255,255,0.1)' }));
    S.ph = phone(stage, 'tarot', { left: '260px', top: '560px', transformOrigin: '50% 50%' });
    S.head = el('div', 'abs center', { top: '200px' }, stage);
    S.h1 = words(S.head, 'Draw a card.', 'h1', { fontSize: '130px' });
    S.h2 = words(S.head, 'No sign-up.', 'h1', { fontSize: '130px' });
    S.h2.spans.forEach((s) => { s.classList.add('grad'); s.style.paddingRight = '0.04em'; });
    S.chips = el('div', 'abs', { left: '70px', right: '70px', top: '230px', display: 'flex', flexWrap: 'wrap', gap: '18px', justifyContent: 'center' }, stage);
    S.chipEls = SHELVES.map((s) => el('div', 'chip', { fontSize: '36px', opacity: 0 }, S.chips, s));
    vignette(stage);
    S.end = endCard(stage, { line: 'Try it in your browser.', grad: 'your browser.', cta: 'plutto.space', sub: 'Tarot · runes · I Ching · and 99 more traditions' });
  },
  async frame(t) {
    S.haze(t); S.stars(t);
    const out = ease.inCubic(prog(t, END - 0.6, END));
    const pk = ease.outExpo(prog(t, 0.3, 1.6));
    set(S.ph.el, { y: lerp(1300, 0, pk) + out * 60, s: 0.86, o: 1 - out });
    await S.ph.at(Math.min(12.5, Math.max(0, (t - 0.8) * 1.2)));
    // The deck fans out behind the phone.
    S.cards.forEach((c, i) => {
      const k = ease.outBack(prog(t, 1.4 + i * 0.12, 2.4 + i * 0.12));
      const side = i % 2 ? 1 : -1, n = Math.floor(i / 2) + 1;
      c.style.zIndex = '0';
      set(c, { o: Math.min(1, k * 1.4) * (1 - out), x: side * n * 150 * k, y: n * 40 * k + Math.sin(t + i) * 8, r: side * (8 + n * 8) * k });
    });
    S.ph.el.style.zIndex = '2';
    rise(S.h1.spans, t - 0.4, { stagger: 0.08, out: 5.3 });
    rise(S.h2.spans, t - 0.75, { stagger: 0.08, out: 4.95 });
    S.h2.spans.forEach((s) => { s.style.backgroundPosition = `${ease.inOutCubic(prog(t, 1.2, 3.4)) * 150}% 0`; });
    S.chipEls.forEach((c, i) => set(c, { o: ease.outCubic(prog(t, 6.2 + i * 0.18, 6.7 + i * 0.18)) * (1 - out), y: (1 - ease.outExpo(prog(t, 6.2 + i * 0.18, 7 + i * 0.18))) * 40 }));
    S.chips.style.zIndex = '3';
    S.end(t - END);
  },
};
