'use client';

export function Badge({ href, soft, internal, mark, small, big, label }) {
  const cls = `flex h-[52px] items-center gap-2.5 rounded-xl border border-white/20 bg-black px-4 text-white ${soft ? 'badge-soft' : ''} ${href ? 'transition-transform hover:scale-[1.03]' : 'cursor-default'}`;
  const inner = (
    <>
      <span className="text-white">{mark}</span>
      <span className="flex flex-col leading-none">
        <span className="text-[10px] text-white/70">{small}</span>
        <span className="mt-1 text-[18px] font-semibold tracking-[-0.01em]">{big}</span>
      </span>
    </>
  );
  if (href && internal) return <a href={href} aria-label={label} className={cls}>{inner}</a>;
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={cls}>{inner}</a>;
  return <div aria-disabled="true" className={cls}>{inner}</div>;
}
