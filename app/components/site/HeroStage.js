'use client';

/**
 * THE HERO STAGE — the first scrolls turn the phones, then the page moves on.
 *
 * On a wide screen the hero is pinned (position: sticky inside a tall section)
 * until every screen has been at the front — by the cycle, by scrolling, by the
 * wheel over the phones or by a dot. Then the pin is released: the section
 * drops to its natural height and the next scroll moves the page at once.
 *
 * While pinned, the wheel OVER THE PHONES turns them instead of scrolling the
 * page; anywhere else it scrolls the page into the pin, which turns them too.
 * Nothing can hold a visitor: once all three are seen, the wheel scrolls the
 * page again wherever it is.
 *
 * The phones are a fanned stack that keeps cycling. The front phone stands in
 * the middle; the next two wait behind it, each a step up, to the right and a
 * little smaller and darker, like a hand of cards. Every few seconds the front
 * phone swings out to the right and tucks in behind the others as the last
 * card, while each of them steps one place forward — and round again, forever.
 * Scrolling through the pinned hero turns the stack too (two turns over the
 * pin), on top of the cycle. A caption and three dots under the buttons say
 * which phone is in front; a dot turns the stack to its phone.
 *
 * Phones (narrow screens) and reduced motion get the unpinned hero: the chat
 * alone on a phone, the still three-up arrangement on a desktop.
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, animate, useMotionValue, useScroll, useSpring, useTransform, useMotionValueEvent, useReducedMotion, AnimatePresence } from 'framer-motion';
import Tilt from './motion/Tilt';

// THE PATH. A phone's place in the stack is u = (index − turn) mod 3:
//   u = 0 front · u = 1, 2 behind, fanned up and to the right.
// The front phone does not jump to the back: as the turn advances its u runs
// 3 → 2 along a loop — a small lift, out to the right on top of everything,
// then, once it is clear of the others, tucked in behind them into the last
// slot. Every other phone steps one place forward.
//
// The path is ONE smooth curve (a Catmull-Rom spline through these points),
// not straight legs joined at corners: with legs, a phone slowed to a stop at
// every joint and each turn read as several small stop-and-go moves. The only
// place the curve is allowed to stop is the front, where the phone holds.
const PATH = [
  // u     x     y    scale  rotate  (unused)  bright
  [0,      0,    0,   1,     0,      0,    1],
  [1,     74,  -30,   0.9,   5,     -5,    0.5],
  [2,    140,  -58,   0.8,   9,     -8,    0.32],
  [2.3,  270,  -42,   0.8,  13,     16,    0.4],
  [2.62, 352,   -6,   0.87, 10,     22,    0.62],
  [2.88,  92,    8,   1.03,  3,      7,    0.95],
  [3,      0,    0,   1,     0,      0,    1],
];
const N = PATH[0].length - 1;
const wrap = (v) => ((v % 3) + 3) % 3;
// Tangent at each point: Catmull-Rom (neighbours' chord, over their u gap),
// wrapping round the loop, and zero at the front so the phone settles there.
const TAN = PATH.map((pt, k) => {
  if (k === 0 || k === PATH.length - 1) return Array(N).fill(0);
  const prev = PATH[k - 1], next = PATH[k + 1];
  const du = next[0] - prev[0];
  return Array.from({ length: N }, (_, i) => (next[i + 1] - prev[i + 1]) / du);
});
function along(u) {
  let k = 0;
  while (k < PATH.length - 2 && u > PATH[k + 1][0]) k += 1;
  const p0 = PATH[k], p1 = PATH[k + 1], m0 = TAN[k], m1 = TAN[k + 1];
  const h = p1[0] - p0[0];
  const t = Math.max(0, Math.min(1, (u - p0[0]) / h));
  const t2 = t * t, t3 = t2 * t;
  const h00 = 2 * t3 - 3 * t2 + 1, h10 = t3 - 2 * t2 + t, h01 = -2 * t3 + 3 * t2, h11 = t3 - t2;
  const v = Array.from({ length: N }, (_, i) => h00 * p0[i + 1] + h10 * h * m0[i] + h01 * p1[i + 1] + h11 * h * m1[i]);
  return { x: v[0], y: v[1], scale: v[2], rotate: v[3], rotateY: v[4], bright: v[5] };
}
// Layers: the stack in order (front on top), the leaving phone above everything
// while it swings out, and below everything once it tucks back in. It changes
// layer only at u = 2.62, where it is clear of every other phone.
const layer = (u) => (u > 2.62 ? 40 : u > 2 ? 5 : 30 - Math.round(u * 10));

// The glow behind the front phone takes that screen's colour.
const GLOW = ['#7C5CFF', '#E0A458', '#3B82F6'];

function Phone({ turn, index, isFront, children }) {
  const at = (t) => along(wrap(index - t));
  const x = useTransform(turn, (t) => at(t).x);
  const y = useTransform(turn, (t) => at(t).y);
  const scale = useTransform(turn, (t) => at(t).scale);
  const rotate = useTransform(turn, (t) => at(t).rotate);
  // Darkening is a black veil, not a CSS brightness filter: a filter repaints
  // the playing video under it on every frame.
  const shade = useTransform(turn, (t) => 1 - at(t).bright);
  const zIndex = useTransform(turn, (t) => layer(wrap(index - t)));
  return (
    <motion.div className="absolute will-change-transform" style={{ x, y, scale, rotate, zIndex }}>
      {children}
      {/* will-change: opacity keeps this on the compositor. Without it every
          per-frame opacity write repainted and re-rasterised the veil — three
          280×587 repaints a frame, the largest cost left in a turn. */}
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[46px] bg-black" style={{ opacity: shade, willChange: 'opacity' }} />
      {/* a sheen crosses the glass as the phone settles at the front */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[46px]">
        <motion.div
          className="absolute inset-y-0 w-[70%] will-change-transform"
          style={{ background: 'linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.13) 50%, transparent 62%)' }}
          initial={false}
          animate={isFront ? { x: ['-120%', '190%'] } : { x: '-120%' }}
          transition={isFront ? { duration: 1.3, ease: [0.4, 0, 0.2, 1], delay: 0.95 } : { duration: 0 }}
        />
      </div>
    </motion.div>
  );
}

