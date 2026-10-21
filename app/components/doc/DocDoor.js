import Link from 'next/link';
import { LINK } from './classes';

/** The page's end: the way into the app, and the two other doors worth having. */
export function DocDoor({ links = [] }) {
  return (
    <section className="mt-20 border-t border-white/[0.07] pt-12">
      <p className="text-[22px] font-semibold tracking-[-0.02em] text-white">Ask it something you actually want to know.</p>
      <div className="mt-8 flex flex-wrap items-center gap-6">
        <Link
          href="/app"
          className="inline-flex h-12 items-center justify-center rounded-[2px] bg-white px-7 font-mono text-[13px] uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-90"
        >
          Open Plutto in this browser
        </Link>
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={LINK}>{l.label}</Link>
        ))}
      </div>
    </section>
  );
}
