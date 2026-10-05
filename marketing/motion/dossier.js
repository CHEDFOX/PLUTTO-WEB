/**
 * THE FILES — the On the Record idea in a second hand: documented history where
 * divination reached into power, drawn as a declassified case file.
 *
 * A manila folder on a desk under a lamp. It opens; the sheet inside is a typed
 * Plutto Archive file with the claim blacked out. The redaction bars come off one
 * word at a time, a red DECLASSIFIED stamp comes down, and the receipt is typed
 * underneath with its key facts highlighted. A sticky note asks the question for
 * the comments. The last frame (the cover) is the whole file, readable at a glance.
 *
 * Same rules as the record: true, sourced, decades or centuries old; never live
 * wars, disasters or elections.
 *
 *   file({ n, system, subject, period,
 *          claim: [['THE US PAID', 'k'], ['PSYCHICS FOR', 'k'], ['23 YEARS.', 'r']],
 *          fact: 'text with *highlighted* spans', source: '…', prompt: 'the question ↓' })
 */
import { el, prog, ease, lerp, rng, W, H } from './lib.js';
import { paper } from './print.js';

const DESK = '#16110c', MANILA = '#c9a66b', SHEET = '#efe8d8', INK = '#1c1915', RED = '#c3261c';
const HL = 'rgba(255,224,58,0.7)';
const TYPE = 1 / 42;                       // seconds a character, typing
const SHEET_BOX = { left: 104, top: 286, width: 872, height: 1360 };

