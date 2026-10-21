'use client';

/**
 * Home hero: a fanned stack of phones that keeps cycling. On wide screens the hero is pinned (sticky inside a
 * tall section) until every phone has been in front, then released to its natural height. While the hero is at
 * the top, the wheel over the phones turns them instead of scrolling; reduced motion gets the still layout.
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, animate, useMotionValue, useScroll, useSpring, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import useCalm from '../../motion/useCalm';
import Tilt from '../../motion/Tilt';
import { wrap } from './stackPath';
import { Phone } from './Phone';

// The glow behind each phone while it is in front: a warm grey shadow.
const GLOW = ['#CFC8BC', '#D9D3C8', '#CFC8BC'];

// The cycle: how long a phone holds the front (ms), how long one turn on the spring takes (s), and
// the turns that scrolling through the pinned hero adds.
const HOLD = 3600;
const MOVE = 1.6;
const SCROLL_TURNS = 2;
const SPRING = { type: 'spring', stiffness: 52, damping: 14, mass: 1, restDelta: 0.001 };

export default function HeroStage({ copy, phones, neptune }) {
  const stage = useRef(null);
  const calm = useCalm();
  const [front, setFront] = useState(0);
  // The stack, dots and glow run whenever motion is allowed. The pin (the tall sticky section that turns
  // scrolling into turns) lasts only until every screen has been at the front. Its breakpoint is the lg
  // media query, so the server render and the first paint already agree with the device.
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
  // Scrolling turns the stack only where the hero is pinned (a monitor). Unpinned, on a phone or tablet,
  // the hero is short and the turns would whip past in a flick; the cycle, a swipe or a dot turn it instead.
  const scrollOn = useMotionValue(0);
  useEffect(() => {
    const el = document.documentElement;
    const on = () => scrollOn.set(window.matchMedia('(min-width: 1024px)').matches && !el.classList.contains('scaled-tab') ? 1 : 0);
    on(); window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, [scrollOn]);
  const turn = useTransform([auto, scrollTurn, scrollOn], ([a, b, on]) => a + b * on);
  const rise = useTransform(effP, [0, 1], [0, -140]);
  const grow = useTransform(effP, [0, 1], [1, 1.08]);
  useMotionValueEvent(turn, 'change', (t) => setFront(wrap(Math.round(t))));

  // Release: the pinned hero looks the same at every scroll position inside the pin, so the section can
  // drop to its natural height and the scroll be set to the hero's top with nothing visibly moving.
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
      animate(auto, Math.round(auto.get()) + 1, SPRING);
    }, HOLD + MOVE * 1000);
    return () => { clearInterval(id); io.disconnect(); };
  }, [motionOn, auto]);

  // The wheel over the phones turns them instead of scrolling the page, before and after the release,
  // while the hero is up at the top (its top at or above the nav, its bottom below the fold); scrolled past
  // it, the wheel scrolls the page. Deltas are summed (a trackpad sends many small ones) into one turn
  // per notch, with a rest between turns.
  const stackRef = useRef(null);
  useEffect(() => {
    const el = stackRef.current;
    if (!el || !motionOn) return undefined;
    let acc = 0, lastTurn = 0, lastWheel = 0;
    const NOTCH = 80, REST = 650;
    const onWheel = (e) => {
      const r = stage.current.getBoundingClientRect();
      const heroUp = r.top <= 66 && r.bottom > window.innerHeight * 0.6;
      if (!heroUp) return;
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

  // On a touch screen a sideways swipe over the phones turns them one step either way; a mostly vertical
  // move is the page scrolling and is left alone.
  useEffect(() => {
    const el = stackRef.current;
    if (!el || !motionOn) return undefined;
    let x0 = 0, y0 = 0, t0 = 0;
    const down = (e) => { const t = e.touches[0]; x0 = t.clientX; y0 = t.clientY; t0 = performance.now(); };
    const up = (e) => {
      const t = e.changedTouches[0]; const dx = t.clientX - x0, dy = t.clientY - y0;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.2 || performance.now() - t0 > 800) return;
      lastScroll.current = performance.now();   // the cycle waits a beat after a hand
      animate(auto, Math.round(auto.get()) + (dx < 0 ? 1 : -1), SPRING);
    };
    el.addEventListener('touchstart', down, { passive: true });
    el.addEventListener('touchend', up, { passive: true });
    return () => { el.removeEventListener('touchstart', down); el.removeEventListener('touchend', up); };
  }, [motionOn, auto]);

  // A dot turns the stack forward to its phone.
  const goTo = (i) => {
    const steps = wrap(i - front);
    if (!steps) return;
    animate(auto, Math.round(auto.get()) + steps, SPRING);
  };

  const current = phones[front] || phones[0];

  return (
    <section ref={stage} className={`hero-pin relative ${pinned ? 'lg:h-[calc(var(--screen-h)*2.6)]' : ''}`}>
      <div className={`hero-pin-sticky ${pinned ? 'lg:sticky lg:top-16 lg:h-[calc(var(--screen-h)-64px)]' : ''} relative overflow-hidden`}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0"
             style={{ background: 'radial-gradient(40% 50% at 72% 60%, rgba(17,17,17,0.05), transparent 70%)' }} />

        <div className="relative mx-auto grid h-full max-w-6xl grid-cols-1 items-center gap-6 px-6 pt-12 lg:min-h-[calc(var(--screen-h)-64px)] lg:grid-cols-[1.05fr_1fr] lg:gap-4 lg:pt-0">
          <div className="text-center lg:text-left">
            {copy}

            {motionOn ? (
              <div className="mt-8 flex items-center justify-center gap-4 lg:mt-10 lg:justify-start">
                <div className="flex gap-2">
                  {phones.map((ph, i) => (
                    // The button is the tap area (touch screens give every button
                    // 44px, globals.css); the dot is drawn inside it at its own size.
                    <button key={ph.key} type="button" onClick={() => goTo(i)} aria-label={`Show ${ph.caption}`}
                            className="group relative flex items-center">
                      <span className="relative block h-2 overflow-hidden rounded-full bg-white/15 transition-all duration-500"
                            style={{ width: i === front ? 28 : 8 }}>
                        <span className="absolute inset-0 rounded-full bg-white transition-opacity duration-500" style={{ opacity: i === front ? 1 : 0 }} />
                      </span>
                    </button>
                  ))}
                </div>
                <div className="relative h-5 min-w-[15rem] overflow-hidden lg:min-w-[16rem]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p key={current.key} className="absolute whitespace-nowrap text-[13px] text-white/60 lg:text-[14px]"
                              initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}
                              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                      {current.caption}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            ) : null}
          </div>

          <div className="relative mx-auto flex h-[500px] w-full justify-center lg:h-[720px] lg:items-center">
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
              <div ref={stackRef} className="absolute inset-0 origin-top max-lg:-translate-x-[4%] max-lg:scale-[0.74]">
              <Tilt className="absolute inset-0" onHover={(v) => { hover.current = v; }} innerClassName="relative flex h-full w-full items-center justify-center pt-10 pr-20" max={4}>
                {/* the glow behind the stack, following the front phone */}
                {GLOW.map((c, i) => (
                  <motion.div key={c} aria-hidden="true" className="pointer-events-none absolute h-[560px] w-[560px] rounded-full"
                              style={{ background: `radial-gradient(closest-side, ${c}b3 0%, ${c}66 38%, ${c}1f 70%, ${c}00 100%)` }}
                              initial={false} animate={{ opacity: front === i ? 0.42 : 0 }} transition={{ duration: 1.4, ease: 'easeInOut' }} />
                ))}
                {/* Flat on purpose: a 3D rotation (rotateY) re-rasterises a phone on every frame of a turn,
                    worst in Safari, while a flat layer keeps one cached raster. Position, scale, tilt and
                    dimming carry the depth; z-index orders the phones, so nothing is sorted in 3D. */}
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
            {/* narrow + reduced motion: the chat alone (with motion, the stack above runs here too) */}
            {!motionOn ? (
              <div className="relative flex w-full justify-center lg:hidden">{phones[0].mobile || phones[0].node}</div>
            ) : null}
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-12 bg-gradient-to-b from-transparent to-black lg:h-32" />
      </div>
    </section>
  );
}
