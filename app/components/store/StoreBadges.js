'use client';

/**
 * STORE BADGES — shaped like the platforms' own, and honest about the date.
 *
 * Black, rounded, the platform mark on the left and two lines of text: the
 * shape a visitor recognises as "an app store link" before reading it.
 *
 *   Google Play  live. A link to the listing — except on an iPhone, where it is
 *                shown but not a link (nothing to install there).
 *   App Store    in review. Softly blurred and not a link, with "Coming soon".
 *                IOS_LIVE in lib/appStore.js sharpens it and makes it a link.
 *                On an iPhone or iPad (IOS_WEB_APP) it is the way in instead:
 *                "Add to your Home Screen", to the web app's install steps.
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
