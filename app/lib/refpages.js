/**
 * THE REFERENCE PAGES' WORDS — built from app/lib/reference.js, one entry per
 * item: the answer paragraph, the facts table, the questions it answers, where
 * to read next. Kept apart from the markup so /llms-full.txt and the pages say
 * exactly the same thing.
 *
 * The questions are the ones people actually search per item ("which planet
 * rules Rohini", "Year of the Horse years", "Saturn exaltation sign") and each
 * is answered from the item's own data — no two pages share an answer.
 */
import { NAKSHATRAS, ANIMALS, GRAHAS, SIGNS, slugify } from './reference';
import { sunReaches, lahiri, julianDayUT } from './sky';

/*
 * A fact's value is a string or a list of segments — strings and links — so
 * every fact that names another entity links to that entity's page: the
 * library reads as one connected graph, and `flat` gives the same words back
 * as text for llms-full.txt and the hub lines.
 */
const to = (base) => (name, t = name) => ({ t, href: `${base}/${slugify(name)}` });
const sign = to('/zodiac-signs'), graha = to('/grahas'), nak = to('/nakshatras'), animal = to('/chinese-zodiac');
const join = (segs, last = ' and ') => segs.flatMap((x, i) => (i === 0 ? [x] : [i === segs.length - 1 ? last : ', ', x]));
// "Aries (deepest at 10°)" → the sign linked, the rest as written.
const lead = (text, link) => { const [w, ...rest] = text.split(' '); return [link(w), rest.length ? ` ${rest.join(' ')}` : '']; };
export const flat = (v) => (Array.isArray(v) ? v.map((x) => (typeof x === 'string' ? x : x.t)).join('') : v);

const GRAHA_OF = Object.fromEntries(GRAHAS.map((g) => [g.key, g]));
const PADA = 360 / 108;
/** The nakshatras (and which of their padas) inside sign r of the sidereal zodiac. */
const nakshatrasIn = (r) => {
  const out = [];
  for (let k = r * 9; k < r * 9 + 9; k++) {
    const x = NAKSHATRAS[Math.floor(k / 4)];
    const last = out[out.length - 1];
    if (last && last.x === x) last.padas.push((k % 4) + 1); else out.push({ x, padas: [(k % 4) + 1] });
  }
  return out;
};
const padaText = (p) => (p.length === 4 ? 'all four padas' : p.length === 1 ? `pada ${p[0]}` : `padas ${p[0]}–${p[p.length - 1]}`);

// The Sun's ingresses for the year the site is built — computed, not quoted.
const YEAR = new Date().getUTCFullYear();
const toMinute = (d) => new Date(Math.round(d.getTime() / 60000) * 60000);
const when = (x) => { const d = toMinute(x); return `${d.getUTCDate()} ${d.toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' })} ${d.getUTCFullYear()}, ${d.toISOString().slice(11, 16)} UTC`; };
const INGRESS = {};
function ingress(r) {
  if (INGRESS[r]) return INGRESS[r];
  const from = new Date(Date.UTC(YEAR, 0, 1));
  const trop = sunReaches(r * 30, from, 366);
  let sid = sunReaches((r * 30 + lahiri(julianDayUT(new Date(Date.UTC(YEAR, 6, 1))))) % 360, from, 366);
  sid = sunReaches((r * 30 + lahiri(julianDayUT(sid))) % 360, new Date(sid.getTime() - 3 * 86400000), 6);
  return (INGRESS[r] = { trop: when(trop), sid: when(sid) });
}
// When the Chinese year begins in BaZi: Li Chun, as a date in Beijing time.
const liChunDate = (y) => {
  const t = sunReaches(315, new Date(Date.UTC(y, 0, 25)), 20);
  const bj = toMinute(new Date(t.getTime() + 8 * 3600000));
  return `${bj.getUTCDate()} Feb, ${bj.toISOString().slice(11, 16)}`;
};

