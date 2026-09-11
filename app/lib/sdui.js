/**
 * SDUI STYLE — a React Native style object, as the backend writes it, turned
 * into CSS the browser understands.
 *
 * The backend describes whole screens as trees of primitive nodes (Explore, the
 * observations shelf, the library boards). Their `style` objects are written for
 * the phone's renderer, and most keys carry straight over — but four things do
 * not, and each of them silently ruins a layout rather than erroring:
 *
 *   1. NUMBERS ARE PIXELS. `fontSize: 24` means 24px. In CSS a bare number is
 *      invalid for most properties and the declaration is dropped, so a card
 *      would lose its radius, its padding and its type size all at once.
 *   2. THE SHORTHANDS ARE RN'S OWN. paddingHorizontal / paddingVertical /
 *      marginHorizontal / marginVertical do not exist in CSS.
 *   3. FLEX IS THE DEFAULT THERE, BLOCK HERE, and the default direction is
 *      column rather than row. A style that says `justifyContent: flex-end`
 *      assumes a flex column and does nothing to a block div.
 *   4. A FEW VALUES ARE TOKENS — "$serif", "$gold", "$accent" — resolved against
 *      the live theme so a backend tree can use the app's own palette and faces.
 */

// Properties whose numbers are NOT pixels. Everything else numeric gets px.
const UNITLESS = new Set([
  'opacity', 'zIndex', 'flex', 'flexGrow', 'flexShrink', 'fontWeight',
  'aspectRatio', 'order', 'lineClamp',
]);

// Anything here means the node is laid out, not just painted, so it needs
// display:flex — RN gives every view flex by default and CSS does not.
const FLEXY = new Set([
  'justifyContent', 'alignItems', 'alignContent', 'flexDirection', 'flexWrap',
  'gap', 'rowGap', 'columnGap', 'flex',
]);

function token(v, theme) {
  if (typeof v !== 'string' || v[0] !== '$') return v;
  const t = theme || {};
  const key = v.slice(1);
  if (key === 'gold') return '#D4AF37';
  if (key === 'accent') return t.accent || '#D4AF37';
  // The faces the backend names (theme.fonts registers the files). On the phone
  // these are loaded families; here they are whatever the site already has for
  // that role, so a tree asking for the display face gets the display face.
  if (key === 'serif') return 'var(--font-reading), Syne, system-ui, sans-serif';
  if (key === 'serifBold') return 'var(--font-display), Syne, system-ui, sans-serif';
  return t[key] != null ? t[key] : v;
}

const px = (k, v) =>
  typeof v === 'number' && !UNITLESS.has(k) ? `${v}px` : v;

export function css(style, theme) {
  if (!style || typeof style !== 'object') return undefined;
  const out = {};
  let flexy = false;
  for (const k in style) {
    const raw = token(style[k], theme);
    if (raw == null) continue;
    if (FLEXY.has(k)) flexy = true;
    switch (k) {
      case 'paddingHorizontal':
        out.paddingLeft = px(k, raw); out.paddingRight = px(k, raw); break;
      case 'paddingVertical':
        out.paddingTop = px(k, raw); out.paddingBottom = px(k, raw); break;
      case 'marginHorizontal':
        out.marginLeft = px(k, raw); out.marginRight = px(k, raw); break;
      case 'marginVertical':
        out.marginTop = px(k, raw); out.marginBottom = px(k, raw); break;
      case 'borderWidth':
        // RN paints a border from width alone; CSS needs a style as well, and
        // without it the border is simply absent.
        out.borderWidth = px(k, raw); out.borderStyle = 'solid'; break;
      case 'fontWeight':
        out.fontWeight = String(raw); break;
      case 'lineHeight':
        // RN line height is pixels, CSS's bare number is a multiplier — the same
        // value read the wrong way turns 20px leading into 20 lines of space.
        out.lineHeight = typeof raw === 'number' ? `${raw}px` : raw; break;
      case 'letterSpacing':
        out.letterSpacing = typeof raw === 'number' ? `${raw}px` : raw; break;
      case 'shadowColor': case 'shadowOffset': case 'shadowOpacity':
      case 'shadowRadius': case 'elevation':
        break;                                   // RN shadows; the web has its own
      default:
        out[k] = px(k, raw);
    }
  }
  if (flexy && !out.display) {
    out.display = 'flex';
    if (!out.flexDirection) out.flexDirection = 'column';   // RN's default, not CSS's
  }
  if (out.position === 'absolute' && out.display === undefined) out.display = 'block';
  return out;
}

/** `props.lines` — the phone's numberOfLines, as a clamp. */
export function clamp(lines) {
  if (!lines || lines < 1) return undefined;
  return {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: lines,
    overflow: 'hidden',
  };
}
