/**
 * THE FOOTER — one line, three parts: the copyright, the studio and its
 * mission, and the legal pages App Review, Google's brand verification and
 * Paddle's website approval look for (the backend's own pages, the same ones
 * the phone opens).
 */

const LEGAL = [
  // What Plutto Star costs — Paddle approves a selling domain only when its
  // prices can be found from the site, so it sits on every page with the rest.
  { label: 'Pricing', href: '/pricing' },
  { label: 'Privacy Policy', href: 'https://api.plutto.space/privacy' },
  { label: 'Terms of Use', href: 'https://api.plutto.space/terms' },
  // Paddle approves a selling domain only if it links to a refund policy too.
  { label: 'Refund Policy', href: 'https://api.plutto.space/refunds' },
];

export default function Footer() {
  return (
    <footer data-no-auto-case className="sentence-case relative z-10 border-t border-white/[0.08] font-ui">
      <div className="mx-auto grid max-w-6xl gap-3 px-6 py-8 text-center text-[13px] text-white/45 md:grid-cols-3 md:items-center md:text-left">
        <p>© {new Date().getFullYear()} Plutto</p>
        {/* The studio, and the mission in one word: an expedition — setting out
            after the patterns around us, the written ones and the ones still
            to be found. */}
        <p className="md:text-center">A <span className="text-white/70">Xooteq Lab</span> Expedition</p>
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-end">
          {LEGAL.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="transition-colors hover:text-white">{l.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
