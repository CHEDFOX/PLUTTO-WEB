'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/', label: 'App' },
  { href: '/about', label: 'About' },
];

export default function Nav() {
  const path = usePathname();
  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-6 md:px-12 py-6 md:py-8 bg-black/40 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-serif text-[24px] md:text-[28px] font-medium text-white tracking-tight">
            Plutto
          </span>
          <span className="mt-0.5 text-[8px] uppercase tracking-[0.4em] text-white/45">
            An astrology oracle
          </span>
        </Link>

        <nav className="flex items-center gap-7 md:gap-12">
          {ITEMS.map((it) => {
            const active = path === it.href;
            return (
              <Link
                key={it.href}
                href={it.href}
                className="relative text-[10px] md:text-[11px] uppercase tracking-[0.32em] text-white/75 hover:text-white transition-colors"
              >
                {it.label}
                {active && (
                  <span className="absolute -bottom-2 left-0 right-0 h-[1px] bg-white" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
