/** POP 03 · YOUR VEDIC SIGN IS PROBABLY DIFFERENT — two zodiacs, 24°13′ apart (Lahiri, 2026). */
import { el, set, scribble, prog, ease, lerp, W, POP, spring, popBg, sticker, slab, sparkles, popEnd } from '../lib.js';

const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const AYAN = 24 + 13 / 60, END = 12.8;
let S = {};

function wheel(g, rot, hi, arcA) {
  const cx = 540, cy = 560; g.clearRect(0, 0, W, 1120);
  const ang = (d) => (-90 - d) * Math.PI / 180;
  const ringCol = [[POP.white, POP.ink], [POP.pink, POP.ink]];
  [[400, 500, 0, 0], [290, 390, rot, 1]].forEach(([r0, r1, off, k]) => {
    for (let i = 0; i < 12; i++) {
      const a0 = ang(i * 30 + off), a1 = ang((i + 1) * 30 + off);
      g.beginPath(); g.arc(cx, cy, r1, a1, a0); g.arc(cx, cy, r0, a0, a1, true); g.closePath();
      g.fillStyle = SIGNS[i] === 'Leo' && hi ? POP.yellow : ringCol[k][0]; g.fill();
      g.strokeStyle = POP.ink; g.lineWidth = 5; g.stroke();
      const m = ang(i * 30 + 15 + off), rr = (r0 + r1) / 2;
      g.save(); g.translate(cx + Math.cos(m) * rr, cy + Math.sin(m) * rr); g.rotate(m + Math.PI / 2);
      g.fillStyle = POP.ink; g.font = `900 ${k ? 26 : 32}px Inter`; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(SIGNS[i].toUpperCase(), 0, 0); g.restore();
    }
  });
  g.beginPath(); g.arc(cx, cy, 280, 0, 6.283); g.fillStyle = POP.ink; g.fill();
  g.fillStyle = POP.white; g.font = '900 34px Inter'; g.textAlign = 'center'; g.fillText('WESTERN · OUTSIDE', cx, cy - 16);
  g.fillStyle = POP.pink; g.fillText('VEDIC · INSIDE', cx, cy + 32);
  if (rot > 0.2 && arcA > 0.01) {
    g.save(); g.globalAlpha = arcA; g.lineCap = 'round';
    g.strokeStyle = POP.ink; g.lineWidth = 30; g.beginPath(); g.arc(cx, cy, 536, ang(rot), ang(0)); g.stroke();
    g.strokeStyle = POP.yellow; g.lineWidth = 18; g.stroke();
    const m = ang(rot / 2), x = cx + Math.cos(m) * 536, y = cy + Math.sin(m) * 536 - 70;
    const mins = Math.round(rot * 60), txt = `${Math.floor(mins / 60)}°${String(mins % 60).padStart(2, '0')}′`;
    g.font = '900 54px Inter'; const w = g.measureText(txt).width + 50;
    g.fillStyle = POP.ink; g.beginPath(); g.roundRect(x - w / 2 + 8, y - 42 + 8, w, 84, 16); g.fill();
    g.fillStyle = POP.yellow; g.beginPath(); g.roundRect(x - w / 2, y - 42, w, 84, 16); g.fill(); g.lineWidth = 5; g.stroke();
    g.fillStyle = POP.ink; g.textBaseline = 'middle'; g.fillText(txt, x, y + 2);
    g.restore();
  }
}

