import Link from 'next/link';
import { LINK } from '../doc/classes';
import { CAL_YEARS } from '../../lib/astro/skycal';

export function YearNav({ base, year }) {
  return (
    <nav aria-label="Other years" className="mt-12 flex flex-wrap gap-5 text-[15px]">
      {CAL_YEARS.map((y) => (y === year ? <span key={y} className="text-white">{y}</span> : <Link key={y} href={`${base}/${y}`} className={LINK}>{y}</Link>))}
    </nav>
  );
}
