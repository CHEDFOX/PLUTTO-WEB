'use client';

import { useEffect, useState } from 'react';
import CustomCursor from './CustomCursor';
import PageLoader from './PageLoader';
import BinaryHover from './BinaryHover';
import FloatingLogo from './FloatingLogo';
import { unlockAudio } from '../lib/sfx';

const LOGO_SIZE = 72;

export default function SiteChrome() {
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const compute = () => {
      setAnchor({
        x: window.innerWidth - LOGO_SIZE,
        y: window.innerHeight - LOGO_SIZE,
      });
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  useEffect(() => {
    unlockAudio();
  }, []);

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <CustomCursor />
      <PageLoader />
      <BinaryHover />
      <FloatingLogo active anchor={anchor} size={LOGO_SIZE} />
    </>
  );
}
