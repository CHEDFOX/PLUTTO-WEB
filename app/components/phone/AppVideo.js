'use client';

/**
 * A screen of the real app recorded while it runs (tools/app-screens, like Shot). `name` picks
 * /app/screens/<name>.mp4 and .webm (chat, tarot, voice, when, language); `poster` shows before the first
 * frame, and reduced motion gets `still` instead of the video.
 */

import { useEffect, useRef, useState } from 'react';

export default function AppVideo({ name, poster, still, label }) {
  const ref = useRef(null);
  const [calm, setCalm] = useState(false);
  useEffect(() => {
    const c = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setCalm(c);
    const v = ref.current;
    if (!v || c) return undefined;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  if (calm) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={still || poster} alt={label} className="absolute inset-0 h-full w-full object-cover" />;
  }
  return (
    <video ref={ref} className="absolute inset-0 h-full w-full object-cover" poster={poster}
           muted loop playsInline autoPlay preload="metadata" aria-label={label}>
      <source src={`/app/screens/${name}.mp4`} type="video/mp4" />
      <source src={`/app/screens/${name}.webm`} type="video/webm" />
    </video>
  );
}
