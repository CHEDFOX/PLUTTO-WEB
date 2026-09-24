'use client';

/**
 * "GET THE APP" — one link, the right destination per device.
 *
 * Android → the Play listing, directly. iPhone → the App Store the day it is
 * live (IOS_LIVE), until then the download band. Desktop → the download band.
 * Renders as a plain in-page link first, so the server and first paint match,
 * then switches to the store once the device is known.
 */

import usePlatform from '../lib/usePlatform';
import { getAppHref } from '../lib/appStore';

export default function GetAppLink({ className = '', children, onClick }) {
  const platform = usePlatform();
  const href = getAppHref(platform);
  const external = href.startsWith('http');
  return (
    <a href={href} className={className} onClick={onClick}
       target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
      {children}
    </a>
  );
}
