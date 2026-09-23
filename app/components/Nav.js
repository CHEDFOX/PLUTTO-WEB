'use client';

/**
 * THE NAV — a product company's bar, not a portfolio's.
 *
 * Sticky, frosted, one hairline under it. The name set plainly on the left, a
 * few real destinations in the middle, and the one action that matters on the
 * right as a solid pill. On a phone the links fold into a sheet.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/#how', label: 'How it works' },
  { href: '/#features', label: 'Features' },
  { href: '/#draw', label: 'Try a card' },
  { href: '/app', label: 'Web app' },
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
        scrolled ? 'border-b border-white/[0.08] bg-black/70 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 font-ui">
        <Link href="/" aria-label="Plutto home" className="flex items-center gap-2.5">
          <span aria-hidden="true" className="relative inline-block h-[22px] w-[22px] rounded-full bg-gradient-to-br from-white to-white/40">
            <span className="absolute inset-[5px] rounded-full bg-black" />
          </span>
          <span className="text-[17px] font-semibold tracking-[-0.02em] text-white">Plutto</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-[14px] text-white/60 transition-colors hover:text-white">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/#download"
            className="hidden rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-black transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Get the app
          </Link>
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

      {open && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-1 px-6 pt-20 font-ui">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)}
                      className="block border-b border-white/[0.08] py-4 text-[22px] font-semibold tracking-[-0.02em] text-white">
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-8">
              <Link href="/#download" onClick={() => setOpen(false)}
                    className="inline-flex rounded-full bg-white px-6 py-3 text-[15px] font-semibold text-black">
                Get the app
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
