'use client';
/**
 * framer-motion's useReducedMotion, false until hydrated. The server renders the moving markup; a first client
 * render that differs from it (Words drops its per-word spans) is React error #418 and a full re-render.
 */
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export default function useCalm() {
  const pref = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted ? !!pref : false;
}
