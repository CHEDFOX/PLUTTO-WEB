/**
 * /panchang — today's panchang, rendered on the server for New Delhi and
 * regenerated every hour (ISR), so the HTML a crawler reads is always today's;
 * below it, any place and any date in the browser. Verified against Swiss
 * Ephemeris: 300 random city-days, every limb the same at sunrise, end times
 * within 7 seconds.
 */
import Link from 'next/link';
import * as sky from '../../lib/sky';
import { panchang, CITIES } from '../../lib/panchang';
import { pageMeta, breadcrumbLd, faqLd, JsonLd, abs } from '../../lib/seo';
import { cardPath } from '../../lib/cards';
import { Doc, DocDoor, LINK, MONO } from '../../components/site/Doc';
import PanchangView, { clock } from '../../components/site/PanchangView';
import PanchangWidget from '../../components/site/PanchangWidget';

export const revalidate = 3600;

export const metadata = pageMeta({
  title: 'Today’s Panchang: Tithi, Nakshatra, Yoga, Rahu Kaal',
  description: 'Today’s Hindu panchang — tithi, nakshatra, yoga, karana and vara with their end times, sunrise, sunset and Rahu Kaal — for New Delhi or your own city, updated hourly.',
  path: '/panchang',
  image: cardPath('panchang'),
});

const FAQS = [
  { q: 'What are the five limbs of the panchang?', a: 'Tithi (the lunar day, each 12° of the Moon’s lead over the Sun), vara (the weekday, counted from sunrise), nakshatra (the Moon’s lunar mansion), yoga (from the sum of the Sun’s and Moon’s longitudes) and karana (half a tithi).' },
  { q: 'Why does the panchang depend on the city?', a: 'The tithi, nakshatra, yoga and karana change at the same instant everywhere, but the day is read from local sunrise, so which ones “belong” to a day — and the vara, sunrise, sunset and Rahu Kaal — depend on the place.' },
  { q: 'How is Rahu Kaal calculated?', a: 'The daytime from sunrise to sunset is divided into eight equal parts. Rahu Kaal is the 8th part on Sunday, the 2nd on Monday, the 7th on Tuesday, the 5th on Wednesday, the 6th on Thursday, the 4th on Friday and the 3rd on Saturday.' },
  { q: 'How accurate is this panchang?', a: 'The positions are computed with the same methods as the Plutto app and were checked against Swiss Ephemeris on 300 random days in five cities: every tithi, nakshatra, yoga and karana matched at sunrise, and end times agreed within seven seconds. Sunrise uses the upper limb of the Sun with standard refraction.' },
];

export default function Page() {
  const place = CITIES[0];
  const [y, m, d] = new Date().toLocaleDateString('en-CA', { timeZone: place.zone }).split('-').map(Number);
  const p = panchang(sky, y, m, d, place);
  const date = new Date(p.sunrise).toLocaleDateString('en-GB', { timeZone: place.zone, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const t0 = p.tithi[0], n0 = p.nakshatra[0];
  const answer = `Today, ${date}, in New Delhi: ${t0.name} tithi (${p.paksha.split(' (')[0]}) until ${clock(t0.ends, place.zone, true)}; the Moon is in ${n0.name.name} nakshatra until ${clock(n0.ends, place.zone, true)}; yoga ${p.yoga[0].name}; karana ${p.karana[0].name}. Sunrise ${clock(p.sunrise, place.zone)}, sunset ${clock(p.sunset, place.zone)}, Rahu Kaal ${clock(p.rahuKaal.from, place.zone)}–${clock(p.rahuKaal.to, place.zone)} (IST).`;
  const page = { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Today’s Panchang', url: abs('/panchang'), dateModified: new Date().toISOString(), speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.speakable'] }, inLanguage: 'en' };
  return (
    <>
      <JsonLd data={page} />
      <JsonLd data={faqLd(FAQS)} />
      <JsonLd data={breadcrumbLd([{ name: 'Panchang', path: '/panchang' }])} />
      <Doc eyebrow={`Panchang · ${date}`} title="Today’s panchang" crumbs={[{ name: 'Panchang', path: '/panchang' }]}>
        <p className="speakable !mt-0 max-w-2xl text-[19px] leading-[1.65] text-white/85">{answer}</p>
        <h2>New Delhi, today</h2>
        <div className="mt-6"><PanchangView p={p} /></div>
        <h2>Your city, any date</h2>
        <div className="mt-6"><PanchangWidget /></div>
        <h2>Questions</h2>
        {FAQS.map((f) => <div key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>)}
        <p className="!mt-10"><span className={MONO}>In Plutto</span><br />The panchang is the same for everyone in a city; what it means for you depends on your own chart — <Link href="/tools/moon-sign-nakshatra" className={LINK}>your Moon’s nakshatra</Link> first of all.</p>
        <DocDoor links={[{ href: '/sky-calendar', label: 'Sky calendar' }, { href: '/tools', label: 'Free calculators' }]} />
      </Doc>
    </>
  );
}
