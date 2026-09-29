/**
 * THE SKY-CALENDAR PAGES — retrogrades, eclipses, transits for one year, from
 * Swiss Ephemeris (lib/skycal.js). Answer first, then the tables; every time
 * in UTC as sent, with the reader's local time filled in by LocalTime.
 */
import Link from 'next/link';
import { Doc, DocDoor, LINK, MONO } from './Doc';
import LocalTime from './LocalTime';
import { JsonLd, articleLd, faqLd, breadcrumbLd, pageMeta } from '../../lib/seo';
import { UPDATED } from '../../lib/guides';
import { cardPath } from '../../lib/cards';
import { SOURCE, CAL_YEARS, retrogrades, eclipses, ingresses, signAtStart, opposite, signAt, degIn, sanskrit, utcDate, utcShort, utcTime, istWhen } from '../../lib/skycal';

const TH = 'py-2 pr-4 text-left font-normal text-white/45';
const TD = 'py-2.5 pr-4 align-top text-white/85';
const sl = (s) => s.toLowerCase();
const signLink = (s) => <Link href={`/zodiac-signs/${sl(s)}`} className={LINK}>{s}</Link>;
const When = ({ t }) => (<><span className="tabular-nums">{utcShort(t)}, {utcTime(t)} UTC</span><br /><span className="text-[12px] text-white/45">your time: <LocalTime t={t} utc="—" /></span></>);
const list = (xs) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

