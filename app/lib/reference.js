/**
 * THE REFERENCE LIBRARY — the fixed correspondences of the traditions Plutto
 * reads, one page each: /nakshatras/<slug>, /chinese-zodiac/<slug>,
 * /grahas/<slug>, /zodiac-signs/<slug>.
 *
 * Every field below is a standard, published correspondence of its tradition
 * (nakshatra lords follow the Vimshottari order; gana, deity and symbol are the
 * common classical attributions; the Chinese trines, secret friends and clashes
 * are the San He, Liu He and Chong pairs; exaltations are the Parāśari ones).
 * Where schools genuinely disagree — Rahu's exaltation, the sidereal dates —
 * the page says so rather than picking a side silently.
 *
 * The `about` lines are interpretation, written as what the tradition
 * associates with each, never as a promise about anyone's life.
 */

const SIGN_NAMES = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
// An END that falls exactly on a sign boundary is written as the texts write it:
// Ashlesha ends at 30°00′ Cancer, not 0°00′ Leo.
const degEnd = (x) => { const r = Math.round(x * 3600) / 3600; return r % 30 === 0 ? `30°00′ ${SIGN_NAMES[(r / 30 - 1 + 12) % 12]}` : deg(x); };
const deg = (x) => { const s = Math.floor(x / 30); const d = x - s * 30; const whole = Math.floor(d + 1e-9); const min = Math.round((d - whole) * 60); return `${whole}°${String(min).padStart(2, '0')}′ ${SIGN_NAMES[s % 12]}`; };
export const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// ── NAKSHATRAS ───────────────────────────────────────────────────────────────
// [name, ruling graha, deity, symbol, gana, what the tradition associates with it]
const N = [
  ['Ashwini', 'Ketu', 'the Ashvini Kumaras, physicians of the gods', "a horse's head", 'Deva', 'speed, healing and first steps — the nakshatra of beginnings and of help that arrives quickly'],
  ['Bharani', 'Venus', 'Yama, lord of death and restraint', 'the yoni', 'Manushya', 'bearing and carrying through — creation, restraint and the weight of what must be held until it is born'],
  ['Krittika', 'Sun', 'Agni, the sacred fire', 'a razor or flame', 'Rakshasa', 'cutting and purifying — sharp judgement, courage and the fire that separates the true from the false'],
  ['Rohini', 'Moon', 'Brahma (Prajapati), the creator', 'an ox cart', 'Manushya', 'growth, beauty and fertility — the Moon’s favourite nakshatra, associated with abundance and attraction'],
  ['Mrigashira', 'Mars', 'Soma, the Moon’s nectar', "a deer's head", 'Deva', 'searching and curiosity — the restless seeker following a scent'],
  ['Ardra', 'Rahu', 'Rudra, the storm', 'a teardrop', 'Manushya', 'storm and renewal — upheaval that clears the air, grief that becomes insight'],
  ['Punarvasu', 'Jupiter', 'Aditi, mother of the gods', 'a quiver of arrows', 'Deva', 'return and restoration — the light coming back, the safe homecoming'],
  ['Pushya', 'Saturn', 'Brihaspati, teacher of the gods', "a cow's udder", 'Deva', 'nourishment and care — traditionally the most auspicious nakshatra for beginnings'],
  ['Ashlesha', 'Mercury', 'the Nagas, the serpent beings', 'a coiled serpent', 'Rakshasa', 'the embrace — hypnotic insight, entanglement and serpent wisdom'],
  ['Magha', 'Ketu', 'the Pitrs, the ancestors', 'a royal throne', 'Rakshasa', 'lineage and authority — honour, inheritance and the weight of those who came before'],
  ['Purva Phalguni', 'Venus', 'Bhaga, god of delight and fortune', 'the front legs of a bed', 'Manushya', 'pleasure and rest — creativity, romance and enjoyment'],
  ['Uttara Phalguni', 'Sun', 'Aryaman, god of contracts and friendship', 'the back legs of a bed', 'Manushya', 'patronage and commitment — agreements kept, kindness that lasts'],
  ['Hasta', 'Moon', 'Savitr, the vivifying Sun', 'an open hand', 'Deva', 'the skill of the hand — craft, dexterity and wit'],
  ['Chitra', 'Mars', 'Tvashtr (Vishvakarma), the divine architect', 'a bright jewel', 'Rakshasa', 'brilliance and design — making beautiful things, being seen'],
  ['Swati', 'Rahu', 'Vayu, the wind', 'a young sprout swaying in the wind', 'Deva', 'independence — movement, flexibility and trade'],
  ['Vishakha', 'Jupiter', 'Indra and Agni together', 'a triumphal arch', 'Rakshasa', 'purpose — single-minded pursuit of a goal until it is won'],
  ['Anuradha', 'Saturn', 'Mitra, god of friendship', 'a lotus', 'Deva', 'devotion and friendship — loyalty, and success through cooperation'],
  ['Jyeshtha', 'Mercury', 'Indra, king of the gods', 'a circular amulet', 'Rakshasa', 'seniority — responsibility, protection and the burden of leading'],
  ['Mula', 'Ketu', 'Nirriti, goddess of dissolution', 'a bundle of roots', 'Rakshasa', 'the root — getting to the bottom of things, undoing in order to rebuild'],
  ['Purva Ashadha', 'Venus', 'Apas, the waters', 'an elephant tusk', 'Manushya', 'invincibility — early victory, conviction and purification'],
  ['Uttara Ashadha', 'Sun', 'the Vishvedevas, the universal gods', 'the planks of a bed', 'Manushya', 'final victory — the win that lasts, integrity and endurance'],
  ['Shravana', 'Moon', 'Vishnu, the preserver', 'an ear', 'Deva', 'listening — learning, teaching and the knowledge passed by word of mouth'],
  ['Dhanishta', 'Mars', 'the eight Vasus', 'a drum', 'Rakshasa', 'rhythm and wealth — music, timing and prosperity'],
  ['Shatabhisha', 'Rahu', 'Varuna, lord of the cosmic waters', 'an empty circle', 'Rakshasa', 'the hundred healers — secrecy, healing and seeing what is hidden'],
  ['Purva Bhadrapada', 'Jupiter', 'Aja Ekapada, the one-footed goat', 'the front legs of a funeral cot', 'Manushya', 'intensity — the fire of transformation and fierce idealism'],
  ['Uttara Bhadrapada', 'Saturn', 'Ahir Budhnya, the serpent of the deep', 'the back legs of a funeral cot', 'Manushya', 'depth — stillness, wisdom and control of the inner fire'],
  ['Revati', 'Mercury', 'Pushan, guardian of travellers', 'a fish', 'Deva', 'safe passage — nourishment on the journey and the gentle completion of a cycle'],
];
// The naming syllables (nama akshara) of each pada, as the common panchang
// table gives them; regional lists differ for a few (Shravana is also given as
// Khi, Khu, Khe, Kho; the last of Uttara Bhadrapada as Tra).
const SYLLABLES = [
  ['Chu', 'Che', 'Cho', 'La'], ['Li', 'Lu', 'Le', 'Lo'], ['A', 'I', 'U', 'E'], ['O', 'Va', 'Vi', 'Vu'],
  ['Ve', 'Vo', 'Ka', 'Ki'], ['Ku', 'Gha', 'Ng', 'Chha'], ['Ke', 'Ko', 'Ha', 'Hi'], ['Hu', 'He', 'Ho', 'Da'],
  ['Di', 'Du', 'De', 'Do'], ['Ma', 'Mi', 'Mu', 'Me'], ['Mo', 'Ta', 'Ti', 'Tu'], ['Te', 'To', 'Pa', 'Pi'],
  ['Pu', 'Sha', 'Na', 'Tha'], ['Pe', 'Po', 'Ra', 'Ri'], ['Ru', 'Re', 'Ro', 'Ta'], ['Ti', 'Tu', 'Te', 'To'],
  ['Na', 'Ni', 'Nu', 'Ne'], ['No', 'Ya', 'Yi', 'Yu'], ['Ye', 'Yo', 'Bha', 'Bhi'], ['Bhu', 'Dha', 'Pha', 'Dha'],
  ['Bhe', 'Bho', 'Ja', 'Ji'], ['Ju', 'Je', 'Jo', 'Gha'], ['Ga', 'Gi', 'Gu', 'Ge'], ['Go', 'Sa', 'Si', 'Su'],
  ['Se', 'So', 'Da', 'Di'], ['Du', 'Tha', 'Jha', 'Na'], ['De', 'Do', 'Cha', 'Chi'],
];
// Yoni — the animal nature Guna Milan compares (4 of its 36 points).
const YONI = ['Horse', 'Elephant', 'Sheep', 'Serpent', 'Serpent', 'Dog', 'Cat', 'Sheep', 'Cat', 'Rat', 'Rat', 'Cow', 'Buffalo', 'Tiger',
  'Buffalo', 'Tiger', 'Deer', 'Deer', 'Dog', 'Monkey', 'Mongoose', 'Monkey', 'Lion', 'Horse', 'Lion', 'Cow', 'Elephant'];