export function file({ n, system, subject, period, claim, fact, source, prompt, end }) {
  const words = claim.flatMap(([line, ink]) => line.split(' ').map((w) => ({ w, ink })));
  const segs = fact.split('*').map((s, i) => ({ s, em: i % 2 === 1 }));
  const chars = segs.reduce((a, s) => a + s.s.length, 0);
  const OPEN = 0.5, BAR0 = 1.35, GAP = 0.2;
  const barT = (i) => BAR0 + i * GAP;
  const STAMP = barT(words.length - 1) + 0.55;
  const FACT_AT = STAMP + 0.8;
  const factEnd = FACT_AT + chars * TYPE;
  const SRC_AT = factEnd + 0.2, srcEnd = SRC_AT + source.length * TYPE * 0.55;
  const NOTE = srcEnd + 0.45, BRAND = NOTE + 0.85;
  end = end ?? Math.max(14, BRAND + 2.3);
  // when each highlighted span finishes typing
  let acc = 0; const doneAt = segs.map((sg) => { acc += sg.s.length; return FACT_AT + acc * TYPE; });
  const S = {};

  return {
    duration: end,
    poster: end - 0.2,
    score() {
      const c = [{ i: 'room', t: 0, end, g: 0.035 }, { i: 'pad', t: 0, end, ns: [38, 45, 50], g: 0.1, bright: 360, verb: 0.6 }];
      for (let t = 0.12; t < STAMP - 0.3; t += 0.95) c.push({ i: 'heartbeat', t, g: 0.42 });
      c.push({ i: 'whoosh', t: OPEN - 0.05, dur: 0.7, g: 0.4 });
      words.forEach((_, i) => c.push({ i: 'hit', t: barT(i), g: 0.16 }, { i: 'tom', t: barT(i), f: 140, g: 0.2, d: 0.18, verb: 0.12 }));
      c.push({ i: 'riser', t: BAR0, end: STAMP, g: 0.22 });
      c.push({ i: 'boom', t: STAMP, g: 0.85 }, { i: 'tom', t: STAMP, f: 52, g: 0.75, verb: 0.35, d: 0.6 }, { i: 'hit', t: STAMP, g: 0.5 });
      for (let k = 0; k < chars; k += 2) c.push({ i: 'key', t: FACT_AT + k * TYPE, g: 0.11 });
      c.push({ i: 'bell', t: factEnd + 0.04, n: 96, g: 0.07, dur: 1.1 });
      for (let k = 0; k < source.length; k += 3) c.push({ i: 'key', t: SRC_AT + k * TYPE * 0.55, g: 0.06 });
      c.push({ i: 'whoosh', t: NOTE - 0.12, dur: 0.3, g: 0.25 }, { i: 'hit', t: NOTE, g: 0.22 });
      c.push({ i: 'bell', t: BRAND + 0.05, n: 81, g: 0.16, dur: 2.6 }, { i: 'bell', t: BRAND + 0.2, n: 88, g: 0.1, dur: 2.4 });
      return c;
    },
    async setup(stage) {
      stage.style.background = DESK;
      await Promise.all(['400 100px Anton', '400 40px Typewriter', '700 40px Typewriter', '400 40px Marker', '400 40px Stencil'].map((f) => document.fonts.load(f)));
      // rough ink for bars and stamps
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.style.position = 'absolute';
      svg.innerHTML = `
        <filter id="rough" x="-3%" y="-10%" width="106%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.04 0.3" numOctaves="2" seed="${n + 4}"/><feDisplacementMap in="SourceGraphic" scale="7"/></filter>
        <filter id="stampInk" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${n + 9}" result="n"/>
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.6 1.9" result="m"/>
          <feComposite in="SourceGraphic" in2="m" operator="in" result="i"/>
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="3" result="w"/>
          <feDisplacementMap in="i" in2="w" scale="4"/></filter>`;
      stage.appendChild(svg);

      S.root = el('div', 'abs', { left: 0, top: 0, width: `${W}px`, height: `${H}px`, transformOrigin: '50% 45%' }, stage);
      // the desk, and the lamp over it
      paper(S.root, { color: DESK, fibre: [70, 52, 34], wash: 0.7, specks: 160, seed: 40 + n });
      el('div', 'layer', { background: 'radial-gradient(70% 48% at 52% 40%, rgba(255,196,120,0.24), transparent 70%)' }, S.root);

      // the folder, open
      const folder = el('div', 'abs', { left: '48px', top: '214px', width: '984px', height: '1500px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.55)' }, S.root);
      paper(folder, { color: MANILA, fibre: [120, 88, 48], wash: 0.55, specks: 260, seed: 50 + n });
      const tab = el('div', 'abs', { left: '86px', top: '162px', width: '320px', height: '70px', background: MANILA, borderRadius: '10px 10px 0 0', boxShadow: '0 -6px 14px rgba(0,0,0,0.25)' }, S.root);
      el('div', 'abs', { left: '28px', top: '14px', font: '400 34px/1 Stencil', letterSpacing: '0.12em', color: '#5a4322' }, tab, `FILE N° ${String(n).padStart(2, '0')}`);
      // a coffee ring, because someone read this before you
      el('div', 'abs', { left: '700px', top: '1470px', width: '250px', height: '250px', borderRadius: '50%', border: '10px solid rgba(110,70,30,0.22)', filter: 'blur(1.5px)' }, S.root);

      // the sheet
      const sheet = el('div', 'abs', { ...px(SHEET_BOX), transform: 'rotate(-0.7deg)', boxShadow: '0 8px 22px rgba(0,0,0,0.35)', overflow: 'hidden' }, S.root);
      paper(sheet, { color: SHEET, fibre: [110, 95, 75], wash: 0.4, specks: 180, seed: 60 + n });
      const pad = el('div', 'abs', { left: '64px', right: '64px', top: '56px', bottom: '56px', display: 'flex', flexDirection: 'column' }, sheet);
      // letterhead
      const head = el('div', '', { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: '14px', borderBottom: `5px solid ${INK}` }, pad);
      el('div', '', { font: '400 40px/1 Stencil', letterSpacing: '0.14em', color: INK }, head, 'PLUTTO ARCHIVE');
      el('div', '', { font: '700 24px/1 Typewriter', letterSpacing: '0.08em', color: RED }, head, `CASE N° ${String(n).padStart(3, '0')}`);
      el('div', '', { height: '3px', background: INK, marginTop: '5px', opacity: 0.85 }, pad);
      const meta = el('div', '', { marginTop: '26px', display: 'grid', gap: '6px', font: '400 27px/1.3 Typewriter', color: INK }, pad);
      [['SYSTEM', system], ['SUBJECT', subject], ['PERIOD', period]].forEach(([k, v]) => {
        const r = el('div', '', { display: 'flex', gap: '12px' }, meta);
        el('span', '', { width: '170px', flex: 'none', color: '#6c6253' }, r, k);
        el('span', '', { fontWeight: 700 }, r, v.toUpperCase());
      });

      // the claim, set to the measure, every word under a bar
      S.claim = el('div', '', { marginTop: '34px', position: 'relative' }, pad);
      const m = document.createElement('canvas').getContext('2d'); m.font = '400 100px Anton';
      const MEASURE = 744;
      S.bars = [];
      claim.forEach(([line, ink]) => {
        const size = Math.min(150, (100 * MEASURE) / m.measureText(line).width);
        const row = el('div', '', { font: `400 ${size}px/0.98 Anton`, letterSpacing: '0.005em', color: ink === 'r' ? RED : INK, whiteSpace: 'nowrap', textTransform: 'uppercase' }, S.claim);
        line.split(' ').forEach((w, j) => {
          if (j) row.appendChild(document.createTextNode(' '));
          const span = el('span', '', { position: 'relative', display: 'inline-block' }, row, w);
          const bar = el('span', '', { position: 'absolute', left: '-7px', right: '-7px', top: '10%', bottom: '4%', background: '#0e0d0c', filter: 'url(#rough)', transformOrigin: '100% 50%' }, span);
          S.bars.push(bar);
        });
      });

      // the stamp
      S.stamp = el('div', 'abs', { left: '440px', top: '104px', font: '400 54px/1 Stencil', letterSpacing: '0.06em', color: RED, border: `7px solid ${RED}`, padding: '8px 20px 4px', borderRadius: '8px', filter: 'url(#stampInk)', mixBlendMode: 'multiply', opacity: 0, whiteSpace: 'nowrap' }, sheet, 'DECLASSIFIED');

      // the receipt, typed, with its facts highlighted
      S.fact = el('div', '', { marginTop: '36px', font: '400 32px/1.42 Typewriter', color: INK }, pad);
      S.segs = segs.map((sg) => el('span', '', sg.em ? { fontWeight: 700, backgroundImage: `linear-gradient(${HL}, ${HL})`, backgroundRepeat: 'no-repeat', backgroundPosition: '0 70%', backgroundSize: '0% 62%' } : {}, S.fact, ''));
      S.caret = el('span', '', { display: 'inline-block', width: '0.55em', height: '1.05em', background: INK, verticalAlign: '-0.15em', marginLeft: '2px' }, S.fact);
      S.src = el('div', '', { marginTop: '22px', font: '400 22px/1.4 Typewriter', color: '#6c6253', letterSpacing: '0.02em' }, pad, '');

      // the sign-off, bottom of the sheet
      S.brand = el('div', 'abs', { left: '64px', bottom: '58px', display: 'flex', alignItems: 'center', gap: '14px', opacity: 0 }, sheet);
      el('div', '', { width: '30px', height: '30px', borderRadius: '50%', border: `8px solid ${INK}`, boxSizing: 'border-box' }, S.brand);
      el('div', '', { font: '700 25px/1.35 Typewriter', letterSpacing: '0.1em', color: INK }, S.brand, 'ASK THE ARCHIVE<br>→ PLUTTO.SPACE');

      // a paperclip on the top edge
      const clip = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      clip.setAttribute('viewBox', '0 0 60 170'); clip.style.cssText = 'position:absolute;left:640px;top:236px;width:60px;height:170px;transform:rotate(6deg);filter:drop-shadow(0 3px 3px rgba(0,0,0,.35))';
      clip.innerHTML = '<path d="M20 150 V30 a16 16 0 0 1 32 0 V140 a24 24 0 0 1 -48 0 V45" fill="none" stroke="#b9bcc0" stroke-width="7" stroke-linecap="round"/>';
      S.root.appendChild(clip);

      // the sticky note, with the question
      S.note = el('div', 'abs', { width: '410px', minHeight: '190px', background: '#f8e46a', boxShadow: '0 14px 26px rgba(0,0,0,0.35)', padding: '30px 28px 28px', boxSizing: 'border-box', font: '400 42px/1.12 Marker', color: INK, opacity: 0, transformOrigin: '50% 0' }, S.root, prompt);

      // the cover that opens
      S.cover = el('div', 'abs', { left: '48px', top: '214px', width: '984px', height: '1500px', borderRadius: '8px', overflow: 'hidden', transformOrigin: '0% 100%', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }, S.root);
      paper(S.cover, { color: '#c39d60', fibre: [120, 88, 48], wash: 0.6, specks: 260, seed: 70 + n });
      el('div', 'abs', { left: '50%', top: '42%', transform: 'translate(-50%,-50%) rotate(-8deg)', font: '400 120px/1 Stencil', color: 'rgba(160,30,24,0.55)', border: '10px solid rgba(160,30,24,0.55)', padding: '12px 30px', filter: 'url(#stampInk)', whiteSpace: 'nowrap' }, S.cover, 'CLASSIFIED');
      el('div', 'abs', { left: '50%', top: '58%', transform: 'translateX(-50%)', font: '700 34px/1.3 Typewriter', color: '#4b381c', textAlign: 'center', letterSpacing: '0.08em', whiteSpace: 'nowrap' }, S.cover, `PLUTTO ARCHIVE · FILE ${String(n).padStart(2, '0')}<br>${system.toUpperCase()}`);
      S.layout = () => {
        // the stamp sits across the claim's lower right; the note at the sheet's foot, clear of the text
        const fb = S.src.getBoundingClientRect();
        S.note.style.left = '585px';
        S.note.style.top = `${Math.min(1418, Math.max(1290, fb.bottom + 34))}px`;
      };
    },
    async frame(t) {
      // the camera settles in; the stamp shakes the desk
      let shake = 0; const ds = t - STAMP; if (ds >= 0 && ds < 0.3) shake = 1 - ds / 0.3;
      const R = rng(Math.floor(t * 30) + 3);
      const push = lerp(1.05, 1, ease.outCubic(prog(t, 0, 1.6)));
      S.root.style.transform = `scale(${push}) translate(${(R() - 0.5) * 16 * shake}px, ${(R() - 0.5) * 16 * shake}px)`;
      // the cover swings away
      const o = ease.inOutCubic(prog(t, OPEN, OPEN + 0.75));
      S.cover.style.transform = `translate(${-1150 * o}px, ${60 * o}px) rotate(${-16 * o}deg)`;
      S.cover.style.opacity = o >= 1 ? 0 : 1;
      // the bars come off, one word at a time
      S.bars.forEach((b, i) => {
        const p = ease.inOutCubic(prog(t, barT(i), barT(i) + 0.18));
        b.style.transform = `scaleX(${1 - p}) rotate(${-2 * p}deg)`;
        b.style.opacity = p >= 1 ? 0 : 1;
      });
      // the stamp comes down
      const sp = prog(t, STAMP, STAMP + 0.12);
      S.stamp.style.opacity = sp > 0 ? 0.92 : 0;
      S.stamp.style.transform = `scale(${lerp(1.9, 1, ease.outCubic(sp))}) rotate(-9deg)`;
      // the receipt, typed; each fact highlighted as it lands
      let left = Math.max(0, Math.floor((t - FACT_AT) / TYPE));
      segs.forEach((sg, i) => {
        const k = Math.min(sg.s.length, left); S.segs[i].textContent = sg.s.slice(0, k); left -= k;
        if (sg.em) S.segs[i].style.backgroundSize = `${100 * ease.outCubic(prog(t, doneAt[i], doneAt[i] + 0.35))}% 62%`;
      });
      S.caret.style.opacity = t < FACT_AT ? 0 : (t < factEnd + 0.15 || Math.floor(t * 2.5) % 2 ? 1 : 0);
      if (t > SRC_AT) S.caret.style.opacity = 0;
      S.src.textContent = source.slice(0, Math.max(0, Math.floor((t - SRC_AT) / (TYPE * 0.55))));
      if (S.layout) S.layout();
      // the note slaps on; the sign-off
      const np = prog(t, NOTE, NOTE + 0.16);
      S.note.style.opacity = np > 0 ? 1 : 0;
      S.note.style.transform = `scale(${lerp(1.25, 1, ease.outCubic(np))}) rotate(${lerp(9, 3.5, np)}deg)`;
      S.brand.style.opacity = ease.outCubic(prog(t, BRAND, BRAND + 0.5));
    },
  };
}

function px(b) { return { left: `${b.left}px`, top: `${b.top}px`, width: `${b.width}px`, height: `${b.height}px` }; }
