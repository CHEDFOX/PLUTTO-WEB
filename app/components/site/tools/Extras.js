/**
 * THE REFERENCE BESIDE THE CALCULATORS — server HTML, so a reader or crawler
 * sees every table a result comes from, and can check a score by hand.
 */
import Link from 'next/link';
import { VASHYA, VASHYA_TABLE, YONIS, YONI_TABLE, varnaOf, vashyaOf, signLord } from '../../../lib/guna';
import { sadeSati, GENERATED } from '../../../lib/sadesati';
import { NAKSHATRAS, SIGNS, GRAHAS } from '../../../lib/reference';
import { LINK } from '../Doc';

const TH = 'py-2 pr-3 text-left font-normal text-white/45';
const TD = 'py-2 pr-3 text-white/85';

function Grid({ caption, cols, rows, corner = '' }) {
  return (
    <div className="mt-6 max-w-full overflow-x-auto">
      <table className="text-[13px] tabular-nums">
        <caption className="pb-3 text-left text-[16px] font-semibold text-white">{caption}</caption>
        <thead><tr><th scope="col" className={TH}>{corner}</th>{cols.map((c) => <th key={c} scope="col" className={TH}>{c}</th>)}</tr></thead>
        <tbody className="divide-y divide-white/[0.06]">
          {rows.map(([h, cells]) => <tr key={h}><th scope="row" className={TH}>{h}</th>{cells.map((c, i) => <td key={i} className={TD}>{c}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}

const PLANETS7 = GRAHAS.filter((g) => g.friends).map((g) => g.key);
const view = (a, b) => { const g = GRAHAS.find((x) => x.key === a); return a === b || g.friends.includes(b) ? 'F' : g.enemies.includes(b) ? 'E' : 'N'; };
const MAITRI = { FF: 5, FN: 4, NF: 4, NN: 3, FE: 1, EF: 1, NE: 0.5, EN: 0.5, EE: 0 };

export function GunaTables() {
  return (
    <section className="mt-14">
      <h2>The tables this calculator uses</h2>
      <p>Every score above comes from these. Bride’s value down the side, groom’s across the top where the table is directional.</p>

      <Grid caption="Varna and Vashya of each Moon sign" cols={['Varna', 'Vashya', 'Sign lord']}
        rows={SIGNS.map((s, r) => [`${s.name} (${s.sanskrit})`, [varnaOf(r), r === 8 ? 'Manava to 15°, then Chatushpada' : r === 9 ? 'Chatushpada to 15°, then Jalachara' : vashyaOf(r * 30 + 1), signLord(r)]])} />
      <p>Varna scores 1 when the groom’s varna is the same as or higher than the bride’s (Brahmin, Kshatriya, Vaishya, Shudra).</p>

      <Grid caption="Vashya points (bride down, groom across)" cols={VASHYA} rows={VASHYA.map((v, i) => [v, VASHYA_TABLE[i]])} />

      <h3>Tara</h3>
      <p>Count from the bride’s nakshatra to the groom’s, and back, and take each count’s remainder after dividing by 9. A remainder of 3, 5 or 7 (Vipat, Pratyak, Naidhana) is inauspicious. Both auspicious: 3 points; one: 1.5; neither: 0.</p>

      <Grid caption="Yoni of each nakshatra" cols={['Yoni', 'Gana', 'Nadi']}
        rows={NAKSHATRAS.map((n, i) => [<Link key={n.slug} href={`/nakshatras/${n.slug}`} className={LINK}>{n.name}</Link>, [n.yoni, n.gana, ['Adi', 'Madhya', 'Antya'][[0, 1, 2, 2, 1, 0][i % 6]]]])} />
      <Grid caption="Yoni points" cols={YONIS} rows={YONIS.map((y, i) => [y, YONI_TABLE[i]])} />

      <Grid caption="Graha Maitri points (Moon-sign lords)" cols={PLANETS7} rows={PLANETS7.map((a) => [a, PLANETS7.map((b) => MAITRI[view(a, b) + view(b, a)])])} />
      <p>From each lord’s natural friendship with the other (Brihat Parashara Hora Shastra): both friends 5; friend and neutral 4; both neutral 3; friend and enemy 1; neutral and enemy ½; both enemies 0.</p>

      <h3>Gana, Bhakoot and Nadi</h3>
      <p>Gana: the same gana 6; Deva with Manushya 5; Manushya with Rakshasa 1; Deva with Rakshasa 0. Some schools score the cross pairs by who is the bride; this calculator uses the common symmetric table.</p>
      <p>Bhakoot: 7 points unless the Moon signs are 2/12, 5/9 or 6/8 from each other — Bhakoot dosha, 0. Nadi: 8 points unless both nakshatras share a nadi — Nadi dosha, 0. Classical exceptions can cancel either dosha; the calculator shows the plain score.</p>
    </section>
  );
}

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
