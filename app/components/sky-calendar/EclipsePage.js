/**
 * /eclipses/<year>: the year's eclipses from app/lib/astro/skycal.js (Swiss Ephemeris data). Every time is printed
 * in UTC in the HTML; the reader's local time is filled in after hydration (ui/LocalTime).
 */
import { eclipses, signAt, degIn, sanskrit, utcDate, utcShort, utcTime } from '../../lib/astro/skycal';
import { Table } from './Table';
import { list } from './format';
import { When } from './When';
import { Shell } from './Shell';

const KIND = { total: 'Total', annular: 'Annular', hybrid: 'Hybrid', partial: 'Partial', penumbral: 'Penumbral' };
const coord = (lat, lon) => `${Math.abs(lat).toFixed(1)}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(lon).toFixed(1)}°${lon >= 0 ? 'E' : 'W'}`;

export function eclipseText(year) {
  const e = eclipses(year);
  const name = (x) => `${KIND[x.kind].toLowerCase()} ${x.body} eclipse on ${utcShort(x.t)}`;
  return { e, answer: `There are ${e.length} eclipses in ${year}: ${list(e.map(name))}. Solar eclipses fall at a new Moon and lunar eclipses at a full Moon, always near the lunar nodes — Rahu and Ketu in Vedic astrology.` };
}

export function EclipsePage({ year }) {
  const { e, answer } = eclipseText(year);
  const faqs = [
    { q: `How many eclipses are there in ${year}?`, a: `${e.length}: ${e.filter((x) => x.body === 'solar').length} solar and ${e.filter((x) => x.body === 'lunar').length} lunar.` },
    ...e.filter((x) => x.kind === 'total').map((x) => ({ q: `When is the total ${x.body} eclipse of ${year}?`, a: `${utcDate(x.t)}, greatest at ${utcTime(x.t)} UTC${x.body === 'solar' ? `, at ${coord(x.lat, x.lon)}` : ''}.` })),
    { q: 'What sign are the eclipses in?', a: list(e.map((x) => `${utcShort(x.t)}: ${signAt(x.trop)} (Western), ${signAt(x.sid)} (Vedic)`)) + '.' },
  ];
  return (
    <Shell kind="eclipses" year={year} title={`Eclipses ${year}: Solar and Lunar Eclipse Dates`} h1={`Eclipses in ${year}`} description="" answer={answer} faqs={faqs}>
      <Table head={['Eclipse', 'Greatest eclipse', 'Magnitude', 'Western sign', 'Vedic sign']}
        rows={e.map((x) => [<><span className="text-white">{KIND[x.kind]} {x.body}</span>{x.body === 'solar' && x.kind !== 'partial' ? <><br /><span className="text-[12px] text-white/45">greatest at {coord(x.lat, x.lon)}</span></> : null}</>, <When key="w" t={x.t} />, x.body === 'solar' ? x.magnitude : (x.kind === 'penumbral' ? x.penumbral : x.umbral), `${degIn(x.trop)} ${signAt(x.trop)}`, `${degIn(x.sid)} ${signAt(x.sid)} (${sanskrit(signAt(x.sid))})`])} />
      <p>Magnitude is the fraction of the Sun’s diameter covered (solar) or of the Moon’s diameter inside the Earth’s shadow — the umbra, or for a penumbral eclipse the penumbra (lunar). A lunar eclipse is visible wherever the Moon is above the horizon at the time; a solar eclipse only along its track.</p>
    </Shell>
  );
}
