/**
 * A READING PAGE — the shell the guides, the FAQ and the traditions atlas share.
 *
 * Deliberately plain server markup: no motion wrappers, no client components.
 * These pages exist to be READ — by people and by crawlers, several of which
 * (the answer engines' among them) never run JavaScript — so every word is in
 * the HTML as sent, at full opacity, in document order, with real headings.
 * The look is the information page's: the same eyebrow, type and hairlines.
 */
import Link from 'next/link';

export const MONO = 'text-[14px] font-semibold text-[#A78BFA]';
export const LINK = 'text-white underline decoration-white/30 underline-offset-4 hover:decoration-white';

export function Doc({ eyebrow, title, lead, crumbs = [], children }) {
  return (
    <article data-no-auto-case data-no-binary className="sentence-case relative z-10 font-ui">
      <header className="mx-auto max-w-4xl px-6 pb-12 pt-8 md:pt-16">
        {crumbs.length ? (
          <nav aria-label="Breadcrumb" className="mb-6 text-[13px] text-white/40">
            <Link href="/" className="hover:text-white">Plutto</Link>
            {crumbs.map((c) => (
              <span key={c.path}>
                <span className="mx-2">/</span>
                <Link href={c.path} className="hover:text-white">{c.name}</Link>
              </span>
            ))}
          </nav>
        ) : null}
        {eyebrow ? <p className={MONO}>{eyebrow}</p> : null}
        <h1
          className="mt-5 font-semibold tracking-[-0.04em] text-white"
          style={{ fontSize: 'clamp(2rem,5.2vw,3.4rem)', lineHeight: 1.08, maxWidth: '22ch' }}
        >
          {title}
        </h1>
        {lead ? <p className="mt-8 max-w-2xl text-[18px] leading-[1.65] text-white/70">{lead}</p> : null}
      </header>
      <div className="mx-auto max-w-4xl px-6 pb-20 text-[16px] leading-[1.7] text-white/65 [&_h2]:mt-14 [&_h2]:text-[24px] [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h2]:text-white [&_h3]:mt-8 [&_h3]:text-[18px] [&_h3]:font-semibold [&_h3]:text-white [&_p]:mt-4 [&_p]:max-w-2xl">
        {children}
      </div>
    </article>
  );
}

/** The page's end: the way into the app, and the two other doors worth having. */
export function DocDoor({ links = [] }) {
  return (
    <section className="mt-20 border-t border-white/[0.07] pt-12">
      <p className="text-[22px] font-semibold tracking-[-0.02em] text-white">Ask it something you actually want to know.</p>
      <div className="mt-8 flex flex-wrap items-center gap-6">
        <Link
          href="/app"
          className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-[15px] font-semibold text-black transition-opacity hover:opacity-90"
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
