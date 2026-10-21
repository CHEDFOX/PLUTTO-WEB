import { INK, SINDOOR, MONO, SERIF, at, f } from './style';

/** The tropical zodiac outside, the sidereal inside, 24° behind it. */
export function Zodiacs() {
  const S = ['ARI', 'TAU', 'GEM', 'CAN', 'LEO', 'VIR', 'LIB', 'SCO', 'SAG', 'CAP', 'AQU', 'PIS'];
  const c = 260, AY = 24;
  // Ecliptic longitude runs anticlockwise from the March equinox, set at the left.
  const pt = (r, lon) => at(c, c, r, 270 - lon);
  const ring = (r0, r1, shift, label, op) => (
    <g>
      <circle cx={c} cy={c} r={r0} fill="none" stroke={INK} strokeOpacity={op} />
      <circle cx={c} cy={c} r={r1} fill="none" stroke={INK} strokeOpacity={op} />
      {S.map((s, k) => {
        const lon = shift + 30 * k;
        const [x0, y0] = pt(r0, lon), [x1, y1] = pt(r1, lon);
        const [tx, ty] = pt((r0 + r1) / 2, lon + 15);
        return (
          <g key={s}>
            <line x1={f(x0)} y1={f(y0)} x2={f(x1)} y2={f(y1)} stroke={k === 0 ? SINDOOR : INK} strokeOpacity={k === 0 ? 1 : op} strokeWidth={k === 0 ? 2 : 1} />
            <text x={f(tx)} y={f(ty) + 4} textAnchor="middle" fontSize="11" fill={INK} fillOpacity={k === 0 ? 1 : 0.7} style={MONO}>{s}</text>
          </g>
        );
      })}
      <text x={c} y={c - r1 + 22} textAnchor="middle" fontSize="9" fill={INK} fillOpacity="0.55" style={MONO}>{label}</text>
    </g>
  );
  const [ex, ey] = pt(232, 0);
  const arc = (r) => {
    const [x0, y0] = pt(r, 0), [x1, y1] = pt(r, AY);
    return `M${f(x0)} ${f(y0)} A${r} ${r} 0 0 0 ${f(x1)} ${f(y1)}`;
  };
  const [ax, ay] = pt(80, AY / 2);
  return (
    <svg viewBox="-70 0 590 520" role="img" aria-label="Two zodiac rings. The outer, tropical ring starts Aries at the March equinox; the inner, sidereal ring starts Aries about 24 degrees later.">
      {ring(222, 176, 0, 'TROPICAL · THE SEASONS', 0.9)}
      {ring(160, 114, AY, 'SIDEREAL · THE STARS', 0.55)}
      <path d={arc(104)} fill="none" stroke={SINDOOR} strokeWidth="2" />
      <text x={f(ax) + 4} y={f(ay) + 6} fontSize="22" fill={SINDOOR} style={SERIF}>24°</text>
      <circle cx={f(ex)} cy={f(ey)} r="4" fill={SINDOOR} />
      <text x={f(ex) - 10} y={f(ey) - 3} textAnchor="end" fontSize="9" fill={INK} style={MONO}>MARCH</text>
      <text x={f(ex) - 10} y={f(ey) + 9} textAnchor="end" fontSize="9" fill={INK} style={MONO}>EQUINOX</text>
      <circle cx={c} cy={c} r="3" fill={INK} />
    </svg>
  );
}
