import { INK, SINDOOR, MONO, SERIF } from './style';

/** The sixteen principal figures, top mark first: 1 is a single line, 2 a double. */
const ODU = [
  ['Ogbe', '1111'], ['Oyeku', '2222'], ['Iwori', '2112'], ['Odi', '1221'],
  ['Irosun', '1122'], ['Owonrin', '2211'], ['Obara', '1222'], ['Okanran', '2221'],
  ['Ogunda', '1112'], ['Osa', '2111'], ['Ika', '2122'], ['Oturupon', '2212'],
  ['Otura', '1211'], ['Irete', '1121'], ['Ose', '1212'], ['Ofun', '2121'],
];
export function Odu() {
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
