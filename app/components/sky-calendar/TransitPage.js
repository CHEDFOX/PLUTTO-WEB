import { ingresses, signAtStart, opposite, sanskrit, utcDate, utcShort, utcTime, istWhen } from '../../lib/astro/skycal';
import { Table } from './Table';
import { signLink, list } from './format';
import { When } from './When';
import { Shell } from './Shell';

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
