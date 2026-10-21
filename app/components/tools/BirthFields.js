'use client';

import { zoneLabel } from '../../lib/astro/zone';
import { FIELD, LABEL } from './birth';

export function BirthFields({ id, title, value, onChange, zoneList }) {
  const set = (k) => (e) => onChange({ ...value, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  return (
    <fieldset className="grid gap-4 sm:grid-cols-2">
      {title ? <legend className="mb-3 text-[16px] font-semibold text-white">{title}</legend> : null}
      <div>
        <label htmlFor={`${id}-date`} className={LABEL}>Date of birth</label>
        <input id={`${id}-date`} type="date" min="1800-01-01" max="2199-12-31" value={value.date} onChange={set('date')} className={`${FIELD} mt-2`} />
      </div>
      <div>
        <label htmlFor={`${id}-time`} className={LABEL}>Time of birth (local)</label>
        <input id={`${id}-time`} type="time" disabled={value.unknown} value={value.unknown ? '' : value.time} onChange={set('time')} className={`${FIELD} mt-2 disabled:opacity-40`} />
        <label className="mt-2 flex items-center gap-2 text-[14px] text-white/60">
          <input type="checkbox" checked={value.unknown} onChange={set('unknown')} className="h-4 w-4 accent-white" />
          I don’t know the time
        </label>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${id}-zone`} className={LABEL}>Time zone of the birthplace</label>
        <select id={`${id}-zone`} value={value.zone} onChange={set('zone')} className={`${FIELD} mt-2`}>
          {zoneList.map((z) => <option key={z} value={z}>{zoneLabel(z)}</option>)}
        </select>
      </div>
    </fieldset>
  );
}
