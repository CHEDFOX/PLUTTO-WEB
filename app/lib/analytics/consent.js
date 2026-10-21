// WHERE THE LAW ASKS FIRST — the EU, the rest of the EEA, the UK and Switzerland.
// One list for every measurement on the site: the Meta pixel's consent bar
// (app/api/meta/pixel, which META_CONSENT_COUNTRIES may replace) and Google Tag
// Manager's consent defaults (app/lib/gtm.js).
export const ASK_FIRST_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV',
  'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH',
];

// The visitor's answer, kept by the consent bar: "granted", "denied", or absent.
export const CONSENT_KEY = 'plutto_ads';
