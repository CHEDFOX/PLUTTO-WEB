// Hand-placed constellation — deliberate positions, not random dust.
// Two magnitudes: bright "anchor" stars and faint "field" stars.

const BRIGHT = [
  { cx: 84, cy: 142, r: 1.3, o: 0.55 },
  { cx: 215, cy: 88, r: 1.1, o: 0.42 },
  { cx: 388, cy: 196, r: 1.5, o: 0.6 },
  { cx: 612, cy: 124, r: 1.0, o: 0.4 },
  { cx: 730, cy: 282, r: 1.2, o: 0.48 },
  { cx: 158, cy: 412, r: 1.0, o: 0.38 },
  { cx: 472, cy: 504, r: 1.4, o: 0.55 },
  { cx: 868, cy: 528, r: 1.1, o: 0.42 },
  { cx: 102, cy: 678, r: 1.2, o: 0.45 },
  { cx: 348, cy: 758, r: 1.0, o: 0.36 },
  { cx: 658, cy: 712, r: 1.3, o: 0.5 },
  { cx: 920, cy: 802, r: 1.0, o: 0.38 },
];

const FIELD = [
  { cx: 42, cy: 56 }, { cx: 290, cy: 38 }, { cx: 466, cy: 92 },
  { cx: 558, cy: 220 }, { cx: 802, cy: 184 }, { cx: 60, cy: 280 },
  { cx: 244, cy: 326 }, { cx: 552, cy: 348 }, { cx: 692, cy: 392 },
  { cx: 392, cy: 432 }, { cx: 800, cy: 472 }, { cx: 18, cy: 562 },
  { cx: 268, cy: 596 }, { cx: 542, cy: 620 }, { cx: 778, cy: 648 },
  { cx: 458, cy: 866 }, { cx: 198, cy: 902 }, { cx: 712, cy: 944 },
];

const STAR_TINT = '#E6F0FF';
const HALO_TINT = '#5DBAE8';

export default function Starfield() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Very soft, wide radial haze — anchors the eye toward mid-stage. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            `radial-gradient(ellipse 80% 55% at 65% 35%, rgba(93,186,232,0.06) 0%, transparent 60%)`,
        }}
      />
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        {FIELD.map((s, i) => (
          <circle key={`f${i}`} cx={s.cx} cy={s.cy} r={0.7} fill={STAR_TINT} opacity={0.18} />
        ))}
        {BRIGHT.map((s, i) => (
          <g key={`b${i}`}>
            <circle cx={s.cx} cy={s.cy} r={s.r * 3.5} fill={HALO_TINT} opacity={s.o * 0.14} />
            <circle cx={s.cx} cy={s.cy} r={s.r} fill={STAR_TINT} opacity={s.o} />
          </g>
        ))}
      </svg>
    </div>
  );
}
