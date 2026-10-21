/**
 * Shell of the reading pages (guides, FAQ, traditions and the rest): plain server markup, every word in
 * the HTML as sent, for crawlers that do not run JavaScript. No motion wrappers, no client components.
 */
import Link from 'next/link';
import { MONO } from './classes';

export function Doc({ eyebrow, title, lead, crumbs = [], children }) {
  return (
    <article data-no-auto-case className="sentence-case relative z-10 font-ui">
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
