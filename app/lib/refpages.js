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
import { NAKSHATRAS, ANIMALS, GRAHAS, SIGNS } from './reference';

const list = (xs) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
// The luminaries take an article in prose: “ruled by the Sun”, not “ruled by Sun”.
const the = (p) => (/^(Sun|Moon|North|South)\b/.test(p) ? `the ${p}` : p);
const The = (p) => (/^(Sun|Moon|North|South)\b/.test(p) ? `The ${p}` : p);
const ord = (n) => `${n}${[, 'st', 'nd', 'rd'][(n % 100 >> 3) ^ 1 && n % 10] || 'th'}`;

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
      facts: [['Number', `${x.n} of 27`], ['Span', `${x.from} – ${x.to}`], ['Ruling planet (dasha lord)', x.lord], ['Deity', x.deity], ['Symbol', x.symbol], ['Gana (temperament)', x.gana]],
      body: [
        `Because ${the(x.lord)} rules ${x.name}, someone whose Moon was here at birth begins life in the ${x.lord} mahadasha, for the part of it that remains according to how far the Moon had travelled through the nakshatra.`,
        `Its gana is ${x.gana} — one of the three temperaments (Deva, Manushya, Rakshasa) that Guna Milan compares when matching two charts.`,
      ],
      faqs: [
        { q: `Which planet rules ${x.name} nakshatra?`, a: `${The(x.lord)}. It is ${the(x.lord)}'s nakshatra in the Vimshottari sequence, so a birth Moon in ${x.name} starts life in the ${x.lord} dasha.` },
        { q: `What is the deity of ${x.name}?`, a: `${x.deity[0].toUpperCase()}${x.deity.slice(1)}.` },
        { q: `Which zodiac sign is ${x.name} in?`, a: `${x.name} runs from ${x.from} to ${x.to} in the sidereal zodiac used by Vedic astrology.` },
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
        facts: [['Order', `${x.n} of 12`], ['Fixed element', x.element], ['Polarity', x.polarity], ['Best matches (San He trine)', list(x.trine)], ['Secret friend (Liu He)', x.friend], ['Clash (Chong)', x.clash]],
        body: [
          `${x.name} years: ${recent.map((y) => `${y.year} ${y.element}`).join(' · ')}. Each year's element comes from its heavenly stem, so a ${x.name} year is Wood, Fire, Earth, Metal or Water in turn and the same combination returns every sixty years.`,
          `A year does not begin on 1 January. The popular zodiac changes at Chinese New Year (between 21 January and 20 February); BaZi changes it at Li Chun, the start of spring, around 4 February. Anyone born in January or early February belongs to the previous year's animal.`,
          `In compatibility, the ${x.name} forms a San He trine with the ${list(x.trine)}, a Liu He pair ("secret friend") with the ${x.friend}, and clashes (Chong) with the ${x.clash}, the animal six places away.`,
        ],
        faqs: [
          { q: `What years are the Year of the ${x.name}?`, a: `${recent.map((y) => y.year).join(', ')}. Remember the year starts at Chinese New Year (or Li Chun, around 4 February, in BaZi), not on 1 January.` },
          { q: `Who is the ${x.name} most compatible with?`, a: `The ${list(x.trine)} (its San He trine) and the ${x.friend} (its Liu He secret friend). Its traditional clash is with the ${x.clash}.` },
          { q: `What element is the ${x.name}?`, a: `The ${x.name}'s fixed element is ${x.element}. Each ${x.name} year also has its own element from the heavenly stem — for example ${recent[recent.length - 1].year} is a ${recent[recent.length - 1].element} ${x.name}.` },
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
      h1: x.en.includes('lunar node') ? `${x.name} (${x.en.toLowerCase()})` : `${x.name} — the ${x.en} in Vedic astrology`,
      answer: `${x.name}${x.en.includes('lunar node') ? `, the ${x.en.toLowerCase()},` : ` is ${the(x.en)} in Vedic astrology. It`} signifies ${x.karaka}. ${x.rules.length ? `It rules ${list(x.rules)}, is` : 'It rules no sign of its own in the classical scheme and is'} exalted in ${x.exalt} and debilitated in ${x.debil}, and its Vimshottari mahadasha lasts ${x.dasha} years.`,
      facts: [['Signifies (karaka)', x.karaka], ['Rules', x.rules.length ? list(x.rules) : '— (a shadow planet)'], ['Exaltation', x.exalt], ['Debilitation', x.debil], ['Mahadasha', `${x.dasha} years`], ...(x.day ? [['Day', x.day]] : []), ['Traditional gemstone', x.gem]],
      body: [
        `In the Vimshottari dasha the ${x.dasha}-year ${x.name} period is divided into nine antardashas, one for each graha, in the same order as the mahadashas themselves.`,
        x.en.includes('lunar node')
          ? 'Rahu and Ketu are always exactly opposite each other. They are not bodies but the points where the Moon’s path crosses the Sun’s — where eclipses happen — which is why Jyotish calls them chhaya grahas, shadow planets, and why the schools disagree about their exaltation.'
          : `A graha in its own or exalted sign is read as strong and able to deliver what it signifies; in its debilitation, as struggling to — though classical cancellation rules (neecha bhanga) can reverse a debilitation.`,
      ],
      faqs: [
        { q: `In which sign is ${x.name} exalted?`, a: `${x.exalt}. Its debilitation is the opposite sign, ${x.debil}.` },
        { q: `How long is the ${x.name} mahadasha?`, a: `${x.dasha} years in the Vimshottari dasha system, out of a 120-year cycle.` },
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
      facts: [['Symbol', x.symbol], ['Sanskrit name', x.sanskrit], ['Element', x.element], ['Modality', x.mode], ['Ruling planet', x.ruler], ['Western (tropical) dates', x.trop], ['Vedic (sidereal) dates', x.sid]],
      body: [
        `Why two sets of dates: the tropical zodiac is tied to the seasons and the sidereal zodiac to the constellations. The equinoxes have drifted about 24° against the stars since the zodiacs coincided, so the Sun enters sidereal ${x.name} roughly three and a half weeks after it enters tropical ${x.name}. Exact dates shift by a day or so from year to year.`,
        `Your Sun sign is only one placement: your Moon sign and your rising sign (ascendant) are read at least as closely, and Vedic astrology gives the Moon sign the most weight of all.`,
      ],
      faqs: [
        { q: `What are the dates for ${x.name}?`, a: `In Western (tropical) astrology, ${x.trop}. In Vedic (sidereal) astrology, ${x.sid}. Both vary by about a day from year to year.` },
        { q: `What is the ruling planet of ${x.name}?`, a: `${The(x.ruler)}.` },
        { q: `What is ${x.name} called in Vedic astrology?`, a: `${x.sanskrit}.` },
      ],
    }),
  },
};

export const refPath = (key, slug) => `${SECTIONS[key].base}/${slug}`;
