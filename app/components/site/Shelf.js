'use client';

/**
 * THE SHELF — a hundred and two spines, standing on one ledge.
 *
 * The library is the product, so the library is the picture. A list of names is
 * a claim; a shelf of real spines, each filed under its real region, is the
 * thing itself — and it is the one image on this site no other astrology app
 * can copy, because no other astrology app has a hundred and two of anything.
 *
 * WHY ONE ROW. Wrapped into a block, the spines read as an equaliser: a grid of
 * colour with no floor. A single row on a single ledge, wider than the window
 * and scrolling past both edges, reads as a shelf and says the true thing about
 * the collection — it does not fit on the screen.
 *
 * WHY IT LOOKS EXPENSIVE. Every colour is earned: the hue is the backend's own
 * shelf (library_map.REGIONS), so the row sorts itself into twelve bands, and
 * the gutters between groups are where one shelf ends and the next begins.
 * Widths and heights vary the way real spines do, derived from the title so
 * they are identical on the server and in the browser — Math.random here would
 * tear on hydration and look, correctly, like a mistake.
 *
 * Pointing at a spine lifts it and names it. That is the whole interaction, and
 * it is enough: the reward is a tradition you have never heard of, from a city
 * you have, with a hundred and one more behind it.
 */

import { useMemo, useState } from 'react';
import { TRADITIONS, SHELVES, SHELF_COLOR } from '../../lib/traditions';

/** A stable number in [0,1) from a string — same on both sides of hydration. */
function hash(label) {
  let h = 0;
  for (let i = 0; i < label.length; i += 1) h = (h * 31 + label.charCodeAt(i)) % 99991;
  return (h % 1000) / 1000;
}

export default function Shelf() {
  const [at, setAt] = useState(null);

  // Grouped in the library's own order, so the gutters fall between shelves.
  const groups = useMemo(() => {
    const by = new Map(SHELVES.map((s) => [s.id, []]));
    TRADITIONS.forEach((t) => (by.get(t.shelf) || by.get('sky')).push(t));
    return SHELVES.map((s) => ({ ...s, items: by.get(s.id) || [] })).filter((g) => g.items.length);
  }, []);

  return (
    <div>
      {/* Full-bleed: the shelf runs off both edges of the window on purpose. */}
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-black to-transparent md:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-black to-transparent md:w-28" />

        <div
          className="overflow-x-auto px-6 pb-2 pt-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onMouseLeave={() => setAt(null)}
        >
          <div className="mx-auto w-max">
            <div className="flex h-[168px] items-stretch gap-7 md:h-[210px]">
              {groups.map((g) => (
                <div key={g.id} className="flex h-full items-end gap-[3px]">
                  {g.items.map((t) => {
                    const h = hash(t.label);
                    const c = g.color;
                    const on = at === t.label;
                    return (
                      <button
                        key={t.label}
                        type="button"
                        onMouseEnter={() => setAt(t.label)}
                        onFocus={() => setAt(t.label)}
                        onClick={() => setAt(t.label)}
                        aria-label={`${t.label}, ${t.place}`}
                        className="relative shrink-0 rounded-t-[2px] outline-none transition-transform duration-300 ease-out"
                        style={{
                          width: 9 + Math.round(h * 9),
                          height: `${62 + Math.round(h * 38)}%`,
                          transform: on ? 'translateY(-16px)' : 'none',
                          background: `linear-gradient(100deg, ${c}66 0%, ${c} 26%, ${c}D9 62%, ${c}55 100%)`,
                          boxShadow: on
                            ? `0 0 0 1px ${c}, 0 22px 44px -14px ${c}`
                            : 'inset -1px 0 0 rgba(0,0,0,0.5)',
                          opacity: at == null || on ? 1 : 0.34,
                        }}
                      >
                        {/* the two bands every spine carries near its head */}
                        <span className="absolute inset-x-0 top-[13%] h-px bg-black/40" />
                        <span className="absolute inset-x-0 top-[19%] h-px bg-black/25" />
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* The ledge the whole collection stands on. */}
            <div className="mt-[6px] h-px w-full bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <div className="h-5 w-full bg-gradient-to-b from-white/[0.05] to-transparent" />
          </div>
        </div>
      </div>

      {/* What you are pointing at. Fixed height, so the shelf never jumps. */}
      <div className="mt-6 flex min-h-[3.6em] items-start justify-center px-6 text-center">
        {at ? (
          <p>
            <span
              data-no-auto-case
              className="block font-editorial text-[1.5rem] leading-tight md:text-[2rem]"
              style={{ color: SHELF_COLOR[TRADITIONS.find((t) => t.label === at)?.shelf] }}
            >
              {at}
            </span>
            <span className="mt-2 block font-mono text-[0.66rem] uppercase tracking-[0.3em] text-[#8A8A8E]">
              {TRADITIONS.find((t) => t.label === at)?.place}
            </span>
          </p>
        ) : (
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.3em] text-[#6E6E72]">
            Point at a spine
          </p>
        )}
      </div>

      {/* The twelve shelves — legend and colour key at once. */}
      <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
        {SHELVES.map((s) => (
          <li key={s.id} className="flex items-center gap-2">
            <span className="h-[9px] w-[3px] rounded-sm" style={{ background: s.color }} />
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-[#8A8A8E]">
              {s.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