// Nadi runs Adi, Madhya, Antya, Antya, Madhya, Adi — and repeats (8 points).
const NADI = ['Adi (Vata)', 'Madhya (Pitta)', 'Antya (Kapha)'];
const NADI_AT = (i) => [0, 1, 2, 2, 1, 0][i % 6];

const STEP = 360 / 27;
const PADA = STEP / 4;
export const NAKSHATRAS = N.map(([name, lord, deity, symbol, gana, about], i) => ({
  n: i + 1, name, slug: slugify(name), lord, deity, symbol, gana, about,
  from: deg(i * STEP), to: degEnd((i + 1) * STEP),
  syllables: SYLLABLES[i], yoni: YONI[i], nadi: NADI[NADI_AT(i)],
  // 108 padas, 3°20′ each; the navamsa runs through the signs in order from
  // Aries, so pada k of the zodiac falls in navamsa sign k mod 12.
  padas: [0, 1, 2, 3].map((q) => {
    const k = i * 4 + q;
    return { n: q + 1, from: deg(k * PADA), to: degEnd((k + 1) * PADA), sign: SIGN_NAMES[Math.floor((k * PADA) / 30)], navamsa: SIGN_NAMES[k % 12], syllable: SYLLABLES[i][q] };
  }),
  signs: [...new Set([0, 1, 2, 3].map((q) => SIGN_NAMES[Math.floor(((i * 4 + q) * PADA) / 30)]))],
}));