const listOr = (xs) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} or ${xs[xs.length - 1]}`);
const cap = (t) => t[0].toUpperCase() + t.slice(1);
const list = (xs) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
// The luminaries take an article in prose: “ruled by the Sun”, not “ruled by Sun”.
const the = (p) => (/^(Sun|Moon|North|South)\b/.test(p) ? `the ${p}` : p);
const The = (p) => (/^(Sun|Moon|North|South)\b/.test(p) ? `The ${p}` : p);
const ord = (n) => `${n}${[, 'st', 'nd', 'rd'][(n % 100 >> 3) ^ 1 && n % 10] || 'th'}`;

const r = (x) => SIGNS.indexOf(x);
const PLANETS7 = GRAHAS.filter((g) => g.friends);
const exalted = (x) => PLANETS7.filter((g) => g.exalt.split(' ')[0] === x.name);
const debilitated = (x) => PLANETS7.filter((g) => g.debil.split(' ')[0] === x.name);
const AYAN = lahiri(julianDayUT(new Date(Date.UTC(YEAR, 0, 1))));

export const SECTIONS = {
  nakshatras: {
    base: '/nakshatras', label: 'Nakshatras', guide: '/guides/vedic-astrology', guideName: 'Vedic astrology',
    hubTitle: 'The 27 Nakshatras: Lords, Deities, Symbols and Degrees',
    hubDescription: 'All 27 nakshatras (lunar mansions) of Vedic astrology with their ruling planet, deity, symbol, gana and exact span in the sidereal zodiac.',
    hubLead: 'The nakshatras are the 27 lunar mansions of Vedic astrology, each spanning 13°20′ of the sidereal zodiac. The one the Moon occupied at your birth — your janma nakshatra — sets where your Vimshottari dasha begins, and colours how Jyotish reads your mind and temperament.',
    cta: 'Plutto computes your janma nakshatra from your date, time and place of birth.',
    items: NAKSHATRAS,
    page: (x) => ({
      title: `${x.name} Nakshatra: Lord, Deity, Symbol and Meaning`,
      description: `${x.name}, the ${ord(x.n)} nakshatra (${x.from} – ${x.to}): ruled by ${the(x.lord)}, deity ${x.deity.split(',')[0]}, symbol ${x.symbol}. Meaning in Vedic astrology.`,
      h1: `${x.name} nakshatra`,
      answer: `${x.name} is the ${ord(x.n)} of the 27 nakshatras, spanning ${x.from} to ${x.to} in the sidereal zodiac. Its ruling planet is ${the(x.lord)}, its deity is ${x.deity}, and its symbol is ${x.symbol}. Jyotish associates it with ${x.about}.`,
      facts: [
        ['Number', `${x.n} of 27`],
        ['Span', `${x.from} – ${x.to}`],
        ['Sign', join(x.signs.map((n) => sign(n)))],
        ['Ruling planet (dasha lord)', [graha(x.lord)]],
        ['Deity', x.deity],
        ['Symbol', x.symbol],
        ['Gana (temperament)', x.gana],
        ['Nadi', x.nadi],
        ['Yoni (animal)', x.yoni],
        ['Naming syllables', x.syllables.join(', ')],
        [`Other nakshatras of ${the(x.lord)}`, join(NAKSHATRAS.filter((o) => o.lord === x.lord && o !== x).map((o) => nak(o.name)))],
      ],
      tables: [{
        caption: `The four padas of ${x.name}`,
        head: ['Pada', 'Span', 'Navamsa', 'Syllable'],
        rows: x.padas.map((p) => [String(p.n), `${p.from} – ${p.to}`, [sign(p.navamsa)], p.syllable]),
      }],
      body: [
        `Because ${the(x.lord)} rules ${x.name}, someone whose Moon was here at birth begins life in the ${x.lord} mahadasha, for the part of it that remains according to how far the Moon had travelled through the nakshatra.`,
        `Each nakshatra has four padas (quarters) of 3°20′. The pada decides the navamsa — the ninth-harmonic chart Jyotish reads for marriage and inner strength — and the syllable a name traditionally begins with. ${x.name}'s padas fall in the ${list(x.padas.map((p) => p.navamsa))} navamsas.`,
        `Its gana is ${x.gana}, its nadi ${x.nadi} and its yoni the ${x.yoni.toLowerCase()} — three of the eight factors Guna Milan compares when matching two charts (nadi alone carries 8 of the 36 points).`,
      ],
      faqs: [
        { q: `Which planet rules ${x.name} nakshatra?`, a: `${The(x.lord)}. It is ${the(x.lord)}'s nakshatra in the Vimshottari sequence, so a birth Moon in ${x.name} starts life in the ${x.lord} dasha.` },
        { q: `What are the name letters for ${x.name} nakshatra?`, a: `By pada: ${x.padas.map((p) => `${p.n} — ${p.syllable}`).join(', ')}. A name traditionally begins with the syllable of the pada the Moon occupied at birth.` },
        { q: `What is the deity of ${x.name}?`, a: `${x.deity[0].toUpperCase()}${x.deity.slice(1)}.` },
        { q: `Which zodiac sign is ${x.name} in?`, a: `${x.name} runs from ${x.from} to ${x.to} in the sidereal zodiac used by Vedic astrology${x.signs.length > 1 ? `, so it spans ${list(x.signs)}` : `, entirely within ${x.signs[0]}`}.` },
        { q: `What are the nadi and yoni of ${x.name}?`, a: `Nadi ${x.nadi}; yoni ${x.yoni.toLowerCase()}. Both are compared in Guna Milan: nadi is worth 8 of the 36 points, yoni 4.` },
      ],
    }),
  },
  animals: {
    base: '/chinese-zodiac', label: 'Chinese zodiac', guide: '/guides/chinese-astrology', guideName: 'Chinese astrology (BaZi)',
    hubTitle: 'The 12 Chinese Zodiac Animals: Years, Elements, Compatibility',
    hubDescription: 'The twelve animals of the Chinese zodiac with their years, fixed elements, yin or yang, best matches (San He and Liu He) and clashes (Chong).',
    hubLead: 'The Chinese zodiac is the cycle of twelve animals — the earthly branches — that names every year, month, day and hour. Your year animal is the best-known, but a BaZi chart holds four: one for each pillar. Each year also carries one of the five elements, so the full cycle repeats every sixty years.',
    cta: 'Plutto reads all four of your animals — year, month, day and hour — in your BaZi chart.',
    items: ANIMALS,
    page: (x) => {
      const recent = x.years.filter((y) => y.year >= 1936 && y.year <= 2032);
      return {
        title: `Year of the ${x.name}: Years, Element, Traits, Compatibility`,
        description: `Year of the ${x.name} in the Chinese zodiac: ${recent.slice(-5).map((y) => y.year).join(', ')}… Fixed element ${x.element}, traits, best matches (${list(x.trine)}, ${x.friend}) and its clash (${x.clash}).`,
        h1: `The ${x.name} in the Chinese zodiac`,
        answer: `The ${x.name} is the ${ord(x.n)} animal of the Chinese zodiac, a ${x.polarity.toLowerCase()} sign whose fixed element is ${x.element}. Tradition associates it with being ${x.about}. ${x.name} years include ${recent.slice(-4).map((y) => `${y.year} (${y.element})`).join(', ')}.`,
        facts: [
          ['Order', `${x.n} of 12`],
          ['Earthly branch', `${x.branch} ${x.branchChar}`],
          ['Chinese character', x.char],
          ['Fixed element', x.element],
          ['Polarity', x.polarity],
          ['Best matches (San He trine)', join(x.trine.map((n) => animal(n)))],
          ['Secret friend (Liu He)', [animal(x.friend)]],
          ['Clash (Chong)', [animal(x.clash)]],
          ['Harm (Liu Hai)', [animal(x.harm)]],
          ['Solar month', x.month],
          ['Double-hour', x.hours],
        ],
        tables: [{
          caption: `${x.name} years and when each begins`,
          head: ['Year', 'Element', 'Begins (Li Chun, Beijing time)'],
          rows: recent.map((y) => [String(y.year), `${y.year % 2 === 0 ? 'Yang' : 'Yin'} ${y.element}`, liChunDate(y.year)]),
        }],
        body: [
          `Each year's element comes from its heavenly stem, so a ${x.name} year is Wood, Fire, Earth, Metal or Water in turn and the same combination returns every sixty years. The start dates above are computed from the Sun's position: Li Chun is the moment it reaches 315° of ecliptic longitude.`,
          `A year does not begin on 1 January. The popular zodiac changes at Chinese New Year (between 21 January and 20 February); BaZi changes it at Li Chun, the start of spring, around 4 February. Anyone born in January or early February belongs to the previous year's animal.`,
          `In compatibility, the ${x.name} forms a San He trine with the ${list(x.trine)}, a Liu He pair ("secret friend") with the ${x.friend}, clashes (Chong) with the ${x.clash}, the animal six places away, and harms (Liu Hai) the ${x.harm}.`,
          `The ${x.name} is also the ${x.branch} branch of the day, ruling the double-hour ${x.hours}, and of the solar month that runs from ${x.month.replace(' – ', ' to ')}. In a BaZi chart it can appear in any of the four pillars — year, month, day or hour — not only the year.`,
        ],
        faqs: [
          { q: `What years are the Year of the ${x.name}?`, a: `${recent.map((y) => y.year).join(', ')}. Remember the year starts at Chinese New Year (or Li Chun, around 4 February, in BaZi), not on 1 January.` },
          { q: `Who is the ${x.name} most compatible with?`, a: `The ${list(x.trine)} (its San He trine) and the ${x.friend} (its Liu He secret friend). Its traditional clash is with the ${x.clash}, and it harms the ${x.harm}.` },
          { q: `What element is the ${x.name}?`, a: `The ${x.name}'s fixed element is ${x.element}. Each ${x.name} year also has its own element from the heavenly stem — for example ${recent[recent.length - 1].year} is a ${recent[recent.length - 1].element} ${x.name}.` },
          { q: `What time is the hour of the ${x.name}?`, a: `${x.hours}, the ${x.branch} hour. It gives the branch of the hour pillar in BaZi; many practitioners first correct clock time to local solar time.` },
        ],
      };
    },
  },
  grahas: {
    base: '/grahas', label: 'Grahas', guide: '/guides/vedic-astrology', guideName: 'Vedic astrology',
    hubTitle: 'The Nine Grahas of Vedic Astrology: Signs, Exaltation, Dashas',
    hubDescription: 'The nine grahas (planets) of Vedic astrology with the signs they rule, their exaltation and debilitation, their Vimshottari dasha years, day and gemstone.',
    hubLead: 'The grahas are the nine "seizers" of Vedic astrology: the Sun, Moon, Mars, Mercury, Jupiter, Venus and Saturn, and the two lunar nodes, Rahu and Ketu. Each rules signs, is strongest in its sign of exaltation and weakest in its debilitation, and runs a period of the 120-year Vimshottari dasha.',
    cta: 'Plutto places all nine grahas in your chart and tells you which one is running your life now.',
    items: GRAHAS,
    page: (x) => ({
      title: `${x.en === 'North lunar node' ? 'Rahu' : x.en === 'South lunar node' ? 'Ketu' : `${x.en} (${x.name})`} in Vedic Astrology: Meaning, Exaltation & Dasha`,
      description: `${x.name} in Jyotish: what it signifies (${x.karaka.split(',')[0]}…), ${x.rules.length ? `rules ${list(x.rules)}, ` : ''}exalted in ${x.exalt.split(' (')[0]}, debilitated in ${x.debil.split(' (')[0]}, ${x.dasha}-year Vimshottari dasha.`,
      h1: x.en.includes('lunar node') ? `${x.name} (${x.en.toLowerCase()})` : `${x.name} — ${the(x.en)} in Vedic astrology`,
      answer: `${x.name}${x.en.includes('lunar node') ? `, the ${x.en.toLowerCase()},` : ` is ${the(x.en)} in Vedic astrology. It`} signifies ${x.karaka}. ${x.rules.length ? `It rules ${list(x.rules)}, is` : 'It rules no sign of its own in the classical scheme and is'} exalted in ${x.exalt} and debilitated in ${x.debil}, and its Vimshottari mahadasha lasts ${x.dasha} years.`,
      facts: [
        ['Signifies (karaka)', x.karaka],
        ['Rules', x.rules.length ? join(x.rules.map((n) => sign(n))) : '— (a shadow planet)'],
        ['Exaltation', lead(x.exalt, sign)],
        ['Debilitation', lead(x.debil, sign)],
        ['Mahadasha', `${x.dasha} years`],
        ['Nakshatras ruled', join(NAKSHATRAS.filter((n) => n.lord === x.key).map((n) => nak(n.name)))],
        ...(x.friends ? [
          ['Friends', join(x.friends.map((k) => graha(k)))],
          ['Neutral', x.neutral.length ? join(x.neutral.map((k) => graha(k))) : '—'],
          ['Enemies', x.enemies.length ? join(x.enemies.map((k) => graha(k))) : 'none'],
        ] : []),
        ...(x.day ? [['Day', x.day]] : []),
        ['Traditional gemstone', x.gem],
      ],
      body: [
        `In the Vimshottari dasha the ${x.dasha}-year ${x.name} period is divided into nine antardashas, one for each graha, in the same order as the mahadashas themselves. Anyone whose birth Moon is in ${listOr(NAKSHATRAS.filter((n) => n.lord === x.key).map((n) => n.name))} begins life in it.`,
        x.en.includes('lunar node')
          ? 'Rahu and Ketu are always exactly opposite each other. They are not bodies but the points where the Moon’s path crosses the Sun’s — where eclipses happen — which is why Jyotish calls them chhaya grahas, shadow planets, and why the schools disagree about their exaltation.'
          : `A graha in its own or exalted sign is read as strong and able to deliver what it signifies; in its debilitation, as struggling to — though classical cancellation rules (neecha bhanga) can reverse a debilitation. Its natural friendships, from Brihat Parashara Hora Shastra, decide how it fares in another graha's sign.`,
      ],
      faqs: [
        { q: `In which sign is ${x.name} exalted?`, a: `${x.exalt}. Its debilitation is the opposite sign, ${x.debil}.` },
        { q: `How long is the ${x.name} mahadasha?`, a: `${x.dasha} years in the Vimshottari dasha system, out of a 120-year cycle.` },
        { q: `Which nakshatras does ${x.name} rule?`, a: `${list(NAKSHATRAS.filter((n) => n.lord === x.key).map((n) => n.name))} — nine nakshatras (120°) apart, one in each third of the zodiac.` },
        ...(x.friends ? [{ q: `Which planets are friends of ${x.name}?`, a: `${cap(list(x.friends.map(the)))}. ${x.neutral.length ? `Neutral: ${list(x.neutral.map(the))}. ` : ''}${x.enemies.length ? `Enemies: ${list(x.enemies.map(the))}.` : 'It treats no graha as an enemy.'} These are the natural (naisargika) relationships of Brihat Parashara Hora Shastra.` }] : []),
        { q: `What does ${x.name} signify in Vedic astrology?`, a: `${x.karaka[0].toUpperCase()}${x.karaka.slice(1)}.` },
      ],
    }),
  },
  signs: {
    base: '/zodiac-signs', label: 'Zodiac signs', guide: '/guides/western-astrology', guideName: 'Western astrology',
    hubTitle: 'The 12 Zodiac Signs: Dates, Elements and Rulers',
    hubDescription: 'The twelve zodiac signs with tropical (Western) and sidereal (Vedic) dates, element, modality, ruling planet and Sanskrit name.',
    hubLead: 'The zodiac is the band of sky the Sun, Moon and planets travel through, divided into twelve signs of 30°. Western astrology measures it from the March equinox (tropical); Vedic astrology measures it against the stars (sidereal). The two now differ by about 24°, which is why your Vedic sign is often the one before your Western sign.',
    cta: 'Plutto reads your Sun, Moon and rising sign in both zodiacs — and says which one each tradition means.',
    items: SIGNS,
    page: (x) => ({
      title: `${x.name} (${x.sanskrit}): Dates, Element, Ruler, Traits`,
      description: `${x.name} dates: ${x.trop} (Western), ${x.sid.replace('about ', 'c. ')} (Vedic). ${x.mode} ${x.element.toLowerCase()} sign ruled by ${the(x.ruler.split(' (')[0])}: ${x.about}.`,
      h1: `${x.name} (${x.sanskrit})`,
      answer: `${x.name}, ${x.symbol}, is a ${x.mode.toLowerCase()} ${x.element.toLowerCase()} sign ruled by ${the(x.ruler)}. The Sun is in tropical (Western) ${x.name} from ${x.trop}, and in sidereal (Vedic) ${x.name} — called ${x.sanskrit} — from ${x.sid}. The sign is associated with ${x.about}.`,
      facts: [
        ['Symbol', x.symbol],
        ['Sanskrit name', x.sanskrit],
        ['Element', x.element],
        ['Modality', x.mode],
        ['Ruling planet', lead(x.ruler, (w) => graha(w))],
        ['Zodiac degrees', `${r(x) * 30}° – ${r(x) * 30 + 30}°`],
        ['Opposite sign', [sign(SIGNS[(r(x) + 6) % 12].name)]],
        ...(exalted(x).length ? [['Exalted here', join(exalted(x).map((g) => graha(g.key)))]] : []),
        ...(debilitated(x).length ? [['Debilitated here', join(debilitated(x).map((g) => graha(g.key)))]] : []),
        ['Nakshatras (sidereal)', nakshatrasIn(r(x)).flatMap((o, i) => [...(i ? [', '] : []), nak(o.x.name), ` (${padaText(o.padas)})`])],
        ['Western (tropical) dates', x.trop],
        ['Vedic (sidereal) dates', x.sid],
        [`Sun enters, ${YEAR} (tropical)`, ingress(r(x)).trop],
        [`Sun enters, ${YEAR} (sidereal)`, ingress(r(x)).sid],
      ],
      body: [
        `Why two sets of dates: the tropical zodiac is tied to the seasons and the sidereal zodiac to the constellations. The equinoxes have drifted about 24° against the stars since the zodiacs coincided (the Lahiri ayanamsa is ${Math.floor(AYAN)}°${String(Math.round((AYAN % 1) * 60)).padStart(2, '0')}′ in ${YEAR}), so the Sun enters sidereal ${x.name} roughly three and a half weeks after it enters tropical ${x.name}. The ${YEAR} ingresses above are computed from the Sun's position, to the minute.`,
        `In Vedic astrology ${x.sanskrit} holds ${list(nakshatrasIn(r(x)).map((o) => `${o.x.name} (${padaText(o.padas)})`))}. A Moon here is read through both the sign and its nakshatra.`,
        `Your Sun sign is only one placement: your Moon sign and your rising sign (ascendant) are read at least as closely, and Vedic astrology gives the Moon sign the most weight of all.`,
      ],
      faqs: [
        { q: `What are the dates for ${x.name}?`, a: `In Western (tropical) astrology, ${x.trop}. In Vedic (sidereal) astrology, ${x.sid}. Both vary by about a day from year to year; in ${YEAR} the Sun entered tropical ${x.name} on ${ingress(r(x)).trop} and sidereal ${x.name} on ${ingress(r(x)).sid}.` },
        { q: `What is the ruling planet of ${x.name}?`, a: `${The(x.ruler)}.` },
        { q: `Which nakshatras are in ${x.name}?`, a: `In the sidereal zodiac, ${list(nakshatrasIn(r(x)).map((o) => `${o.x.name} (${padaText(o.padas)})`))}.` },
        ...(exalted(x).length ? [{ q: `Which planet is exalted in ${x.name}?`, a: `${list(exalted(x).map((g) => The(g.en)))}, in the Parashari scheme.` }] : []),
        { q: `What is ${x.name} called in Vedic astrology?`, a: `${x.sanskrit}.` },
      ],
    }),
  },
};

export const refPath = (key, slug) => `${SECTIONS[key].base}/${slug}`;
