/**
 * 02 · ASK IT OUT LOUD — the voice orb (real recording) with the questions
 * people actually carry, handwritten around it; then hello in the languages
 * it answers in. 109 is the count of languages onboarding offers.
 */
import { el, set, words, rise, haze, stars, vignette, footage, endCard, prog, ease, inOut, lerp } from '../lib.js';

const QUESTIONS = [
  { q: 'should I move cities?', x: 90, y: 560, r: -5 },
  { q: 'is it him?', x: 640, y: 690, r: 4 },
  { q: 'why does this keep happening?', x: 110, y: 1330, r: 3 },
  { q: 'what is this year for?', x: 560, y: 1450, r: -4 },
  { q: 'am I on the right path?', x: 220, y: 1560, r: -2 },
];
// Hello, in its own script — each in a language onboarding offers.
const HELLO = [
  { w: 'Hello', f: 'Inter' }, { w: 'नमस्ते', f: 'Deva' }, { w: 'Hola', f: 'Inter' }, { w: 'Olá', f: 'Inter' },
  { w: 'مرحبا', f: 'Arabic' }, { w: 'Aloha', f: 'Inter' }, { w: 'こんにちは', f: 'JP' }, { w: 'שלום', f: 'Hebrew' },
  { w: 'Merhaba', f: 'Inter' }, { w: 'Talofa', f: 'Inter' },
];
const LANG = 7.2, END = 11.8;
let S = {};
export default {
  duration: 14.3,
  async setup(stage) {
    S.haze = haze(stage, { x: 0.5, y: 0.52, size: 1400, alpha: 0.26 });
    S.stars = stars(stage, { seed: 21, n: 200, speed: 3 });
    // The orb: a square crop around it from the voice recording (590×1280).
    S.orb = footage(stage, 'voice', { crop: [120, 465, 350, 350], w: 820, h: 820, style: { left: '130px', top: '560px', borderRadius: '50%', WebkitMaskImage: 'radial-gradient(circle, #000 52%, transparent 70%)', maskImage: 'radial-gradient(circle, #000 52%, transparent 70%)' } });
    S.head = el('div', 'abs center', { top: '250px' }, stage);
    S.h1 = words(S.head, 'Ask it', 'h1', { fontSize: '150px' });
    S.h2 = words(S.head, 'out loud.', 'h1', { fontSize: '150px' });
    S.h2.spans.forEach((s) => { s.classList.add('grad'); s.style.paddingRight = '0.05em'; });
    S.qs = QUESTIONS.map((q) => el('div', 'abs hand', { left: `${q.x}px`, top: `${q.y}px`, fontSize: '64px', transform: `rotate(${q.r}deg)`, opacity: 0, whiteSpace: 'nowrap' }, stage, q.q));
    S.hello = HELLO.map((h) => el('div', 'abs center', { top: '820px', fontFamily: h.f, fontWeight: h.f === 'Inter' ? 800 : 600, fontSize: '190px', letterSpacing: h.f === 'Inter' ? '-0.04em' : '0', opacity: 0 }, stage, h.w));
    S.langs = el('div', 'abs center', { top: '1180px' }, stage);
    S.l1 = words(S.langs, 'In 109 languages.', 'h1', { fontSize: '96px' });
    S.sub = el('div', 'abs center hand', { top: '1330px', fontSize: '62px', opacity: 0 }, stage, 'pick yours once. every reading arrives in it.');
    vignette(stage);
    S.end = endCard(stage, { line: 'Ask it anything. Out loud.', grad: 'Out loud.', cta: 'plutto.space' });
  },
  async frame(t) {
    S.haze(t); S.stars(t);
    const orbIn = ease.outCubic(prog(t, 0, 0.9)), orbOut = ease.inOutCubic(prog(t, LANG - 0.9, LANG));
    set(S.orb.el, { o: orbIn * (1 - orbOut), s: lerp(0.9, 1, ease.outExpo(prog(t, 0, 1.4))) * (1 - orbOut * 0.4) });
    await S.orb.at(Math.min(t * 1.0, 9.9));
    rise(S.h2.spans, t - 0.75, { stagger: 0.12, out: LANG - 1.1 - 0.75 });
    rise(S.h1.spans, t - 0.4, { stagger: 0.1, out: LANG - 1.1 - 0.4 });
    S.h2.spans.forEach((s) => { s.style.backgroundPosition = `${ease.inOutCubic(prog(t, 1.2, 3.4)) * 150}% 0`; });
    S.qs.forEach((q, i) => {
      const a = 1.6 + i * 0.85;
      const k = inOut(t, a, LANG - 1.2 + i * 0.05, 0.6);
      q.style.opacity = k;
      q.style.transform = `translateY(${(1 - ease.outExpo(prog(t, a, a + 1))) * 40 - (t - a) * 6}px) rotate(${QUESTIONS[i].r}deg)`;
    });
    // Hello, in turn — a soft cross-dissolve, faster as it goes.
    S.hello.forEach((h, i) => {
      const a = LANG + i * 0.4;
      const k = ease.outCubic(prog(t, a, a + 0.18)) * (1 - ease.inCubic(prog(t, a + 0.36, a + 0.52)));
      const last = i === HELLO.length - 1;
      const hold = last ? ease.outCubic(prog(t, a, a + 0.18)) * (1 - ease.inCubic(prog(t, END - 0.5, END))) : k;
      set(h, { o: hold, s: lerp(1.08, 1, ease.outExpo(prog(t, a, a + 0.5))), blur: (1 - Math.min(1, hold * 1.4)) * 10 });
    });
    rise(S.l1.spans, t - LANG - 0.6, { stagger: 0.08, out: END - LANG - 1.1 });
    set(S.sub, { o: inOut(t, LANG + 1.6, END - 0.6, 0.6), y: (1 - ease.outExpo(prog(t, LANG + 1.6, LANG + 2.4))) * 24 });
    S.end(t - END);
  },
};