// ── CHINESE ZODIAC ───────────────────────────────────────────────────────────
// [animal, fixed element, yin/yang, what the tradition associates with it]
const A = [
  ['Rat', 'Water', 'Yang', 'quick-witted, resourceful and adaptable — the first to arrive, as the race story tells it'],
  ['Ox', 'Earth', 'Yin', 'steady, patient and dependable — strength that comes from endurance'],
  ['Tiger', 'Wood', 'Yang', 'brave, competitive and magnetic — the animal of bold beginnings'],
  ['Rabbit', 'Wood', 'Yin', 'gentle, careful and diplomatic — elegance and quiet good fortune'],
  ['Dragon', 'Earth', 'Yang', 'ambitious, confident and charismatic — the only mythical animal of the twelve'],
  ['Snake', 'Fire', 'Yin', 'wise, intuitive and composed — depth beneath a calm surface'],
  ['Horse', 'Fire', 'Yang', 'energetic, free-spirited and warm — the love of movement and open space'],
  ['Goat', 'Earth', 'Yin', 'gentle, creative and kind — also called the Sheep or Ram'],
  ['Monkey', 'Metal', 'Yang', 'clever, curious and inventive — the problem-solver and the trickster'],
  ['Rooster', 'Metal', 'Yin', 'observant, hard-working and direct — precision and pride in the work'],
  ['Dog', 'Earth', 'Yang', 'loyal, honest and protective — a strong sense of what is fair'],
  ['Pig', 'Water', 'Yin', 'generous, sincere and easy-going — enjoyment and good-heartedness'],
];
const TRINES = [[0, 4, 8], [1, 5, 9], [2, 6, 10], [3, 7, 11]];            // San He
const HARM = [[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]];           // Liu Hai
// The earthly branch each animal is, in pinyin and character; the animal's own
// character (traditional form in brackets where it differs); the solar month
// (the Tiger's opens at Li Chun) and the double-hour it governs.
const BRANCH = [['Zi', '子', '鼠'], ['Chou', '丑', '牛'], ['Yin', '寅', '虎'], ['Mao', '卯', '兔'], ['Chen', '辰', '龙 (龍)'], ['Si', '巳', '蛇'],
  ['Wu', '午', '马 (馬)'], ['Wei', '未', '羊'], ['Shen', '申', '猴'], ['You', '酉', '鸡 (雞)'], ['Xu', '戌', '狗'], ['Hai', '亥', '猪 (豬)']];
