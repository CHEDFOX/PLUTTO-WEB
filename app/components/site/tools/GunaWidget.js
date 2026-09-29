'use client';
/**
 * KUNDLI MATCHING (GUNA MILAN) — two births, two Moons, eight kootas. The
 * astronomy loads only when someone asks; nothing is sent anywhere.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BirthFields, emptyBirth, useZones, birthError, birthMoon } from './birth';
import { gunaMilan, verdict, MAX } from '../../../lib/guna';

const WHAT = {
  Varna: 'spiritual temperament',
  Vashya: 'mutual attraction and influence',
  Tara: 'birth-star harmony',
  Yoni: 'physical and intimate nature',
  'Graha Maitri': 'friendship of the Moon-sign lords — the meeting of minds',
  Gana: 'temperament (Deva, Manushya, Rakshasa)',
  Bhakoot: 'the Moon signs’ positions from each other — family and prosperity',
  Nadi: 'constitution and progeny',
};

export default function GunaWidget() {
  const { list, local } = useZones();
  const [bride, setBride] = useState(emptyBirth());
  const [groom, setGroom] = useState(emptyBirth());
  const [r, setR] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    setBride((b) => (b.zone === 'UTC' ? { ...b, zone: local } : b));
    setGroom((b) => (b.zone === 'UTC' ? { ...b, zone: local } : b));
  }, [local]);

  async function go(e) {
    e.preventDefault();
    const problem = birthError(bride, 'the bride') || birthError(groom, 'the groom');
    setErr(problem || '');
    if (problem) return;
    setBusy(true);
    try {
      const sky = await import('../../../lib/sky');
      const b = birthMoon(sky, bride), g = birthMoon(sky, groom);
      setR({ ...gunaMilan(b.sidereal, g.sidereal), uncertain: [...b.changes.map((c) => `the bride’s ${c}`), ...g.changes.map((c) => `the groom’s ${c}`)] });
    } catch {
      setErr('Something went wrong computing the charts. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-label="Calculator" className="not-prose">
      <form onSubmit={go} className="max-w-2xl space-y-8">
        <BirthFields id="bride" title="Bride" value={bride} onChange={setBride} zoneList={list} />
        <BirthFields id="groom" title="Groom" value={groom} onChange={setGroom} zoneList={list} />
        <div>
          <button type="submit" disabled={busy} className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-[15px] font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60">
            {busy ? 'Computing…' : 'Match'}
          </button>
          {err ? <p role="alert" className="!mt-3 text-[14px] text-[#F87171]">{err}</p> : null}
        </div>
      </form>

      {r ? (
        <div aria-live="polite" className="mt-10 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-[13px] font-semibold text-white/55">Guna Milan</p>
          <p className="mt-3 text-[44px] font-semibold leading-none tracking-[-0.04em] text-white">{r.total} <span className="text-[22px] text-white/45">/ 36</span></p>
          <p className="!mt-3 text-[16px] text-white/80">{verdict(r.total)}{r.doshas.length ? ` · ${r.doshas.join(', ')}` : ''}.</p>
          <p className="!mt-3 text-[14px] text-white/55">
            Bride: <Link href={`/nakshatras/${r.bride.nakshatra.slug}`} className="text-white underline decoration-white/30 underline-offset-4">{r.bride.nakshatra.name}</Link>, {r.bride.sign.name} ({r.bride.sign.sanskrit}) ·
            Groom: <Link href={`/nakshatras/${r.groom.nakshatra.slug}`} className="text-white underline decoration-white/30 underline-offset-4">{r.groom.nakshatra.name}</Link>, {r.groom.sign.name} ({r.groom.sign.sanskrit})
          </p>
          {r.uncertain.length ? (
            <p className="!mt-3 text-[14px] text-[#A78BFA]">Without a birth time, {r.uncertain.join(' and ')} could be either of two: the Moon changed it that day. Add the time for a certain score.</p>
          ) : null}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead><tr className="text-white/40"><th scope="col" className="py-1.5 pr-3 font-normal">Koota</th><th scope="col" className="py-1.5 pr-3 font-normal">Bride</th><th scope="col" className="py-1.5 pr-3 font-normal">Groom</th><th scope="col" className="py-1.5 text-right font-normal">Points</th></tr></thead>
              <tbody className="divide-y divide-white/[0.06]">
                {r.kootas.map((k) => (
                  <tr key={k.name} className="text-white/80">
                    <td className="py-2.5 pr-3"><span className="text-white">{k.name}</span><br /><span className="text-[12px] text-white/40">{WHAT[k.name]}</span></td>
                    <td className="py-2.5 pr-3">{k.bride}</td>
                    <td className="py-2.5 pr-3">{k.groom}</td>
                    <td className={`py-2.5 text-right tabular-nums ${k.points === 0 ? 'text-[#F87171]' : 'text-white'}`}>{k.points} / {MAX[k.name]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="!mt-5 text-[13px] leading-[1.6] text-white/45">
            Guna Milan compares only the two Moons. Classical exceptions can cancel Nadi and Bhakoot dosha (for example when the Moon-sign lords are the same or friends), and a full match also weighs Mangal dosha and both whole charts — which is what Plutto reads.
          </p>
        </div>
      ) : null}
    </section>
  );
}
