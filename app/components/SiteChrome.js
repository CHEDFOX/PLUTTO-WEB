'use client';

/**
 * SITE CHROME — the things that sit over every marketing page.
 *
 * The drifting logo mark was removed: it wandered across the viewport and
 * parked itself on top of whatever was being read, which on a page built out
 * of headlines is a mark over a headline a good part of the time. The wordmark
 * in the nav is the same identity, held still. `FloatingLogo.js` and the
 * `LogoMark.js` it draws are left in the tree, unrendered, so bringing the
 * piece back somewhere it does not cover text is one import.
 */

import { useEffect } from 'react';
import CustomCursor from './CustomCursor';
import PageLoader from './PageLoader';
import BinaryHover from './BinaryHover';
import { unlockAudio } from '../lib/sfx';

export default function SiteChrome() {
  useEffect(() => {
    unlockAudio();
  }, []);

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <CustomCursor />
      <PageLoader />
      <BinaryHover />
    </>
  );
}
