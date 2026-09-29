/**
 * POP 01 · TALKS BACK — the brand film, loud. Each script of the frieze cuts
 * in on its own colour field; the line slams in; the app answers on a
 * sticker card (the real recording).
 */
import { el, set, haze, footage, prog, ease, inOut, lerp, POP, spring, popBg, sticker, slab, sparkles, marquee, popEnd } from '../lib.js';

const FRIEZE = [
  { glyph: '𓋹', font: 'Hiero', size: 400, say: 'ankh', means: 'life', where: 'Egypt · 3000 BC' },
  { glyph: '𒉆𒋻', font: 'Cunei', size: 300, say: 'nam·tar', means: 'fate, as decreed', where: 'Sumer · 2500 BC' },
  { glyph: '卜', font: 'CJK', size: 400, say: 'bǔ', means: 'to divine', where: 'Shang China · 1200 BC' },
  { glyph: 'ज्योतिष', font: 'Deva', size: 230, say: 'jyotiṣa', means: 'the science of light', where: 'India · 1200 BC' },
  { glyph: 'γνῶθι', font: 'InterGreek', size: 250, say: 'gnōthi', means: 'know thyself', where: 'Delphi · 500 BC' },
  { glyph: 'גורל', font: 'Hebrew', size: 290, say: 'goral', means: 'the lot that is cast', where: 'Judea · 500 BC' },
  { glyph: 'fata', font: 'Inter', italic: true, size: 290, say: 'fata viam', means: 'the fates will find a way', where: 'Rome · 19 BC' },
  { glyph: '᚛ᚑᚌᚐᚋ᚜', font: 'Ogham', size: 230, say: 'ogam', means: 'the tree letters', where: 'Ireland · 400 AD' },
  { glyph: 'ᚹᚣᚱᛞ', font: 'Runic', size: 290, say: 'wyrd', means: 'what becomes', where: 'The North · 700 AD' },
  { glyph: 'قسمة', font: 'Arabic', size: 290, say: 'qisma', means: 'kismet', where: 'Arabia · 700 AD' },
];
const COLORS = [POP.orange, POP.red, POP.pink, POP.magenta, POP.violet, POP.blue, POP.cyan, POP.teal, POP.lime, POP.yellow];
const STEP = 0.5, F0 = 0.2;
const HEAD = F0 + FRIEZE.length * STEP;      // 5.2 s
const CARD = HEAD + 3.3;                      // 8.5 s
const END = 13.2;
let S = {};

