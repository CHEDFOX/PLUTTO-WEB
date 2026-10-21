import { TH, TD } from './tableClasses';

export function Grid({ caption, cols, rows, corner = '' }) {
  return (
    <div className="mt-6 max-w-full overflow-x-auto">
      <table className="text-[13px] tabular-nums">
        <caption className="pb-3 text-left text-[16px] font-semibold text-white">{caption}</caption>
        <thead><tr><th scope="col" className={TH}>{corner}</th>{cols.map((c) => <th key={c} scope="col" className={TH}>{c}</th>)}</tr></thead>
        <tbody className="divide-y divide-white/[0.06]">
          {rows.map(([h, cells]) => <tr key={h}><th scope="row" className={TH}>{h}</th>{cells.map((c, i) => <td key={i} className={TD}>{c}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}
