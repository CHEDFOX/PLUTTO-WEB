'use client';
/**
 * useCalm — framer-motion's useReducedMotion, safe to render with.
 *
 * The server cannot know a visitor's motion preference, so it renders the
 * moving version. useReducedMotion answers `true` on the very first client
 * render for someone who asked for less motion, and anything that renders
 * DIFFERENT markup from that answer (Words drops its per-word spans) no longer
 * matches the server's HTML: React throws #418 and re-renders the page from
 * scratch. This answers `false` until the page has hydrated, then the real
 * preference — the first render always matches, and the calm version follows
 * a frame later.
 */
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export default function useCalm() {
  const pref = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted ? !!pref : false;
}
