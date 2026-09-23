/**
 * THE DEVICE — an iPhone 15 at its real logical size (393 × 852 pt), shrunk
 * with a transform.
 *
 * Every screen inside is laid out in the app's own points: the numbers in the
 * mobile source (ChatPanel's 24pt gutters, the 82pt box clearance, the 70pt tab
 * bar, the 34pt home-indicator inset) are used as CSS pixels unchanged, and the
 * whole device is scaled as one picture. That is what keeps the proportions the
 * phone's rather than an approximation of them.
 *
 * The system chrome — status bar, Dynamic Island, home indicator — is iOS's,
 * drawn over the app the way the app draws under it (statusBarTranslucent).
 * System text uses the platform face: SF on Apple devices, which is what the
 * app's un-styled text renders in on an iPhone.
 */

export const SCREEN_W = 393;
export const SCREEN_H = 852;
export const INSET_TOP = 59;
export const INSET_BOTTOM = 34;
const BEZEL = 13;
const OUTER_W = SCREEN_W + BEZEL * 2;
const OUTER_H = SCREEN_H + BEZEL * 2;

export const SYSTEM_FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", var(--font-ui), sans-serif';

export default function Device({ width = 300, children, statusTime = '9:41', className = '', style }) {
  const k = width / OUTER_W;
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width, height: OUTER_H * k, ...style }}>
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: OUTER_W, height: OUTER_H, transform: `scale(${k})`,
          borderRadius: 68, background: '#0a0a0c', padding: BEZEL,
          boxShadow: '0 0 0 1.5px #3a3a40, 0 0 0 3px #111, 0 60px 140px -30px rgba(0,0,0,0.95)',
        }}
      >
        <div data-no-auto-case className="app-screen relative overflow-hidden bg-black" style={{ width: SCREEN_W, height: SCREEN_H, borderRadius: 55, fontFamily: SYSTEM_FONT }}>
          {children}
          <StatusBar time={statusTime} />
          {/* Dynamic Island */}
          <div className="absolute left-1/2 z-50 -translate-x-1/2 rounded-full bg-black" style={{ top: 11, width: 126, height: 37 }} />
          {/* home indicator */}
          <div className="absolute left-1/2 z-50 -translate-x-1/2 rounded-full bg-white" style={{ bottom: 8, width: 139, height: 5 }} />
        </div>
      </div>
    </div>
  );
}

function StatusBar({ time }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between text-white" style={{ height: 54, padding: '0 30px 0 50px' }}>
      <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.4, width: 54, textAlign: 'center' }}>{time}</span>
      <span className="flex items-center" style={{ gap: 6, marginRight: 4 }} aria-hidden="true">
        <svg width="19" height="12" viewBox="0 0 19 12" fill="white"><rect x="0" y="7.5" width="3.2" height="4.5" rx="0.9" /><rect x="5.1" y="5.2" width="3.2" height="6.8" rx="0.9" /><rect x="10.2" y="2.7" width="3.2" height="9.3" rx="0.9" /><rect x="15.3" y="0" width="3.2" height="12" rx="0.9" /></svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="white"><path d="M8.5 2.3c2.4 0 4.6.9 6.3 2.5l1.2-1.2A10.6 10.6 0 0 0 8.5.6 10.6 10.6 0 0 0 1 3.6l1.2 1.2a8.9 8.9 0 0 1 6.3-2.5Z" /><path d="M8.5 5.7c1.5 0 2.9.6 3.9 1.5l1.2-1.2a7.3 7.3 0 0 0-10.2 0l1.2 1.2c1-1 2.4-1.5 3.9-1.5Z" /><path d="M8.5 9.1c.6 0 1.2.2 1.6.6L8.5 11.4 6.9 9.7c.4-.4 1-.6 1.6-.6Z" /></svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="23" height="12" rx="3.8" stroke="white" strokeOpacity=".35" /><rect x="2" y="2" width="20" height="9" rx="2.5" fill="white" /><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="white" fillOpacity=".4" /></svg>
      </span>
    </div>
  );
}
