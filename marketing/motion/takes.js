/**
 * HOT TAKES — the side series (scenes/take-*.js). Letterpress protest placards:
 * a claim stamped in wood type, black and fire-red on newsprint, to a stomp.
 * Then the receipt, typed: the fact that makes the claim true. Then the fight,
 * a question stamped for the comments. The claim frame is the thumbnail.
 *
 * Controversial about astrology itself (the zodiac, the horoscope, Mercury),
 * never about people, beliefs or named rivals. Every claim is true, and the
 * receipt says why. That is what makes a take travel: people argue, then check.
 *
 *   take({ n, claim: [['YOUR SIGN', 'k'], ['IS PROBABLY', 'k'], ['WRONG.', 'r']],
 *          fact: 'text with *red* spans', prompt: 'the question ↓' })
 */
import { el, prog, ease, lerp, rng, W, H } from './lib.js';
import { paper, marks } from './print.js';

const NEWS = '#ECE5D1', INK = { k: '#171513', r: '#E4321B' };
const X = 84, WIDTH = W - 2 * X;
const TALL = 1.42;   // wood type is cut tall and narrow
const CLAIM_TOP = 372, STOMP = 0.3, FACT_AT = 4.6, PROMPT_GAP = 0.6, TYPE = 1 / 42;

export function take({ n, claim, fact, prompt, label = 'HOT TAKE', system = 'PLUTTO', accent = INK.r, tag = 'ASK YOUR REAL CHART · PLUTTO.SPACE', end }) {
  const IN = { k: INK.k, r: accent }, tint = `rgba(${[1, 3, 5].map((i) => parseInt(accent.slice(i, i + 2), 16))},0.13)`;
  const words = claim.flatMap(([line], li) => line.split(' ').map((w) => ({ w, li })));
  const segs = fact.split('*').map((s, i) => ({ s, em: i % 2 === 1 }));
  const chars = segs.reduce((a, s) => a + s.s.length, 0);
  const factEnd = FACT_AT + 0.5 + chars * TYPE, PROMPT = factEnd + PROMPT_GAP, BRAND = PROMPT + 1.0;
  end = end ?? Math.max(13.4, BRAND + 2.4);   // a longer receipt holds the screen longer
  const stampT = (i) => 0.3 + i * STOMP;
  let S = {};

  return {
    duration: end,
    poster: FACT_AT - 0.6,
    score() {
      const c = [{ i: 'room', t: 0, end, g: 0.03 }];
      // A stomp under everything: kick, kick, clap, at the stamping tempo.
      for (let t = 0.3; t < end - 0.8; t += STOMP * 4) c.push({ i: 'kick', t, g: 0.34 }, { i: 'kick', t: t + STOMP, g: 0.3 }, { i: 'clap', t: t + STOMP * 2, g: 0.2 });
      words.forEach((_, i) => c.push({ i: 'tom', t: stampT(i), f: 62, g: 0.5, verb: 0.2, d: 0.35 }, { i: 'hit', t: stampT(i), g: 0.12 }));
      c.push({ i: 'hit', t: stampT(words.length - 1), g: 0.35 }, { i: 'braam', t: stampT(words.length - 1), n: 36, dur: 1.6, g: 0.22 });
      for (let k = 0; k < chars; k += 2) c.push({ i: 'key', t: FACT_AT + 0.5 + k * TYPE, g: 0.1 });   // the receipt, typed
      c.push({ i: 'bell', t: factEnd + 0.05, n: 96, g: 0.08, dur: 1.2 });                                // …and the carriage bell
      c.push({ i: 'tom', t: PROMPT, f: 70, g: 0.55, verb: 0.3, d: 0.4 }, { i: 'hit', t: PROMPT, g: 0.3 });
      c.push({ i: 'sting', t: BRAND + 0.1, g: 0.45 });
      return c;
    },
    async setup(stage) {
      stage.style.background = NEWS;
      const b = paper(stage, { color: NEWS, fibre: [90, 80, 60], wash: 0.55, specks: 380, seed: 30 + n });
      marks(b, INK.k, { alpha: 0.35, target: null });
      // Wood type never inks evenly: streaky voids from the grain, and a slightly chewed edge.
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.style.position = 'absolute';
      svg.innerHTML = `<filter id="wood" x="-2%" y="-2%" width="104%" height="104%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.5" numOctaves="3" seed="${n + 3}" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.3 1.95" result="m"/>
        <feComposite in="SourceGraphic" in2="m" operator="in" result="ink"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="9" result="w"/>
        <feDisplacementMap in="ink" in2="w" scale="5"/></filter>`;
      stage.appendChild(svg);
      await document.fonts.load('900 100px Inter');
      S.root = el('div', 'abs', { left: 0, top: 0, width: `${W}px`, height: `${H}px` }, stage);
      // The masthead: which take this is, and whose.
      S.head = el('div', 'abs', { left: `${X}px`, right: `${X}px`, top: '300px', display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: `4px solid ${INK.k}`, fontFamily: 'Mono', fontWeight: 500, fontSize: '22px', letterSpacing: '0.16em', color: INK.k }, S.root);
      el('span', '', {}, S.head, `${label} N° ${String(n).padStart(2, '0')}`); el('span', '', { color: IN.r }, S.head, system);
      // The claim: each line set to the full measure, as wood type would be.
      const m = document.createElement('canvas').getContext('2d'); m.font = '900 100px Inter';
      S.claim = el('div', 'abs', { left: `${X}px`, width: `${WIDTH}px`, top: `${CLAIM_TOP}px`, transformOrigin: '0 0', filter: 'url(#wood)' }, S.root);
      let wi = 0;
      S.words = [];
      claim.forEach(([line, ink]) => {
        const size = Math.min(300, (100 * WIDTH) / (m.measureText(line).width * 0.97 + line.length * -3));
        const row = el('div', '', { fontFamily: 'Inter', fontWeight: 900, fontSize: `${size}px`, lineHeight: `${size * 0.74}px`, height: `${size * 0.74 * TALL}px`, letterSpacing: '-0.03em', color: IN[ink], whiteSpace: 'nowrap', marginBottom: '16px', paddingTop: `${size * 0.02}px` }, S.claim);
        line.split(' ').forEach((w, j) => {
          if (j) row.appendChild(document.createTextNode(' '));
          S.words.push({ e: el('span', '', { display: 'inline-block', opacity: 0, transformOrigin: '50% 0' }, row, w), i: wi++, rot: (rng(wi * 7 + n)() - 0.5) * 3 });
        });
      });
      // The receipt: typed, with the number that matters in red.
      S.fact = el('div', 'abs', { left: `${X}px`, width: `${WIDTH}px`, top: '900px', fontFamily: 'Mono', fontWeight: 500, fontSize: '42px', lineHeight: 1.34, color: INK.k, opacity: 0 }, S.root);
      S.segs = segs.map((sg) => el('span', '', { color: sg.em ? IN.r : IN.k, background: sg.em ? tint : 'none' }, S.fact, ''));
      S.caret = el('span', '', { display: 'inline-block', width: '0.55em', height: '1em', background: IN.r, verticalAlign: '-0.12em' }, S.fact);
      // The fight: a question stamped for the comments.
      S.prompt = el('div', 'abs', { left: `${X - 10}px`, top: '1245px', padding: '20px 30px 24px', background: IN.r, color: NEWS, fontFamily: 'Inter', fontWeight: 900, fontSize: '62px', letterSpacing: '-0.02em', lineHeight: 1, maxWidth: `${WIDTH}px`, filter: 'url(#wood)', opacity: 0 }, S.root, prompt);
      // The mark, small: this is a side take, not the brand film.
      S.brand = el('div', 'abs', { left: `${X}px`, top: '1400px', display: 'flex', alignItems: 'center', gap: '14px', fontFamily: 'Inter', fontWeight: 800, fontSize: '34px', letterSpacing: '-0.03em', color: INK.k, opacity: 0 }, S.root);
      el('div', '', { width: '30px', height: '30px', borderRadius: '50%', border: `8px solid ${INK.k}`, boxSizing: 'border-box' }, S.brand);
      el('span', '', {}, S.brand, 'Plutto');
      el('span', '', { fontFamily: 'Mono', fontWeight: 500, fontSize: '20px', letterSpacing: '0.16em', color: IN.r, marginLeft: '8px' }, S.brand, tag);
    },
    async frame(t) {
      // Every stamp shakes the table.
      let kick = 0;
      S.words.forEach(({ i }) => { const d = t - stampT(i); if (d >= 0 && d < 0.25) kick = Math.max(kick, 1 - d / 0.25); });
      const dp = t - PROMPT; if (dp >= 0 && dp < 0.25) kick = Math.max(kick, 1 - dp / 0.25);
      const R = rng(Math.floor(t * 30) + 1);
      S.root.style.transform = kick > 0 ? `translate(${(R() - 0.5) * 18 * kick}px, ${(R() - 0.5) * 18 * kick}px)` : 'none';
      // The claim: each word stamped down hard, a little askew.
      S.words.forEach(({ e, i, rot }) => {
        const p = prog(t, stampT(i), stampT(i) + 0.14);
        e.style.opacity = p > 0 ? 1 : 0;
        const sc = lerp(1.55, 1, ease.outCubic(p)); e.style.transform = `scale(${sc}, ${sc * TALL}) rotate(${rot * (1 - p * 0.6)}deg)`;
      });
      // Then it steps back to make room for the receipt, and stays as the headline.
      const back = ease.inOutCubic(prog(t, FACT_AT - 0.3, FACT_AT + 0.3)), small = Math.min(0.46, 300 / S.claim.offsetHeight);
      S.claim.style.transform = `scale(${lerp(1, small, back)})`;
      const factTop = CLAIM_TOP + S.claim.offsetHeight * small + 50;
      S.fact.style.top = `${lerp(factTop + 300, factTop, back)}px`;
      S.fact.style.opacity = back;
      let left = Math.max(0, Math.floor((t - FACT_AT - 0.5) / TYPE));
      segs.forEach((sg, i) => { const k = Math.min(sg.s.length, left); S.segs[i].textContent = sg.s.slice(0, k); left -= k; });
      S.caret.style.opacity = t < factEnd + 0.2 || Math.floor(t * 2.5) % 2 ? 1 : 0;
      // Measured after the typing, so each block sits under what is really there.
      S.prompt.style.top = `${factTop + S.fact.offsetHeight + 50}px`;
      S.brand.style.top = `${factTop + S.fact.offsetHeight + 50 + S.prompt.offsetHeight + 42}px`;
      // The fight, stamped; then the mark.
      const pp = prog(t, PROMPT, PROMPT + 0.14);
      S.prompt.style.opacity = pp > 0 ? 1 : 0;
      S.prompt.style.transform = `scale(${lerp(1.5, 1, ease.outCubic(pp))}) rotate(${lerp(-7, -2.5, pp)}deg)`;
      const bb = ease.outCubic(prog(t, BRAND, BRAND + 0.5));
      S.brand.style.opacity = bb; S.brand.style.transform = `translateY(${(1 - bb) * 14}px)`;
    },
  };
}
