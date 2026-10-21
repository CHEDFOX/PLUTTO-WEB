/**
 * Footer of every marketing page: copyright, the studio, and the legal pages App Review, Google's brand
 * verification and the payment provider look for (the backend's own pages, the ones the phone opens).
 */

// The site's own pages, linked from every page so search engines do not treat them as unimportant. They
// sit behind "Library" in a native <details>: the links are in the HTML as sent, and search engines index a
// collapsed disclosure in full (it is not hidden text: anyone can open it).
import CookieChoices from './CookieChoices';

const READ = [
  { label: 'How it works', href: '/about' },
  { label: 'Magazine', href: '/magazine' },
  { label: 'Guides', href: '/guides' },
  { label: 'Ancient languages', href: '/traditions' },
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
  // The payment provider approves a selling site only when its prices can be found from every page.
  { label: 'Pricing', href: '/pricing' },
  { label: 'Privacy Policy', href: 'https://api.plutto.space/privacy' },
  { label: 'Terms of Use', href: 'https://api.plutto.space/terms' },
  // It also requires a link to the refund policy.
  { label: 'Refund Policy', href: 'https://api.plutto.space/refunds' },
];

export default function Footer() {
  return (
    <footer data-no-auto-case className="sentence-case relative z-10 border-t-[3px] border-white font-ui">
      <div className="mx-auto grid max-w-6xl gap-3 px-6 py-8 text-center font-mono text-[12px] uppercase tracking-[0.14em] text-white/70 md:grid-cols-3 md:items-center md:text-left">
        <p><span className="mr-3 font-display text-[22px] font-extrabold normal-case tracking-[0.08em] text-white">PLUTTO</span>© {new Date().getFullYear()}</p>
        <p className="md:text-center">A <span className="text-white/70">Xooteq Lab</span> Expedition</p>
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-end">
          {LEGAL.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="transition-colors hover:text-white">{l.label}</a>
            </li>
          ))}
          {/* Only when the Meta pixel is on (app/api/meta/pixel). */}
          <li className="empty:hidden"><CookieChoices className="uppercase tracking-[0.14em] transition-colors hover:text-white" /></li>
          {/* On phones the panel anchors to the whole footer, not the word, so it
              never runs off the edge of the screen. */}
          <li className="md:relative">
            <details className="group">
              <summary className="cursor-pointer list-none transition-colors hover:text-white group-open:text-white [&::-webkit-details-marker]:hidden">Library</summary>
              <nav
                aria-label="Read about Plutto"
                className="absolute bottom-full left-1/2 z-20 mb-3 w-[min(88vw,420px)] -translate-x-1/2 border border-white bg-black p-5 text-left shadow-2xl md:left-auto md:right-0 md:translate-x-0"
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
