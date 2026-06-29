// Deterministic static starfield — no animation, no client JS.
// Seeded so SSR and CSR generate identical positions.

function makeStars(count, seed) {
  let s = seed >>> 0;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  const stars = [];
  for (let i = 0; i < count; i++) {
    const r = rand();
    stars.push({
      cx: +(rand() * 1000).toFixed(2),
      cy: +(rand() * 1000).toFixed(2),
      r: +(0.4 + rand() * 1.3).toFixed(2),
      o: +(0.12 + (r < 0.08 ? 0.55 : r < 0.25 ? 0.32 : 0.18) * rand()).toFixed(3),
    });
  }
  return stars;
}

const STARS = makeStars(110, 0x5c057a8);

export default function Starfield() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-0 overflow-hidden"
    >
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill="#FFFFFF"
            opacity={s.o}
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
    </div>
  );
}
