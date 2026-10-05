/**
 * TRUE STORY — the record's idea at full voltage (scenes/truth-*.js).
 *
 * One mystery number slams in first, huge, in chromatic split (2060, 1899,
 * 93/123, C₂H₄…), on a saturated field with a spinning sunburst and halftone.
 * Then it lifts away and the claim arrives on tilted colour slabs, a TRUE STORY
 * starburst spins on, and the receipt is typed onto a white card with its facts
 * marked in the film's colour. A speech bubble asks the question; marquee tape
 * carries the sign-off. Each film has its own three-colour palette, so a grid
 * of them reads loud and distinct. Same rules as the record: true, sourced,
 * decades or centuries old.
 *
 *   truth({ n, system, hero: '2060', label: 'NOT ONE YEAR SOONER',
 *           palette: [field, a, b], claim: ['ISAAC NEWTON', 'DATED THE END', 'OF THE WORLD.'],
 *           fact: 'text with *marked* spans', source: '…', prompt: 'the question ↓' })
 */
import { el, prog, ease, lerp, rng, W, H, POP, spring, popBg, sticker, sparkles, marquee, blob, set } from './lib.js';

const INK = POP.ink, TYPE = 1 / 44;

export function truth({ n, system, hero, label, palette: [FIELD, A, B], claim, fact, source, prompt, end }) {
  const segs = fact.split('*').map((s, i) => ({ s, em: i % 2 === 1 }));
  const chars = segs.reduce((a, s) => a + s.s.length, 0);
  const HERO = 0.12, LABEL = 0.75, LIFT = 1.9;
  const lineT = (i) => 2.25 + i * 0.38;
  const STAR = lineT(claim.length - 1) + 0.5;
  const FACT_AT = STAR + 0.7, factEnd = FACT_AT + chars * TYPE;
  const SRC_AT = factEnd + 0.15, srcEnd = SRC_AT + source.length * TYPE * 0.5;
  const ASK = srcEnd + 0.35, TAPE = ASK + 0.5;
  end = end ?? Math.max(14, TAPE + 2.4);
  let acc = 0; const doneAt = segs.map((sg) => { acc += sg.s.length; return FACT_AT + acc * TYPE; });
  // the highlighter: whichever accent is lighter, so ink reads on it
  const lum = (h) => { const v = parseInt(h.slice(1), 16); return 0.299 * (v >> 16) + 0.587 * ((v >> 8) & 255) + 0.114 * (v & 255); };
  const MARK = lum(A) >= lum(B) ? A : B;
  const S = {};

  return {
    duration: end,
    poster: end - 0.2,
    score() {
      const c = [{ i: 'room', t: 0, end, g: 0.03 }];
      // a four-on-the-floor under everything, with hats
      for (let t = 0.12; t < end - 0.5; t += 0.5) c.push({ i: 'kick', t, g: 0.32 }, { i: 'hat', t: t + 0.25, g: 0.1 });
      for (let t = 0.62; t < end - 0.5; t += 1) c.push({ i: 'clap', t, g: 0.14 });
      c.push({ i: 'boom', t: HERO, g: 0.95 }, { i: 'hit', t: HERO, g: 0.5 }, { i: 'braam', t: HERO, n: 36, dur: 1.4, g: 0.25 });
      for (let k = 0; k < label.length; k += 2) c.push({ i: 'key', t: LABEL + k * 0.03, g: 0.08 });
      c.push({ i: 'whoosh', t: LIFT - 0.05, dur: 0.6, g: 0.35 });
      claim.forEach((_, i) => c.push({ i: 'whoosh', t: lineT(i) - 0.08, dur: 0.3, g: 0.22 }, { i: 'hit', t: lineT(i) + 0.12, g: 0.3 }, { i: 'tom', t: lineT(i) + 0.12, f: 90 - i * 10, g: 0.4, d: 0.3, verb: 0.2 }));
      c.push({ i: 'riser', t: lineT(0), end: STAR, g: 0.2 });
      c.push({ i: 'sting', t: STAR, g: 0.55 }, { i: 'boom', t: STAR, g: 0.6 });
      for (let k = 0; k < chars; k += 2) c.push({ i: 'key', t: FACT_AT + k * TYPE, g: 0.09 });
      c.push({ i: 'blip', t: ASK, n: 79, g: 0.3 }, { i: 'hit', t: ASK, g: 0.25 });
      c.push({ i: 'bell', t: TAPE + 0.05, n: 84, g: 0.18, dur: 2.4 });
      return c;
    },
    async setup(stage) {
      await Promise.all(['900 100px Inter', '800 40px Inter', '600 40px Inter', '400 100px Anton', '500 30px Mono'].map((f) => document.fonts.load(f)));
      S.bg = popBg(stage);
      S.blob = blob(stage, { size: 980, color: A, seed: n + 2, style: { left: '50px', top: '330px', opacity: 0.9 } });
      S.spark = sparkles(stage, 7, n + 30, [POP.white, B, A]);
      S.root = el('div', 'abs', { left: 0, top: 0, width: `${W}px`, height: `${H}px` }, stage);
      // the masthead
      S.mast = el('div', 'abs', { left: '60px', right: '60px', top: '214px', display: 'flex', gap: '14px', alignItems: 'center', font: '500 26px/1 Mono', letterSpacing: '0.16em', color: INK }, S.root);
      el('span', '', { background: POP.white, border: `4px solid ${INK}`, padding: '10px 16px', borderRadius: '999px' }, S.mast, `TRUE STORY N° ${String(n).padStart(2, '0')}`);
      el('span', '', { background: INK, color: POP.white, padding: '14px 18px', borderRadius: '999px' }, S.mast, system.toUpperCase());

      // the hero number: white with an ink edge, cyan and magenta ghosts behind
      const m = document.createElement('canvas').getContext('2d'); m.font = '400 100px Anton';
      const plain = hero.replace(/_/g, ''), heroHtml = hero.replace(/_(\d)/g, '<span style="font-size:0.5em">$1</span>');
      const hs = Math.min(420, (100 * 900) / m.measureText(plain).width);
      S.hero = el('div', 'abs', { left: 0, right: 0, top: '560px', height: `${hs}px`, textAlign: 'center', transformOrigin: '50% 0' }, S.root);
      const hstyle = { position: 'absolute', left: 0, right: 0, font: `400 ${hs}px/1 Anton`, letterSpacing: '-0.01em', whiteSpace: 'nowrap' };
      S.ghostA = el('div', '', { ...hstyle, color: POP.cyan, mixBlendMode: 'multiply' }, S.hero, heroHtml);
      S.ghostB = el('div', '', { ...hstyle, color: POP.magenta, mixBlendMode: 'multiply' }, S.hero, heroHtml);
      el('div', '', { ...hstyle, color: POP.white, WebkitTextStroke: `7px ${INK}`, paintOrder: 'stroke fill' }, S.hero, heroHtml);
      S.label = sticker(S.root, '', { bg: B, size: 40, pad: '16px 30px', r: 999, shadow: 10, style: { left: '50%', top: `${560 + hs + 40}px`, font: '900 40px/1 Inter', letterSpacing: '0.04em', opacity: 0 } });

      // the claim, on tilted slabs
      const mc = document.createElement('canvas').getContext('2d'); mc.font = '900 100px Inter';
      const bands = [POP.white, A, B, POP.white];
      S.lines = claim.map((line, i) => {
        const size = Math.min(132, (100 * 840) / mc.measureText(line).width);
        const band = el('div', 'abs', { left: '60px', right: '60px', top: `${520 + i * 150}px`, height: '134px', display: 'grid', placeItems: 'center',
          background: bands[i % bands.length], border: `6px solid ${INK}`, borderRadius: '20px', boxShadow: `12px 12px 0 ${INK}`, opacity: 0 }, S.root);
        el('div', '', { font: `900 ${size}px/1 Inter`, letterSpacing: '-0.04em', color: INK, whiteSpace: 'nowrap', textTransform: 'uppercase' }, band, line);
        return { band, rot: (i % 2 ? 1.6 : -1.6), from: i % 2 ? 1 : -1 };
      });
      S.claimBottom = 520 + claim.length * 150;

      // TRUE STORY starburst
      S.star = el('div', 'abs', { left: '752px', top: '176px', width: '310px', height: '310px', opacity: 0 }, S.root);
      let d = ''; for (let i = 0; i < 32; i++) { const r = i % 2 ? 128 : 158, a = (i / 32) * Math.PI * 2; d += (i ? 'L' : 'M') + (160 + r * Math.cos(a)).toFixed(1) + ' ' + (160 + r * Math.sin(a)).toFixed(1); }
      S.star.innerHTML = `<svg viewBox="0 0 320 320" width="320" height="320"><path d="${d}Z" fill="${POP.yellow}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/></svg>`;
      el('div', 'abs', { inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', font: '900 52px/0.95 Inter', letterSpacing: '-0.03em', color: INK }, S.star, 'TRUE<br>STORY');

      // the receipt card
      S.card = el('div', 'abs', { left: '60px', right: '60px', top: `${S.claimBottom + 70}px`, background: POP.white, border: `6px solid ${INK}`, borderRadius: '30px', boxShadow: `14px 14px 0 ${INK}`, padding: '34px 38px 30px', opacity: 0 }, S.root);
      S.fact = el('div', '', { font: '600 33px/1.4 Inter', letterSpacing: '-0.01em', color: INK }, S.card);
      S.segs = segs.map((sg) => el('span', '', sg.em ? { fontWeight: 900, backgroundImage: `linear-gradient(${MARK}, ${MARK})`, backgroundRepeat: 'no-repeat', backgroundPosition: '0 85%', backgroundSize: '0% 55%' } : {}, S.fact, ''));
      S.caret = el('span', '', { display: 'inline-block', width: '0.5em', height: '1em', background: B, verticalAlign: '-0.12em', marginLeft: '3px', border: `3px solid ${INK}`, boxSizing: 'border-box' }, S.fact);
      S.src = el('div', '', { marginTop: '18px', font: '500 20px/1.4 Mono', letterSpacing: '0.04em', color: 'rgba(20,16,43,0.6)' }, S.card, '');

      // the question, as a speech bubble
      S.ask = el('div', 'abs', { left: '60px', background: B, border: `6px solid ${INK}`, borderRadius: '34px', boxShadow: `12px 12px 0 ${INK}`, padding: '24px 34px', font: '900 50px/1.05 Inter', letterSpacing: '-0.03em', color: INK, opacity: 0, transformOrigin: '10% 100%', maxWidth: '820px' }, S.root, prompt);
      el('div', 'abs', { left: '70px', bottom: '-34px', width: '46px', height: '46px', background: B, borderRight: `6px solid ${INK}`, borderBottom: `6px solid ${INK}`, transform: 'rotate(45deg)' }, S.ask);

      // the sign-off tape
      S.tape = marquee(stage, ['True story', 'plutto.space', 'Ask anything', system], { y: 1650, rot: -5, bg: POP.white, size: 50, speed: 220 });
      S.place = () => {
        const cb = S.card.getBoundingClientRect();
        S.ask.style.top = `${Math.min(1440, cb.bottom + 46)}px`;
      };
    },
    async frame(t) {
      S.bg(t, FIELD, { rays: 'rgba(255,255,255,0.9)', cx: 50, cy: 38, dotColor: INK, spin: 9 });
      S.blob(t);
      S.spark(t, ease.outCubic(prog(t, 0.2, 1.2)));
      // the hero: slams in, jitters in split colour, then lifts to the masthead
      const hp = spring(prog(t, HERO, HERO + 0.7));
      const lift = ease.inOutCubic(prog(t, LIFT, LIFT + 0.55));
      const split = 10 + 34 * (1 - prog(t, HERO, HERO + 0.6)) + (t > HERO ? Math.sin(t * 23) * 3 : 0);
      S.ghostA.style.transform = `translate(${-split}px, ${split * 0.4}px)`;
      S.ghostB.style.transform = `translate(${split}px, ${-split * 0.4}px)`;
      const sc = lerp(2.6, 1, hp) * lerp(1, 0.4, lift);
      S.hero.style.opacity = t >= HERO ? 1 : 0;
      S.hero.style.transform = `translateY(${lerp(0, -255, lift)}px) scale(${sc}) rotate(${lerp(-6, 0, hp) + lerp(0, -3, lift)}deg)`;
      // its label pops, then gives way to the claim
      const lp = spring(prog(t, LABEL, LABEL + 0.5));
      S.label.style.opacity = lp > 0 && t < LIFT + 0.2 ? 1 : 0;
      S.label.style.transform = `translateX(-50%) scale(${lp * (1 - ease.inCubic(prog(t, LIFT - 0.1, LIFT + 0.2)))}) rotate(-3deg)`;
      S.label.textContent = label.slice(0, Math.max(0, Math.floor((t - LABEL) / 0.03)));
      // the claim slabs slide in from alternating sides
      S.lines.forEach(({ band, rot, from }, i) => {
        const p = spring(prog(t, lineT(i), lineT(i) + 0.55));
        band.style.opacity = t >= lineT(i) ? 1 : 0;
        band.style.transform = `translateX(${(1 - p) * from * 1200}px) rotate(${rot}deg)`;
      });
      // the starburst spins on
      const sp = spring(prog(t, STAR, STAR + 0.6));
      S.star.style.opacity = t >= STAR ? 1 : 0;
      S.star.style.transform = `scale(${sp}) rotate(${(1 - sp) * -120 + 12 + Math.sin(t * 2) * 4}deg)`;
      // the receipt
      const cp = ease.outCubic(prog(t, FACT_AT - 0.35, FACT_AT));
      S.card.style.opacity = cp; S.card.style.transform = `translateY(${(1 - cp) * 90}px) rotate(${lerp(3, -0.8, cp)}deg)`;
      let left = Math.max(0, Math.floor((t - FACT_AT) / TYPE));
      segs.forEach((sg, i) => {
        const k = Math.min(sg.s.length, left); S.segs[i].textContent = sg.s.slice(0, k); left -= k;
        if (sg.em) S.segs[i].style.backgroundSize = `${100 * ease.outCubic(prog(t, doneAt[i], doneAt[i] + 0.3))}% 55%`;
      });
      S.caret.style.opacity = t >= FACT_AT && t < SRC_AT && (t < factEnd || Math.floor(t * 3) % 2) ? 1 : 0;
      S.src.textContent = source.slice(0, Math.max(0, Math.floor((t - SRC_AT) / (TYPE * 0.5))));
      S.place();
      // the question pops
      const ap = spring(prog(t, ASK, ASK + 0.55));
      S.ask.style.opacity = t >= ASK ? 1 : 0;
      S.ask.style.transform = `scale(${ap}) rotate(${-2 + (1 - ap) * 8}deg)`;
      S.tape(t, ease.outCubic(prog(t, TAPE, TAPE + 0.4)));
    },
  };
}
