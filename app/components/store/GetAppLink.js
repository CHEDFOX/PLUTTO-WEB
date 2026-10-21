'use client';

/**
 * "Get the app" link, by device (app/lib/appStore): Android goes to the Play listing; iPhone and iPad to
 * /app?install=1 while IOS_WEB_APP, else the App Store once IOS_LIVE, else the download band; desktop to the
 * download band. The in-page link renders first, so the server and first paint match.
 */

import usePlatform from './usePlatform';
import { getAppHref } from '../../lib/appStore';

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
