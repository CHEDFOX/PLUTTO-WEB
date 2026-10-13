/**
 * THE MAGAZINE'S DRAWN PLATES — the pictures no photograph can give: the week as
 * a star, the two zodiacs on one dial, the sixteen figures of Ifá.
 *
 * Pure SVG, drawn from the facts in the text (nothing here is decorative
 * geometry), in ink on paper with the one sindoor line the eye should follow.
 * `currentColor` is the ink, so a plate sits on any ground the page gives it.
 */

const INK = 'currentColor';
const SINDOOR = '#C8341F';
const MONO = { fontFamily: 'var(--font-mono), IBM Plex Mono, ui-monospace, monospace', letterSpacing: '0.12em' };
const SERIF = { fontFamily: 'var(--font-display), Bodoni Moda, Georgia, serif' };

const at = (cx, cy, r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.sin(a), cy - r * Math.cos(a)];
};
const f = (n) => Math.round(n * 10) / 10;

/** The seven planets slowest to fastest; joining every third gives the week. */
function Week() {
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

/** The tropical zodiac outside, the sidereal inside, 24° behind it. */
function Zodiacs() {
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

/** The sixteen principal figures, top mark first: 1 is a single line, 2 a double. */
const ODU = [
  ['Ogbe', '1111'], ['Oyeku', '2222'], ['Iwori', '2112'], ['Odi', '1221'],
  ['Irosun', '1122'], ['Owonrin', '2211'], ['Obara', '1222'], ['Okanran', '2221'],
  ['Ogunda', '1112'], ['Osa', '2111'], ['Ika', '2122'], ['Oturupon', '2212'],
  ['Otura', '1211'], ['Irete', '1121'], ['Ose', '1212'], ['Ofun', '2121'],
];
function Odu() {
  const W = 130, H = 150;
  return (
    <svg viewBox="0 0 540 620" role="img" aria-label="The sixteen principal figures of Ifá, each four marks of one line or two, with their names and their value written in binary.">
      {ODU.map(([name, marks], i) => {
        const x0 = 10 + (i % 4) * W + W / 2, y0 = 12 + Math.floor(i / 4) * H;
        const bits = marks.split('').map((m) => (m === '1' ? 1 : 0)).join('');
        return (
          <g key={name}>
            {marks.split('').map((m, r) => {
              const y = y0 + 10 + r * 20;
              return m === '1'
                ? <line key={r} x1={x0} y1={y} x2={x0} y2={y + 12} stroke={i === 0 ? SINDOOR : INK} strokeWidth="3" strokeLinecap="round" />
                : (
                  <g key={r}>
                    <line x1={x0 - 7} y1={y} x2={x0 - 7} y2={y + 12} stroke={INK} strokeWidth="3" strokeLinecap="round" />
                    <line x1={x0 + 7} y1={y} x2={x0 + 7} y2={y + 12} stroke={INK} strokeWidth="3" strokeLinecap="round" />
                  </g>
                );
            })}
            <text x={x0} y={y0 + 106} textAnchor="middle" fontSize="17" fill={INK} style={SERIF}>{name}</text>
            <text x={x0} y={y0 + 124} textAnchor="middle" fontSize="10" fill={INK} fillOpacity="0.55" style={MONO}>{bits}</text>
          </g>
        );
      })}
    </svg>
  );
}

const PLATES = { week: Week, zodiacs: Zodiacs, odu: Odu };

/** `fit="height"` fills a box of fixed height (a card); the default fills the width. */
export default function Plate({ name, fit = 'width', className = '' }) {
  const P = PLATES[name];
  if (!P) return null;
  const size = fit === 'height' ? '[&_svg]:h-full [&_svg]:w-auto' : '[&_svg]:h-auto [&_svg]:w-full';
  return <div className={`text-white ${size} ${className}`}><P /></div>;
}
