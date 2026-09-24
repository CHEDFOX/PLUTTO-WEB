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
 * The phones are a fanned stack, not a carousel. The front phone stands in the
 * middle; the next two wait behind it, each a step up, to the right and a
 * little smaller and darker, like a hand of cards. A turn slides the front phone
 * out, down and to the left, fading, while the next steps forward out of the
 * stack. Nothing ever passes through anything else (a circular carousel made
 * the incoming and outgoing phones cross mid-turn), and scrolling back up plays
 * the same moves in reverse. A caption and three dots under the buttons say
 * which phone is in front; a dot scrolls straight to its phone.
 *
 * Phones (narrow screens) and reduced motion get the unpinned hero: the chat
 * alone on a phone, the still three-up arrangement on a desktop.
 */

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion, AnimatePresence } from 'framer-motion';
import Tilt from './motion/Tilt';

// Scroll progress → carousel turns. Each phone holds the front for a stretch
// before the next turn begins.
const P = [0, 0.1, 0.4, 0.55, 0.85, 1];
const R = [0, 0, 1, 1, 2, 2];

// Where a phone sits for its distance `d` from the front (d = index − turn):
//   d = 0  front      d = 1, 2  behind, fanned up and right      d = −1  gone
const SLOTS = [
  // d   x     y    scale  rotate  opacity  bright
  [-1, -230,  40, 0.8,  -11,    0,     0.5],
  [-0.5,-120, 22, 0.9,  -6,     0.12,  0.7],
  [ 0,    0,   0, 1,     0,     1,     1],
  [ 1,   74, -30, 0.9,   5,     1,     0.5],
  [ 2,  140, -58, 0.8,   9,     1,     0.32],
];
function lerpSlots(d) {
  const c = Math.max(-1, Math.min(2, d));
  let k = 0;
  while (k < SLOTS.length - 2 && c > SLOTS[k + 1][0]) k += 1;
  const [d0, ...a] = SLOTS[k];
  const [d1, ...b] = SLOTS[k + 1];
  const f = (c - d0) / (d1 - d0);
  const v = a.map((x, i) => x + (b[i] - x) * f);
  return { x: v[0], y: v[1], scale: v[2], rotate: v[3], opacity: v[4], bright: v[5] };
}

function Phone({ turn, index, children }) {
  const at = (t) => lerpSlots(index - t);
  const x = useTransform(turn, (t) => at(t).x);
  const y = useTransform(turn, (t) => at(t).y);
  const scale = useTransform(turn, (t) => at(t).scale);
  const rotate = useTransform(turn, (t) => at(t).rotate);
  const opacity = useTransform(turn, (t) => at(t).opacity);
  const filter = useTransform(turn, (t) => `brightness(${at(t).bright})`);
  // The leaving phone drops BEHIND everything as it slides away, so the phone
  // stepping forward is always the crisp one on top — no double exposure.
  const zIndex = useTransform(turn, (t) => { const d = index - t; return d < 0 ? 1 : 30 - Math.round(d * 10); });
  return (
    <motion.div className="absolute will-change-transform" style={{ x, y, scale, rotate, opacity, zIndex, filter }}>
      {children}
    </motion.div>
  );
}

export default function HeroStage({ copy, phones, neptune }) {
  const stage = useRef(null);
  const calm = useReducedMotion();
  const [front, setFront] = useState(0);
  // The pin is a wide-screen affair and the breakpoint is CSS's (lg), so the
  // server render and the first paint already agree with the device.
  const pinned = !calm;
  const { scrollYProgress } = useScroll({ target: stage, offset: ['start start', 'end end'] });
  // Each turn eases in and out (smootherstep) instead of moving at one speed.
  const ease = (v) => { const k = Math.floor(v), f = v - k; return k + f * f * f * (f * (f * 6 - 15) + 10); };
  const turn = useTransform(scrollYProgress, (p) => {
    for (let i = 0; i < P.length - 1; i += 1) {
      if (p <= P[i + 1]) { const f = (p - P[i]) / (P[i + 1] - P[i] || 1); return ease(R[i] + (R[i + 1] - R[i]) * Math.max(0, Math.min(1, f))); }
    }
    return R[R.length - 1];
  });
  const rise = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const grow = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  useMotionValueEvent(turn, 'change', (t) => setFront(((Math.round(t) % 3) + 3) % 3));

  const goTo = (i) => {
    const el = stage.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    const at = [0.05, 0.47, 0.92][i];
    window.scrollTo({ top: top + span * at, behavior: 'smooth' });
  };

  const current = phones[front] || phones[0];

  return (
    <section ref={stage} className={`relative ${pinned ? 'lg:h-[300vh]' : ''}`}>
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
                <div className="neptune-breathe">{neptune}</div>
              </motion.div>
            </div>

            {/* wide + motion: the carousel */}
            {pinned ? (
              <Tilt className="absolute inset-0 hidden lg:block" innerClassName="relative flex h-full w-full items-center justify-center pt-10 pr-20" max={4}>
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