const MONTH = ['about 7 December – 5 January', 'about 6 January – 3 February', 'about 4 February – 5 March', 'about 6 March – 4 April',
  'about 5 April – 5 May', 'about 6 May – 5 June', 'about 6 June – 6 July', 'about 7 July – 7 August', 'about 8 August – 7 September',
  'about 8 September – 7 October', 'about 8 October – 6 November', 'about 7 November – 6 December'];
const hh = (h) => `${String(h % 24).padStart(2, '0')}:00`;
const SECRET = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]];       // Liu He
const STEM_ELEMENT = ['Metal', 'Metal', 'Water', 'Water', 'Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth']; // by the year's last digit
export const yearElement = (y) => STEM_ELEMENT[((y % 10) + 10) % 10];
export const yearAnimalIndex = (y) => (((y - 2020) % 12) + 12) % 12;
export const ANIMALS = A.map(([name, element, polarity, about], i) => {
  const trine = TRINES.find((t) => t.includes(i)).filter((x) => x !== i);
  const friend = SECRET.find((p) => p.includes(i)).find((x) => x !== i);
  const clash = (i + 6) % 12;
  const years = [];
  for (let y = 1924; y <= 2043; y++) if (yearAnimalIndex(y) === i) years.push(y);
  return {
    n: i + 1, name, slug: slugify(name), element, polarity, about,
    trine: trine.map((x) => A[x][0]), friend: A[friend][0], clash: A[clash][0],
    harm: A[HARM.find((p) => p.includes(i)).find((x) => x !== i)][0],
    branch: BRANCH[i][0], branchChar: BRANCH[i][1], char: BRANCH[i][2],
    month: MONTH[i], hours: `${hh(23 + i * 2)} – ${hh(1 + i * 2)}`,
    years: years.map((y) => ({ year: y, element: yearElement(y) })),
  };
});

// ── GRAHAS ───────────────────────────────────────────────────────────────────
const FRIENDSHIP = {
  Sun: { friends: ['Moon', 'Mars', 'Jupiter'], neutral: ['Mercury'], enemies: ['Venus', 'Saturn'] },
  Moon: { friends: ['Sun', 'Mercury'], neutral: ['Mars', 'Jupiter', 'Venus', 'Saturn'], enemies: [] },
  Mars: { friends: ['Sun', 'Moon', 'Jupiter'], neutral: ['Venus', 'Saturn'], enemies: ['Mercury'] },
  Mercury: { friends: ['Sun', 'Venus'], neutral: ['Mars', 'Jupiter', 'Saturn'], enemies: ['Moon'] },
  Jupiter: { friends: ['Sun', 'Moon', 'Mars'], neutral: ['Saturn'], enemies: ['Mercury', 'Venus'] },
  Venus: { friends: ['Mercury', 'Saturn'], neutral: ['Mars', 'Jupiter'], enemies: ['Sun', 'Moon'] },
  Saturn: { friends: ['Mercury', 'Venus'], neutral: ['Jupiter'], enemies: ['Sun', 'Moon', 'Mars'] },
};

