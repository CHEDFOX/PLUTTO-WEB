'use client';

import { useEffect, useState } from 'react';
import { detectPlatform } from './appStore';

/** 'desktop' on the server and first paint, then the device's real platform. */
export default function usePlatform() {
  const [platform, setPlatform] = useState('desktop');
  useEffect(() => { setPlatform(detectPlatform()); }, []);
  return platform;
}
