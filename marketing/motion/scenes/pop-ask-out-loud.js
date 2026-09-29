/** POP 02 · ASK IT OUT LOUD — the real voice orb as a badge, questions as stickers, hello on colour. */
import { el, set, footage, prog, ease, lerp, POP, spring, popBg, sticker, slab, sparkles, popEnd } from '../lib.js';

const QS = [['should I move cities?', 70, 620, -6], ['is it him?', 690, 700, 5], ['why does this keep happening?', 90, 1420, 4], ['what is this year for?', 560, 1540, -5], ['am I on the right path?', 150, 1660, -2]];
const HELLO = [['Hello', 'Inter'], ['नमस्ते', 'Deva'], ['Hola', 'Inter'], ['Olá', 'Inter'], ['مرحبا', 'Arabic'], ['Aloha', 'Inter'], ['こんにちは', 'JP'], ['שלום', 'Hebrew'], ['Merhaba', 'Inter'], ['Talofa', 'Inter']];
const HC = [POP.orange, POP.pink, POP.cyan, POP.lime, POP.violet, POP.yellow, POP.red, POP.teal, POP.blue, POP.magenta];
const LANG = 7.0, END = 11.9;
let S = {};
export default {
  duration: 14.3,
  async setup(stage) {
    S.bg = popBg(stage);
    S.spark = sparkles(stage, 8, 12, [POP.yellow, POP.white, POP.cyan]);
    S.orb = footage(stage, 'voice', { crop: [120, 465, 350, 350], w: 700, h: 700, style: { left: '190px', top: '700px', borderRadius: '50%', border: `8px solid ${POP.ink}`, boxShadow: `18px 18px 0 ${POP.ink}` } });
    S.a = slab(stage, 'Ask it', { size: 190, style: { top: '220px' } });
    S.b = slab(stage, 'out loud.', { size: 190, color: POP.yellow, echoes: 2, echoColor: POP.white, style: { top: '400px' } });
    S.qs = QS.map(([q, x, y, r]) => ({ e: sticker(stage, q, { size: 46, pad: '10px 26px', r: 14, shadow: 8, style: { left: `${x}px`, top: `${y}px`, fontFamily: 'Hand', fontWeight: 700, letterSpacing: 0, opacity: 0 } }), r }));
    S.hello = HELLO.map(([w, f]) => el('div', 'abs center', { top: '700px', fontFamily: f, fontWeight: f === 'Inter' ? 900 : 600, fontSize: f === 'Inter' ? '230px' : '200px', letterSpacing: f === 'Inter' ? '-0.05em' : 0, color: POP.ink, textShadow: `12px 12px 0 ${POP.white}`, opacity: 0 }, stage, w));
    S.langs = sticker(stage, 'In 109 languages.', { bg: POP.yellow, size: 84, pad: '18px 44px', style: { left: '50%', top: '1150px', opacity: 0 } });
    S.sub = el('div', 'abs center hand', { top: '1330px', fontSize: '68px', fontWeight: 700, color: POP.ink, opacity: 0 }, stage, 'pick yours once. every reading arrives in it.');
    S.end = popEnd(stage, { line: 'Ask it anything.', punch: 'Out loud.', cta: 'plutto.space', bg: POP.magenta });
  },
  async frame(t) {
    const hi = Math.min(HELLO.length - 1, Math.max(0, Math.floor((t - LANG) / 0.42)));
    S.bg(t, t < LANG ? POP.magenta : HC[hi], { rays: POP.white, spin: 12 });
    S.spark(t, t < END ? 1 : 0);
    const orbOut = ease.inCubic(prog(t, LANG - 0.5, LANG));
    const pulse = 1 + 0.03 * Math.sin(t * 5);
    set(S.orb.el, { o: t < LANG ? 1 : 0, s: spring(prog(t, 0.1, 0.8)) * pulse * (1 - orbOut * 0.5), r: Math.sin(t * 0.8) * 3 });
    await S.orb.at(Math.min(t, 9.9));
    const hOut = ease.inCubic(prog(t, LANG - 0.5, LANG));
    set(S.a.box, { s: spring(prog(t, 0.3, 0.9)), r: -3, o: 1 - hOut });
    set(S.b.box, { s: spring(prog(t, 0.6, 1.3)), r: 2, o: 1 - hOut });
    S.b.echo.forEach((e, k) => { e.style.transform = `translate(${(k + 1) * 14}px, ${(k + 1) * 14}px)`; });
    S.qs.forEach(({ e, r }, i) => {
      const a = 1.5 + i * 0.8;
      e.style.opacity = t > a && t < LANG - 0.3 ? 1 : 0;
      e.style.transform = `scale(${spring(prog(t, a, a + 0.5))}) rotate(${r + Math.sin(t * 2 + i) * 1.5}deg) translateY(${Math.sin(t * 1.4 + i) * 8}px)`;
    });
    S.hello.forEach((h, i) => {
      const a = LANG + i * 0.42, last = i === HELLO.length - 1;
      const on = t >= a && (last ? t < END : t < a + 0.42);
      h.style.opacity = on ? 1 : 0;
      if (on) set(h, { s: spring(prog(t, a, a + 0.35)), r: (i % 2 ? 3 : -3) * (1 - spring(prog(t, a, a + 0.35))) });
    });
    S.langs.style.opacity = t > LANG + 0.5 && t < END ? 1 : 0;
    S.langs.style.transform = `translateX(-50%) scale(${spring(prog(t, LANG + 0.5, LANG + 1.1))}) rotate(-3deg)`;
    set(S.sub, { o: t > LANG + 1.4 && t < END ? ease.outCubic(prog(t, LANG + 1.4, LANG + 1.8)) : 0, r: -1 });
    S.end(t - END);
  },
};
