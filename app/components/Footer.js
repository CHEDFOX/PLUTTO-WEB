// Closing line + standard footer. Appears on every page.

export default function Footer() {
  return (
    <>
      {/* The closing thought — leads into the footer */}
      <section className="px-6 md:px-12 pt-28 pb-16 border-t border-white/[0.08] mt-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-serif font-light italic text-white/70 text-[20px] md:text-[26px] leading-[1.55]">
            The Sky Has Always Inspired Questions.
            <br />
            We&rsquo;re Simply Continuing The Conversation.
          </p>
        </div>
      </section>

      <footer className="px-6 md:px-12 pt-10 pb-12">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div>
            <div className="font-serif text-2xl font-light leading-none text-white">
              Plutto
            </div>
            <p className="mt-4 max-w-xs text-[12px] leading-relaxed text-white/45">
              A Voice-First Astrology Oracle.
              <br />
              iOS &amp; Android — Soon.
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] uppercase tracking-[0.32em] text-white/45">
            <a className="hover:text-white transition-colors" href="https://api.plutto.space/privacy">Privacy</a>
            <a className="hover:text-white transition-colors" href="https://api.plutto.space/static/terms.html">Terms</a>
            <a className="hover:text-white transition-colors" href="https://api.plutto.space/static/delete.html">Delete Account</a>
            <a className="hover:text-white transition-colors" href="mailto:support@plutto.space">Contact</a>
          </nav>
        </div>
        <p className="mt-12 text-[10px] uppercase tracking-[0.4em] text-white/25">
          © Xooteq Lab
        </p>
      </footer>
    </>
  );
}
