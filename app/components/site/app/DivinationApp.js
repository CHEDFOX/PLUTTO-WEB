/**
 * TAROT — the divination screen: the SDUI tree from divination.py, drawn by
 * src/render/Divination.js inside a fullscreen sheet.
 *
 * Shown in the state after the three-card spread ("Past · Present · Future",
 * DEFAULT_SPREAD) has been laid and each card tapped face up. Everything here
 * is identical in the build on sale and the one in review; the tap-to-expand
 * panel is where the two differ, so it is not shown.
 *
 *   sheet     bg #000 (opened from a chat hook), close ✕ 20 pt white 50 %
 *             at top 62 right 28, grab handle 36 × 3.5 white 10 % at y 54
 *   title     "Tarot" — Baloo 2, 27 pt, white 96 %, tracking 0.3, at y 74;
 *             its marginBottom 40 applied twice by sdui.js, so 80 below
 *   chips     SF 12 pt, tracking 0.4, 7×14 padding, r 20, 0.7 pt white 18 %;
 *             selected #E0A458 on #12101c; all at 40 % once a card is laid
 *   slots     78 × 125 (min(78, round(393·0.2)) × 1.6), gap 14, r 8
 *   face-up   border white 28 %, bg #0d0b16, art under blur 12 + tint 34 %,
 *             name bar black 62 %: name Baloo 8.5/11, essence SF italic 6.5/8.5
 *   question  SF 13.5, centred, hairline white 14 %
 *   fan       backs 78 × 125 overlapping by 42 %, lifted −12 / +4.8 and tilted
 *             −5° / 0° / +5° in turn; chosen cards at 50 %
 *   actions   Undo (ghost) and REVEAL #E0A458, SF 12.5 Bold, tracking 1.6
 */

import Image from 'next/image';

const W = (a) => `rgba(255,255,255,${a})`;
const SERIF = 'var(--font-app), "Baloo 2", sans-serif';
const ACCENT = '#E0A458';
const CW = 78, CH = 125;

const SPREADS = ['Single Card', 'Past · Present · Future', 'The Celtic Cross', 'Between Two'];
const LAID = [
  { id: 'the_moon', name: 'The Moon', essence: 'The night road. Illusion, dream, fear that may or may not be about the real thing.' },
  { id: 'the_star', name: 'The Star', essence: 'Hope after the Tower. Quiet faith, healing, being seen as you are.' },
  { id: 'the_sun', name: 'The Sun', essence: 'Clarity and gladness. What is happening is good and does not need interpreting.' },
];
const PICKED = new Set([1, 3, 4]);

function Veil() {
  // expo-blur intensity 12 (dark) + the backend's cardTint.
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', background: 'rgba(0,0,0,0.08)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,8,20,0.34)' }} />
    </>
  );
}

function Back({ style }) {
  return (
    <div style={{ position: 'relative', width: CW, height: CH, borderRadius: 8, overflow: 'hidden', border: `0.7px solid ${W(0.14)}`, background: '#0d0b16', flex: 'none', ...style }}>
      <div style={{ position: 'absolute', inset: 0, background: '#141024', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: 'rgba(224,164,88,0.5)' }}>✦</div>
      <Image src="/library/tarot/back.webp" alt="" width={156} height={274} sizes="78px" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <Veil />
    </div>
  );
}

function Face({ card }) {
  return (
    <div style={{ position: 'relative', width: CW, height: CH, borderRadius: 8, overflow: 'hidden', border: `0.7px solid ${W(0.28)}`, background: '#0d0b16' }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 33, color: 'rgba(224,164,88,0.5)' }}>✦</div>
      <Image src={`/library/tarot/${card.id}.webp`} alt={card.name} width={156} height={274} sizes="78px" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <Veil />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.62)', padding: '4px 3px' }}>
        <p style={{ fontFamily: SERIF, fontSize: 8.5, lineHeight: '11px', color: W(0.92), textAlign: 'center' }}>{card.name}</p>
        <p style={{ fontSize: 6.5, lineHeight: '8.5px', fontStyle: 'italic', color: W(0.62), marginTop: 1.5, textAlign: 'center', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{card.essence}</p>
      </div>
    </div>
  );
}

export default function DivinationApp() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#000' }}>
      {/* grab handle + close */}
      <div style={{ position: 'absolute', top: 54, left: '50%', marginLeft: -18, width: 36, height: 3.5, borderRadius: 2, background: W(0.1) }} />
      <div style={{ position: 'absolute', top: 62, right: 28, zIndex: 5 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 6.5 L17.5 17.5 M17.5 6.5 L6.5 17.5" stroke={W(0.5)} strokeWidth="2.4" strokeLinecap="round" fill="none" /></svg>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ height: 74 }} />
        <p style={{ fontFamily: SERIF, fontSize: 27, lineHeight: '43.3px', letterSpacing: 0.3, color: 'rgba(255,255,255,0.96)', marginBottom: 80 }}>Tarot</p>

        {/* spreads */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 48, opacity: 0.4, maxWidth: 353 }}>
          {SPREADS.map((s) => {
            const on = s === 'Past · Present · Future';
            return (
              <span key={s} style={{ padding: '7px 14px', borderRadius: 20, border: `0.7px solid ${on ? ACCENT : W(0.18)}`, background: on ? ACCENT : 'transparent', fontSize: 12, lineHeight: '14.3px', letterSpacing: 0.4, color: on ? '#12101c' : W(0.75) }}>{s}</span>
            );
          })}
        </div>

        {/* slots, all laid and turned */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 48 }}>
          {LAID.map((c) => (
            <div key={c.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Face card={c} />
              <div style={{ height: 18 }} />
            </div>
          ))}
        </div>

        {/* question */}
        <div style={{ alignSelf: 'stretch', padding: '10px 0', borderBottom: `0.5px solid ${W(0.14)}`, textAlign: 'center', fontSize: 13.5, lineHeight: '16px', color: W(0.9), marginBottom: 48 }}>
          Will the move be worth it?
        </div>

        {/* the fan */}
        <div style={{ alignSelf: 'stretch', overflow: 'hidden', height: 161 }}>
          <div style={{ display: 'flex', padding: '18px 6px' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Back key={i} style={{
                marginRight: -CW * 0.42,
                transform: `translateY(${(i % 2 === 0 ? -1 : 0.4) * 12}px) rotate(${((i % 3) - 1) * 5}deg)`,
                opacity: PICKED.has(i) ? 0.5 : 1, zIndex: i,
              }} />
            ))}
          </div>
        </div>

        {/* actions */}
        <div style={{ display: 'flex', gap: 12, marginTop: 46 }}>
          <span style={{ padding: '13px 30px', borderRadius: 999, border: `0.7px solid ${W(0.2)}`, fontSize: 11, lineHeight: '14.9px', letterSpacing: 1, color: W(0.7) }}>Undo</span>
          <span style={{ padding: '13px 30px', borderRadius: 999, background: ACCENT, fontSize: 12.5, lineHeight: '14.9px', fontWeight: 700, letterSpacing: 1.6, color: '#12101c' }}>REVEAL</span>
        </div>
      </div>
    </div>
  );
}
