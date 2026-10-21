'use client';

import { useEffect, useState } from 'react';
import { zones, localZone } from '../../lib/astro/zone';

/** The zone list and the visitor's own zone, read after mount. */
export function useZones() {
  const [list, setList] = useState(['UTC']);
  const [local, setLocal] = useState('UTC');
  useEffect(() => { setList(zones()); setLocal(localZone()); }, []);
  return { list, local };
}
