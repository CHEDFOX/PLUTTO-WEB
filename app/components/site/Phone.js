/**
 * THE PHONE — the product, on the device it lives on.
 *
 * A product page that never shows the product reads as a promise. These are the
 * app's own screens rebuilt in markup from its own styles: the chat's starfield,
 * the user's bubble (15/22, white 85% on white 6%, radius 16), the Oracle's reply
 * in Baloo 2 at 17/27, the follow-up chips, the card the Oracle
 * deals. Markup rather than screenshots so they are sharp at every width and
 * cost no bytes — swap in real captures the day there are good ones.
 *
 * The frame is drawn, not an image: a rounded bezel, the island, a hairline of
 * light on the rim. `scale` shrinks the whole thing with a transform so the
 * screens keep their true pixel sizes inside it.
 */

const W = 300;
const H = 640;

export function Phone({ children, className = '', style, floating = false }) {
  return (
    <div
      className={`${floating ? 'absolute' : 'relative'} shrink-0 rounded-[52px] bg-[#0b0b0f] p-[10px] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.12),inset_0_0_0_1px_rgba(255,255,255,0.06)] ${className}`}
      style={{ width: W + 20, height: H + 20, ...style }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[42px] bg-black">
        {children}
        {/* the island */}
        <div className="absolute left-1/2 top-[11px] z-20 h-[30px] w-[96px] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}

export function StatusBar({ time = '9:41' }) {
  return (
    <div className="relative z-10 flex h-[50px] items-end justify-between px-7 pb-1.5 font-ui text-[14px] font-semibold text-white">
      <span>{time}</span>
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="white"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.5" y="5" width="3" height="6" rx="1" /><rect x="9" y="2.5" width="3" height="8.5" rx="1" /><rect x="13.5" y="0" width="3" height="11" rx="1" /></svg>
        <svg width="24" height="11" viewBox="0 0 24 11" fill="none"><rect x="0.5" y="0.5" width="20" height="10" rx="3" stroke="white" strokeOpacity=".4" /><rect x="2" y="2" width="15" height="7" rx="1.6" fill="white" /><rect x="21.5" y="3.5" width="1.6" height="4" rx=".8" fill="white" fillOpacity=".4" /></svg>
      </span>
    </div>
  );
}

// A few fixed stars, so the three screens share one sky and it never flickers
// between server and client renders.
const STARS = [
  [12, 8, 1], [78, 5, 1.4], [44, 14, 1], [90, 22, 1], [22, 30, 1.2], [64, 36, 1],
  [8, 48, 1], [52, 52, 1.4], [86, 60, 1], [30, 66, 1], [70, 74, 1.2], [16, 82, 1],
  [58, 88, 1], [94, 92, 1], [38, 96, 1.2], [6, 18, 0.8], [34, 42, 0.8], [80, 44, 0.8],
];

export function Sky({ tint = 'rgba(88,70,200,0.28)' }) {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: `radial-gradient(120% 60% at 50% 0%, ${tint}, transparent 70%), #04040a` }} />
      {STARS.map(([x, y, r], i) => (
        <span key={i} className="absolute rounded-full bg-white"
              style={{ left: `${x}%`, top: `${y}%`, width: r * 2, height: r * 2, opacity: 0.25 + (i % 4) * 0.12 }} />
      ))}
    </div>
  );
}

