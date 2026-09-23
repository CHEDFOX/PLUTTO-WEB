/**
 * STORE BADGES — shaped like the platforms' own, and honest about the date.
 *
 * Black, rounded, the platform mark on the left and two lines of text, which is
 * the shape a visitor recognises as "an app store link" before they read it.
 * The apps are not public yet, so the small line says so instead of "Download
 * on the"; change `soon` to false (and give each an href) the day they are.
 */

const soon = true;

export default function StoreBadges({ className = '' }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 font-ui ${className}`}>
      <Badge mark={<AppleGlyph />} small={soon ? 'Coming soon to the' : 'Download on the'} big="App Store" />
      <Badge mark={<PlayGlyph />} small={soon ? 'Coming soon to' : 'Get it on'} big="Google Play" />
    </div>
  );
}

function Badge({ mark, small, big }) {
  return (
    <div className="flex h-[52px] items-center gap-2.5 rounded-xl border border-white/20 bg-black px-4 text-white">
      <span className="text-white">{mark}</span>
      <span className="flex flex-col leading-none">
        <span className="text-[10px] text-white/70">{small}</span>
        <span className="mt-1 text-[18px] font-semibold tracking-[-0.01em]">{big}</span>
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
    <svg width="20" height="22" viewBox="0 0 20 22" aria-hidden="true">
      <path d="M1 1.2 11.4 11 1 20.8c-.3-.2-.5-.6-.5-1V2.2c0-.4.2-.8.5-1z" fill="#34A853" />
      <path d="M14.8 7.6 11.4 11 1 1.2c.1-.1.3-.2.5-.2.2 0 .4.1.6.2l12.7 6.4z" fill="#FBBC04" />
      <path d="M14.8 14.4 2.1 20.8c-.2.1-.4.2-.6.2-.2 0-.4-.1-.5-.2L11.4 11l3.4 3.4z" fill="#EA4335" />
      <path d="M19 11c0 .4-.2.8-.6 1l-3.6 2.4L11.4 11l3.4-3.4L18.4 10c.4.2.6.6.6 1z" fill="#4285F4" />
    </svg>
  );
}
