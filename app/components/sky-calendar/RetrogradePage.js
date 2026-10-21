/**
 * /mercury-retrograde/<year>: Mercury's retrogrades in the year, then every planet's, from app/lib/astro/skycal.js
 * (Swiss Ephemeris data). Every time is printed in UTC in the HTML; the reader's local time is filled in after
 * hydration (ui/LocalTime).
 */
import { retrogrades, signAt, degIn, utcDate, utcShort } from '../../lib/astro/skycal';
import { Table } from './Table';
import { list, signLink } from './format';
import { When } from './When';
import { Shell } from './Shell';

export function retroText(year) {
  const r = retrogrades(year);
  const m = r.Mercury.filter((p) => new Date(p.from).getUTCFullYear() === year || new Date(p.to).getUTCFullYear() === year);
  const spans = m.map((p) => `${utcShort(p.from)} – ${utcShort(p.to)}`);
  return { r, m, answer: `Mercury is retrograde ${['no', 'once', 'twice', 'three times', 'four times'][m.length]} in ${year}: ${list(spans)} (UTC). Each retrograde lasts about three weeks, in ${list([...new Set(m.map((p) => signAt(p.startTrop)))])} in the Western zodiac.` };
}

export function RetrogradePage({ year }) {
  const { r, m, answer } = retroText(year);
  const faqs = [
    { q: `When is Mercury retrograde in ${year}?`, a: `${list(m.map((p) => `${utcDate(p.from)} to ${utcDate(p.to)}`))}, UTC.` },
    { q: 'How long does Mercury retrograde last?', a: `About three weeks: in ${year}, ${list(m.map((p) => `${p.days} days`))}.` },
    { q: `Which planets are retrograde in ${year}?`, a: `${list(Object.entries(r).filter(([, p]) => p.length).map(([k]) => k))}. The outer planets are retrograde for four to five months of every year.` },
    { q: 'Is a planet really moving backwards?', a: 'No. Retrograde is apparent motion: as Earth overtakes a planet (or an inner planet overtakes Earth), the planet appears from here to slide backwards against the stars for a while.' },
  ];
  return (
    <Shell kind="mercury-retrograde" year={year} title={`Mercury Retrograde ${year}: Exact Dates and Times`} h1={`Mercury retrograde ${year}`} description="" answer={answer} faqs={faqs}>
      <Table caption={`Mercury retrograde ${year}`} head={['Stations retrograde', 'Stations direct', 'Western sign', 'Vedic sign']}
        rows={m.map((p) => [<When key="a" t={p.from} />, <When key="b" t={p.to} />, <>{degIn(p.startTrop)} {signLink(signAt(p.startTrop))} → {degIn(p.endTrop)} {signAt(p.endTrop)}</>, <>{signAt(p.startSid)} → {signAt(p.endSid)}</>])} />
      <h2>Every planet’s retrogrades in {year}</h2>
      <Table head={['Planet', 'Retrograde', 'Direct', 'Days', 'Sign (Western / Vedic)']}
        rows={Object.entries(r).flatMap(([planet, ps]) => ps.map((p) => [planet, <When key="a" t={p.from} />, <When key="b" t={p.to} />, p.days, `${signAt(p.startTrop)} / ${signAt(p.startSid)}`]))} />
    </Shell>
  );
}