/** The Oracle, mid-conversation. */
export function ChatScreen() {
  return (
    <div className="absolute inset-0 flex flex-col text-left">
      <Sky />
      <StatusBar />
      <div className="relative z-10 flex items-center justify-center gap-2 pb-3 pt-2 font-ui">
        <span className="relative inline-block h-[16px] w-[16px] rounded-full bg-gradient-to-br from-white to-white/40">
          <span className="absolute inset-[4px] rounded-full bg-[#04040a]" />
        </span>
        <span className="text-[15px] font-semibold tracking-[-0.01em] text-white">Plutto</span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col gap-5 px-5 pt-3">
        <div className="self-end rounded-2xl bg-white/[0.06] px-[14px] py-[10px] font-ui text-[15px] font-light leading-[22px] text-white/85">
          Should I take the job?
        </div>
        <p className="font-app text-[17px] leading-[27px] text-white/80">
          Take it. The first winter is cold and the money comes late — but it comes.
        </p>
        <p className="font-app text-[17px] leading-[27px] text-white/80">
          Read the contract twice. The second clause is the one that matters.
        </p>
        <div className="flex gap-2 font-ui">
          {['Why the winter?', 'Tell me more'].map((c) => (
            <span key={c} className="rounded-full border border-white/15 px-3 py-1.5 text-[12px] text-white/70">{c}</span>
          ))}
        </div>
      </div>

      <div className="relative z-10 px-4 pb-8">
        <div className="flex h-[48px] items-center gap-3 rounded-full bg-white/[0.08] pl-5 pr-1.5 ring-1 ring-white/10">
          <span className="flex-1 font-ui text-[14px] text-white/40">Ask anything</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
            <svg width="14" height="18" viewBox="0 0 14 18" fill="none" stroke="black" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <rect x="4" y="1" width="6" height="10" rx="3" /><path d="M1 8.5a6 6 0 0 0 12 0M7 14.5V17" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

/** A card, dealt and read. */
export function CardScreen() {
  return (
    <div className="absolute inset-0 flex flex-col">
      <Sky tint="rgba(40,110,200,0.32)" />
      <StatusBar />
      <div className="relative z-10 flex flex-1 flex-col items-center px-6 pt-6 text-center">
        <p className="font-ui text-[12px] font-medium text-white/50">Tarot · one card</p>
        <img src="/library/tarot/the_star.webp" alt="The Star" width={300} height={527}
             className="mt-5 w-[150px] rounded-[8px] shadow-[0_30px_60px_-20px_rgba(120,170,255,0.55)] ring-1 ring-white/15" />
        <p className="mt-6 font-ui text-[24px] font-semibold tracking-[-0.03em] text-white">The Star</p>
        <p className="mt-3 font-app text-[16px] leading-[25px] text-white/75">
          Rest now. What you lost is already on its way back — slower than you want, whole when it comes.
        </p>
      </div>
      <div className="relative z-10 flex justify-center pb-9">
        <span className="rounded-full bg-white px-5 py-2.5 font-ui text-[14px] font-semibold text-black">Ask about it</span>
      </div>
    </div>
  );
}

/** The morning line, arriving on the lock screen. */
export function LockScreen() {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="absolute inset-0" aria-hidden="true"
           style={{ background: 'radial-gradient(90% 55% at 30% 20%, rgba(255,140,90,0.55), transparent 70%), radial-gradient(90% 60% at 80% 75%, rgba(90,80,230,0.6), transparent 70%), #07060f' }} />
      <StatusBar time="" />
      <div className="relative z-10 pt-6 text-center font-ui text-white">
        <p className="text-[16px] font-medium text-white/80">Tuesday 9 January</p>
        <p className="mt-1 text-[84px] font-semibold leading-none tracking-[-0.04em]">7:30</p>
      </div>
      <div className="relative z-10 mt-auto px-3 pb-24">
        <div className="rounded-[22px] bg-white/[0.16] p-3.5 font-ui backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-black">
              <span className="relative inline-block h-[16px] w-[16px] rounded-full bg-gradient-to-br from-white to-white/40">
                <span className="absolute inset-[4px] rounded-full bg-black" />
              </span>
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between">
                <span className="text-[14px] font-semibold text-white">Your morning</span>
                <span className="text-[12px] text-white/60">now</span>
              </div>
              <p className="text-[14px] leading-[19px] text-white/90">
                A quiet day for decisions. Say the hard thing before noon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Onboarding: the only setup there is. */
export function WhenScreen() {
  const rows = [['Date', '14 March 1996'], ['Time', '6:40 am'], ['Place', 'Mumbai, India']];
  return (
    <div className="absolute inset-0 flex flex-col text-left">
      <Sky tint="rgba(120,90,255,0.3)" />
      <StatusBar />
      <div className="relative z-10 flex gap-1.5 px-6 pt-4" aria-hidden="true">
        {[1, 1, 1, 0].map((on, i) => (
          <span key={i} className={`h-[3px] flex-1 rounded-full ${on ? 'bg-white' : 'bg-white/20'}`} />
        ))}
      </div>
      <div className="relative z-10 flex-1 px-6 pt-10">
        <p className="font-app text-[28px] font-medium leading-[34px] text-white">When did you arrive?</p>
        <p className="mt-2 font-ui text-[14px] text-white/50">The sky at that minute is where every reading starts.</p>
        <div className="mt-8 space-y-3 font-ui">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between rounded-2xl bg-white/[0.07] px-4 py-3.5 ring-1 ring-white/10">
              <span className="text-[13px] text-white/50">{k}</span>
              <span className="text-[15px] font-medium text-white">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-10 px-6 pb-9">
        <div className="flex h-[50px] items-center justify-center rounded-full bg-white font-ui text-[15px] font-semibold text-black">Continue</div>
      </div>
    </div>
  );
}

/** Voice: it talks, and it listens while it talks. */
export function VoiceScreen() {
  return (
    <div className="absolute inset-0 flex flex-col">
      <Sky tint="rgba(56,140,255,0.26)" />
      <StatusBar />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <div className="relative h-[190px] w-[190px]" aria-hidden="true">
          <span className="orb-ring absolute inset-0 rounded-full ring-1 ring-sky-300/30" />
          <span className="orb-ring absolute inset-0 rounded-full ring-1 ring-violet-300/30" style={{ animationDelay: '1.2s' }} />
          <span className="orb-core absolute inset-[22px] rounded-full"
                style={{ background: 'radial-gradient(circle at 35% 30%, #fff 0%, #a5d8ff 18%, #7c5cff 55%, #2a1b6b 100%)', boxShadow: '0 0 80px 10px rgba(124,92,255,0.55)' }} />
        </div>
        <p className="mt-10 px-8 text-center font-app text-[18px] leading-[27px] text-white/85">
          …so read it twice. The second clause is the one that matters.
        </p>
      </div>
      <div className="relative z-10 flex items-center justify-center gap-4 pb-10 font-ui">
        <span className="rounded-full bg-white/10 px-4 py-2 text-[13px] text-white/75 ring-1 ring-white/10">Tap to interrupt</span>
      </div>
    </div>
  );
}
