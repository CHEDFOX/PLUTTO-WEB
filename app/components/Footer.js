export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <nav
          className="flex flex-wrap items-center gap-x-6 gap-y-3 uppercase"
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: '0.65rem',
            letterSpacing: '0.3em',
          }}
        >
          <a
            className="text-[#888] transition-colors hover:text-[#2962FF]"
            href="https://api.plutto.space/privacy"
          >
            Privacy
          </a>
          <a
            className="text-[#888] transition-colors hover:text-[#2962FF]"
            href="https://api.plutto.space/static/terms.html"
          >
            Terms
          </a>
          <a
            className="text-[#888] transition-colors hover:text-[#2962FF]"
            href="https://api.plutto.space/static/delete.html"
          >
            Delete Account
          </a>
          <a
            className="text-[#888] transition-colors hover:text-[#2962FF]"
            href="mailto:support@plutto.space"
          >
            Contact
          </a>
        </nav>
        <p
          className="uppercase text-[#444]"
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
