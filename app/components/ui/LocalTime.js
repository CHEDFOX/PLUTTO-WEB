'use client';
/**
 * An instant, in UTC in the HTML as sent (what crawlers read) and in the reader's own time zone after
 * hydration.
 */
import { useEffect, useState } from 'react';

export default function LocalTime({ t, utc }) {
  const [local, setLocal] = useState(null);
  useEffect(() => {
    try {
      const d = new Date(t);
      setLocal(`${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}`);
    } catch { /* keep UTC */ }
  }, [t]);
  return <time dateTime={new Date(t).toISOString()}>{local ?? utc}</time>;
}
