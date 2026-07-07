// Coming-soon "store badges" — Apple + Google glyphs in pill shape.
// Since the apps aren't listed publicly yet, these read as "Soon".

export default function StoreBadges() {
  return (
    <div className="flex flex-col items-center gap-6">
      <p
        className="uppercase text-[#A6835A]"
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: '0.7rem',
          letterSpacing: '0.32em',
        }}
      >
        Download Plutto
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Badge icon={<AppleGlyph />} label="App Store"  sub="Coming Soon" />
        <Badge icon={<PlayGlyph />}  label="Google Play" sub="Coming Soon" />
      </div>
    </div>
  );
}

function Badge({ icon, label, sub }) {
  return (
    <div
      className="flex items-center gap-3 rounded-md px-5 py-3 text-[#F0F0F0] transition-colors"
      style={{
        border: '1px solid rgba(166,131,90,0.25)',
        background: 'linear-gradient(180deg, rgba(166,131,90,0.05), rgba(166,131,90,0.02))',
      }}
    >
      <span className="opacity-80 text-[#A6835A]">{icon}</span>
      <span className="flex flex-col leading-tight">
        <span
          className="uppercase text-[#888]"
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: '0.6rem',
            letterSpacing: '0.28em',
          }}
        >
          {sub}
        </span>
        <span className="font-display text-[17px] font-bold tracking-tight">
          {label}
        </span>
      </span>
    </div>
  );
}

function AppleGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 12.04c-.02-1.96 1.6-2.9 1.67-2.95-.91-1.33-2.33-1.51-2.84-1.54-1.21-.12-2.36.71-2.97.71-.61 0-1.56-.69-2.57-.67-1.32.02-2.54.77-3.22 1.95-1.37 2.38-.35 5.9.99 7.83.65.95 1.42 2.01 2.43 1.97.98-.04 1.35-.63 2.54-.63 1.18 0 1.52.63 2.56.61 1.06-.02 1.73-.96 2.38-1.91.75-1.1 1.06-2.17 1.08-2.22-.02-.01-2.07-.79-2.05-3.15zM15.1 6.6c.54-.65.9-1.55.8-2.45-.78.03-1.72.52-2.27 1.17-.5.57-.93 1.49-.81 2.37.86.06 1.74-.44 2.28-1.09z" />
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.6 2.2v19.6c0 .55.61.87 1.06.57l14.43-9.8c.4-.27.4-.87 0-1.14L5.18 1.63c-.45-.3-1.06.02-1.06.57z" fill="currentColor" />
    </svg>
  );
}
