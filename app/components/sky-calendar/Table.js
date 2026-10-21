const TH = 'py-2 pr-4 text-left font-normal text-white/45';
const TD = 'py-2.5 pr-4 align-top text-white/85';

export function Table({ caption, head, rows }) {
  return (
    <div className="mt-6 max-w-full overflow-x-auto">
      <table className="w-full text-left text-[14px]">
        {caption ? <caption className="pb-3 text-left text-[17px] font-semibold text-white">{caption}</caption> : null}
        <thead><tr>{head.map((h) => <th key={h} scope="col" className={TH}>{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-white/[0.06]">{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={TD}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