export const GRAHAS = [
  { name: 'Surya', en: 'Sun', rules: ['Leo'], exalt: 'Aries (deepest at 10°)', debil: 'Libra', dasha: 6, day: 'Sunday', gem: 'Ruby', karaka: 'the soul, the father, authority, vitality and self-respect' },
  { name: 'Chandra', en: 'Moon', rules: ['Cancer'], exalt: 'Taurus (deepest at 3°)', debil: 'Scorpio', dasha: 10, day: 'Monday', gem: 'Pearl', karaka: 'the mind, the mother, emotions, comfort and the public' },
  { name: 'Mangala', en: 'Mars', rules: ['Aries', 'Scorpio'], exalt: 'Capricorn (deepest at 28°)', debil: 'Cancer', dasha: 7, day: 'Tuesday', gem: 'Red coral', karaka: 'energy, courage, siblings, land and the will to act' },
  { name: 'Budha', en: 'Mercury', rules: ['Gemini', 'Virgo'], exalt: 'Virgo (deepest at 15°)', debil: 'Pisces', dasha: 17, day: 'Wednesday', gem: 'Emerald', karaka: 'intellect, speech, learning, trade and adaptability' },
  { name: 'Guru', en: 'Jupiter', rules: ['Sagittarius', 'Pisces'], exalt: 'Cancer (deepest at 5°)', debil: 'Capricorn', dasha: 16, day: 'Thursday', gem: 'Yellow sapphire', karaka: 'wisdom, teachers, children, dharma and fortune' },
  { name: 'Shukra', en: 'Venus', rules: ['Taurus', 'Libra'], exalt: 'Pisces (deepest at 27°)', debil: 'Virgo', dasha: 20, day: 'Friday', gem: 'Diamond', karaka: 'love, the spouse, beauty, the arts and comfort' },
  { name: 'Shani', en: 'Saturn', rules: ['Capricorn', 'Aquarius'], exalt: 'Libra (deepest at 20°)', debil: 'Aries', dasha: 19, day: 'Saturday', gem: 'Blue sapphire', karaka: 'time, discipline, labour, endurance and longevity' },
  { name: 'Rahu', en: 'North lunar node', rules: [], exalt: 'Taurus in most texts (some schools: Gemini)', debil: 'Scorpio (some schools: Sagittarius)', dasha: 18, day: null, gem: 'Hessonite (gomed)', karaka: 'ambition, obsession, the foreign and the unconventional' },
  { name: 'Ketu', en: 'South lunar node', rules: [], exalt: 'Scorpio in most texts (some schools: Sagittarius)', debil: 'Taurus (some schools: Gemini)', dasha: 7, day: null, gem: "Cat's eye", karaka: 'detachment, spirituality, the past and liberation' },
].map((g) => ({ ...g, key: g.en.startsWith('North') ? 'Rahu' : g.en.startsWith('South') ? 'Ketu' : g.en }))
  .map((g) => ({
    ...g, slug: slugify(g.key),
    // Naisargika (natural) friendship, Brihat Parashara Hora Shastra. The
    // nodes have no agreed table, so none is given for them.
    ...FRIENDSHIP[g.key],
  }));

