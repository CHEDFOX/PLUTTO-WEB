/** THE LIBRARY 04 · EVERY ALPHABET — the words for fate in the scripts that first wrote them, then the page turns: read in yours. */
import { LIB, lines, caps, libEnd, libScore, el, set, prog, ease, W, H } from '../library.js';
import { paper } from '../print.js';

const PAGE = [
  { glyph: '𓋹', font: 'Hiero', size: 340, say: 'ankh', means: 'life', where: 'Egypt · 3000 BCE' },
  { glyph: '𒉆𒋻', font: 'Cunei', size: 260, say: 'nam·tar', means: 'fate, as decreed', where: 'Sumer · 2500 BCE' },
  { glyph: '卜', font: 'CJK', size: 340, say: 'bǔ', means: 'to divine', where: 'Shang China · 1200 BCE' },
  { glyph: 'ज्योतिष', font: 'Deva', size: 200, say: 'jyotiṣa', means: 'the science of light', where: 'India · 1200 BCE' },
  { glyph: 'גורל', font: 'Hebrew', size: 250, say: 'goral', means: 'the lot that is cast', where: 'Judea · 500 BCE' },
  { glyph: 'γνῶθι', font: 'InterGreek', size: 210, say: 'gnōthi', means: 'know thyself', where: 'Delphi · 500 BCE' },
  { glyph: '᚛ᚑᚌᚐᚋ᚜', font: 'Ogham', size: 200, say: 'ogam', means: 'the tree letters', where: 'Ireland · 400 CE' },
  { glyph: 'ᚹᚣᚱᛞ', font: 'Runic', size: 250, say: 'wyrd', means: 'what becomes', where: 'The North · 700 CE' },
  { glyph: 'قسمة', font: 'Arabic', size: 250, say: 'qisma', means: 'kismet', where: 'Arabia · 700 CE' },
];
const HELLO = [['Hello', 'Inter'], ['नमस्ते', 'Deva'], ['Hola', 'Inter'], ['مرحبا', 'Arabic'], ['こんにちは', 'JP'], ['שלום', 'Hebrew'], ['Olá', 'Inter'], ['Merhaba', 'Inter']];
const G0 = 1.0, STEP = 0.7, TURN = G0 + PAGE.length * STEP + 0.2, YOURS = TURN + 0.7, LANGS = YOURS + 1.3, END = 12.4;
const INK = '#2a1d12', RUBRIC = '#9b2b1f';
const S = {};

export default {
  duration: 15.0,
  poster: G0 + 4 * STEP + 0.4,
  score() {
    return libScore({ duration: this.duration, end: END, hits: [0.3, YOURS, LANGS], flips: PAGE.map((_, i) => G0 + i * STEP), turns: [TURN] });
  },
  async setup(stage) {
    await Promise.all(['italic 500 110px Cormorant', '500 50px Cormorant', '500 26px Mono', ...[...PAGE, ...HELLO.map(([, f]) => ({ font: f }))].map((p) => `600 100px ${p.font}`)].map((f) => document.fonts.load(f)));
    stage.style.background = LIB.night;
    // night behind the page, with the lamp
    el('div', 'layer', { background: `radial-gradient(70% 45% at 50% 40%, rgba(${LIB.lamp},0.15), transparent 70%), linear-gradient(${LIB.deep}, ${LIB.night})` }, stage);
    S.yours = lines(stage, ['Read in yours.'], { top: 640, size: 150, italic: true });
    S.hello = HELLO.map(([w, f]) => el('div', 'abs center', { top: '900px', font: `600 ${f === 'Inter' ? 150 : 130}px/1.3 ${f}`, color: `rgba(${LIB.lamp},0.9)`, opacity: 0 }, stage, w));
    S.langs = caps(stage, 'Ask in 109 languages', { left: 0, right: 0, top: '1180px', textAlign: 'center', fontSize: '34px', color: LIB.cream, opacity: 0 });
    // the page
    S.page = el('div', 'layer', { transformOrigin: '0% 50%', zIndex: 10, boxShadow: '30px 0 80px rgba(0,0,0,0.6)' }, stage);
    const c = paper(S.page, { color: '#ece2cc', fibre: [120, 92, 60], wash: 0.55, seed: 14 }).canvas;
    c.style.position = 'absolute'; c.style.inset = '0';
    el('div', 'abs', { left: '70px', right: '70px', top: '120px', bottom: '120px', border: `2px solid ${RUBRIC}`, opacity: 0.55 }, S.page);
    el('div', 'abs', { left: '84px', right: '84px', top: '134px', bottom: '134px', border: `1px solid ${RUBRIC}`, opacity: 0.35 }, S.page);
    S.head = lines(S.page, ['Written in', 'every alphabet.'], { top: 210, size: 112, italic: true, color: INK, gap: 0.25 });
    S.glyphs = PAGE.map((p) => {
      const box = el('div', 'layer', { opacity: 0 }, S.page);
      el('div', 'abs center', { top: `${980 - p.size * 0.65}px`, font: `600 ${p.size}px/1.3 ${p.font}`, color: INK, whiteSpace: 'nowrap' }, box, p.glyph);
      el('div', 'abs center', { top: '1290px', font: 'italic 500 76px/1 Cormorant', color: RUBRIC }, box, p.say);
      el('div', 'abs center', { top: '1390px', font: '500 50px/1 Cormorant', color: INK }, box, `“${p.means}”`);
      el('div', 'abs center', { top: '1490px', font: '500 24px/1 Mono', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(42,29,18,0.6)' }, box, p.where);
      return box;
    });
    S.folio = el('div', 'abs center', { bottom: '160px', font: '500 24px/1 Mono', letterSpacing: '0.2em', color: 'rgba(42,29,18,0.5)' }, S.page, '');
    S.end = libEnd(stage, { line: 'Every alphabet. One library.', sub: 'Vedic · I Ching · Runes · Kabbalah · and 98 more' });
  },
  async frame(t) {
    S.head.show(t, 0.3);
    S.glyphs.forEach((b, i) => {
      const a = G0 + i * STEP, on = t >= a && (i === PAGE.length - 1 || t < a + STEP);
      const p = ease.outCubic(prog(t, a, a + 0.35));
      set(b, { o: on ? p : 0, s: 1.04 - p * 0.04, blur: (1 - p) * 8 });
    });
    const k = Math.min(PAGE.length, Math.max(1, Math.floor((t - G0) / STEP) + 1));
    S.folio.textContent = `— ${k} —`;
    const turn = ease.inOutCubic(prog(t, TURN, TURN + 0.8));
    S.page.style.opacity = turn > 0.98 ? 0 : 1;
    S.page.style.transform = `perspective(2400px) rotateY(${-turn * 100}deg)`;
    S.yours.show(t, YOURS, END - 0.4);
    const hi = Math.floor((t - YOURS - 0.3) / 0.35);
    S.hello.forEach((h, i) => { h.style.opacity = t < END && t > YOURS + 0.3 && hi % HELLO.length === i ? 1 : 0; });
    const lp = ease.outCubic(prog(t, LANGS, LANGS + 0.6));
    set(S.langs, { o: t < END ? lp * (1 - prog(t, END - 0.4, END)) : 0, y: (1 - lp) * 20 });
    S.end(t - END);
  },
};
