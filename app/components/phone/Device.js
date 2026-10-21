import { StatusBar } from './StatusBar';
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
