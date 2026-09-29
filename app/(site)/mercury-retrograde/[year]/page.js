import { notFound } from 'next/navigation';
import { RetrogradePage, retroText, skyMeta } from '../../../components/site/Sky';
import { CAL_YEARS, utcShort } from '../../../lib/skycal';

export const dynamicParams = false;
export function generateStaticParams() { return CAL_YEARS.map((y) => ({ year: String(y) })); }

export async function generateMetadata({ params }) {
  const year = +(await params).year;
  const { m } = retroText(year);
  return skyMeta('mercury-retrograde', year, `Mercury Retrograde ${year}: Exact Dates and Times`,
    `Mercury retrograde ${year}: ${m.map((p) => `${utcShort(p.from)}–${utcShort(p.to)}`).join(', ')}. Exact station times, the signs in both zodiacs, and every planet’s ${year} retrogrades.`);
}

export default async function Page({ params }) {
  const year = +(await params).year;
  if (!CAL_YEARS.includes(year)) notFound();
  return <RetrogradePage year={year} />;
}
