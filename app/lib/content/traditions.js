/**
 * The library's shelves and their colours, a static excerpt of the backend's /api/public/library-map so the marketing
 * pages need no request; `shelf` is the backend's grouping (the regions in library_map.py). Twelve evenly spaced hues,
 * in library order, mark which shelf a spine stands on; gold stays out of them. Names are the traditions' own.
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
