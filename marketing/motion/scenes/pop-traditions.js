/** POP 10 · 102 TRADITIONS — fat colour dots gather into a ring by region; the names pass on stickers. */
import { el, set, prog, ease, lerp, rng, W, POP, spring, popBg, sticker, slab, sparkles, popEnd } from '../lib.js';

const COLORS = { south_asia: '#FF9A2E', himalaya: '#FFD23D', china: '#FF4545', east_asia: '#FF4FA3', pacific: '#E23BD0', persia: '#9B5CFF', letters: '#3355FF', sky: '#1FC8F0', folk: '#10D1B2', americas: '#2EE08E', africa: '#9BE33C', body: '#E6E63A' };
const END = 11.6;
let S = {};
export default {
  duration: 14,
  async setup(stage) {
    const atlas = await (await fetch('../../app/lib/atlas.json')).json();
    S.list = atlas.regions.flatMap((r) => atlas.traditions.filter((x) => x.region === r.id));
    S.total = atlas.traditions.length;
    const R = rng(5);
    S.dots = S.list.map((x, i) => ({ i, a: (i / S.list.length) * Math.PI * 2 - Math.PI / 2, sx: R() * W, sy: R() * 1100, c: COLORS[x.region] || '#fff' }));
    S.bg = popBg(stage);
    S.spark = sparkles(stage, 8, 101, [POP.yellow, POP.white]);
    const c = el('canvas', 'abs', { left: 0, top: '380px' }, stage); c.width = W; c.height = W; S.g = c.getContext('2d');
    S.num = slab(stage, '0', { size: 230, style: { top: '780px' } });
    S.lab = el('div', 'abs center', { top: '1010px', fontSize: '38px', fontWeight: 900, color: POP.white, letterSpacing: '0.08em' }, stage, 'TRADITIONS');
    S.name = sticker(stage, '', { size: 58, style: { left: '50%', top: '1530px', opacity: 0 } });
    S.h1 = slab(stage, `${S.total} traditions.`, { size: 118, style: { top: '160px' } });
    S.h2 = slab(stage, `${atlas.regions.length} regions.`, { size: 118, style: { top: '290px' } });
    S.h3 = slab(stage, 'Your chart.', { size: 150, color: POP.yellow, echoes: 2, echoColor: POP.white, style: { top: '1480px' } });
    S.end = popEnd(stage, { line: 'Every reading.', punch: 'Every system.', cta: 'plutto.space', bg: POP.violet });
  },
  async frame(t) {
    S.bg(t, POP.ink, { rays: POP.violet, spin: 8, dotColor: POP.violet });
    S.spark(t, t < END ? 1 : 0);
    const g = S.g; g.clearRect(0, 0, W, W);
    const on = t < END;
    let shown = 0;
    for (const d of S.dots) {
      const a0 = 0.5 + d.i * 0.042, k = ease.inOutCubic(prog(t, a0, a0 + 1.1));
      if (k <= 0 || !on) continue;
      if (k >= 1) shown++;
      const ang = d.a + t * 0.06;
      const x = lerp(d.sx, 540 + Math.cos(ang) * 440, k), y = lerp(d.sy, 540 + Math.sin(ang) * 440, k);
      g.fillStyle = d.c; g.strokeStyle = POP.white; g.lineWidth = 4;
      g.beginPath(); g.arc(x, y, 15 + 3 * Math.sin(t * 3 + d.i), 0, 6.283); g.fill(); g.stroke();
    }
    S.num.main.textContent = String(Math.min(S.total, shown)); S.num.echo.forEach((e) => { e.textContent = S.num.main.textContent; });
    set(S.num.box, { o: on ? 1 : 0, s: spring(prog(t, 0.4, 1)) * (shown >= S.total ? 1 + 0.05 * Math.sin(t * 6) : 1), r: -2 });
    set(S.lab, { o: on ? 1 : 0 });
    const x = S.list[Math.min(S.list.length - 1, Math.max(0, shown - 1))];
    if (x) { S.name.innerHTML = x.name; S.name.style.background = COLORS[x.region] || '#fff'; }
    S.name.style.opacity = on && t > 0.9 && t < 6.6 ? 1 : 0; S.name.style.transform = 'translateX(-50%) rotate(-2deg)';
    set(S.h1.box, { o: on && t > 6.8 ? 1 : 0, s: spring(prog(t, 6.8, 7.3)), r: -2 });
    set(S.h2.box, { o: on && t > 7.1 ? 1 : 0, s: spring(prog(t, 7.1, 7.6)), r: 2 });
    set(S.h3.box, { o: on && t > 7.5 ? 1 : 0, s: lerp(2, 1, Math.min(1, spring(prog(t, 7.5, 8.2)))), r: -3 });
    S.h3.echo.forEach((e, k) => { e.style.transform = `translate(${(k + 1) * 14}px, ${(k + 1) * 14}px)`; });
    S.end(t - END);
  },
};