// ── ZODIAC SIGNS ─────────────────────────────────────────────────────────────
// Tropical dates are the usual ones (they shift by a day with the year); the
// sidereal (Lahiri) dates are approximate Sun ingresses and are labelled so.
export const SIGNS = [
  { name: 'Aries', sanskrit: 'Mesha', symbol: 'the Ram', element: 'Fire', mode: 'Cardinal', ruler: 'Mars', trop: 'March 21 – April 19', sid: 'about April 14 – May 14', about: 'initiative, courage and the urge to begin' },
  { name: 'Taurus', sanskrit: 'Vrishabha', symbol: 'the Bull', element: 'Earth', mode: 'Fixed', ruler: 'Venus', trop: 'April 20 – May 20', sid: 'about May 15 – June 14', about: 'steadiness, the senses and what lasts' },
  { name: 'Gemini', sanskrit: 'Mithuna', symbol: 'the Twins', element: 'Air', mode: 'Mutable', ruler: 'Mercury', trop: 'May 21 – June 20', sid: 'about June 15 – July 15', about: 'curiosity, conversation and connection' },
  { name: 'Cancer', sanskrit: 'Karka', symbol: 'the Crab', element: 'Water', mode: 'Cardinal', ruler: 'Moon', trop: 'June 21 – July 22', sid: 'about July 16 – August 16', about: 'feeling, home and protection' },
  { name: 'Leo', sanskrit: 'Simha', symbol: 'the Lion', element: 'Fire', mode: 'Fixed', ruler: 'Sun', trop: 'July 23 – August 22', sid: 'about August 17 – September 16', about: 'self-expression, pride and generosity' },
  { name: 'Virgo', sanskrit: 'Kanya', symbol: 'the Maiden', element: 'Earth', mode: 'Mutable', ruler: 'Mercury', trop: 'August 23 – September 22', sid: 'about September 17 – October 16', about: 'discernment, craft and service' },
  { name: 'Libra', sanskrit: 'Tula', symbol: 'the Scales', element: 'Air', mode: 'Cardinal', ruler: 'Venus', trop: 'September 23 – October 22', sid: 'about October 17 – November 15', about: 'balance, fairness and partnership' },
  { name: 'Scorpio', sanskrit: 'Vrishchika', symbol: 'the Scorpion', element: 'Water', mode: 'Fixed', ruler: 'Mars (modern Western: Pluto)', trop: 'October 23 – November 21', sid: 'about November 16 – December 15', about: 'intensity, depth and transformation' },
  { name: 'Sagittarius', sanskrit: 'Dhanu', symbol: 'the Archer', element: 'Fire', mode: 'Mutable', ruler: 'Jupiter', trop: 'November 22 – December 21', sid: 'about December 16 – January 14', about: 'meaning, faith and the far horizon' },
  { name: 'Capricorn', sanskrit: 'Makara', symbol: 'the Sea-goat', element: 'Earth', mode: 'Cardinal', ruler: 'Saturn', trop: 'December 22 – January 19', sid: 'about January 15 – February 12', about: 'ambition, structure and responsibility' },
  { name: 'Aquarius', sanskrit: 'Kumbha', symbol: 'the Water-bearer', element: 'Air', mode: 'Fixed', ruler: 'Saturn (modern Western: Uranus)', trop: 'January 20 – February 18', sid: 'about February 13 – March 13', about: 'independence, ideals and the collective' },
  { name: 'Pisces', sanskrit: 'Meena', symbol: 'the Fish', element: 'Water', mode: 'Mutable', ruler: 'Jupiter (modern Western: Neptune)', trop: 'February 19 – March 20', sid: 'about March 14 – April 13', about: 'imagination, compassion and surrender' },
].map((s) => ({ ...s, slug: slugify(s.name) }));

export const REF = {
  nakshatras: { items: NAKSHATRAS, base: '/nakshatras', label: 'Nakshatras' },
  animals: { items: ANIMALS, base: '/chinese-zodiac', label: 'Chinese zodiac' },
  grahas: { items: GRAHAS, base: '/grahas', label: 'Grahas' },
  signs: { items: SIGNS, base: '/zodiac-signs', label: 'Zodiac signs' },
};
