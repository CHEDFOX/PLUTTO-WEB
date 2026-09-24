/**
 * THE FOOTER — one line: the two legal pages App Review and Google's brand
 * verification look for (the backend's own pages, the same ones the phone
 * opens), and the copyright.
 */

const LEGAL = [
  { label: 'Privacy Policy', href: 'https://api.plutto.space/privacy' },
  { label: 'Terms of Use', href: 'https://api.plutto.space/terms' },
];

export default function Footer() {
  return (
    <footer data-no-auto-case className="sentence-case relative z-10 border-t border-white/[0.08] font-ui">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-[13px] text-white/45 md:flex-row md:items-center md:justify-between">
        <ul className="flex gap-6">
          {LEGAL.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="transition-colors hover:text-white">{l.label}</a>
            </li>
          ))}
        </ul>
        <p>© {new Date().getFullYear()} Xooteq Lab. All rights reserved.</p>
      </div>
    </footer>
  );
}
