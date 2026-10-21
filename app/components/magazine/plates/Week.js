import { INK, SINDOOR, MONO, SERIF, at, f } from './style';

/** The seven planets slowest to fastest; joining every third gives the week. */
export function Week() {
  const P = [
    ['Saturn', 'Saturday'], ['Jupiter', 'Thursday'], ['Mars', 'Tuesday'], ['Sun', 'Sunday'],
    ['Venus', 'Friday'], ['Mercury', 'Wednesday'], ['Moon', 'Monday'],
  ];
  const c = 260, r = 165;
  const pts = P.map((_, i) => at(c, c, r, (360 / 7) * i));
  // Saturday → Sunday → Monday …: each day starts three places on.
  const order = Array.from({ length: 8 }, (_, k) => (k * 3) % 7);
  const star = order.map((i, k) => `${k ? 'L' : 'M'}${f(pts[i][0])} ${f(pts[i][1])}`).join(' ');
  return (
    <svg viewBox="0 0 520 520" role="img" aria-label="The seven planets on a circle in their old order, joined every third one into a seven-pointed star that follows the days of the week.">
      <circle cx={c} cy={c} r={r} fill="none" stroke={INK} strokeOpacity="0.25" />
      <path d={star} fill="none" stroke={SINDOOR} strokeWidth="1.6" strokeLinejoin="round" />
      {P.map(([planet, day], i) => {
        const [x, y] = pts[i];
        const [lx, ly] = at(c, c, r + 46, (360 / 7) * i);
        return (
          <g key={planet}>
            <circle cx={x} cy={y} r="6" fill={INK} />
            <text x={lx} y={ly - 4} textAnchor="middle" fontSize="19" fill={INK} style={SERIF}>{planet}</text>
            <text x={lx} y={ly + 15} textAnchor="middle" fontSize="10" fill={INK} fillOpacity="0.6" style={MONO}>{day.toUpperCase()}</text>
          </g>
        );
      })}
    </svg>
  );
}
