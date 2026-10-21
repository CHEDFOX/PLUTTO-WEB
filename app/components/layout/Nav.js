'use client';

/**
 * Site nav: the wordmark, the section links and "Ask Plutto" over a double rule. On phones the links fold
 * into a full-screen sheet.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import GetAppLink from '../store/GetAppLink';

const LINKS = [
  { href: '/app', label: 'Ask' },
  { href: '/panchang', label: 'Today' },
  { href: '/magazine', label: 'Magazine' },
  { href: '/traditions', label: 'Traditions' },
  { href: '/editorial-standards', label: 'Method' },
  { href: '/about', label: 'About' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();

  useEffect(() => { setOpen(false); }, [path]);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <header
      data-no-auto-case
      className={`sentence-case fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-black'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 font-ui">
        {/* Wordmark */}
        <Link href="/" aria-label="Plutto home" className="flex items-center">
          <span className="font-display text-[28px] font-extrabold uppercase leading-none tracking-[0.08em] text-white">Plutto</span>
        </Link>

        <ul className="hidden items-center gap-5 md:flex lg:gap-8">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={`font-mono text-[12px] uppercase tracking-[0.18em] transition-colors hover:text-white ${path === l.href || path?.startsWith(`${l.href}/`) ? 'text-white underline underline-offset-[6px]' : 'text-white/70'}`}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <GetAppLink className="hidden bg-white px-4 py-2 font-mono text-[12px] uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-90 sm:inline-flex">
            Ask Plutto
          </GetAppLink>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative z-[55] inline-flex h-10 w-10 items-center justify-center rounded-full text-white md:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-5 w-5">
              {open ? (<><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>) : (<><path d="M4 8h16" /><path d="M4 16h16" /></>)}
            </svg>
          </button>
        </div>
      </nav>
      {/* Double rule under the bar */}
      <div aria-hidden="true" className="mx-auto max-w-6xl px-6">
        <div className="h-[4px] border-b border-t-2 border-white" />
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-1 px-6 pt-20 font-ui">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)}
                      className="block border-b border-white/20 py-4 font-display text-[26px] font-bold text-white">
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-8">
              <GetAppLink onClick={() => setOpen(false)}
                    className="inline-flex bg-white px-6 py-3 font-mono text-[13px] uppercase tracking-[0.18em] text-black">
                Ask Plutto
              </GetAppLink>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
