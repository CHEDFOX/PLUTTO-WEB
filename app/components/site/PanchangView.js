/**
 * ONE DAY'S PANCHANG, DRAWN — used by the server page (today, New Delhi) and
 * the browser widget (any place, any date). No hooks, so it renders on both.
 * Times are the place's local clock, cut to the minute as panchangs print them.
 */
import Link from 'next/link';

const A = 'text-white underline decoration-white/30 underline-offset-4 hover:decoration-white';

export const clock = (t, zone, withDay) =>
  new Date(Math.floor(t / 60000) * 60000).toLocaleString('en-GB', { timeZone: zone, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', ...(withDay ? { day: 'numeric', month: 'short' } : {}) });

export default function PanchangView({ p }) {
  const z = p.place.zone;
  const sameDay = (t) => new Date(t).toLocaleDateString('en-GB', { timeZone: z }) === new Date(p.sunrise).toLocaleDateString('en-GB', { timeZone: z });
  const at = (t) => clock(t, z, !sameDay(t));
  const seq = (xs, render = (x) => x.name) => xs.map((x, i) => (
    <span key={i}>{i ? ' → ' : ''}<span className="text-white">{render(x)}</span> <span className="text-white/45">until {at(x.ends)}</span></span>
  ));
  const rows = [
    ['Tithi', <>{seq(p.tithi)}<br /><span className="text-white/45">{p.paksha}</span></>],
    ['Nakshatra', seq(p.nakshatra, (x) => <Link href={`/nakshatras/${x.name.slug}`} className={A}>{x.name.name}</Link>)],
    ['Yoga', seq(p.yoga)],
    ['Karana', seq(p.karana)],
    ['Vara', p.vara],
    ['Sunrise · sunset', `${clock(p.sunrise, z)} · ${clock(p.sunset, z)}`],
    ['Rahu Kaal', `${clock(p.rahuKaal.from, z)} – ${clock(p.rahuKaal.to, z)}`],
    ['Moon sign · Sun sign', `${p.moonSign} · ${p.sunSign} (sidereal, at sunrise)`],
  ];
  return (
    <table className="w-full max-w-2xl border-y border-white/[0.07] text-left text-[15px]">
      <tbody className="divide-y divide-white/[0.06]">
        {rows.map(([k, v]) => (
          <tr key={k}>
            <th scope="row" className="w-1/3 py-3 pr-4 align-top font-normal text-white/45">{k}</th>
            <td className="py-3 leading-[1.6] text-white/85">{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
