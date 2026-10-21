'use client';

/**
 * App Store and Google Play badges (flags in app/lib/appStore). Play is live: a link, except on an iPhone.
 * The App Store badge is blurred and not a link until IOS_LIVE; on an iPhone or iPad with IOS_WEB_APP it
 * becomes the Home Screen badge, linking to /app?install=1.
 */

import usePlatform from './usePlatform';
import { ANDROID_LIVE, IOS_LIVE, IOS_WEB_APP, PLAY_URL, WEB_APP_INSTALL, storeUrl } from '../../lib/appStore';
import { Badge } from './Badge';
import { AppleGlyph } from './AppleGlyph';
import { PlayGlyph } from './PlayGlyph';

export default function StoreBadges({ className = '' }) {
  const platform = usePlatform();
  const play = ANDROID_LIVE && platform !== 'ios' ? PLAY_URL : null;
  const webApp = IOS_WEB_APP && platform === 'ios';
  const apple = IOS_LIVE ? storeUrl('ios') : null;
  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 font-ui ${className}`}>
      {webApp
        ? <Badge href={WEB_APP_INSTALL} internal mark={<AppleGlyph />} small="Add Plutto to your" big="Home Screen" label="Add Plutto to your Home Screen" />
        : <Badge href={apple} soft={!IOS_LIVE} mark={<AppleGlyph />} small={IOS_LIVE ? 'Download on the' : 'Coming soon to the'} big="App Store" label="Plutto on the App Store" />}
      <Badge href={play} mark={<PlayGlyph />} small={ANDROID_LIVE ? 'Get it on' : 'Coming soon to'} big="Google Play" label="Plutto on Google Play" />
    </div>
  );
}
