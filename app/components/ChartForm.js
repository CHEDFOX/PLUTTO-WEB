'use client';

import { useState } from 'react';

export default function ChartForm() {
  const [unknownTime, setUnknownTime] = useState(false);
  const [updates, setUpdates] = useState(true);

  return (
    <form
      className="space-y-7"
      onSubmit={(e) => {
        e.preventDefault();
        // Wire to api.plutto.space/api/public/kundli/generate later.
      }}
    >
      <Field label="Name">
        <input
          type="text"
          required
          autoComplete="name"
          className="input"
          placeholder=""
        />
      </Field>

      <Field label="Birthdate">
        <div className="grid grid-cols-3 gap-3">
          <input type="text" inputMode="numeric" maxLength={2} placeholder="MM" className="input text-center" />
          <input type="text" inputMode="numeric" maxLength={2} placeholder="DD" className="input text-center" />
          <input type="text" inputMode="numeric" maxLength={4} placeholder="YYYY" className="input text-center" />
        </div>
      </Field>

      <Field label="Time of birth">
        <div className="grid grid-cols-[1fr_auto_1fr_1.1fr] items-center gap-3">
          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            placeholder="HH"
            className="input text-center"
            disabled={unknownTime}
          />
          <span className="text-white/40 text-lg">:</span>
          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            placeholder="MM"
            className="input text-center"
            disabled={unknownTime}
          />
          <select className="input pr-3" disabled={unknownTime}>
            <option className="bg-black">AM</option>
            <option className="bg-black">PM</option>
          </select>
        </div>
        <label className="mt-3 flex cursor-pointer items-center gap-3 text-[13px] text-white/60">
          <Checkbox checked={unknownTime} onChange={setUnknownTime} />
          I don&rsquo;t know my birth time
        </label>
      </Field>

      <Field label="Place of birth">
        <input type="text" required placeholder="A city" className="input" />
      </Field>

      <Field label="Email">
        <input type="email" required placeholder="Email address" className="input" />
        <label className="mt-3 flex cursor-pointer items-center gap-3 text-[13px] text-white/60">
          <Checkbox checked={updates} onChange={setUpdates} />
          Send me updates
        </label>
      </Field>

      <button
        type="submit"
        className="mt-2 inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-[11px] uppercase tracking-[0.32em] text-black transition-colors hover:bg-gold hover:text-black"
      >
        See my chart
      </button>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.32em] text-white/55 mb-3">
        {label}
      </label>
      {children}
    </div>
  );
}

function Checkbox({ checked, onChange }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex h-4 w-4 items-center justify-center border ${
        checked ? 'border-white bg-white' : 'border-white/30'
      } transition-colors`}
    >
      {checked && (
        <svg viewBox="0 0 16 16" className="h-3 w-3 text-black" fill="none">
          <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
