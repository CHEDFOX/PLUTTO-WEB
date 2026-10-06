/** THE LIBRARY 02 · THE CATALOGUE — flick through the drawer, land on one card, then ask it. */
import { LIB, atlas, night, lines, libEnd, libScore, el, set, prog, ease, rng } from '../library.js';

const N = 22, F0 = 0.9, SPAN = 5.3;
// flicks: slow, fast through the middle, slow onto the card
const FLIPS = Array.from({ length: N }, (_, i) => { const u = i / N; return F0 + SPAN * (u + (0.75 / (2 * Math.PI)) * Math.sin(2 * Math.PI * u)); });
const LAND = F0 + SPAN + 0.1, ASK = LAND + 0.7, TYPE = 1 / 24, STAMP = '→ ASK IT IN PLUTTO';
const FREE = ASK + STAMP.length * TYPE + 1.1, END = 12.0;
const S = {};

function card(parent, t, n, total, title) {
  const c = el('div', 'abs', { left: '90px', top: '760px', width: '900px', height: '600px', background: '#f3ecdb', borderRadius: '10px', boxShadow: '0 30px 60px rgba(0,0,0,0.55)', transformOrigin: '50% 100%', color: LIB.ink, overflow: 'hidden' }, parent);
  // blue rules and the red header rule of a library card
  for (let y = 196; y < 600; y += 54) el('div', 'abs', { left: 0, right: 0, top: `${y}px`, height: '2px', background: 'rgba(109,141,181,0.45)' }, c);
  el('div', 'abs', { left: 0, right: 0, top: '140px', height: '3px', background: LIB.red }, c);
  el('div', 'abs', { left: '120px', top: 0, bottom: 0, width: '2px', background: 'rgba(163,50,42,0.5)' }, c);
  el('div', 'abs', { left: '22px', top: '44px', font: '700 28px/1 Typewriter', color: 'rgba(27,23,18,0.7)' }, c, t.call);
  el('div', 'abs', { left: '150px', right: '40px', top: '40px', font: '700 52px/1.05 Typewriter', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, c, title || t.name);
  el('div', 'abs', { left: '150px', top: '100px', font: '400 26px/1 Typewriter', color: 'rgba(27,23,18,0.62)' }, c, `${t.place} · ${t.regionTitle} · ${t.kind}`);
  el('div', 'abs', { left: '150px', right: '50px', top: '160px', font: '400 34px/54px Typewriter' }, c, t.note);
  el('div', 'abs', { right: '34px', top: '48px', font: '400 22px/1 Typewriter', color: 'rgba(27,23,18,0.5)' }, c, `${n} / ${total}`);
  const stamp = el('div', 'abs', { left: '150px', top: '430px', font: '700 40px/1 Typewriter', color: LIB.red }, c, '');
  return { c, stamp };
}

export default {
  duration: 14.6,
  poster: FREE + 0.6,
  score() {
    const c = libScore({ duration: this.duration, end: END, hits: [0.3, LAND, ASK, FREE], flips: FLIPS, turns: [F0 - 0.1] });
    for (let k = 0; k < STAMP.length; k++) if (STAMP[k] !== ' ') c.push({ i: 'key', t: ASK + 0.3 + k * TYPE, g: 0.16 });
    return c;
  },
  async setup(stage) {
    await Promise.all(['700 52px Typewriter', '400 34px Typewriter', 'italic 500 140px Cormorant', '500 140px Cormorant'].map((f) => document.fonts.load(f)));
    const a = await atlas();
    night(stage);
    const R = rng(21);
    const pool = a.traditions.filter((t) => t.id !== 'merindinlogun').map((t) => [R(), t]).sort((x, y) => x[0] - y[0]).map(([, t]) => t);
    const feat = a.traditions.find((t) => t.id === 'merindinlogun');
    const deck = [...pool.slice(0, N), feat];
    const idx = (t) => a.list.indexOf(t) + 1;
    S.box = el('div', 'layer', { perspective: '1800px', perspectiveOrigin: '50% 30%' }, stage);
    // back to front: the featured card is laid down first, so it sits at the back
    S.cards = deck.map((t, i) => ({ i, ...card(S.box, { ...t, regionTitle: a.title(t.region), call: `${t.region.slice(0, 2).toUpperCase()} ${String(idx(t)).padStart(3, '0')}` }, idx(t), a.traditions.length) })).reverse();
    S.cards.forEach((k, z) => { k.c.style.zIndex = z; });
    // the drawer front
    const d = el('div', 'abs', { left: '50px', right: '50px', top: '1250px', height: '400px', zIndex: 50, borderRadius: '8px', background: 'linear-gradient(#6a4429, #3d2414 60%, #22130a)', boxShadow: '0 -10px 40px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.12)' }, stage);
    const lab = el('div', 'abs', { left: '50%', top: '70px', width: '420px', height: '100px', marginLeft: '-210px', border: `5px solid ${LIB.brass}`, borderRadius: '6px', background: '#efe4c8', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 30px/1 Typewriter', color: LIB.ink, letterSpacing: '0.06em', whiteSpace: 'nowrap' }, d, 'DIVINATION · A–Z');
    el('div', 'abs', { left: '50%', top: '240px', width: '120px', height: '70px', marginLeft: '-60px', borderRadius: '0 0 60px 60px', border: `6px solid ${LIB.brass}`, borderTop: 0 }, d);
    S.lab = lab;
    S.h1 = lines(stage, ['Look it up.'], { top: 280, size: 150, italic: true });
    S.h2 = lines(stage, ['Then ask it.'], { top: 470, size: 150 });
    S.free = el('div', 'abs', { left: '50%', top: '1700px', zIndex: 60, transform: 'translateX(-50%)', whiteSpace: 'nowrap', font: '600 40px/1 Inter', color: LIB.ink, background: LIB.cream, borderRadius: '999px', padding: '24px 46px', opacity: 0 }, stage, 'Every tradition. Free to open.');
    S.end = libEnd(stage, { line: 'Look it up. Then ask it.', sub: 'Free to start · Android · Web' });
  },
  async frame(t) {
    const done = FLIPS.filter((f) => t >= f + 0.26).length;
    S.cards.forEach(({ c, i }) => {
      const f = FLIPS[i];
      if (f !== undefined && t >= f) {
        const p = ease.inCubic(prog(t, f, f + 0.26));
        c.style.opacity = t >= f + 0.26 ? 0 : 1 - p * 0.6;
        c.style.transform = `rotateX(${p * 100}deg)`;
        return;
      }
      const depth = i - done;
      c.style.opacity = depth > 3 ? 0 : 1;
      c.style.filter = `brightness(${1 - depth * 0.16})`;
      const lift = i === N && t > LAND ? ease.outCubic(prog(t, LAND, LAND + 0.6)) : 0;
      c.style.transform = `translateY(${-depth * 22 - lift * 90}px) scale(${1 - depth * 0.012 + lift * 0.03})`;
    });
    const k = Math.max(0, Math.floor((t - ASK - 0.3) / TYPE) + 1);
    S.cards[0].stamp.textContent = t > ASK + 0.3 ? STAMP.slice(0, k) : '';
    S.h1.show(t, 0.3, END - 0.4);
    S.h2.show(t, ASK, END - 0.4);
    const fp = ease.outCubic(prog(t, FREE, FREE + 0.5));
    S.free.style.opacity = t < END ? fp : 0;
    S.free.style.transform = `translateX(-50%) translateY(${(1 - fp) * 30}px)`;
    S.end(t - END);
  },
};
