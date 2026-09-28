/**
 * THE FREE CALCULATORS — what each one is, in words. The arithmetic is in
 * calc.js; the widgets in components/site/tools. Every page states its method
 * in full, so a reader (or an answer engine) can check a result by hand.
 */
export const TOOLS = [
  {
    slug: 'life-path-number',
    name: 'Life path number calculator',
    short: 'Life path number',
    title: 'Life Path Number Calculator — Free, Step by Step',
    description: 'Find your life path number from your date of birth. A free numerology calculator that shows every step, keeps master numbers 11, 22 and 33, and explains each.',
    answer: 'Your life path number is your date of birth reduced to a single digit: reduce the month, the day and the year separately, add the three results, and reduce the total again — keeping 11, 22 and 33, the master numbers, whole. It is the central number of Pythagorean numerology.',
    method: [
      'Reduce the month to one digit (November, 11, is kept as a master number).',
      'Reduce the day the same way: 29 becomes 2 + 9 = 11, which is kept.',
      'Reduce the year: 1987 becomes 1 + 9 + 8 + 7 = 25, then 2 + 5 = 7.',
      'Add the three results and reduce once more: 11 + 11 + 7 = 29, 2 + 9 = 11. The life path is 11.',
    ],
    note: 'Reducing each part first is the method most numerologists use, because adding every digit at once can hide a master number. When both methods agree the difference never matters; this calculator shows the working so you can see which part produced the result.',
    faqs: [
      { q: 'What is a life path number?', a: 'It is your full date of birth reduced to a single digit (or to a master number, 11, 22 or 33). In Pythagorean numerology it describes the broad direction of a life — the lessons and strengths it keeps returning to.' },
      { q: 'Why are 11, 22 and 33 not reduced?', a: 'They are master numbers. Numerologists treat them as heightened forms of 2, 4 and 6 and keep them whole when they appear, rather than adding their digits.' },
      { q: 'Does the time or place of birth matter?', a: 'No. The life path uses only the calendar date. Astrology needs the time and place; numerology does not.' },
      { q: 'Is the life path the same as the Vedic moolank?', a: 'No. The moolank (root number) of Ank Jyotish, Indian numerology, is the day of birth alone reduced to one digit; the bhagyank (destiny number) uses the whole date, like the life path, but is reduced to 1–9 with no master numbers.' },
    ],
    guide: '/guides/numerology',
  },
  {
    slug: 'chinese-zodiac',
    name: 'Chinese zodiac calculator',
    short: 'Chinese zodiac animal',
    title: 'Chinese Zodiac Calculator — Animal, Element, Yin/Yang',
    description: 'Find your Chinese zodiac animal, element and yin or yang from your date of birth — with the January–February boundary handled correctly and the Li Chun cusp explained.',
    answer: 'Your Chinese zodiac animal is the animal of your Chinese year, which does not begin on 1 January. Chinese astrology (BaZi) starts the year at Li Chun, the start of spring, on 3, 4 or 5 February; anyone born in January or early February belongs to the previous year’s animal.',
    method: [
      'If you were born before 4 February, count your birth year as the year before.',
      'The animal repeats every 12 years: 2020 was the Rat, 2021 the Ox, and so on through the Pig.',
      'The element follows the year’s last digit: 0–1 Metal, 2–3 Water, 4–5 Wood, 6–7 Fire, 8–9 Earth.',
      'Even years are yang, odd years yin. So 2026 is the yang Fire Horse.',
    ],
    note: 'Popular horoscopes often turn the year at Chinese New Year, which moves between 21 January and 20 February. BaZi — the Four Pillars, which is how Plutto reads a Chinese chart — uses Li Chun, a fixed point in the solar year. The two agree for everyone born outside that window.',
    faqs: [
      { q: 'Why does my animal differ from a website that uses only the year?', a: 'The Chinese year does not start on 1 January. If you were born in January or early February, your animal is the previous year’s. BaZi turns the year at Li Chun (3–5 February); popular calendars at the lunar new year.' },
      { q: 'What if I was born on 3, 4 or 5 February?', a: 'Li Chun falls on one of those days at a specific minute that changes each year. Only a full BaZi chart, computed from the time and place of birth, settles which side of it you were born on.' },
      { q: 'What does the element add?', a: 'Each animal year also carries one of the five elements — Wood, Fire, Earth, Metal, Water — so the full cycle is 60 years. A Fire Horse and a Water Horse are read differently.' },
      { q: 'Is the year animal my whole Chinese chart?', a: 'No. It is one of four pillars — year, month, day and hour. BaZi reads the day pillar as the self; the year is the outermost layer, family and generation.' },
    ],
    guide: '/guides/chinese-astrology',
  },
  {
    slug: 'name-numerology',
    name: 'Name numerology calculator',
    short: 'Name numerology',
    title: 'Name Numerology Calculator — Pythagorean & Chaldean',
    description: 'Calculate your name number in both Pythagorean and Chaldean numerology: expression, soul urge and personality numbers, with the letter-by-letter table shown.',
    answer: 'A name number is the sum of the values of its letters, reduced to a single digit. Pythagorean numerology numbers the alphabet 1 to 9 in order (A=1 … I=9, J=1 …); Chaldean numerology gives each letter a value from 1 to 8 by its sound and reads the unreduced compound number as well.',
    method: [
      'Pythagorean: A J S = 1, B K T = 2, C L U = 3, D M V = 4, E N W = 5, F O X = 6, G P Y = 7, H Q Z = 8, I R = 9.',
      'Expression (destiny) number: add every letter and reduce, keeping 11, 22 and 33.',
      'Soul urge: add only the vowels (A, E, I, O, U). Personality: add only the consonants.',
      'Chaldean: A I J Q Y = 1, B K R = 2, C G L S = 3, D M T = 4, E H N X = 5, U V W = 6, O Z = 7, F P = 8. Nine is not assigned to any letter.',
    ],
    note: 'Use the name you actually go by for a portrait of who you are now, and the full birth name for the one numerologists call your destiny. Accents are ignored; letters outside A–Z are skipped.',
    faqs: [
      { q: 'Pythagorean or Chaldean — which is right?', a: 'They are two traditions, not two answers to one question. Pythagorean is the Western default; Chaldean is older, sound-based and widely used in India for name corrections. Plutto reads both.' },
      { q: 'Why does Chaldean numerology never use 9?', a: 'Nine is considered sacred in the Chaldean system and is not given to any letter. It can still appear as a total.' },
      { q: 'Is Y a vowel?', a: 'Conventions differ. This calculator counts A, E, I, O and U as vowels and Y as a consonant, the most common rule; some numerologists count Y as a vowel when it sounds like one.' },
      { q: 'What is a compound number?', a: 'In Chaldean numerology, the total before it is reduced — for example 23 before 2 + 3 = 5. Each compound number from 10 to 52 has its own traditional meaning.' },
    ],
    guide: '/guides/numerology',
  },
];

export const toolPath = (slug) => `/tools/${slug}`;
export const toolBySlug = (slug) => TOOLS.find((t) => t.slug === slug);
