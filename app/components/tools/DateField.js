'use client';

import { FIELD, LABEL } from './widgetClasses';

export function DateField({ id, value, onChange }) {
  return (
    <div className="max-w-xs">
      <label htmlFor={id} className={LABEL}>Date of birth</label>
      <input id={id} type="date" min="1800-01-01" max="2200-12-31" value={value} onChange={(e) => onChange(e.target.value)} className={`${FIELD} mt-2`} />
    </div>
  );
}
