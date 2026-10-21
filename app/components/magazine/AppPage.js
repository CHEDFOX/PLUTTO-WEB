import Link from 'next/link';
import Image from 'next/image';
import { APP_PAGE } from '../../lib/content/magazine';

/** A page of the app, in a phone's frame, opening the app. */
export function AppPage({ k, size = 'strip', cta = 'Open in the app' }) {
  const p = APP_PAGE[k];
  if (!p) return null;
  return (
    <Link href="/app" className={`group block shrink-0 snap-start ${size === 'strip' ? 'w-[188px] md:w-[208px]' : 'w-full max-w-[240px]'}`}>
      <div className="rounded-[26px] bg-white p-[6px] shadow-[0_24px_40px_-24px_rgba(17,17,17,0.55)] transition-transform duration-500 group-hover:-translate-y-1.5">
        <Image
          src={`/magazine/app/${p.key}.webp`}
          width={540}
          height={1043}
          alt={`${p.title}, a page of the Plutto app`}
          className="block h-auto w-full rounded-[20px]"
          sizes="240px"
        />
      </div>
      {size === 'strip' ? (
        <>
          <p className="mt-4 font-display text-[19px] leading-tight text-white">{p.title}</p>
          <p className="mt-1.5 text-[14px] leading-snug text-white/60">{p.line}</p>
        </>
      ) : null}
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white underline-offset-4 group-hover:underline">{cta} →</p>
    </Link>
  );
}
