/**
 * SMALL MOVING PARTS OF THE APP, in CSS.
 *
 *   Orbit       MicroLoader's 'orbit' variant (theme.loader.variant = 'orbit'):
 *               five gold dots, radius 0.34·size, dot 0.13·size, the ring turning
 *               in 3.4 s while each dot bobs (760 + 190·i ms) and pulses
 *               (560 + 130·i ms) on its own clock. Size 34, colour theme.accent.
 *   SendButton  32 pt circle, white 12 %, six 1.8 pt particles in the model's
 *               colour orbiting at radii 4–9 on one 5.6 s loop, phases 0–0.9.
 */

export function Orbit({ size = 34, color = '#D4AF37', collapsing = false }) {
  const R = size * 0.34;
  const dot = Math.max(3, Math.round(size * 0.13));
  return (
    <div style={{ width: size, height: size, position: 'relative' }} aria-hidden="true">
      <div className="app-orbit" style={{ position: 'absolute', inset: 0, transition: 'transform 260ms cubic-bezier(.2,1.4,.4,1), opacity 260ms', transform: collapsing ? 'scale(0.04)' : 'scale(1)', opacity: collapsing ? 0 : 1 }}>
        <div className="app-orbit-spin" style={{ position: 'absolute', inset: 0 }}>
          {Array.from({ length: 5 }).map((_, i) => {
            const a = (i / 5) * Math.PI * 2;
            return (
              <span key={i} style={{ position: 'absolute', left: size / 2 - dot / 2, top: size / 2 - dot / 2, width: dot, height: dot }}>
                <span className="app-orbit-bob" style={{ display: 'block', width: dot, height: dot, '--bx': `${Math.cos(a) * R}px`, '--by': `${Math.sin(a) * R}px`, animationDuration: `${760 + i * 190}ms` }}>
                  <span className="app-orbit-pulse" style={{ display: 'block', width: dot, height: dot, borderRadius: dot, background: color, animationDuration: `${560 + i * 130}ms` }} />
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const DOTS = [{ r: 4, p: 0 }, { r: 7, p: 0.18 }, { r: 5, p: 0.36 }, { r: 9, p: 0.54 }, { r: 6, p: 0.72 }, { r: 8, p: 0.9 }];

export function SendButton({ color = '#EF4444' }) {
  return (
    <div style={{ width: 32, height: 32, borderRadius: 16, overflow: 'hidden', background: 'rgba(255,255,255,0.12)', position: 'relative', flex: 'none' }} aria-hidden="true">
      {DOTS.map((d, i) => (
        <span key={i} className="app-send-dot" style={{
          position: 'absolute', left: 16 - 0.9, top: 16 - 0.9, width: 1.8, height: 1.8, borderRadius: 1,
          background: color, opacity: 0.85, '--r': `${d.r}px`, animationDelay: `${-d.p * 5600}ms`,
        }} />
      ))}
    </div>
  );
}