function Table({ caption, head, rows }) {
  return (
    <div className="mt-6 max-w-full overflow-x-auto">
      <table className="w-full text-left text-[14px]">
        {caption ? <caption className="pb-3 text-left text-[17px] font-semibold text-white">{caption}</caption> : null}
        <thead><tr>{head.map((h) => <th key={h} scope="col" className={TH}>{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-white/[0.06]">{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={TD}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function YearNav({ base, year }) {
  return (
    <nav aria-label="Other years" className="mt-12 flex flex-wrap gap-5 text-[15px]">
      {CAL_YEARS.map((y) => (y === year ? <span key={y} className="text-white">{y}</span> : <Link key={y} href={`${base}/${y}`} className={LINK}>{y}</Link>))}
    </nav>
  );
}

function Shell({ kind, year, title, h1, description, answer, faqs, children }) {
  const path = `/${kind}/${year}`;
  const label = { 'mercury-retrograde': 'Retrogrades', eclipses: 'Eclipses', transits: 'Transits' }[kind];
  return (
    <>
      <JsonLd data={articleLd({ title, description, path, updated: UPDATED, image: cardPath(kind, String(year)) })} />
      <JsonLd data={faqLd(faqs)} />
      <JsonLd data={breadcrumbLd([{ name: 'Sky calendar', path: '/sky-calendar' }, { name: `${label} ${year}`, path }])} />
      <Doc eyebrow={`Sky calendar · ${year}`} title={h1} crumbs={[{ name: 'Sky calendar', path: '/sky-calendar' }, { name: `${label} ${year}`, path }]}>
        <p className="speakable !mt-0 max-w-2xl text-[19px] leading-[1.65] text-white/85">{answer}</p>
        {children}
        <h2>Questions</h2>
        {faqs.map((f) => <div key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}
        <p className="!mt-10 text-[13px] text-white/40">Computed with {SOURCE}, the engine the Plutto app uses; times to the minute. Sidereal positions use the Lahiri ayanamsa.</p>
        <YearNav base={`/${kind}`} year={year} />
        <p className="!mt-10"><span className={MONO}>In Plutto</span><br />What a transit means depends on where it falls in your own chart — Plutto reads it against your birth chart, out loud.</p>
        <DocDoor links={[{ href: '/sky-calendar', label: 'Sky calendar' }, { href: '/tools/moon-sign-nakshatra', label: 'Your Moon sign' }]} />
      </Doc>
    </>
  );
}

export const skyMeta = (kind, year, title, description) => pageMeta({ title, description, path: `/${kind}/${year}`, type: 'article', image: cardPath(kind, String(year)) });

// ── Retrogrades ───────────────────────────────────────────────────────────
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

// ── Eclipses ──────────────────────────────────────────────────────────────
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

// ── Transits ──────────────────────────────────────────────────────────────
const VEDIC = ['Saturn', 'Jupiter', 'Rahu', 'Mars', 'Venus', 'Mercury'];
const WESTERN = ['Pluto', 'Neptune', 'Uranus', 'Saturn', 'Jupiter', 'Mars'];

export function transitText(year) {
  const sat = ingresses(year, 'sidereal', 'Saturn'), jup = ingresses(year, 'sidereal', 'Jupiter'), rahu = ingresses(year, 'sidereal', 'Rahu');
  const bits = [];
  bits.push(sat.length ? `Saturn ${sat.map((x) => `${x.retro ? 'returns to' : 'enters'} ${x.sign} on ${utcShort(x.t)}`).join(', then ')}` : `Saturn stays in ${signAtStart(year, 'sidereal', 'Saturn')} all year`);
  bits.push(jup.length ? `Jupiter ${jup.map((x) => `${x.retro ? 'returns to' : 'enters'} ${x.sign} on ${utcShort(x.t)}`).join(', then ')}` : `Jupiter stays in ${signAtStart(year, 'sidereal', 'Jupiter')}`);
  bits.push(rahu.length ? `Rahu moves into ${rahu[0].sign} and Ketu into ${opposite(rahu[0].sign)} on ${utcShort(rahu[0].t)} (true node)` : `Rahu stays in ${signAtStart(year, 'sidereal', 'Rahu')} and Ketu in ${opposite(signAtStart(year, 'sidereal', 'Rahu'))}`);
  return { sat, jup, rahu, answer: `In Vedic (sidereal) astrology in ${year}: ${bits.join('; ')}. Dates are for the sidereal zodiac with the Lahiri ayanamsa; Western (tropical) dates are further down.` };
}

export function TransitPage({ year }) {
  const { rahu, answer } = transitText(year);
  const mean = ingresses(year, 'sidereal', 'RahuMean');
  const row = (x) => [<When key="w" t={x.t} />, <>{signLink(x.sign)} <span className="text-white/45">({sanskrit(x.sign)})</span>{x.retro ? <span className="text-white/45"> · retrograde</span> : null}</>];
  const faqs = [
    { q: `Saturn transit ${year}: when does Saturn change sign?`, a: ingresses(year, 'sidereal', 'Saturn').length ? list(ingresses(year, 'sidereal', 'Saturn').map((x) => `${utcDate(x.t)} into ${x.sign} (${sanskrit(x.sign)})`)) + ', sidereal.' : `Saturn does not change sidereal sign in ${year}; it stays in ${signAtStart(year, 'sidereal', 'Saturn')}.` },
    { q: `Jupiter transit ${year}: when does Jupiter change sign?`, a: ingresses(year, 'sidereal', 'Jupiter').length ? list(ingresses(year, 'sidereal', 'Jupiter').map((x) => `${utcDate(x.t)} into ${x.sign} (${sanskrit(x.sign)})`)) + ', sidereal.' : `Jupiter does not change sidereal sign in ${year}.` },
    { q: `When is the Rahu–Ketu transit in ${year}?`, a: rahu.length ? `By the true node (as Plutto computes): ${utcDate(rahu[0].t)}. By the mean node, which most printed panchangs use: ${mean.length ? utcDate(mean[0].t) : `not in ${year}`}. Rahu moves backwards through the zodiac, so it enters ${rahu[0].sign} from ${rahu[0].from}.` : `Rahu does not change sign in ${year} by the true node${mean.length ? `; by the mean node it enters ${mean[0].sign} on ${utcDate(mean[0].t)}` : ''}.` },
    { q: 'Why do Vedic and Western transit dates differ?', a: 'The sidereal zodiac of Vedic astrology is about 24° behind the tropical zodiac of Western astrology, so a planet changes Vedic sign weeks, months or — for Saturn — about two years after the Western sign of the same name.' },
  ];
  return (
    <Shell kind="transits" year={year} title={`Planetary Transits ${year}: Saturn, Jupiter, Rahu–Ketu Dates`} h1={`Planetary transits ${year}`} description="" answer={answer} faqs={faqs}>
      <h2>Vedic (sidereal) transits</h2>
      {VEDIC.map((p) => {
        const xs = ingresses(year, 'sidereal', p);
        return (
          <div key={p}>
            <h3>{p === 'Rahu' ? 'Rahu and Ketu' : p}</h3>
            {xs.length ? <Table head={['Date', p === 'Rahu' ? 'Rahu enters (Ketu enters the opposite sign)' : 'Enters']} rows={xs.map(row)} /> : <p>In {signAtStart(year, 'sidereal', p)} all year{p === 'Rahu' ? ` (Ketu in ${opposite(signAtStart(year, 'sidereal', p))})` : ''}.</p>}
            {p === 'Rahu' ? <p>Rahu here is the true node, as the Plutto app computes it. Most printed panchangs use the mean node{mean.length ? <>, which enters {mean[0].sign} on {utcDate(mean[0].t)}</> : null} — the two can differ by a few weeks.</p> : null}
          </div>
        );
      })}
      <h3>Sankranti {year} — the Sun’s sidereal sign changes</h3>
      <Table head={['Sankranti', 'UTC', 'India (IST)']} rows={ingresses(year, 'sidereal', 'Sun').map((x) => [`${sanskrit(x.sign)} Sankranti (Sun into ${x.sign})`, `${utcShort(x.t)}, ${utcTime(x.t)}`, istWhen(x.t)])} />
      <h2>Western (tropical) ingresses</h2>
      {WESTERN.map((p) => {
        const xs = ingresses(year, 'tropical', p);
        return <div key={p}><h3>{p}</h3>{xs.length ? <Table head={['Date', 'Enters']} rows={xs.map(row)} /> : <p>In {signAtStart(year, 'tropical', p)} all year.</p>}</div>;
      })}
      <h3>Equinoxes, solstices and the Sun’s signs</h3>
      <Table head={['Date', 'Sun enters']} rows={ingresses(year, 'tropical', 'Sun').map(row)} />
    </Shell>
  );
}

// ── The hub ───────────────────────────────────────────────────────────────
export function SkyHub() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: 'Sky calendar', path: '/sky-calendar' }])} />
      <Doc eyebrow="Sky calendar" title="Retrogrades, eclipses and transits" crumbs={[{ name: 'Sky calendar', path: '/sky-calendar' }]}
        lead={`Every date on these pages is computed with ${SOURCE} — the engine the Plutto app uses — to the minute, in both the Western and the Vedic zodiac.`}>
        <ul className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {CAL_YEARS.map((y) => (
            <li key={y} className="py-5 text-[16px]">
              <span className="mr-4 font-semibold text-white">{y}</span>
              <Link href={`/mercury-retrograde/${y}`} className={LINK}>Mercury retrograde</Link> · <Link href={`/eclipses/${y}`} className={LINK}>Eclipses</Link> · <Link href={`/transits/${y}`} className={LINK}>Transits (Saturn, Jupiter, Rahu–Ketu)</Link>
            </li>
          ))}
        </ul>
        <p className="!mt-8"><Link href="/panchang" className={LINK}>Today’s panchang</Link> · <Link href="/tools/sade-sati" className={LINK}>Sade Sati calculator</Link></p>
        <DocDoor links={[{ href: '/tools', label: 'Free calculators' }, { href: '/guides', label: 'Guides' }]} />
      </Doc>
    </>
  );
}
