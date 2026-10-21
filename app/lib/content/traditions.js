/**
 * THE SHELVES — the whole library, and the colour each part of it is filed in.
 *
 * A STATIC EXCERPT of the live library (`/api/public/library-map`), copied out
 * of the backend so the marketing pages can name a hundred and two real
 * traditions without a request. The `shelf` is the backend's own grouping (the
 * twelve REGIONS in library_map.py) — not a category invented for the website.
 *
 * THE COLOUR IS INFORMATION. Twelve shelves, twelve hues, evenly spaced around
 * the wheel and ordered as the library is: South Asia through to the body. A
 * spine's colour tells you which shelf it stands on, so the wall of them reads
 * as an organised collection rather than as decoration. Gold is NOT in this
 * palette — it stays the brand's own accent, spent on one thing at a time.
 *
 * The names are the traditions' own: `Merindinlogun` is not "African
 * astrology", and printing all of them is the point — none is a footnote.
 */

/** The twelve shelves, in the order the library keeps them. */
export const SHELVES = [
  { id: 'south_asia', name: 'South Asia',    color: '#E9A13B' },
  { id: 'himalaya',   name: 'Himalaya',      color: '#E0C24A' },
  { id: 'china',      name: 'China',         color: '#DC4B3E' },
  { id: 'east_asia',  name: 'East Asia',     color: '#D9497A' },
  { id: 'pacific',    name: 'Pacific',       color: '#C059C6' },
  { id: 'persia',     name: 'Persia & Araby', color: '#9061E0' },
  { id: 'letters',    name: 'Letters',       color: '#5B77E8' },
  { id: 'sky',        name: 'The Sky',       color: '#3FA3DD' },
  { id: 'folk',       name: 'Folk Europe',   color: '#27AFA6' },
  { id: 'americas',   name: 'The Americas',  color: '#2FB884' },
  { id: 'africa',     name: 'Africa',        color: '#77B93F' },
  { id: 'body',       name: 'The Body',      color: '#C3C43C' },
];

export const SHELF_COLOR = Object.fromEntries(SHELVES.map((s) => [s.id, s.color]));
