/**
 * EVERY PAGE'S SHARE CARD, IN WORDS — what /og/<section>/<slug> draws: the
 * page's own title, its key facts, and the body it is about where the site has
 * art for it (a nakshatra shows its lord, a sign its ruler). A page about the
 * Moon never shows a picture of Neptune: without art the card is type alone.
 */
import { GUIDES } from './guides';
import { SECTIONS } from './refpages';
import { TOOLS } from './tools';
import { CAL_YEARS, retrogrades, eclipses, ingresses } from './skycal';

const ART = { Sun: 'sun', Mercury: 'mercury', Venus: 'venus', Mars: 'mars', Rahu: 'rahu', Ketu: 'ketu' };
const art = (graha) => ART[graha] || null;
const the = (p) => (/^(Sun|Moon)$/.test(p) ? `the ${p}` : p);
const DEFAULT = 'neptune-alpha';

function build() {
  const cards = {};
  const put = (section, slug, c) => { cards[`${section}/${slug}`] = c; };
  for (const g of GUIDES) put('guides', g.slug, { eyebrow: 'Guide', title: g.title, sub: g.description, planet: DEFAULT });
  put('guides', 'index', { eyebrow: 'Guides', title: 'Every system Plutto reads, explained', sub: 'Vedic · KP · Western · Chinese BaZi · Numerology · Tarot · Astrocartography', planet: DEFAULT });
  for (const t of TOOLS) put('tools', t.slug, { eyebrow: 'Free calculator', title: t.name[0].toUpperCase() + t.name.slice(1), sub: 'Free · shows its working · nothing leaves your browser', planet: DEFAULT });
  put('tools', 'index', { eyebrow: 'Free', title: 'Astrology and numerology calculators', sub: TOOLS.map((t) => t.short).join(' · '), planet: DEFAULT });
  for (const [key, s] of Object.entries(SECTIONS)) {
    const section = s.base.slice(1);
    put(section, 'index', { eyebrow: 'Reference', title: s.hubTitle.split(':')[0], sub: s.hubTitle.split(':')[1]?.trim() || '', planet: DEFAULT });
    for (const x of s.items) {
      const p = s.page(x);
      const c = { eyebrow: s.label, title: p.h1[0].toUpperCase() + p.h1.slice(1) };
      if (key === 'nakshatras') Object.assign(c, { sub: `${x.n} of 27 · ${x.from} – ${x.to} · ruled by ${the(x.lord)}`, planet: art(x.lord) });
      if (key === 'grahas') Object.assign(c, { sub: `${x.dasha}-year mahadasha · exalted in ${x.exalt.split(' ')[0]}`, planet: art(x.key) });
      if (key === 'signs') Object.assign(c, { title: `${x.name} · ${x.sanskrit}`, sub: `${x.element} · ${x.mode} · ruled by ${the(x.ruler.split(' (')[0])} · ${x.trop}`, planet: art(x.ruler.split(' ')[0]) });
      if (key === 'animals') Object.assign(c, { title: `Year of the ${x.name}`, sub: `${x.polarity} · fixed element ${x.element} · ${x.years.filter((y) => y.year >= 1990 && y.year <= 2030).map((y) => y.year).join(', ')}`, planet: null });
      put(section, x.slug, c);
    }
  }
  // The sky calendar and the panchang.
  const short = (t) => new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
  for (const y of CAL_YEARS) {
    const m = retrogrades(y).Mercury.filter((p) => new Date(p.from).getUTCFullYear() === y);
    put('mercury-retrograde', String(y), { eyebrow: 'Sky calendar', title: `Mercury retrograde ${y}`, sub: m.map((p) => `${short(p.from)} – ${short(p.to)}`).join(' · '), planet: 'mercury' });
    put('eclipses', String(y), { eyebrow: 'Sky calendar', title: `Eclipses ${y}`, sub: eclipses(y).map((e) => `${short(e.t)} ${e.kind} ${e.body}`).join(' · '), planet: 'rahu' });
    const sat = ingresses(y, 'sidereal', 'Saturn'), jup = ingresses(y, 'sidereal', 'Jupiter');
    put('transits', String(y), { eyebrow: 'Sky calendar', title: `Planetary transits ${y}`, sub: [...sat.map((x) => `Saturn → ${x.sign} ${short(x.t)}`), ...jup.map((x) => `Jupiter → ${x.sign} ${short(x.t)}`)].slice(0, 4).join(' · ') || 'Saturn, Jupiter, Rahu–Ketu — Vedic and Western', planet: null });
  }
  put('sky-calendar', 'index', { eyebrow: 'Sky calendar', title: 'Retrogrades, eclipses and transits', sub: `${CAL_YEARS.join(' · ')} — to the minute, from Swiss Ephemeris`, planet: DEFAULT });
  put('panchang', 'index', { eyebrow: 'Updated hourly', title: 'Today’s panchang', sub: 'Tithi · Nakshatra · Yoga · Karana · Rahu Kaal', planet: 'sun' });
  return cards;
}

export const CARDS = build();
export const cardPath = (section, slug = 'index') => `/og/${section}/${slug}`;
