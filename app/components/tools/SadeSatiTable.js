import Link from 'next/link';
import { sadeSati, GENERATED } from '../../lib/astro/sadesati';
import { SIGNS } from '../../lib/content/reference';
import { LINK } from '../doc/classes';
import { TH, TD } from './tableClasses';

const day = (t) => new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export function SadeSatiTable() {
  const from = Date.UTC(2000, 0, 1), to = Date.UTC(2050, 0, 1);
  return (
    <section className="mt-14">
      <h2>Sade Sati for every Moon sign, 2000–2050</h2>
      <p>Computed from Saturn’s sidereal (Lahiri) ingresses with {GENERATED}. Each period runs from Saturn’s first entry into the 12th sign from the Moon to its final exit from the 2nd, retrograde returns included.</p>
      <div className="mt-6 max-w-2xl overflow-x-auto">
        <table className="w-full text-left text-[14px] tabular-nums">
          <thead><tr><th scope="col" className={TH}>Moon sign</th><th scope="col" className={TH}>Sade Sati periods</th></tr></thead>
          <tbody className="divide-y divide-white/[0.06]">
            {SIGNS.map((s, r) => (
              <tr key={s.name}>
                <th scope="row" className={`${TD} align-top font-normal`}><Link href={`/zodiac-signs/${s.slug}`} className={LINK}>{s.name}</Link><br /><span className="text-white/45">{s.sanskrit}</span></th>
                <td className={TD}>{sadeSati(r).filter((p) => p.to > from && p.from < to).map((p) => <div key={p.from}>{day(p.from)} – {day(p.to)}</div>)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
