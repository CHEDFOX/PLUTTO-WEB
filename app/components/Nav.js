'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/about', label: 'About' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-transparent">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-[#F0F0F0] transition-colors hover:text-[#5F82EA]"
          aria-label="Plutto home"
        >
          PLUTTO
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => {
            const active = path === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={
                    'text-sm font-medium font-body transition-colors hover:text-[#5F82EA] ' +
                    (active ? 'text-[#F0F0F0]' : 'text-[#F0F0F0]/80')
                  }
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-md text-[#F0F0F0] hover:text-[#5F82EA] transition-colors relative z-[55]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            {open ? (
              <>
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </>
            ) : (
              <>
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden fixed inset-0 z-50 bg-black flex items-center justify-center">
          <ul className="flex flex-col items-center gap-8 px-6 text-center">
            {LINKS.map((l) => {
              const active = path === l.href;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={
                      'font-display font-bold tracking-tight transition-colors min-h-[44px] inline-flex items-center text-3xl ' +
                      (active
                        ? 'text-[#5F82EA]'
                        : 'text-[#F0F0F0] hover:text-[#5F82EA]')
                    }
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