export default {
  duration: 15.2,
  async setup(stage) {
    S.bg = popBg(stage);
    S.spark = sparkles(stage, 7, 31, [POP.yellow, POP.white, POP.pink]);
    S.hook = slab(stage, 'You’re a Leo.', { size: 150, style: { top: '560px' } });
    S.strike = scribble(stage, 'M 190 660 C 400 630, 700 700, 900 640', { left: 0, top: 0, width: '1080px', height: '1920px' }, { width: 26, color: POP.red });
    S.nope = sticker(stage, 'probably not.', { bg: POP.pink, size: 96, pad: '10px 40px', style: { left: '50%', top: '860px', fontFamily: 'Hand', fontWeight: 700, letterSpacing: 0, opacity: 0 } });
    const c = el('canvas', 'abs', { left: 0, top: '620px' }, stage); c.width = W; c.height = 1120; S.g = c.getContext('2d'); S.c = c;
    S.caps = [['Western astrology counts the zodiac from the spring equinox.', 3.0, 5.0], ['Vedic astrology counts it from the stars.', 5.1, 7.1], ['They’ve drifted 24° apart.', 7.2, 9.3]]
      .map(([txt, a, b]) => ({ e: sticker(stage, txt, { size: 54, pad: '20px 34px', style: { left: '50%', top: '230px', whiteSpace: 'normal', width: '900px', textAlign: 'center', lineHeight: 1.15, opacity: 0 } }), a, b }));
    S.q = sticker(stage, 'Born 23 July – 16 August?', { size: 56, style: { left: '50%', top: '430px', opacity: 0 } });
    S.w = slab(stage, 'Western Leo.', { size: 150, style: { top: '640px' } });
    S.v = slab(stage, 'Vedic Cancer.', { size: 150, color: POP.yellow, echoes: 2, echoColor: POP.white, style: { top: '830px' } });
    S.same = el('div', 'abs center hand', { top: '1060px', fontSize: '84px', fontWeight: 700, color: POP.ink, opacity: 0 }, stage, 'same sky. different ruler.');
    S.end = popEnd(stage, { line: 'Find your real sign.', punch: 'Free.', cta: 'plutto.space/tools', sub: 'Moon sign · nakshatra · dasha · in your browser', bg: POP.blue });
  },
  async frame(t) {
    const phase = t < 2.8 ? POP.yellow : t < 9.4 ? POP.blue : POP.pink;
    S.bg(t, phase, { rays: POP.white, spin: 10 });
    S.spark(t, t < END ? 1 : 0);
    const hookOut = t > 2.8 ? 0 : 1;
    set(S.hook.box, { o: hookOut, s: spring(prog(t, 0.1, 0.7)), r: -2 });
    S.strike(ease.inOutCubic(prog(t, 1.0, 1.35)) * hookOut);
    S.nope.style.opacity = t > 1.35 && t < 2.8 ? 1 : 0;
    S.nope.style.transform = `translateX(-50%) scale(${spring(prog(t, 1.35, 1.9))}) rotate(-7deg)`;
    const wk = spring(prog(t, 2.8, 3.6));
    const rot = AYAN * ease.inOutCubic(prog(t, 5.6, 8.3));
    wheel(S.g, rot, t > 8.6, 1);
    set(S.c, { o: t > 2.8 && t < 9.4 ? 1 : 0, s: lerp(0.5, 1, Math.min(1.05, wk)), r: (1 - wk) * -40 + (t - 2.8) * 1.5 });
    S.caps.forEach(({ e, a, b }) => { e.style.opacity = t > a && t < b ? 1 : 0; e.style.transform = `translateX(-50%) scale(${spring(prog(t, a, a + 0.45))}) rotate(${a > 5 ? 2 : -2}deg)`; });
    S.q.style.opacity = t > 9.4 && t < END ? 1 : 0; S.q.style.transform = `translateX(-50%) scale(${spring(prog(t, 9.4, 9.9))}) rotate(-2deg)`;
    set(S.w.box, { o: t > 9.7 && t < END ? 1 : 0, s: spring(prog(t, 9.7, 10.2)), r: -2 });
    set(S.v.box, { o: t > 10.1 && t < END ? 1 : 0, s: spring(prog(t, 10.1, 10.7)), r: 2 });
    S.v.echo.forEach((e, k) => { e.style.transform = `translate(${(k + 1) * 14}px, ${(k + 1) * 14}px)`; });
    set(S.same, { o: t > 10.8 && t < END ? 1 : 0, r: -2 });
    S.end(t - END);
  },
};
