/**
 * ONBOARDING — the birth step of src/screens/BirthDetailsScreen.js.
 *
 * Date and time are ONE screen (the COMBINED step), then place. Plain black, no
 * progress bar, no starfield, system face throughout (the catalog's fonts are
 * not loaded yet this early). Copy from the backend onboarding bundle.
 *
 *   title      "When Did You Arrive\\nOn Earth?"  20/30 Thin, tracking 1.2, top 85.2
 *   back       ‹  30 pt Thin, #8A8A8E, at 16,66
 *   wheels     rows 32 pt, 3 visible, columns 76 pt, no band or rules; the rows
 *              above and below are perspective(600) rotateX(∓30°) scale(.86)
 *              at 42 %; the chosen value is 14 pt Thin in gold, its neighbours
 *              15 pt Light white. Date row at y 258.72, time row at y 474
 *   colon      22 pt Thin #8A8A8E
 *   continue   "CONTINUE" 12 pt Medium, tracking 3, white, centred on y ≈ 750
 *
 * Shown filled in: 24 JUN 1995, 14 : 30 — every wheel touched, so CONTINUE is lit.
 */

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const GOLD = '#D4AF37';

function Wheel({ top, mid, bot }) {
  const row = (text, k) => {
    const side = k !== 1;
    return (
      <div key={k} style={{
        height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: side ? `perspective(600px) rotateX(${k === 0 ? -30 : 30}deg) scale(.86)` : undefined,
        opacity: side ? 0.42 : 1,
      }}>
        <span style={side
          ? { fontSize: 15, fontWeight: 300, color: '#fff', letterSpacing: 0.5 }
          : { fontSize: 14, fontWeight: 200, color: GOLD, letterSpacing: 0.5 }}>{text}</span>
      </div>
    );
  };
  return <div style={{ width: 76, height: 96, overflow: 'hidden' }}>{[top, mid, bot].map(row)}</div>;
}

export default function OnboardingApp() {
  const d = 24, m = 5, y = 1995, h = 14, mi = 30;
  const p2 = (n) => String(n).padStart(2, '0');
  return (
    <div className="absolute inset-0" style={{ background: '#000', color: '#fff' }}>
      <span style={{ position: 'absolute', top: 66, left: 16, fontSize: 30, fontWeight: 200, color: '#8A8A8E', lineHeight: '36px' }}>‹</span>
      <p style={{ position: 'absolute', top: 85.2, left: 0, right: 0, padding: '0 32px', fontSize: 20, fontWeight: 200, lineHeight: '30px', letterSpacing: 1.2, textAlign: 'center', whiteSpace: 'pre-line' }}>
        {'When Did You Arrive\nOn Earth?'}
      </p>

      <div style={{ position: 'absolute', top: 258.72, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <Wheel top={p2(d - 1)} mid={p2(d)} bot={p2(d + 1)} />
        <Wheel top={MONTHS[m - 1]} mid={MONTHS[m]} bot={MONTHS[m + 1]} />
        <Wheel top={y - 1} mid={y} bot={y + 1} />
      </div>

      <div style={{ position: 'absolute', top: 474, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Wheel top={p2(h - 1)} mid={p2(h)} bot={p2(h + 1)} />
        <span style={{ fontSize: 22, fontWeight: 200, color: '#8A8A8E', margin: '0 4px' }}>:</span>
        <Wheel top={p2(mi - 1)} mid={p2(mi)} bot={p2(mi + 1)} />
      </div>

      <div style={{ position: 'absolute', top: 727.76, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <span style={{ padding: '16px 32px', fontSize: 12, fontWeight: 500, letterSpacing: 3, color: '#fff' }}>CONTINUE</span>
      </div>
    </div>
  );
}
