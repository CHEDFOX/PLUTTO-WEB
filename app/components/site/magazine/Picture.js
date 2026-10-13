'use client';

/**
 * A picture from Wikimedia Commons, with a way out. The files are loaded from
 * Commons itself (that is where their licences and histories live, and where
 * each credit links); if Commons is slow or refuses, the reader gets the
 * article's drawn plate or a plain caption plate instead of a broken image.
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
