// Where consent is asked before measuring: the EU, the rest of the EEA, the UK and Switzerland. One list for the
// Meta pixel's consent bar (app/api/meta/pixel, which META_CONSENT_COUNTRIES may replace) and Google Tag Manager's
// consent defaults (app/lib/analytics/gtm.js).
export const ASK_FIRST_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV',
  'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH',
];

// localStorage key shared by the Meta consent bar and GTM: "granted", "denied", or absent.
export const CONSENT_KEY = 'plutto_ads';
