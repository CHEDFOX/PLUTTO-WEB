'use client';

function Stat({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.32em] text-white/35">{label}</p>
      <p className="mt-1 font-serif text-xl font-light text-white">{value}</p>
    </div>
  );
}

export default function Chart({ kundli }) {
  const k = kundli?.kundli || {};
  const dasha = k.current_dasha || {};

  return (
    <div className="pb-10">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-mist py-8">
        <Stat label="Ascendant" value={k.ascendant} />
        <Stat label="Sun" value={k.sun_sign} />
        <Stat label="Moon" value={k.moon_sign} />
        <Stat label="Nakshatra" value={k.nakshatra} />
      </section>

      {(dasha.string || dasha.planet) && (
        <section className="mt-8">
          <p className="text-[10px] uppercase tracking-[0.32em] text-white/35">
            The chapter running now
          </p>
          <p className="mt-2 font-serif text-2xl font-light text-white">
            {dasha.string || `${dasha.planet}${dasha.sub ? ` — ${dasha.sub}` : ''}`}
          </p>
        </section>
      )}

      {k.planets && (
        <section className="mt-12">
          <p className="text-[10px] uppercase tracking-[0.32em] text-white/35 mb-4">
            Placements
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
            {Object.entries(k.planets).map(([planet, d]) => (
              <div key={planet}
                className="flex items-baseline justify-between border-b border-white/5 py-2">
                <span className="font-serif text-base text-white/85">
                  {planet}
                  {d.retrograde ? (
                    <span className="text-gold/70 text-xs align-super"> ℞</span>
                  ) : null}
                </span>
                <span className="text-[12px] text-white/45">
                  {d.rashi}{d.house ? ` · ${d.house}` : ''}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
