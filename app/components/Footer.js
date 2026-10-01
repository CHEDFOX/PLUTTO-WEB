/**
 * THE FOOTER — one line, three parts: the copyright, the studio and its
 * mission, and the legal pages App Review, Google's brand verification and
 * the payment provider's website approval look for (the backend's own pages, the same ones
 * the phone opens).
 */

// WHAT TO READ — the site's own pages, from every page. Linked here because a
// page nothing links to is a page search engines treat as unimportant. They
// sit behind one word, "Library", in a native <details>: the footer looks as it
// always did, and the links are in the HTML as sent — search engines index
// content in a collapsed disclosure in full (it is not hidden text: anyone can
// open it), so the pages keep their internal links without a row of them.
const READ = [
  { label: 'How it works', href: '/about' },
  { label: 'Guides', href: '/guides' },
  { label: '102 traditions', href: '/traditions' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Vedic', href: '/guides/vedic-astrology' },
  { label: 'KP', href: '/guides/kp-astrology' },
  { label: 'Western', href: '/guides/western-astrology' },
  { label: 'Chinese BaZi', href: '/guides/chinese-astrology' },
  { label: 'Numerology', href: '/guides/numerology' },
  { label: 'Tarot', href: '/guides/tarot' },
  { label: 'Astrocartography', href: '/guides/astrocartography' },
  { label: 'Nakshatras', href: '/nakshatras' },
  { label: 'Chinese zodiac', href: '/chinese-zodiac' },
  { label: 'Grahas', href: '/grahas' },
  { label: 'Zodiac signs', href: '/zodiac-signs' },
  { label: 'Free calculators', href: '/tools' },
  { label: 'Kundli matching', href: '/tools/kundli-matching' },
  { label: 'Sade Sati', href: '/tools/sade-sati' },
  { label: 'Panchang today', href: '/panchang' },
  { label: 'Sky calendar', href: '/sky-calendar' },
  { label: 'Editorial standards', href: '/editorial-standards' },
];

const LEGAL = [
  // What Plutto Star costs — a payment provider approves a selling site only
  // when its prices can be found from it, so it sits on every page with the rest.
  { label: 'Pricing', href: '/pricing' },
  { label: 'Privacy Policy', href: 'https://api.plutto.space/privacy' },
  { label: 'Terms of Use', href: 'https://api.plutto.space/terms' },
  // Payment providers approve a selling site only if it links to a refund policy too.
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
          {/* On phones the panel anchors to the whole footer, not the word, so it
              never runs off the edge of the screen. */}
          <li className="md:relative">
            <details className="group">
              <summary className="cursor-pointer list-none transition-colors hover:text-white group-open:text-white [&::-webkit-details-marker]:hidden">Library</summary>
              <nav
                aria-label="Read about Plutto"
                className="absolute bottom-full left-1/2 z-20 mb-3 w-[min(88vw,420px)] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#0b0b10]/95 p-5 text-left shadow-2xl backdrop-blur md:left-auto md:right-0 md:translate-x-0"
              >
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {READ.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} className="transition-colors hover:text-white">{l.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            </details>
          </li>
        </ul>
      </div>
    </footer>
  );
}
