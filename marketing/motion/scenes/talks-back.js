/**
 * 01 · TALKS BACK — the brand film. The same question in the scripts that
 * first asked it, 3000 BC to 700 AD, then the line the site opens with, then
 * the app answering it for real (the actual chat recording from the app).
 */
import { ASSET, el, set, words, rise, haze, stars, vignette, footage, scribble, endCard, prog, ease, inOut, lerp } from '../lib.js';

// The site's frieze (components/site/Ancient.js), word for word.
const FRIEZE = [
  { glyph: '𓋹', font: 'Hiero', size: 330, say: 'ankh', means: 'life', where: 'Egypt · 3000 BC' },
  { glyph: '𒉆𒋻', font: 'Cunei', size: 250, say: 'nam·tar', means: 'fate, as decreed', where: 'Sumer · 2500 BC' },
  { glyph: '卜', font: 'CJK', size: 320, say: 'bǔ', means: 'to divine', where: 'Shang China · 1200 BC' },
  { glyph: 'ज्योतिष', font: 'Deva', size: 190, say: 'jyotiṣa', means: 'the science of light', where: 'India · 1200 BC' },
  { glyph: 'γνῶθι', font: 'InterGreek', size: 200, say: 'gnōthi', means: 'know thyself', where: 'Delphi · 500 BC' },
  { glyph: 'גורל', font: 'Hebrew', size: 230, say: 'goral', means: 'the lot that is cast', where: 'Judea · 500 BC' },
  { glyph: 'fata', font: 'Inter', italic: true, size: 230, say: 'fata viam', means: 'the fates will find a way', where: 'Rome · 19 BC' },
  { glyph: '᚛ᚑᚌᚐᚋ᚜', font: 'Ogham', size: 190, say: 'ogam', means: 'the tree letters', where: 'Ireland · 400 AD' },
  { glyph: 'ᚹᚣᚱᛞ', font: 'Runic', size: 230, say: 'wyrd', means: 'what becomes', where: 'The North · 700 AD' },
  { glyph: 'قسمة', font: 'Arabic', size: 230, say: 'qisma', means: 'kismet', where: 'Arabia · 700 AD' },
];
const STEP = 0.5, F0 = 0.35;           // one word every half second
const HEAD = F0 + FRIEZE.length * STEP + 0.15;   // ≈ 5.5 s
const PHONE = HEAD + 3.3;              // the app answers
const END = 13.0;

