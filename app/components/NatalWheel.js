// A static natal-chart wheel: outer zodiac ring with 12 signs,
// inner house ring with house numbers, central dot.
// Pure SVG. Variants: "faint" for hero decoration, "solid" for the chart page.

const ZODIAC = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

export default function NatalWheel({
  size = 420,
  variant = 'solid', // 'solid' | 'faint'
  center,            // optional ReactNode at the center (e.g. the Orb)
}) {
  const faint = variant === 'faint';
  const strokeMain = faint ? 'rgba(41,98,255,0.24)' : 'rgba(41,98,255,0.55)';
  const strokeFine = faint ? 'rgba(41,98,255,0.10)' : 'rgba(41,98,255,0.24)';
  const signColor  = faint ? 'rgba(200,225,255,0.35)' : 'rgba(200,225,255,0.85)';
  const houseColor = faint ? 'rgba(200,225,255,0.22)' : 'rgba(200,225,255,0.55)';

  const c = 200;
  const rOuter = 198;
  const rZodiacBand = 168;
  const rHouseBand = 110;
  const rInner = 70;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 400 400" width={size} height={size} aria-hidden="true">
        <circle cx={c} cy={c} r={rOuter} fill="none" stroke={strokeMain} strokeWidth="1" />
        <circle cx={c} cy={c} r={rZodiacBand} fill="none" stroke={strokeFine} strokeWidth="0.6" />
        <circle cx={c} cy={c} r={rHouseBand} fill="none" stroke={strokeFine} strokeWidth="0.6" />
        <circle cx={c} cy={c} r={rInner} fill="none" stroke={strokeFine} strokeWidth="0.6" />

        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 - 90) * (Math.PI / 180);
          const x1 = c + rZodiacBand * Math.cos(a);
          const y1 = c + rZodiacBand * Math.sin(a);
          const x2 = c + rOuter * Math.cos(a);
          const y2 = c + rOuter * Math.sin(a);
          return (
            <line key={`zd${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeFine} strokeWidth="0.6" />
          );
        })}

        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 - 90) * (Math.PI / 180);
          const x1 = c + rInner * Math.cos(a);
          const y1 = c + rInner * Math.sin(a);
          const x2 = c + rHouseBand * Math.cos(a);
          const y2 = c + rHouseBand * Math.sin(a);
          return (
            <line key={`hd${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeFine} strokeWidth="0.5" />
          );
        })}

        {ZODIAC.map((g, i) => {
          const a = (i * 30 + 15 - 90) * (Math.PI / 180);
          const r = (rOuter + rZodiacBand) / 2;
          const x = c + r * Math.cos(a);
          const y = c + r * Math.sin(a);
          return (
            <text
              key={`z${i}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={signColor}
              fontSize={faint ? 12 : 16}
              fontFamily="system-ui, sans-serif"
            >
              {g}
            </text>
          );
        })}

        {Array.from({ length: 12 }).map((_, i) => {
          const a = (180 - i * 30 - 15) * (Math.PI / 180);
          const r = (rHouseBand + rInner) / 2;
          const x = c + r * Math.cos(a);
          const y = c + r * Math.sin(a);
          return (
            <text
              key={`h${i}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={houseColor}
              fontSize={faint ? 9 : 11}
              fontFamily="'JetBrains Mono', ui-monospace, monospace"
            >
              {i + 1}
            </text>
          );
        })}

        {!center && <circle cx={c} cy={c} r={3} fill="#2962FF" />}
      </svg>

      {center && (
        <div className="absolute inset-0 flex items-center justify-center">
          {center}
        </div>
      )}
    </div>
  );
}
