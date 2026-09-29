import { notFound } from 'next/navigation';
import { EclipsePage, eclipseText, skyMeta } from '../../../components/site/Sky';
import { CAL_YEARS, utcShort } from '../../../lib/skycal';

export const dynamicParams = false;
export function generateStaticParams() { return CAL_YEARS.map((y) => ({ year: String(y) })); }

export async function generateMetadata({ params }) {
  const year = +(await params).year;
  const { e } = eclipseText(year);
  return skyMeta('eclipses', year, `Eclipses ${year}: Solar and Lunar Eclipse Dates`,
    `All ${e.length} eclipses of ${year} — ${e.map((x) => `${x.kind} ${x.body} ${utcShort(x.t)}`).join(', ')} — with exact times, magnitude and zodiac sign.`);
}

export default async function Page({ params }) {
  const year = +(await params).year;
  if (!CAL_YEARS.includes(year)) notFound();
  return <EclipsePage year={year} />;
}
