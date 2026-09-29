'use client';
/** A snippet to copy, with a button that copies it. */
import { useState } from 'react';

export default function CopyBox({ text, label }) {
  const [done, setDone] = useState(false);
  return (
    <div className="mt-4 max-w-2xl rounded-xl border border-white/10 bg-white/[0.03]">
      <pre className="overflow-x-auto whitespace-pre-wrap break-all p-4 font-mono text-[12.5px] leading-[1.6] text-white/75">{text}</pre>
      <div className="border-t border-white/10 px-4 py-2">
        <button type="button" onClick={() => navigator.clipboard?.writeText(text).then(() => { setDone(true); setTimeout(() => setDone(false), 2000); })} className="text-[14px] text-white underline decoration-white/30 underline-offset-4">
          {done ? 'Copied' : `Copy the ${label} code`}
        </button>
      </div>
    </div>
  );
}
