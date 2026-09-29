/** POP 05 · THE 2 AUGUST 2027 ECLIPSE — total, greatest over Egypt at 10:06 UTC; five eclipses in 2027. */
import { ASSET, el, set, img, prog, ease, lerp, W, POP, spring, popBg, sticker, slab, sparkles, popEnd } from '../lib.js';

const TOT = 4.2, END = 12.2;
let S = {};
export default {
  duration: 14.6,
  async setup(stage) {
    S.bg = popBg(stage);
    const c = el('canvas', 'abs', { left: 0, top: '120px' }, stage); c.width = W; c.height = 1000; S.g = c.getContext('2d');
    S.sun = img(stage, `${ASSET}/planets/sun.png`, { left: '215px', top: '160px', width: '650px', height: '836px', mixBlendMode: 'screen' });
    S.moon = el('div', 'abs', { left: 0, top: 0, width: '468px', height: '468px', borderRadius: '50%', background: POP.ink, border: `8px solid ${POP.white}`, boxSizing: 'border-box' }, stage);
    S.spark = sparkles(stage, 9, 55, [POP.yellow, POP.pink, POP.white]);
    S.date = sticker(stage, '2 August 2027', { bg: POP.yellow, size: 64, pad: '10px 36px', style: { left: '50%', top: '1080px' } });
    S.h1 = slab(stage, 'Total solar', { size: 150, style: { top: '1210px' } });
    S.h2 = slab(stage, 'eclipse.', { size: 150, color: POP.pink, style: { top: '1350px' } });
    S.f1 = sticker(stage, 'Greatest over Egypt · 10:06 UTC', { size: 40, pad: '12px 26px', r: 999, shadow: 8, style: { left: '50%', top: '1540px' } });
    S.f2 = sticker(stage, 'Sun in Leo (Western) · Cancer (Vedic)', { size: 40, pad: '12px 26px', r: 999, shadow: 8, style: { left: '50%', top: '1630px' } });
    S.head = el('div', 'abs', { left: '50%', top: '260px', background: POP.ink, color: POP.white, padding: '12px 28px', fontFamily: 'Mono', fontSize: '38px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0, whiteSpace: 'nowrap' }, stage, 'All five eclipses of 2027');
    S.rows = [['6 Feb · annular solar', POP.cyan], ['20 Feb · penumbral lunar', POP.white], ['18 Jul · penumbral lunar', POP.white], ['2 Aug · TOTAL SOLAR', POP.yellow], ['17 Aug · penumbral lunar', POP.white]]
      .map(([d, bg], i) => sticker(stage, d, { bg, size: 62, pad: '14px 36px', style: { left: '50%', top: `${420 + i * 210}px`, opacity: 0 } }));
    S.end = popEnd(stage, { line: 'Every eclipse.', punch: 'Computed.', cta: 'plutto.space/sky-calendar', sub: 'Swiss Ephemeris · Western and Vedic', bg: POP.magenta });
  },
  async frame(t) {
    const A = t < 7.4;
    const cx = 534, cy = 584;
    const off = t < TOT ? -(1 - ease.outCubic(prog(t, 0.2, TOT))) : ease.inCubic(prog(t, TOT + 1.4, 7.4));
    const mx = cx - off * 700, my = cy - off * 420;
    const cover = Math.max(0, 1 - Math.hypot(mx - cx, my - cy) / 330);
    // Ink behind the Sun, so its screen-blended render keeps its own orange; violet for the list.
    S.bg(t, A ? POP.ink : POP.violet, { rays: A ? (cover > 0.85 ? POP.yellow : POP.violet) : POP.white, spin: 16, dotColor: A ? POP.violet : POP.ink });
    S.spark(t, A && cover > 0.85 ? 1 : 0.4);
    S.moon.style.transform = `translate(${mx - 234}px, ${my - 234}px)`; S.moon.style.opacity = A ? 1 : 0;
    set(S.sun, { o: A ? 0.4 + 0.6 * (1 - cover * 0.9) : 0 });
    const g = S.g; g.clearRect(0, 0, W, 1000);
    const k = A ? Math.pow(cover, 3) : 0;
    if (k > 0.01) {
      const oy = cy - 120;
      const cols = [POP.yellow, POP.pink, POP.white, POP.cyan];
      for (let i = 0; i < 48; i++) {
        const a = (i / 48) * Math.PI * 2 + t * 0.2;
        const len = 120 + 160 * Math.abs(Math.sin(i * 2.17 + 1.3)) + 40 * Math.sin(t * 3 + i);
        g.strokeStyle = cols[i % 4]; g.globalAlpha = k; g.lineWidth = 14; g.lineCap = 'round';
        g.beginPath(); g.moveTo(cx + Math.cos(a) * 260, oy + Math.sin(a) * 260); g.lineTo(cx + Math.cos(a) * (260 + len), oy + Math.sin(a) * (260 + len)); g.stroke();
      }
      g.globalAlpha = 1;
    }
    S.date.style.opacity = A && t > 0.5 ? 1 : 0; S.date.style.transform = `translateX(-50%) scale(${spring(prog(t, 0.5, 1))}) rotate(-3deg)`;
    set(S.h1.box, { o: A && t > 0.8 ? 1 : 0, s: spring(prog(t, 0.8, 1.3)), r: -2 });
    set(S.h2.box, { o: A && t > 1.1 ? 1 : 0, s: spring(prog(t, 1.1, 1.7)), r: 2 });
    [S.f1, S.f2].forEach((f, i) => { f.style.opacity = A && t > 1.8 + i * 0.3 ? 1 : 0; f.style.transform = `translateX(-50%) scale(${spring(prog(t, 1.8 + i * 0.3, 2.3 + i * 0.3))}) rotate(${i ? 1 : -1}deg)`; });
    const B = t >= 7.4 && t < END;
    S.head.style.opacity = B ? 1 : 0; S.head.style.transform = `translateX(-50%) rotate(-2deg) scaleX(${ease.outExpo(prog(t, 7.4, 7.8))})`;
    S.rows.forEach((r, i) => { r.style.opacity = B && t > 7.6 + i * 0.25 ? 1 : 0; r.style.transform = `translateX(-50%) scale(${spring(prog(t, 7.6 + i * 0.25, 8.1 + i * 0.25))}) rotate(${[-2, 1, -1, 2, -1][i]}deg)`; });
    S.end(t - END);
  },
};
