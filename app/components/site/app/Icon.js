/**
 * THE APP'S OWN ICONS — src/render/Icon.js from the mobile app, converted
 * mechanically from react-native-svg to DOM SVG (tag names lowercased, the
 * remote-image override dropped). Every path, radius and stroke is the app's,
 * so a glyph on the landing page is the glyph on the phone. Regenerate from the
 * source rather than editing by hand.
 */

const getTheme = () => ({ icons: { variant: 'rounded' } });

// scalloped "blob" path — n soft lobes around a circle (used for the Oracle orb).
function blob(n = 10, R = 7.4, amp = 1.5, cx = 12, cy = 12) {
  const step = (Math.PI * 2) / n;
  let d = '';
  for (let i = 0; i <= n; i++) {
    const a = i * step;
    const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
    if (i === 0) { d = `M${x.toFixed(2)} ${y.toFixed(2)}`; continue; }
    const pa = a - step / 2, cr = R + amp;
    const qx = cx + Math.cos(pa) * cr, qy = cy + Math.sin(pa) * cr;
    d += ` Q${qx.toFixed(2)} ${qy.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d + ' Z';
}
const BLOB = blob(10, 7.2, 1.5);

// Amplitude-modulated waveform path (the "sound wave" look): a flat baseline that
// swells into oscillations toward the centre and settles flat again at the edges.
// envFn(t) in [0,1] shapes the amplitude across the width (t is 0..1).
function amWave({ cx = 12, cy = 12, x0 = 1.5, x1 = 22.5, cycles = 9, maxAmp = 8, step = 0.5, envFn }) {
  const span = x1 - x0;
  const env = envFn || ((t) => Math.pow(Math.sin(Math.PI * t), 1.3));
  let d = '';
  for (let x = x0; x <= x1 + 0.001; x += step) {
    const t = (x - x0) / span;
    const y = cy - Math.sin(t * Math.PI * 2 * cycles) * maxAmp * env(t);
    d += (d ? ' L' : 'M') + `${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
}
// Single centred hump envelope (two lobes) — two raised-cosine humps. (kept for amWave)
const WAVE_TWO_HUMP = (t) => {
  const h = (c, w) => Math.max(0, Math.cos((t - c) / w * Math.PI / 2));
  return Math.min(1, h(0.34, 0.26) + h(0.66, 0.26));
};

// Baked "tangled strings" mark (the F3 design): 4 ultra-thin strands [pathD, opacity].
// Pre-computed (smooth bezier) so there's no runtime randomness — identical every render.
const SOUNDWAVE_STRANDS = [
  ['M2.20 12.53 C2.87 12.77 3.03 12.49 3.20 12.22 C3.37 11.95 3.53 11.14 3.70 11.19 C3.87 11.25 4.03 11.89 4.20 12.52 C4.37 13.16 4.53 14.80 4.70 15.00 C4.87 15.20 5.03 14.65 5.20 13.72 C5.37 12.79 5.53 10.13 5.70 9.43 C5.87 8.73 6.03 8.53 6.20 9.51 C6.37 10.48 6.53 13.94 6.70 15.27 C6.87 16.61 7.03 18.17 7.20 17.51 C7.37 16.84 7.53 13.19 7.70 11.30 C7.87 9.40 8.03 6.14 8.20 6.15 C8.37 6.15 8.53 9.15 8.70 11.33 C8.87 13.51 9.03 18.35 9.20 19.22 C9.37 20.09 9.53 18.60 9.70 16.55 C9.87 14.49 10.03 8.65 10.20 6.90 C10.37 5.15 10.53 4.55 10.70 6.04 C10.87 7.53 11.03 13.45 11.20 15.86 C11.37 18.27 11.53 21.09 11.70 20.49 C11.87 19.88 12.03 14.90 12.20 12.24 C12.37 9.57 12.53 4.92 12.70 4.51 C12.87 4.10 13.03 7.33 13.20 9.78 C13.37 12.23 13.53 17.90 13.70 19.20 C13.87 20.51 14.03 19.45 14.20 17.62 C14.37 15.79 14.53 10.10 14.70 8.22 C14.87 6.33 15.03 5.32 15.20 6.31 C15.37 7.30 15.53 12.09 15.70 14.13 C15.87 16.17 16.03 18.68 16.20 18.54 C16.37 18.40 16.53 15.08 16.70 13.29 C16.87 11.50 17.03 8.32 17.20 7.82 C17.37 7.33 17.53 9.05 17.70 10.31 C17.87 11.58 18.03 14.62 18.20 15.42 C18.37 16.21 18.53 15.77 18.70 15.10 C18.87 14.42 19.03 12.11 19.20 11.35 C19.37 10.59 19.53 10.34 19.70 10.56 C19.87 10.77 20.03 12.16 20.20 12.64 C20.37 13.12 20.53 13.45 20.70 13.45 C20.87 13.46 21.03 12.83 21.20 12.67', 0.88],
  ['M2.20 12.53 C2.87 12.28 3.03 11.98 3.20 12.04 C3.37 12.10 3.53 12.40 3.70 12.70 C3.87 13.00 4.03 13.74 4.20 13.82 C4.37 13.91 4.53 13.70 4.70 13.22 C4.87 12.74 5.03 11.41 5.20 10.94 C5.37 10.48 5.53 10.02 5.70 10.41 C5.87 10.79 6.03 12.37 6.20 13.27 C6.37 14.17 6.53 15.73 6.70 15.81 C6.87 15.89 7.03 14.83 7.20 13.75 C7.37 12.67 7.53 10.12 7.70 9.34 C7.87 8.56 8.03 8.28 8.20 9.06 C8.37 9.84 8.53 12.63 8.70 14.02 C8.87 15.40 9.03 17.39 9.20 17.37 C9.37 17.34 9.53 15.41 9.70 13.87 C9.87 12.33 10.03 9.03 10.20 8.13 C10.37 7.22 10.53 7.35 10.70 8.44 C10.87 9.53 11.03 13.08 11.20 14.67 C11.37 16.27 11.53 18.18 11.70 18.00 C11.87 17.82 12.03 15.32 12.20 13.60 C12.37 11.89 12.53 8.54 12.70 7.72 C12.87 6.90 13.03 7.49 13.20 8.69 C13.37 9.89 13.53 13.47 13.70 14.94 C13.87 16.42 14.03 17.84 14.20 17.54 C14.37 17.24 14.53 14.67 14.70 13.13 C14.87 11.59 15.03 8.88 15.20 8.30 C15.37 7.72 15.53 8.60 15.70 9.65 C15.87 10.71 16.03 13.57 16.20 14.65 C16.37 15.73 16.53 16.45 16.70 16.13 C16.87 15.80 17.03 13.76 17.20 12.70 C17.37 11.63 17.53 10.02 17.70 9.74 C17.87 9.45 18.03 10.29 18.20 10.97 C18.37 11.65 18.53 13.26 18.70 13.80 C18.87 14.35 19.03 14.44 19.20 14.22 C19.37 14.00 19.53 12.94 19.70 12.50 C19.87 12.06 20.03 11.63 20.20 11.58 C20.37 11.53 20.53 12.00 20.70 12.19 C20.87 12.38 21.03 12.66 21.20 12.72', 0.84],
  ['M2.20 11.70 C2.87 11.45 3.03 11.11 3.20 11.14 C3.37 11.18 3.53 11.43 3.70 11.75 C3.87 12.06 4.03 12.88 4.20 13.03 C4.37 13.18 4.53 13.09 4.70 12.63 C4.87 12.16 5.03 10.77 5.20 10.22 C5.37 9.66 5.53 8.98 5.70 9.29 C5.87 9.60 6.03 11.13 6.20 12.10 C6.37 13.07 6.53 14.89 6.70 15.11 C6.87 15.34 7.03 14.50 7.20 13.42 C7.37 12.35 7.53 9.60 7.70 8.65 C7.87 7.70 8.03 7.05 8.20 7.73 C8.37 8.40 8.53 11.20 8.70 12.71 C8.87 14.22 9.03 16.62 9.20 16.79 C9.37 16.96 9.53 15.27 9.70 13.71 C9.87 12.15 10.03 8.54 10.20 7.42 C10.37 6.30 10.53 5.99 10.70 6.98 C10.87 7.96 11.03 11.58 11.20 13.34 C11.37 15.09 11.53 17.49 11.70 17.51 C11.87 17.53 12.03 15.22 12.20 13.46 C12.37 11.70 12.53 7.99 12.70 6.95 C12.87 5.91 13.03 6.10 13.20 7.22 C13.37 8.35 13.53 12.05 13.70 13.69 C13.87 15.33 14.03 17.20 14.20 17.06 C14.37 16.93 14.53 14.47 14.70 12.87 C14.87 11.27 15.03 8.22 15.20 7.46 C15.37 6.70 15.53 7.29 15.70 8.31 C15.87 9.32 16.03 12.33 16.20 13.54 C16.37 14.76 16.53 15.80 16.70 15.58 C16.87 15.36 17.03 13.35 17.20 12.23 C17.37 11.11 17.53 9.26 17.70 8.86 C17.87 8.46 18.03 9.17 18.20 9.84 C18.37 10.50 18.53 12.24 18.70 12.85 C18.87 13.47 19.03 13.70 19.20 13.53 C19.37 13.35 19.53 12.27 19.70 11.80 C19.87 11.33 20.03 10.80 20.20 10.72 C20.37 10.63 20.53 11.09 20.70 11.29 C20.87 11.48 21.03 11.80 21.20 11.87', 0.79],
  ['M2.20 11.74 C2.87 11.99 3.03 12.05 3.20 11.89 C3.37 11.74 3.53 11.24 3.70 11.03 C3.87 10.81 4.03 10.46 4.20 10.62 C4.37 10.77 4.53 11.45 4.70 11.97 C4.87 12.49 5.03 13.55 5.20 13.75 C5.37 13.96 5.53 13.77 5.70 13.17 C5.87 12.58 6.03 10.96 6.20 10.18 C6.37 9.41 6.53 8.40 6.70 8.55 C6.87 8.70 7.03 9.98 7.20 11.07 C7.37 12.15 7.53 14.38 7.70 15.06 C7.87 15.75 8.03 15.92 8.20 15.18 C8.37 14.45 8.53 12.00 8.70 10.63 C8.87 9.27 9.03 7.22 9.20 6.99 C9.37 6.77 9.53 7.95 9.70 9.28 C9.87 10.62 10.03 13.73 10.20 14.98 C10.37 16.23 10.53 17.27 10.70 16.80 C10.87 16.33 11.03 13.82 11.20 12.17 C11.37 10.51 11.53 7.60 11.70 6.86 C11.87 6.11 12.03 6.56 12.20 7.69 C12.37 8.81 12.53 12.04 12.70 13.60 C12.87 15.17 13.03 17.03 13.20 17.06 C13.37 17.09 13.53 15.27 13.70 13.79 C13.87 12.31 14.03 9.26 14.20 8.18 C14.37 7.09 14.53 6.69 14.70 7.30 C14.87 7.91 15.03 10.45 15.20 11.86 C15.37 13.27 15.53 15.36 15.70 15.78 C15.87 16.21 16.03 15.36 16.20 14.41 C16.37 13.47 16.53 11.10 16.70 10.11 C16.87 9.11 17.03 8.30 17.20 8.43 C17.37 8.56 17.53 9.99 17.70 10.87 C17.87 11.75 18.03 13.27 18.20 13.72 C18.37 14.18 18.53 13.99 18.70 13.62 C18.87 13.24 19.03 12.03 19.20 11.50 C19.37 10.97 19.53 10.47 19.70 10.41 C19.87 10.36 20.03 10.89 20.20 11.16 C20.37 11.44 20.53 11.92 20.70 12.07 C20.87 12.21 21.03 12.08 21.20 12.02', 0.96],
];

export default function Icon({ name, size = 20, color = 'rgba(255,255,255,0.6)', strokeWidth = 1.8, variant }) {
  // Backend can replace or ADD any icon with a remote image (theme.icons.images:
  // { name: url }) — tinted to `color`. Lets the icon set be extended/rebranded
  // with no app release. Dormant unless set → falls through to the built-in vectors.
  const v = variant || getTheme()?.icons?.variant || 'rounded';
  const wh = { width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true, style: { display: 'block', overflow: 'visible' } };
  const st = { stroke: color, strokeWidth, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  const fill = { fill: color };
  const filled = v !== 'line';   // 'rounded' (filled) is the default

  switch (name) {
    // ── transport ──
    case 'play':
      return filled
        ? <svg {...wh}><path d="M8 5.4 L18.6 11.3 a0.8 0.8 0 0 1 0 1.4 L8 18.6 a0.8 0.8 0 0 1 -1.2 -0.7 V6.1 a0.8 0.8 0 0 1 1.2 -0.7 Z" {...fill} stroke={color} strokeWidth={1.4} strokeLinejoin="round" /></svg>
        : <svg {...wh}><path d="M7 5 L19 12 L7 19 Z" {...st} /></svg>;
    case 'pause':
      return filled
        ? <svg {...wh}><rect x="6.6" y="5" width="3.8" height="14" rx="1.9" {...fill} /><rect x="13.6" y="5" width="3.8" height="14" rx="1.9" {...fill} /></svg>
        : <svg {...wh}><path d="M8.5 5 V19 M15.5 5 V19" stroke={color} strokeWidth={2.4} strokeLinecap="round" /></svg>;
    case 'next':
      return filled
        ? <svg {...wh}><path d="M5 6 L12.5 11.4 a0.7 0.7 0 0 1 0 1.2 L5 18 a0.7 0.7 0 0 1 -1.1 -0.6 V6.6 A0.7 0.7 0 0 1 5 6 Z" {...fill} /><rect x="16.4" y="5" width="3" height="14" rx="1.5" {...fill} /></svg>
        : <svg {...wh}><path d="M5 5.5 L13 12 L5 18.5 Z M17 5.5 V18.5" {...st} fill={color} /></svg>;
    case 'prev':
      return filled
        ? <svg {...wh}><path d="M19 6 L11.5 11.4 a0.7 0.7 0 0 0 0 1.2 L19 18 a0.7 0.7 0 0 0 1.1 -0.6 V6.6 A0.7 0.7 0 0 0 19 6 Z" {...fill} /><rect x="4.6" y="5" width="3" height="14" rx="1.5" {...fill} /></svg>
        : <svg {...wh}><path d="M19 5.5 L11 12 L19 18.5 Z M7 5.5 V18.5" {...st} fill={color} /></svg>;

    // ── search (magnifier — always an outline glyph, both variants) ──
    case 'search':
      return <svg {...wh}><circle cx="10.5" cy="10.5" r="6.4" {...st} /><path d="M15.3 15.3 L20 20" {...st} /></svg>;

    // ── soft-rounded transport variants (see playRound/pauseRound/forward/backward) ──
    // Filled glyphs with generously rounded corners (fill + same-color round stroke).
    case 'playRound':
      return <svg {...wh}><path d="M8 6.2 L18 11.6 a0.5 0.5 0 0 1 0 1.6 L8 17.8 a0.5 0.5 0 0 1 -0.9 -0.5 V6.7 A0.5 0.5 0 0 1 8 6.2 Z" fill={color} stroke={color} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" /></svg>;
    case 'pauseRound':
      return <svg {...wh}><rect x="6.4" y="5.4" width="4" height="13.2" rx="2" {...fill} /><rect x="13.6" y="5.4" width="4" height="13.2" rx="2" {...fill} /></svg>;
    case 'forward':   // fast-forward ▶▶ with rounded corners
      return <svg {...wh}><path d="M3.5 7.5 L10.5 11.6 a0.5 0.5 0 0 1 0 0.8 L3.5 16.5 a0.5 0.5 0 0 1 -0.8 -0.4 V7.9 A0.5 0.5 0 0 1 3.5 7.5 Z" fill={color} stroke={color} strokeWidth={1.9} strokeLinejoin="round" strokeLinecap="round" /><path d="M12.5 7.5 L19.5 11.6 a0.5 0.5 0 0 1 0 0.8 L12.5 16.5 a0.5 0.5 0 0 1 -0.8 -0.4 V7.9 A0.5 0.5 0 0 1 12.5 7.5 Z" fill={color} stroke={color} strokeWidth={1.9} strokeLinejoin="round" strokeLinecap="round" /></svg>;
    case 'backward':  // rewind ◀◀ with rounded corners
      return <svg {...wh}><path d="M20.5 7.5 L13.5 11.6 a0.5 0.5 0 0 0 0 0.8 L20.5 16.5 a0.5 0.5 0 0 0 0.8 -0.4 V7.9 A0.5 0.5 0 0 0 20.5 7.5 Z" fill={color} stroke={color} strokeWidth={1.9} strokeLinejoin="round" strokeLinecap="round" /><path d="M11.5 7.5 L4.5 11.6 a0.5 0.5 0 0 0 0 0.8 L11.5 16.5 a0.5 0.5 0 0 0 0.8 -0.4 V7.9 A0.5 0.5 0 0 0 11.5 7.5 Z" fill={color} stroke={color} strokeWidth={1.9} strokeLinejoin="round" strokeLinecap="round" /></svg>;

    // ── settings (gear) ──
    // Three lines, each longer than the one above it. Left-aligned, so the growth
    // reads as a deliberate stagger rather than a centred logo — and the shortest
    // line sits where the eye lands first. A plain hamburger (three equal lines)
    // is the most anonymous shape in mobile design; this one is still instantly
    // legible as "menu" and belongs to something.
    case 'menu':
      return (
        <svg {...wh}>
          <path d="M5 7.5 H12" {...st} />
          <path d="M5 12 H16" {...st} />
          <path d="M5 16.5 H19.5" {...st} />
        </svg>
      );

    case 'settings':
      return filled ? (
        <svg {...wh}>
          <defs><mask id="gh"><rect x="0" y="0" width="24" height="24" fill="white" /><circle cx="12" cy="12" r="3.2" fill="black" /></mask></defs>
          <g mask="url(#gh)" fill={color}>
            <circle cx="12" cy="12" r="6.6" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
              <rect key={d} x="10.4" y="1.4" width="3.2" height="5.4" rx="1.5" transform={`rotate(${d} 12 12)`} />
            ))}
          </g>
        </svg>
      ) : (
        <svg {...wh}>
          <path d="M4 7 H20 M4 12 H20 M4 17 H20" {...st} />
          <circle cx="9" cy="7" r="2.2" {...fill} /><circle cx="15" cy="12" r="2.2" {...fill} /><circle cx="8" cy="17" r="2.2" {...fill} />
        </svg>
      );

    // ── nav ──
    case 'home':
      return filled
        ? <svg {...wh}><path d="M12 3 a1.7 1.7 0 0 1 1.12 .42 L20.2 9.7 a2.2 2.2 0 0 1 .8 1.7 V18.5 A2.5 2.5 0 0 1 18.5 21 H14.6 v-4.7 a2.6 2.6 0 0 0 -5.2 0 V21 H5.5 A2.5 2.5 0 0 1 3 18.5 V11.4 a2.2 2.2 0 0 1 .8 -1.7 L10.88 3.42 A1.7 1.7 0 0 1 12 3 Z" {...fill} /></svg>
        : <svg {...wh}><path d="M4 11 L12 4 L20 11 M6 9.6 V20 H18 V9.6 M10 20 v-5 a2 2 0 0 1 4 0 v5" {...st} /></svg>;
    case 'oracle':
      return filled
        ? <svg {...wh}><path d={BLOB} {...fill} /></svg>
        : <svg {...wh}><circle cx="12" cy="12" r="8.4" {...st} /><circle cx="12" cy="12" r="3" {...fill} /></svg>;

    // ── mic ──
    case 'mic':
      return filled
        ? <svg {...wh}><rect x="9" y="2.4" width="6" height="11.2" rx="3" {...fill} /><path d="M5.6 11.4 a6.4 6.4 0 0 0 12.8 0" {...st} strokeWidth={2.1} /><rect x="11.1" y="18" width="1.8" height="3.2" rx="0.9" {...fill} /></svg>
        : <svg {...wh}><path d="M12 3 a3 3 0 0 1 3 3 v5 a3 3 0 0 1 -6 0 v-5 a3 3 0 0 1 3 -3 z" {...st} /><path d="M5 11 a7 7 0 0 0 14 0 M12 18 v3" {...st} /></svg>;
    case 'micOff':
      return filled
        ? <svg {...wh}><rect x="9" y="2.4" width="6" height="11.2" rx="3" {...fill} /><path d="M5.6 11.4 a6.4 6.4 0 0 0 12.8 0" {...st} strokeWidth={2.1} /><rect x="11.1" y="18" width="1.8" height="3.2" rx="0.9" {...fill} /><path d="M4 4 L20 20" stroke={color} strokeWidth={2.4} strokeLinecap="round" /></svg>
        : <svg {...wh}><path d="M12 3 a3 3 0 0 1 3 3 v5 a3 3 0 0 1 -6 0 v-5 a3 3 0 0 1 3 -3 z" {...st} /><path d="M5 11 a7 7 0 0 0 14 0 M12 18 v3 M4 4 L20 20" {...st} /></svg>;

    // ── misc ──
    case 'close':
      return <svg {...wh}><path d="M6.5 6.5 L17.5 17.5 M17.5 6.5 L6.5 17.5" stroke={color} strokeWidth={filled ? 2.4 : strokeWidth} strokeLinecap="round" /></svg>;
    case 'check':
      return <svg {...wh}><path d="M5 12.5 L10 17.5 L19 7" stroke={color} strokeWidth={filled ? 2.6 : strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>;
    case 'send':
      return <svg {...wh}><path d="M12 19 L12 5.5 M6 11 L12 5.5 L18 11" stroke={color} strokeWidth={filled ? 2.3 : strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>;
    case 'diagonal':
      return <svg {...wh}><path d="M7 17 L17 7 M9 7 L17 7 L17 15" {...st} /></svg>;
    case 'chevronUp':
      return <svg {...wh}><path d="M5 15 L12 8 L19 15" {...st} strokeWidth={filled ? 2.2 : strokeWidth} /></svg>;
    case 'chevronDown':
      return <svg {...wh}><path d="M5 9 L12 16 L19 9" {...st} strokeWidth={filled ? 2.2 : strokeWidth} /></svg>;
    case 'globe':
      return <svg {...wh}><circle cx="12" cy="12" r="9" {...st} /><path d="M3 12 H21 M12 3 a13 13 0 0 1 0 18 a13 13 0 0 1 0 -18" {...st} /></svg>;
    case 'sparkle':
      return <svg {...wh}><path d="M12 3 C12.6 8.4 13.6 9.4 19 10 C13.6 10.6 12.6 11.6 12 17 C11.4 11.6 10.4 10.6 5 10 C10.4 9.4 11.4 8.4 12 3 Z" {...fill} /><path d="M18 15 C18.2 17 18.5 17.3 20.5 17.5 C18.5 17.7 18.2 18 18 20 C17.8 18 17.5 17.7 15.5 17.5 C17.5 17.3 17.8 17 18 15 Z" {...fill} opacity={0.85} /></svg>;
    case 'music':
      return <svg {...wh}><path d="M9 17 V5 L19 3 V15" {...st} /><circle cx="6.5" cy="17" r="2.5" {...fill} /><circle cx="16.5" cy="15" r="2.5" {...fill} /></svg>;
    case 'sound':
      return <svg {...wh}><path d="M4 9 L4 15 L8 15 L13 19 L13 5 L8 9 Z" {...fill} stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" /><path d="M16 9 a4 4 0 0 1 0 6" {...st} /></svg>;
    case 'voice':
      return <svg {...wh}><circle cx="12" cy="12" r="3.2" {...fill} /><circle cx="12" cy="12" r="7" {...st} opacity={0.6} /><circle cx="12" cy="12" r="10.5" {...st} opacity={0.3} /></svg>;
    case 'bullet':
      return <svg {...wh}><circle cx="12" cy="12" r="2.4" {...fill} /></svg>;

    // ── extra backend-referenceable icons (use by name from the backend) ──
    case 'logout':
      return <svg {...wh}><path d="M14 4 H7 a1.5 1.5 0 0 0-1.5 1.5 V18.5 A1.5 1.5 0 0 0 7 20 H14 M10 12 H20 M17 9 l3 3 l-3 3" {...st} /></svg>;
    case 'crown':
      return <svg {...wh}><path d="M3 8 l4.5 4 L12 5 l4.5 7 L21 8 l-1.6 10 H4.6 Z" {...(filled ? fill : st)} strokeLinejoin="round" /></svg>;
    case 'lock':
      return <svg {...wh}><rect x="5" y="11" width="14" height="9" rx="2.2" {...(filled ? fill : st)} /><path d="M8 11 V8 a4 4 0 0 1 8 0 V11" {...st} /></svg>;
    case 'bell':
      return <svg {...wh}><path d="M6 16 V11 a6 6 0 0 1 12 0 V16 l1.8 2 H4.2 Z" {...st} /><path d="M10 20 a2 2 0 0 0 4 0" {...st} /></svg>;
    case 'star':
      return <svg {...wh}><path d="M12 3 l2.6 5.7 6.2 .6 -4.7 4.1 1.4 6.0 L12 16.4 6.5 19.4 7.9 13.4 3.2 9.3 9.4 8.7 Z" {...(filled ? fill : st)} strokeLinejoin="round" /></svg>;
    case 'heart':
      return <svg {...wh}><path d="M12 20 C12 20 4 14.6 4 9.2 A4 4 0 0 1 12 8 A4 4 0 0 1 20 9.2 C20 14.6 12 20 12 20 Z" {...(filled ? fill : st)} strokeLinejoin="round" /></svg>;
    case 'gift':
      return <svg {...wh}><rect x="4" y="9" width="16" height="11" rx="1.6" {...st} /><path d="M3 9 H21 M12 9 V20 M12 9 C12 6.5 10.5 5 9 5.5 C7.5 6 8.5 9 12 9 C15.5 9 16.5 6 15 5.5 C13.5 5 12 6.5 12 9 Z" {...st} /></svg>;

    // ── voice-mode waveforms (backend-referenceable, e.g. theme.voice.icon) ──
    // soundWave — fine tangled strings that swell toward the centre (the F3 mark).
    // Four ultra-thin overlapping strands with varied depth → an elegant audio
    // knot. Recolours with `color`; scales crisp at any size.
    case 'soundWave':
      return (
        <svg {...wh}>
          {SOUNDWAVE_STRANDS.map(([d, op], i) => (
            <path key={i} d={d} stroke={color} strokeWidth={0.36} fill="none"
              strokeLinecap="round" opacity={op} />
          ))}
        </svg>
      );
    // voiceBars — five rounded bars, tallest in the middle (voice-memo style, image 3).
    case 'voiceBars': {
      const heights = [6, 11, 16, 11, 6];        // relative bar heights
      const bw = 2.2, gap = 2.4;
      const total = heights.length * bw + (heights.length - 1) * gap;
      let x = 12 - total / 2;
      const bars = heights.map((h, i) => {
        const rx = x + i * (bw + gap);
        const r = <rect key={i} x={rx.toFixed(2)} y={(12 - h / 2).toFixed(2)} width={bw} height={h} rx={bw / 2} {...fill} />;
        return r;
      });
      return <svg {...wh}>{bars}</svg>;
    }
    // vinylWave — half record disc + waveform tail (image 1 style).
    case 'vinylWave':
      return (
        <svg {...wh}>
          {/* waveform tail on the left, swelling toward the disc */}
          <path
            d={amWave({ x0: 1, x1: 11.5, cy: 12, cycles: 6, maxAmp: 6.5, step: 0.35,
              envFn: (t) => Math.pow(t, 1.6) })}
            stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round"
          />
          {/* right half-disc with grooves */}
          <path d="M12 4.4 a7.6 7.6 0 0 1 0 15.2 Z" {...fill} />
          <circle cx="12" cy="12" r="1.5" fill={v === 'line' ? color : '#000'} />
          {filled
            ? <circle cx="12" cy="12" r="0.6" {...fill} />
            : <><path d="M12 6.2 a5.8 5.8 0 0 1 0 11.6" {...st} strokeWidth={0.8} opacity={0.5} />
               <path d="M12 8 a4 4 0 0 1 0 8" {...st} strokeWidth={0.8} opacity={0.5} /></>}
        </svg>
      );

    default:
      return null;
  }
}
