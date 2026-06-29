export default function Footer() {
  return (
    <footer className="px-6 md:px-12 pt-20 pb-12 border-t border-white/8 mt-24">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-end md:justify-between gap-10">
        <div>
          <div className="font-serif text-2xl font-light leading-none text-white">
            Plutto
          </div>
          <p className="mt-4 max-w-xs text-[12px] leading-relaxed text-white/45">
            A voice-first astrology oracle.
            <br />
            iOS &amp; Android — soon.
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] uppercase tracking-[0.32em] text-white/45">
          <a className="hover:text-white transition-colors" href="https://api.plutto.space/privacy">Privacy</a>
          <a className="hover:text-white transition-colors" href="https://api.plutto.space/static/terms.html">Terms</a>
          <a className="hover:text-white transition-colors" href="https://api.plutto.space/static/delete.html">Delete account</a>
          <a className="hover:text-white transition-colors" href="mailto:support@plutto.space">Contact</a>
        </nav>
      </div>
      <p className="mt-12 text-[10px] uppercase tracking-[0.4em] text-white/25">
        © xooteq Lab
      </p>
    </footer>
  );
}
