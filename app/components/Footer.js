export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 pt-14 pb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <div className="font-display text-xl font-bold tracking-tight text-[#F0F0F0]">
              PLUTTO
            </div>
            <p
              className="mt-3 uppercase text-[#888]"
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: '0.65rem',
                letterSpacing: '0.3em',
              }}
            >
              An Oracle That Speaks Back · iOS &amp; Android — soon
            </p>
          </div>
          <nav
            className="flex flex-wrap items-center gap-x-6 gap-y-3 uppercase"
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
            }}
          >
            <a
              className="text-[#888] transition-colors hover:text-[#7FB8FF]"
              href="https://api.plutto.space/privacy"
            >
              Privacy
            </a>
            <a
              className="text-[#888] transition-colors hover:text-[#7FB8FF]"
              href="https://api.plutto.space/static/terms.html"
            >
              Terms
            </a>
            <a
              className="text-[#888] transition-colors hover:text-[#7FB8FF]"
              href="https://api.plutto.space/static/delete.html"
            >
              Delete Account
            </a>
            <a
              className="text-[#888] transition-colors hover:text-[#7FB8FF]"
              href="mailto:support@plutto.space"
            >
              Contact
            </a>
          </nav>
        </div>
        <p
          className="mt-10 uppercase text-[#444]"
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: '0.65rem',
            letterSpacing: '0.4em',
          }}
        >
          © Xooteq Lab
        </p>
      </div>
    </footer>
  );
}
