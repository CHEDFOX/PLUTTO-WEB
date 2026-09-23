'use client';

/**
 * SITE CHROME — what sits over every marketing page.
 *
 * Deliberately almost nothing. The custom cursor, the per-word glitch on hover
 * (BinaryHover) and the full-screen page loader were removed: each was a
 * signature, and together they made the site read as a portfolio piece rather
 * than a product. A product page keeps the reader's own cursor, lets text be
 * text, and shows the page as soon as it has one. The components stay in the
 * tree, unrendered.
 */

import { useEffect } from 'react';
import { unlockAudio } from '../lib/sfx';

export default function SiteChrome() {
  useEffect(() => {
    unlockAudio();
  }, []);

  return <div className="grain-overlay" aria-hidden="true" />;
}