let S = {};
export default {
  duration: 15.5,
  async setup(stage) {
    S.haze = haze(stage, { x: 0.25, y: 0.3, alpha: 0.24 });
    S.haze2 = haze(stage, { color: '14,165,233', x: 0.85, y: 0.8, size: 1200, alpha: 0.1 });
    S.stars = stars(stage, { seed: 3, n: 240, speed: 4 });

    // The frieze: one word at a time, big, with its gloss.
    S.frieze = FRIEZE.map((f) => {
      const box = el('div', 'layer', { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0 }, stage);
      el('div', '', { fontFamily: f.font, fontSize: `${f.size}px`, fontStyle: f.italic ? 'italic' : 'normal', fontWeight: 600, lineHeight: 1, height: '380px', display: 'flex', alignItems: 'center' }, box, f.glyph);
      el('div', '', { fontSize: '76px', fontWeight: 700, letterSpacing: '-0.02em', marginTop: '40px' }, box, f.say);
      el('div', 'hand', { fontSize: '66px', marginTop: '6px' }, box, f.means);
      el('div', 'caps', { fontSize: '28px', marginTop: '46px' }, box, f.where);
      return box;
    });
    S.label = el('div', 'abs center hand', { top: '330px', fontSize: '60px', opacity: 0 }, stage, 'the same question, asked for five thousand years');

    // The line.
    S.head = el('div', 'abs center', { top: '640px' }, stage);
    S.l1 = words(S.head, 'Five thousand', 'h1', { fontSize: '168px' });
    S.l2 = words(S.head, 'years old.', 'h1', { fontSize: '168px' });
    S.l3 = words(S.head, 'Talks back.', 'h1 grad', { fontSize: '176px', paddingRight: '0.06em' });
    S.l3.spans.forEach((s) => { s.classList.add('grad'); s.style.backgroundSize = '300% 100%'; });
    S.under = scribble(S.head, 'M40 30 C 200 8, 420 40, 640 18 M90 52 C 260 36, 470 60, 600 44', { left: '220px', top: '520px', width: '700px', height: '80px' }, { width: 7, color: 'rgba(245,240,230,0.85)' });

    // The app, answering — the real recording, cropped to the conversation so
    // it reads at phone size: the question bubble and the answer as it streams.
    S.card = el('div', 'abs', { left: '60px', top: '640px', width: '960px', height: '900px', borderRadius: '48px', overflow: 'hidden',
      border: '2px solid rgba(255,255,255,0.14)', background: '#000', boxShadow: '0 50px 140px rgba(124,58,237,0.35), 0 0 0 1px rgba(255,255,255,0.04) inset', opacity: 0 }, stage);
    S.chat = footage(S.card, 'chat', { crop: [14, 150, 562, 527], w: 960, h: 900, style: { left: 0, top: 0 } });
    S.tag = el('div', 'abs caps', { left: '104px', top: '1580px', fontSize: '24px', opacity: 0 }, stage, '● Recorded in the Plutto app');
    S.note = el('div', 'abs hand', { left: '100px', top: '470px', fontSize: '60px', transform: 'rotate(-4deg)', opacity: 0, whiteSpace: 'nowrap' }, stage, 'ask about the job. or the ex. it’s heard worse.');
    S.arrow = scribble(stage, 'M 905 545 C 950 590, 945 640, 890 690 M 890 690 l 34 -2 M 890 690 l 6 -32', { left: 0, top: 0, width: '1080px', height: '1920px' }, { width: 5 });

    vignette(stage);
    S.end = endCard(stage, { cta: 'Try it free — plutto.space' });
  },
  async frame(t) {
    S.haze(t); S.haze2(t); S.stars(t);

    // Frieze: each word blooms in, holds, and dissolves into the next.
    S.frieze.forEach((box, i) => {
      const a = F0 + i * STEP;
      const k = ease.outCubic(prog(t, a, a + 0.22));
      const out = ease.inCubic(prog(t, a + STEP - 0.08, a + STEP + 0.14));
      set(box, { o: k * (1 - out), s: lerp(1.12, 1, ease.outExpo(prog(t, a, a + 0.6))) * (1 - out * 0.06), blur: (1 - k) * 18 + out * 14, y: out * -30 });
    });
    set(S.label, { o: inOut(t, 0.2, HEAD - 0.45, 0.5) * 0.9 });

    // The line rises, then moves up to make room for the phone.
    const lp = t - HEAD;
    rise(S.l1.spans, lp, { stagger: 0.09 });
    rise(S.l2.spans, lp - 0.3, { stagger: 0.09 });
    rise(S.l3.spans, lp - 0.95, { stagger: 0.12, dur: 1.1 });
    S.l3.spans.forEach((s) => { s.style.backgroundPosition = `${ease.inOutCubic(prog(lp, 1.2, 3.2)) * 150}% 0`; });
    S.under(ease.inOutCubic(prog(lp, 1.9, 2.8)));
    const up = ease.inOutCubic(prog(t, PHONE - 0.2, PHONE + 0.9));
    set(S.head, { y: lerp(0, -470, up), s: lerp(1, 0.5, up), o: 1 - ease.inCubic(prog(t, END - 0.5, END)) });
    S.head.style.transformOrigin = '50% 0';

    // The conversation card rises and plays 0 → 7.3 s of the recording.
    const pk = ease.outExpo(prog(t, PHONE, PHONE + 1.1));
    const pout = ease.inCubic(prog(t, END - 0.5, END));
    set(S.card, { y: (1 - pk) * 260 + pout * 60, s: lerp(0.94, 1, pk), o: pk * (1 - pout) });
    set(S.tag, { o: pk * (1 - pout) * 0.9 });
    // From the moment the question is sent (2.85 s) to the full answer (≈7.6 s).
    await S.chat.at(2.85 + Math.max(0, t - PHONE - 0.1) * 1.15);
    set(S.note, { o: inOut(t, PHONE + 1.6, END - 0.6, 0.5), y: (1 - ease.outExpo(prog(t, PHONE + 1.6, PHONE + 2.4))) * 30 });
    S.arrow(ease.inOutCubic(prog(t, PHONE + 2.1, PHONE + 2.7)) * (1 - pout));

    S.end(t - END);
  },
};
