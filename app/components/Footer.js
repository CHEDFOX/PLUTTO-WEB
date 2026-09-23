/**
 * THE FOOTER — the columns a product company keeps at the bottom of every
 * page: what it is, who made it, and the legal pages App Review and Google's
 * brand verification both look for. The legal links are the backend's own
 * pages, the same ones the phone opens.
 */
import Link from 'next/link';

const COLS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'Try a card', href: '/#draw' },
      { label: 'Web app', href: '/app' },
      { label: 'Get the app', href: '/#download' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'How it works', href: '/about' },
      { label: 'Contact', href: 'mailto:support@plutto.space' },
      { label: 'Support', href: 'https://api.plutto.space/support' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: 'https://api.plutto.space/privacy' },
      { label: 'Terms of Use', href: 'https://api.plutto.space/terms' },
      { label: 'Delete account', href: 'https://api.plutto.space/api/public/delete-account' },
    ],
  },
];

export default function Footer() {
  return (
    <footer data-no-auto-case className="sentence-case relative z-10 border-t border-white/[0.08] font-ui">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-6 py-16 md:grid-cols-5">
        <div className="col-span-2">
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="relative inline-block h-[22px] w-[22px] rounded-full bg-gradient-to-br from-white to-white/40">
              <span className="absolute inset-[5px] rounded-full bg-black" />
            </span>
            <span className="text-[17px] font-semibold tracking-[-0.02em] text-white">Plutto</span>
          </div>
          <p className="mt-4 max-w-[30ch] text-[14px] leading-relaxed text-white/50">
            The divination library. Tarot, runes, I Ching and your stars, in one app.
          </p>
        </div>

        {COLS.map((c) => (
          <div key={c.title}>
            <p className="text-[13px] font-semibold text-white">{c.title}</p>
            <ul className="mt-4 space-y-3">
              {c.links.map((l) => {
                const external = l.href.startsWith('http') || l.href.startsWith('mailto:');
                const cls = 'text-[14px] text-white/50 transition-colors hover:text-white';
                return (
                  <li key={l.label}>
                    {external
                      ? <a href={l.href} className={cls}>{l.label}</a>
                      : <Link href={l.href} className={cls}>{l.label}</Link>}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-[13px] text-white/40 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} Xooteq Lab. All rights reserved.</p>
          <p>Made for curious minds, everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
