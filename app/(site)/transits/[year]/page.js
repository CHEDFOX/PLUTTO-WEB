import { notFound } from 'next/navigation';
import { TransitPage, skyMeta } from '../../../components/site/Sky';
import { CAL_YEARS } from '../../../lib/skycal';

export const dynamicParams = false;
export function generateStaticParams() { return CAL_YEARS.map((y) => ({ year: String(y) })); }

export async function generateMetadata({ params }) {
  const year = +(await params).year;
  return skyMeta('transits', year, `Planetary Transits ${year}: Saturn, Jupiter, Rahu–Ketu Dates`,
    `${year} transit dates for Saturn, Jupiter and Rahu–Ketu in Vedic astrology, every Sankranti, and the Western ingresses — to the minute, from Swiss Ephemeris.`);
}

export default async function Page({ params }) {
  const year = +(await params).year;
  if (!CAL_YEARS.includes(year)) notFound();
  return <TransitPage year={year} />;
}