// The cycle: a phone holds the front for HOLD ms, then the stack turns once on a
// spring that lands with the softest settle (about MOVE s). Scrolling through
// the pinned hero adds SCROLL_TURNS on top.
const HOLD = 3600;
const MOVE = 1.6;
const SCROLL_TURNS = 2;
const SPRING = { type: 'spring', stiffness: 52, damping: 14, mass: 1, restDelta: 0.001 };

export default function HeroStage({ copy, phones, neptune }) {
  const stage = useRef(null);
  const calm = useReducedMotion();
  const [front, setFront] = useState(0);
  // The stack, dots and glow run whenever motion is allowed. The PIN (the tall
  // sticky section that turns scrolling into turns) lasts only until all three
  // screens have been at the front; after that the page scrolls straight away.
  // The breakpoint is CSS's (lg), so the server render and the first paint
  // already agree with the device.
  const motionOn = !calm;
  const [released, setReleased] = useState(false);
  const pinned = motionOn && !released;

  const { scrollYProgress: rawProgress } = useScroll({ target: stage, offset: ['start start', 'end end'] });
  // A mouse wheel scrolls in notches; the spring lets the phones glide between them.
  const scrollYProgress = useSpring(rawProgress, { stiffness: 70, damping: 22, mass: 0.6, restDelta: 0.0002 });
  // Once released, the scroll's contribution is frozen at its last value, so
  // collapsing the pin moves nothing on screen.
  const releasedMV = useMotionValue(0);
  const bakedP = useMotionValue(0);
  const effP = useTransform([scrollYProgress, releasedMV, bakedP], ([p, r, b]) => (r ? b : p));
  const scrollTurn = useTransform(effP, [0.04, 0.96], [0, SCROLL_TURNS], { clamp: true });
  const auto = useMotionValue(0);
  const turn = useTransform([auto, scrollTurn], ([a, b]) => a + b);
  const rise = useTransform(effP, [0, 1], [0, -140]);
  const grow = useTransform(effP, [0, 1], [1, 1.08]);
  useMotionValueEvent(turn, 'change', (t) => setFront(wrap(Math.round(t))));

  // RELEASE. The pinned hero looked the same at every scroll position inside
  // the pin (it was stuck to the top), so the section can drop to its natural
  // height and the scroll be set to the hero's top with nothing visibly moving.
  const seen = useRef(new Set([0]));
  const pendingTop = useRef(null);
  const release = () => {
    if (released || !stage.current) return;
    bakedP.set(scrollYProgress.get());
    releasedMV.set(1);
    const el = stage.current;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const inside = window.scrollY > top - 64 && window.scrollY < top + el.offsetHeight - window.innerHeight;
    pendingTop.current = inside ? Math.max(0, top - 64) : null;
    setReleased(true);
  };
  useLayoutEffect(() => {
    if (released && pendingTop.current != null) {
      window.scrollTo({ top: pendingTop.current, behavior: 'instant' });
      pendingTop.current = null;
    }
  }, [released]);
  useEffect(() => {
    seen.current.add(front);
    if (seen.current.size >= phones.length) release();
  }, [front]); // eslint-disable-line react-hooks/exhaustive-deps

  // The endless cycle. It rests while the pointer is on the phones, while the
  // hero is off screen or the tab hidden, and for a moment after a scroll so
  // the two never fight.
  const hover = useRef(false);
  const lastScroll = useRef(0);
  useMotionValueEvent(rawProgress, 'change', () => { lastScroll.current = performance.now(); });
  useEffect(() => {
    if (!motionOn) return undefined;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    if (stage.current) io.observe(stage.current);
    const id = setInterval(() => {
      if (!visible || hover.current || document.hidden) return;
      if (performance.now() - lastScroll.current < 1200) return;
      if (!window.matchMedia('(min-width: 1024px)').matches) return;
      animate(auto, Math.round(auto.get()) + 1, SPRING);
    }, HOLD + MOVE * 1000);
    return () => { clearInterval(id); io.disconnect(); };
  }, [motionOn, auto]);

  // THE WHEEL OVER THE PHONES turns them instead of scrolling the page — while
  // the hero is pinned on screen and not every screen has been seen. Once all
  // three have, the wheel scrolls the page again, even over the phones, so no
  // one is ever held here. Wheel deltas are accumulated (a trackpad sends many
  // small ones) and one turn is taken per NOTCH, with a rest between turns.
  const stackRef = useRef(null);
  const releasedRef = useRef(false);
  releasedRef.current = released;
  useEffect(() => {
    const el = stackRef.current;
    if (!el || !motionOn) return undefined;
    let acc = 0, lastTurn = 0, lastWheel = 0;
    const NOTCH = 80, REST = 650;
    const onWheel = (e) => {
      if (releasedRef.current) return;
      const r = stage.current.getBoundingClientRect();
      const pinnedOnScreen = r.top <= 66 && r.bottom > window.innerHeight + 2;
      if (!pinnedOnScreen) return;
      e.preventDefault();
      const now = performance.now();
      if (now - lastWheel > 300) acc = 0;
      lastWheel = now;
      acc += e.deltaY;
      if (Math.abs(acc) < NOTCH || now - lastTurn < REST) return;
      const dir = acc > 0 ? 1 : -1;
      acc = 0; lastTurn = now;
      animate(auto, Math.round(auto.get()) + dir, SPRING);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [motionOn, auto]);

  // A dot turns the stack forward to its phone.
  const goTo = (i) => {
    const steps = wrap(i - front);
    if (!steps) return;
    animate(auto, Math.round(auto.get()) + steps, SPRING);
  };

  const current = phones[front] || phones[0];

  return (
    <section ref={stage} className={`relative ${pinned ? 'lg:h-[260vh]' : ''}`}>
      <div className={`${pinned ? 'lg:sticky lg:top-16 lg:h-[calc(100svh-64px)]' : ''} relative overflow-hidden`}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0"
             style={{ background: 'radial-gradient(40% 50% at 72% 60%, rgba(56,120,255,0.22), transparent 70%), radial-gradient(35% 40% at 20% 30%, rgba(124,92,255,0.18), transparent 70%)' }} />

        <div className="relative mx-auto grid h-full max-w-6xl grid-cols-1 items-center gap-6 px-6 pt-12 lg:min-h-[calc(100svh-64px)] lg:grid-cols-[1.05fr_1fr] lg:gap-4 lg:pt-0">
          <div className="text-center lg:text-left">
            {copy}

            {motionOn ? (
              <div className="mt-10 hidden items-center gap-4 lg:flex">
                <div className="flex gap-2">
                  {phones.map((ph, i) => (
                    <button key={ph.key} type="button" onClick={() => goTo(i)} aria-label={`Show ${ph.caption}`}
                            className="group relative h-2 overflow-hidden rounded-full bg-white/15 transition-all duration-500"
                            style={{ width: i === front ? 28 : 8 }}>
                      <span className="absolute inset-0 rounded-full bg-white transition-opacity duration-500" style={{ opacity: i === front ? 1 : 0 }} />
                    </button>
                  ))}
                </div>
                <div className="relative h-5 min-w-[16rem] overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p key={current.key} className="absolute text-[14px] text-white/60"
                              initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}
                              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                      {current.caption}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            ) : null}
          </div>

          <div className="relative mx-auto flex h-[650px] w-full justify-center lg:h-[720px] lg:items-center">
            {/* The render's black sky is baked to transparency (neptune-alpha.png),
                so no blend mode: a blended layer under moving phones is
                recomposited on every frame, and Safari does that slowly. */}
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[-90px] w-[1100px] max-w-none -translate-x-1/2 lg:top-[-250px] lg:w-[1600px]">
              <motion.div style={motionOn ? { y: rise, scale: grow } : undefined} className="max-lg:!transform-none">
                <div className={motionOn ? 'neptune-breathe neptune-still-lg' : 'neptune-breathe'}>{neptune}</div>
              </motion.div>
            </div>

            {/* wide + motion: the carousel */}
            {motionOn ? (
              <div ref={stackRef} className="absolute inset-0 hidden lg:block">
              <Tilt className="absolute inset-0" onHover={(v) => { hover.current = v; }} innerClassName="relative flex h-full w-full items-center justify-center pt-10 pr-20" max={4}>
                {/* the glow: a soft pool of the front screen's colour, behind the stack */}
                {GLOW.map((c, i) => (
                  <motion.div key={c} aria-hidden="true" className="pointer-events-none absolute h-[560px] w-[560px] rounded-full"
                              style={{ background: `radial-gradient(closest-side, ${c}b3 0%, ${c}66 38%, ${c}1f 70%, ${c}00 100%)` }}
                              initial={false} animate={{ opacity: front === i ? 0.42 : 0 }} transition={{ duration: 1.4, ease: 'easeInOut' }} />
                ))}
                {/* Flat, on purpose. A 3D rotation on a phone (rotateY) made the
                    browser re-rasterise it on every frame of a turn, in Chrome and
                    worse in Safari; position, scale, tilt and dimming carry the
                    depth, and a flat layer keeps one cached raster for the whole
                    move. Ordered by z-index, so nothing is sorted or sliced in 3D. */}
                <div className="stack-bob relative flex items-center justify-center">
                  {phones.map((ph, i) => (
                    <Phone key={ph.key} turn={turn} index={i} isFront={front === i}>
                      {/* `idle` is the screen before its turn (the lock screen with
                          no banner yet); the same element type, so switching to
                          `node` is a prop change and its arrival animates. */}
                      {front === i || !ph.idle ? ph.node : ph.idle}
                    </Phone>
                  ))}
                </div>
              </Tilt>
              </div>
            ) : (
              /* wide + reduced motion: the still three-up */
              <div className="relative hidden w-full justify-center lg:flex">
                <div className="absolute left-1/2 top-24" style={{ marginLeft: -300 }}>
                  <div className="-rotate-[7deg] opacity-90">{phones[1].small}</div>
                </div>
                <div className="absolute left-1/2 top-24" style={{ marginLeft: 30 }}>
                  <div className="rotate-[7deg] opacity-90">{phones[2].small}</div>
                </div>
                <div className="relative z-10">{phones[0].node}</div>
              </div>
            )}
            {/* narrow: the chat alone */}
            <div className="relative flex w-full justify-center lg:hidden">{phones[0].mobile || phones[0].node}</div>
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-12 bg-gradient-to-b from-transparent to-black lg:h-32" />
      </div>
    </section>
  );
}
