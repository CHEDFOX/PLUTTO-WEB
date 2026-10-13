'use client';

/**
 * "Cookie choices" — reopens the consent bar of the Meta pixel (app/api/meta/pixel),
 * so a yes can become a no. Shown only when the pixel is on.
 */
import { useEffect, useState } from 'react';

export default function CookieChoices({ className = '' }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const check = () => setOn(!!window.plutto_meta?.enabled);
    check();
    const t = setTimeout(check, 1500);   // the loader arrives after hydration
    return () => clearTimeout(t);
  }, []);
  if (!on) return null;
  return (
    <button type="button" onClick={() => window.plutto_meta?.open()} className={className}>
      Cookie choices
    </button>
  );
}
