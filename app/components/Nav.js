'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const path = usePathname();
  const onAbout = path === '/about';
  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-6 md:px-12 py-6 md:py-8 bg-black/40 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-serif text-[22px] md:text-[26px] font-medium text-white tracking-tight">
            Plutto
          </span>
          <span className="mt-0.5 text-[8px] uppercase tracking-[0.4em] text-white/45">
            An Astrology Oracle
          </span>
        </Link>

        <Link
          href={onAbout ? '/' : '/about'}
          className="relative text-[10px] md:text-[11px] uppercase tracking-[0.32em] text-white/75 hover:text-white transition-colors"
        >
          {onAbout ? 'Home' : 'About'}
        </Link>
      </div>
    </header>
  );
}
