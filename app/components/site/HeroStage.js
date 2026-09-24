'use client';

/**
 * THE HERO STAGE — the first scrolls turn the phones, then the page moves on.
 *
 * On a wide screen the hero is pinned (position: sticky inside a section three
 * screens tall). While it is pinned, the scroll does not move the page; it turns
 * the three phones like a carousel: the chat, then the Tarot draw, then the
 * morning notification, each coming to the front in turn and holding there for a
 * beat. When the third has had its turn the section ends and the page scrolls on
 * normally. Nothing hijacks the wheel — it is ordinary scrolling past a tall
 * section whose contents stay put.
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

import { useEffect, useRef, useState } from 'react';
import { motion, animate, useMotionValue, useScroll, useSpring, useTransform, useMotionValueEvent, useReducedMotion, AnimatePresence } from 'framer-motion';
import Tilt from './motion/Tilt';

// THE PATH. A phone's place in the stack is u = (index − turn) mod 3:
//   u = 0 front · u = 1, 2 behind, fanned up and to the right.
// The front phone does not jump to the back: as the turn advances its u runs
// 3 → 2 along a loop — out to the right on top of everything, then, once it is
// clear of the others, tucked in behind them into the last slot. Every other
// phone just steps one place forward. One continuous path, so the cycle can run
// forever without a seam.
const PATH = [
  // u     x     y    scale  rotate  bright
  [0,      0,    0,   1,     0,      1],
  [1,     74,  -30,   0.9,   5,      0.5],
  [2,    140,  -58,   0.8,   9,      0.32],
  [2.25, 262,  -46,   0.8,  13,      0.42],
  [2.55, 350,  -16,   0.86, 12,      0.62],
  [3,      0,    0,   1,     0,      1],
];
const wrap = (v) => ((v % 3) + 3) % 3;
function along(u) {
  let k = 0;
  while (k < PATH.length - 2 && u > PATH[k + 1][0]) k += 1;
  const [u0, ...a] = PATH[k];
  const [u1, ...b] = PATH[k + 1];
  const f = Math.max(0, Math.min(1, (u - u0) / (u1 - u0)));
  const e = f * f * (3 - 2 * f);            // smooth within each leg
  const v = a.map((x, i) => x + (b[i] - x) * e);
  return { x: v[0], y: v[1], scale: v[2], rotate: v[3], bright: v[4] };
}
// Layers: the stack in order (front on top), the leaving phone above everything
// while it swings out, and below everything once it tucks back in. It changes
// layer only at u = 2.55, where it is clear of every other phone.
const layer = (u) => (u > 2.55 ? 40 : u > 2 ? 5 : 30 - Math.round(u * 10));

function Phone({ turn, index, children }) {
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
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[46px] bg-black" style={{ opacity: shade }} />
    </motion.div>
  );
}

// The cycle: a phone holds the front for HOLD ms, then the stack turns once in
// MOVE ms. Scrolling through the pinned hero adds SCROLL_TURNS on top.
const HOLD = 3400;
const MOVE = 1.35;
const SCROLL_TURNS = 2;

export default function HeroStage({ copy, phones, neptune }) {
  const stage = useRef(null);
  const calm = useReducedMotion();
  const [front, setFront] = useState(0);
  // The pin is a wide-screen affair and the breakpoint is CSS's (lg), so the
  // server render and the first paint already agree with the device.
  const pinned = !calm;
  const { scrollYProgress: rawProgress } = useScroll({ target: stage, offset: ['start start', 'end end'] });
  // A mouse wheel scrolls in notches; the spring lets the phones glide between them.
  const scrollYProgress = useSpring(rawProgress, { stiffness: 70, damping: 22, mass: 0.6, restDelta: 0.0002 });
  const scrollTurn = useTransform(scrollYProgress, [0.04, 0.96], [0, SCROLL_TURNS], { clamp: true });
  const auto = useMotionValue(0);
  const turn = useTransform([auto, scrollTurn], ([a, b]) => a + b);
  const rise = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const grow = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  useMotionValueEvent(turn, 'change', (t) => setFront(wrap(Math.round(t))));

  // The endless cycle. It rests while the pointer is on the phones, while the
  // hero is off screen or the tab hidden, and for a moment after a scroll so
  // the two never fight.
  const hover = useRef(false);
  const lastScroll = useRef(0);
  useMotionValueEvent(rawProgress, 'change', () => { lastScroll.current = performance.now(); });
  useEffect(() => {
    if (!pinned) return undefined;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    if (stage.current) io.observe(stage.current);
    const id = setInterval(() => {
      if (!visible || hover.current || document.hidden) return;
      if (performance.now() - lastScroll.current < 1200) return;
      if (!window.matchMedia('(min-width: 1024px)').matches) return;
      animate(auto, Math.round(auto.get()) + 1, { duration: MOVE, ease: [0.45, 0, 0.2, 1] });
    }, HOLD + MOVE * 1000);
    return () => { clearInterval(id); io.disconnect(); };
  }, [pinned, auto]);

  // A dot turns the stack forward to its phone.
  const goTo = (i) => {
    const steps = wrap(i - front);
    if (!steps) return;
    animate(auto, Math.round(auto.get()) + steps, { duration: MOVE * (steps === 2 ? 1.5 : 1), ease: [0.45, 0, 0.2, 1] });
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

            {pinned ? (
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
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[-90px] w-[1100px] max-w-none -translate-x-1/2 lg:top-[-250px] lg:w-[1600px]" style={{ mixBlendMode: 'screen' }}>
              <motion.div style={pinned ? { y: rise, scale: grow } : undefined} className="max-lg:!transform-none">
                <div className={pinned ? 'neptune-breathe neptune-still-lg' : 'neptune-breathe'}>{neptune}</div>
              </motion.div>
            </div>

            {/* wide + motion: the carousel */}
            {pinned ? (
              <Tilt className="absolute inset-0 hidden lg:block" onHover={(v) => { hover.current = v; }} innerClassName="relative flex h-full w-full items-center justify-center pt-10 pr-20" max={4}>
                {phones.map((ph, i) => (
                  <Phone key={ph.key} turn={turn} index={i}>{ph.node}</Phone>
                ))}
              </Tilt>
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