export default {
  duration: 15.6,
  async setup(stage) {
    S.bg = popBg(stage);
    S.root = el('div', 'layer', { transformOrigin: '50% 50%' }, stage);
    S.spark = sparkles(S.root, 9, 4, [POP.yellow, POP.white, POP.cyan, POP.pink]);
    S.label = el('div', 'abs center hand', { top: '250px', fontSize: '62px', color: POP.ink, fontWeight: 700 }, S.root, 'the same question, asked for five thousand years');

    S.frieze = FRIEZE.map((f, i) => {
      const box = el('div', 'layer', { opacity: 0 }, S.root);
      const g = el('div', 'abs center', { top: '470px', height: '520px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: f.font, fontStyle: f.italic ? 'italic' : 'normal',
        fontWeight: f.font === 'Inter' ? 900 : 600, fontSize: `${f.size}px`, lineHeight: 1, color: POP.ink, textShadow: `12px 12px 0 ${POP.white}` }, box, f.glyph);
      const tag = sticker(box, f.say, { size: 92, pad: '14px 44px', style: { left: '50%', top: '1060px' } });
      const means = el('div', 'abs center hand', { top: '1235px', fontSize: '76px', color: POP.ink, fontWeight: 700 }, box, f.means);
      const where = el('div', 'abs', { left: '50%', top: '1370px', background: POP.ink, color: COLORS[i], padding: '12px 26px', fontFamily: 'Mono', fontSize: '32px', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }, box, f.where);
      return { box, g, tag, means, where, rot: i % 2 ? 4 : -4 };
    });

    // The line.
    S.five = slab(S.root, 'Five', { size: 200, style: { top: '380px' } });
    S.thou = slab(S.root, 'thousand', { size: 190, style: { top: '560px' } });
    S.old = slab(S.root, 'years old.', { size: 160, style: { top: '740px' } });
    S.talks = slab(S.root, 'Talks back.', { size: 236, color: POP.yellow, echoes: 3, echoColor: POP.white, style: { top: '960px' } });

    // The app, answering: the real recording on a sticker card.
    S.card = el('div', 'abs', { left: '70px', top: '700px', width: '940px', height: '860px', borderRadius: '44px', overflow: 'hidden', border: `8px solid ${POP.ink}`, background: '#000', boxShadow: `18px 18px 0 ${POP.ink}`, opacity: 0 }, S.root);
    S.chat = footage(S.card, 'chat', { crop: [14, 150, 562, 527], w: 924, h: 844, style: { left: 0, top: 0 } });
    S.note = sticker(S.root, 'ask about the job. or the ex. it’s heard worse.', { bg: POP.yellow, size: 50, pad: '12px 30px', r: 10, shadow: 8, style: { left: '50%', top: '540px', fontFamily: 'Hand', fontWeight: 700, letterSpacing: '0', opacity: 0 } });
    S.real = el('div', 'abs', { left: '96px', top: '1610px', background: POP.ink, color: POP.white, padding: '10px 22px', fontFamily: 'Mono', fontSize: '26px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0 }, S.root, '● real recording · Plutto app');
    S.tape = marquee(S.root, ['Vedic', 'Western', 'Chinese', 'KP', 'Numerology', 'Tarot'], { y: 1730, rot: -6, bg: POP.cyan });

    S.end = popEnd(stage, { cta: 'Try it free · plutto.space' });
  },
  async frame(t) {
    // Colour: one field per script, violet for the line, pink for the answer.
    const i = Math.min(FRIEZE.length - 1, Math.max(0, Math.floor((t - F0) / STEP)));
    const color = t < HEAD ? COLORS[i] : t < CARD ? POP.violet : POP.pink;
    S.bg(t, color, { rays: t < HEAD ? 'rgba(255,255,255,1)' : POP.yellow, spin: 14 });
    S.spark(t, t > HEAD - 0.2 && t < END ? 1 : 0.6);
    set(S.label, { o: t < HEAD ? 1 : 0, r: -2 });

    S.frieze.forEach((f, k) => {
      const a = F0 + k * STEP;
      const on = t >= a && t < a + STEP;
      f.box.style.opacity = on ? 1 : 0;
      if (!on) return;
      const p = prog(t, a, a + 0.45);
      set(f.g, { s: lerp(0.55, 1, spring(p)), r: (1 - spring(p)) * f.rot * 4 });
      f.tag.style.transform = `translateX(-50%) scale(${spring(prog(t, a + 0.05, a + 0.45))}) rotate(${f.rot}deg)`;
      set(f.means, { o: ease.outCubic(prog(t, a + 0.1, a + 0.25)) });
      f.where.style.transform = `translateX(-50%) rotate(${-f.rot / 2}deg) scaleX(${ease.outExpo(prog(t, a + 0.12, a + 0.4))})`;
    });

    // The line slams in.
    const L = t - HEAD;
    // Then the first lines fly off and "Talks back." docks at the top.
    const up = ease.inOutCubic(prog(t, CARD - 0.3, CARD + 0.55));
    [[S.five, 0, -2], [S.thou, 0.15, 1.5], [S.old, 0.3, -1]].forEach(([sl, d, r]) => {
      const k = spring(prog(L, d, d + 0.5));
      set(sl.box, { o: L > d ? 1 - up : 0, s: k * (1 + up * 0.6), y: -up * 260, r });
    });
    const tk = spring(prog(L, 0.9, 1.55));
    set(S.talks.box, { o: L > 0.9 ? 1 : 0, s: lerp(2.2, 1, Math.min(1, tk)) * lerp(1, 0.5, up), y: -850 * up, r: -3 });
    S.talks.echo.forEach((e, k) => { e.style.transform = `translate(${(k + 1) * 16 * ease.outCubic(prog(L, 1.1, 1.6))}px, ${(k + 1) * 16 * ease.outCubic(prog(L, 1.1, 1.6))}px)`; });
    // A punch on the slam.
    const punch = Math.max(0, 1 - Math.abs(L - 1.2) / 0.18) * 0.035;
    S.root.style.transform = `scale(${1 + punch}) rotate(${punch * 20}deg)`;
    const outAll = ease.inCubic(prog(t, END - 0.4, END));
    [S.talks.box].forEach((b) => { if (t > END - 0.4) b.style.opacity = 1 - outAll; });

    // The answer card.
    const ck = spring(prog(t, CARD, CARD + 0.8));
    set(S.card, { o: t > CARD ? 1 - outAll : 0, y: (1 - Math.min(1, ck)) * 400, s: lerp(0.7, 1, Math.min(1.1, ck)), r: -2.5 + (1 - Math.min(1, ck)) * 8 });
    await S.chat.at(2.85 + Math.max(0, t - CARD - 0.1) * 1.15);
    S.note.style.transform = `translateX(-50%) scale(${spring(prog(t, CARD + 1.3, CARD + 1.9))}) rotate(3deg)`;
    S.note.style.opacity = t > CARD + 1.3 ? 1 - outAll : 0;
    set(S.real, { o: t > CARD + 0.6 ? 1 - outAll : 0, r: -2 });
    S.tape(t, t > CARD ? 1 - outAll : 0);

    S.end(t - END);
  },
};
