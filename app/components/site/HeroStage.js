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
 * The carousel is real 3D arithmetic, not three canned states: each phone sits
 * on a circle (120° apart) and the scroll turns the circle, so a phone moving
 * from the left to the right passes behind, smaller and dimmer, rather than
 * jumping. A caption and three dots under the buttons say which phone is in
 * front; a dot scrolls straight to its phone.
 *
 * Phones (narrow screens) and reduced motion get the unpinned hero: the chat
 * alone on a phone, the still three-up arrangement on a desktop.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion, AnimatePresence } from 'framer-motion';
import Tilt from './motion/Tilt';

// Scroll progress → carousel turns. Each phone holds the front for a stretch
// before the next turn begins.
const P = [0, 0.1, 0.4, 0.55, 0.85, 1];
const R = [0, 0, 1, 1, 2, 2];

function place(theta) {
  const c = Math.cos(theta), s = Math.sin(theta);
  const depth = (1 + c) / 2;            // 1 at the front, 0 straight behind
  return {
    x: s * 215,
    scale: 0.7 + 0.3 * depth,
    rotate: s * 8,
    rotateY: -s * 22,
    opacity: 0.25 + 0.75 * depth,
    zIndex: Math.round(depth * 30),
    filter: `brightness(${0.45 + 0.55 * depth})`,
  };
}

function Phone({ turn, index, children }) {
  const theta = (t) => ((index - t) * 2 * Math.PI) / 3;
  const x = useTransform(turn, (t) => place(theta(t)).x);
  const scale = useTransform(turn, (t) => place(theta(t)).scale);
  const rotate = useTransform(turn, (t) => place(theta(t)).rotate);
  const rotateY = useTransform(turn, (t) => place(theta(t)).rotateY);
  const opacity = useTransform(turn, (t) => place(theta(t)).opacity);
  const zIndex = useTransform(turn, (t) => place(theta(t)).zIndex);
  const filter = useTransform(turn, (t) => place(theta(t)).filter);
  return (
    <motion.div className="absolute" style={{ x, scale, rotate, rotateY, opacity, zIndex, filter }}>
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
  const turn = useTransform(scrollYProgress, P, R);
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
              <Tilt className="absolute inset-0 hidden lg:block" innerClassName="relative flex h-full w-full items-center justify-center" max={5}>
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
