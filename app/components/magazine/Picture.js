'use client';

/**
 * A picture loaded from Wikimedia Commons itself (where its licence and history live, and where its credit links).
 * If Commons is slow or refuses, the reader gets the fallback (the story's title plate) instead of a broken image.
 */
import { useEffect, useRef, useState } from 'react';

export default function Picture({ src, alt, className = '', fallback = null, eager = false }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef(null);
  // An image that failed before the page hydrated never fires onError here.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);
  if (failed) return fallback;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
