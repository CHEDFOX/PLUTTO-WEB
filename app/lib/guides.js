/**
 * THE GUIDES — one page per system Plutto reads, at /guides/<slug>.
 *
 * Built for the question someone actually types ("what is BaZi", "how does KP
 * astrology work", "what is a mahadasha") and for the engines that answer it:
 *
 *   • `answer` is the whole answer in one paragraph, first on the page. Answer
 *     engines lift the first plain definition under a matching heading.
 *   • sections are the long form: how the system works, in its own vocabulary.
 *   • `inPlutto` says what the app computes for it — named as the app names it,
 *     and only what the app does (checked against the backend catalog).
 *   • faqs become FAQPage structured data on the page.
 *
 * Accuracy over reach: these describe the traditions as they are practised and
 * make no claim that astrology predicts anything — the same stance the app
 * takes ("it does not pretend to be certain").
 */

export const UPDATED = '2026-09-28';

export const GUIDES = [
  {
    slug: 'vedic-astrology',
    name: 'Vedic astrology',
    title: 'Vedic Astrology (Jyotish): How It Works',
    description:
      'What Vedic astrology (Jyotish) is: the sidereal zodiac, the nine grahas, twelve bhavas, 27 nakshatras, Vimshottari dashas, yogas and doshas — and how Plutto reads them.',
    answer:
      'Vedic astrology, or Jyotish, is the astrology of the Indian subcontinent. It reads the sky in the sidereal zodiac — measured against the fixed stars — using nine grahas (the Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn and the lunar nodes Rahu and Ketu), twelve bhavas (houses) and 27 nakshatras (lunar mansions). Its signature is timing: the Vimshottari dasha system divides a 120-year life cycle into planetary periods that say which graha is "running" your life now.',
    sections: [
      {
        h: 'The sidereal zodiac and the ayanamsa',
        p: [
          'Western astrology fixes the zodiac to the seasons; Jyotish fixes it to the stars. Because the equinoxes drift slowly against the stars, the two zodiacs now sit about 24° apart, and most people’s Vedic Sun sign is the sign before their Western one. The size of that offset is the ayanamsa. Plutto uses the Lahiri ayanamsa, the standard adopted by the Indian government’s calendar reform and the most widely used in India.',
        ],
      },
      {
        h: 'Grahas, bhavas and nakshatras',
        p: [
          'A Vedic chart (kundli) places the nine grahas in the twelve rashis (signs) and twelve bhavas. Each bhava governs a field of life — the first the self, the seventh partnership, the tenth work and standing. Beneath the signs sit the 27 nakshatras, each 13°20′ of the zodiac; the nakshatra the Moon occupies at birth (the janma nakshatra) sets where your dasha sequence begins.',
        ],
      },
      {
        h: 'Dashas: the timing of a life',
        p: [
          'The Vimshottari dasha assigns each graha a period — Ketu 7 years, Venus 20, the Sun 6, the Moon 10, Mars 7, Rahu 18, Jupiter 16, Saturn 19, Mercury 17 — which together make 120 years. Each mahadasha (major period) divides into antardashas (sub-periods). Jyotish reads a life less as a fixed character than as a sequence of chapters, each coloured by the graha in charge.',
        ],
      },
      {
        h: 'Yogas, doshas, gochara and muhurta',
        p: [
          'Yogas are specific combinations of grahas and houses — Gaja Kesari, Raja yogas, Dhana yogas — read as capacities in the chart. Doshas are the combinations the tradition treats as afflictions, such as Mangal (Kuja) dosha or Kaal Sarp. Gochara is transit: where the grahas are today relative to your natal Moon, which is where Sade Sati (Saturn’s seven-and-a-half-year passage) comes from. Muhurta is the choice of an auspicious moment to begin something.',
        ],
      },
      {
        h: 'Compatibility: Guna Milan',
        p: [
          'For partnership, Jyotish traditionally compares two charts by Ashtakoota Guna Milan: eight factors (kootas) drawn from each person’s Moon nakshatra, scored out of 36 points. Many families treat 18 as the threshold, and read Mangal dosha alongside the score.',
        ],
      },
    ],
    inPlutto: [
      'Grahas — your full chart, planet by planet',
      'Bhavas — the twelve houses, and what occupies them',
      'Dashas — your current mahadasha and antardasha, and what they open',
      'Yogas and Doshas — the combinations present in your chart',
      'Gochara — today’s transits against your Moon',
      'Muhurta — auspicious timing for what you plan',
      'Guna Milan — Ashtakoota compatibility out of 36',
      'Purva Janma and Life Story — the chart read as a whole life',
      'Prashna — a question answered from the moment you ask it',
      'Ank Jyotish — Vedic numerology',
      'Today, This Week, This Month, This Year — time wheels read from your dashas and transits',
    ],
    faqs: [
      { q: 'What is the difference between Vedic and Western astrology?', a: 'Vedic astrology (Jyotish) uses the sidereal zodiac, fixed to the stars; Western astrology uses the tropical zodiac, fixed to the seasons. They now differ by about 24°, so your Vedic sign is often the one before your Western sign. Jyotish also emphasises the Moon, the 27 nakshatras and dasha timing, while Western astrology centres on the Sun sign, aspects and transits.' },
      { q: 'Which ayanamsa does Plutto use?', a: 'Plutto uses the Lahiri (Chitrapaksha) ayanamsa for Vedic charts, the most widely used standard in India. KP charts use the Krishnamurti ayanamsa, as that system specifies.' },
      { q: 'What is a mahadasha?', a: 'A mahadasha is a major planetary period in the Vimshottari dasha system. The 120-year cycle is divided among the nine grahas — Venus runs 20 years, Saturn 19, Rahu 18, Mercury 17, Jupiter 16, the Moon 10, Mars and Ketu 7 each, the Sun 6 — and each mahadasha is subdivided into antardashas.' },
      { q: 'Do I need my exact birth time for a Vedic chart?', a: 'For the ascendant (lagna) and houses, yes — the lagna changes sign roughly every two hours. The planets’ signs and nakshatras are far less sensitive, so a chart with an approximate time is still meaningful for dashas and transits.' },
    ],
    related: ['kp-astrology', 'numerology', 'western-astrology'],
  },
  {
    slug: 'kp-astrology',
    name: 'KP astrology',
    title: 'KP Astrology (Krishnamurti Paddhati): Sub-Lords and Horary',
    description:
      'KP astrology explained: K.S. Krishnamurti’s system of Placidus cusps, star-lords and sub-lords, significators and horary by numbers 1–249 — and how Plutto reads it.',
    answer:
      'KP astrology (Krishnamurti Paddhati) is a precise branch of Vedic astrology developed by K.S. Krishnamurti in Chennai in the mid-twentieth century. It divides each nakshatra into nine unequal sub-divisions ruled by "sub-lords", uses Placidus house cusps, and judges an event by which planets signify the houses involved. It is best known for horary: answering a question from a number between 1 and 249.',
    sections: [
      {
        h: 'Star-lord and sub-lord',
        p: [
          'Every point in the zodiac has a sign lord, a star lord (the ruler of its nakshatra) and a sub lord. KP subdivides each nakshatra in the same proportions as the Vimshottari dasha years, giving 249 unequal subs across the zodiac. The central rule of KP is that the sub-lord of a house cusp decides whether that house’s matters will come to pass.',
        ],
      },
      {
        h: 'Cusps, significators and ruling planets',
        p: [
          'KP uses Placidus house cusps and the Krishnamurti ayanamsa. A planet signifies a house by occupying it, by being the star-lord of a planet in it, or by owning it; the strongest significators of the relevant houses indicate the outcome, and the dasha periods of those planets indicate the timing. "Ruling planets" — the lords of the moment of judgement — confirm the answer.',
        ],
      },
      {
        h: 'Horary: a number from 1 to 249',
        p: [
          'In KP prashna (horary), the querent thinks of a number from 1 to 249. Each number corresponds to one sub of the zodiac, which becomes the ascendant of the question chart, so the answer is read from that moment and that number rather than from a birth chart.',
        ],
      },
    ],
    inPlutto: [
      'Prashna — ask a question, think of a number from 1 to 249, and the chart of that moment answers',
      'Bhavas — house cusps with their star- and sub-lords',
      'KP charts computed with the Krishnamurti ayanamsa and Placidus cusps',
    ],
    faqs: [
      { q: 'Who created KP astrology?', a: 'Professor K.S. Krishnamurti (1908–1972), who developed and published the system in Chennai (then Madras), India, from the 1960s.' },
      { q: 'How is KP different from traditional Vedic astrology?', a: 'KP uses Placidus house cusps instead of whole-sign houses, the Krishnamurti ayanamsa, and the sub-lord of each cusp as the deciding factor for an event. Traditional Jyotish relies more on sign placements, yogas and aspects.' },
      { q: 'Why does KP horary use numbers from 1 to 249?', a: 'Because KP divides the zodiac into 249 subs. Each number maps to one sub, which becomes the ascendant of the horary chart for the question.' },
    ],
    related: ['vedic-astrology', 'numerology'],
  },
  {
    slug: 'western-astrology',
    name: 'Western astrology',
    title: 'Western Astrology: Planets, Aspects, Transits and Synastry',
    description:
      'Western astrology explained: the tropical zodiac, planets and houses, aspects, transits, annual profections and synastry — and what Plutto reads from your chart.',
    answer:
      'Western astrology reads the sky in the tropical zodiac, which is fixed to the seasons: 0° Aries is the March equinox. It interprets the planets by sign and house, the angles between them (aspects), where they are moving now relative to your birth chart (transits), and, for relationships, how two charts interlock (synastry). It descends from the Hellenistic astrology of Roman Egypt.',
    sections: [
      {
        h: 'Planets, signs and houses',
        p: [
          'A Western birth chart places the Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune and Pluto in the twelve signs and twelve houses. Plutto uses the Placidus house system, the most common in modern Western practice. The sign says how a planet behaves; the house says where in life it acts.',
        ],
      },
      {
        h: 'Aspects',
        p: [
          'Aspects are the angles between planets: the conjunction (0°), sextile (60°), square (90°), trine (120°) and opposition (180°). Trines and sextiles are read as ease; squares and oppositions — the "hard" aspects — as tension that drives change.',
        ],
      },
      {
        h: 'Transits and annual profections',
        p: [
          'Transits compare where the planets are today with where they were at birth: a Saturn return, for example, is Saturn coming back to its natal position around ages 29 and 58. Annual profections are a Hellenistic timing technique that advances the ascendant one sign per year of life, making one planet the "lord of the year".',
        ],
      },
      {
        h: 'Synastry and electional astrology',
        p: [
          'Synastry overlays two birth charts to read how two people meet — whose planets touch whose. Electional astrology works the other way: it looks for a future moment whose chart suits what you want to begin.',
        ],
      },
    ],
    inPlutto: [
      'The Planets — your chart, planet by planet',
      'Aspects and Hard Aspects — the angles in your chart',
      'Transits — what the sky is doing to your chart now',
      'Profections — the lord of your year',
      'Temperament — the balance of elements and modes',
      'Synastry — two charts read together',
      'Electional — choosing a moment',
      'Arithmancy — Western numerology',
    ],
    faqs: [
      { q: 'What house system does Plutto use for Western charts?', a: 'Placidus, the most widely used house system in modern Western astrology.' },
      { q: 'What is a Saturn return?', a: 'A Saturn return is the transit of Saturn back to the position it held at your birth. Saturn takes about 29.5 years to circle the zodiac, so returns happen around ages 29–30, 58–59 and 87–88, and are traditionally read as turning points.' },
      { q: 'What is synastry?', a: 'Synastry is the comparison of two birth charts to read a relationship — the aspects one person’s planets make to the other’s.' },
    ],
    related: ['vedic-astrology', 'astrocartography', 'numerology'],
  },
  {
    slug: 'chinese-astrology',
    name: 'Chinese astrology (BaZi)',
    title: 'Chinese Astrology and BaZi (Four Pillars of Destiny)',
    description:
      'Chinese astrology and BaZi explained: the Four Pillars, heavenly stems and earthly branches, the twelve animals, the five elements, Da Yun luck pillars and He Hun compatibility.',
    answer:
      'Chinese astrology reads a birth moment as Four Pillars — BaZi, "eight characters": one heavenly stem and one earthly branch each for the year, month, day and hour of birth. The earthly branches are the twelve animals (Sheng Xiao), and every stem and branch carries one of the five elements (Wu Xing). A chart is read by the balance of those elements around the day stem — the "day master" — and timed by ten-year luck pillars (Da Yun).',
    sections: [
      {
        h: 'Stems, branches and the twelve animals',
        p: [
          'The Chinese calendar combines ten heavenly stems with twelve earthly branches in a sixty-step cycle. The branches are the Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog and Pig. Your year animal is only one of four: the month, day and hour pillars each have an animal and element too, which is why two people born in the same year can have very different charts.',
        ],
      },
      {
        h: 'The five elements and the day master',
        p: [
          'Wood, Fire, Earth, Metal and Water feed and control one another in fixed cycles. BaZi reads every character in the chart relative to the day stem, the day master, and looks for the element that best balances it — the Yong Shen, or "useful god".',
        ],
      },
      {
        h: 'Luck pillars, annual pillars, clashes and combinations',
        p: [
          'Da Yun are ten-year luck pillars that begin at an age calculated from the birth date; Liu Nian is the pillar of the current year laid over the chart. When the branches of different pillars combine (He) or clash (Chong), the tradition reads harmony or disruption between the parts of life they govern.',
        ],
      },
      {
        h: 'Date selection and compatibility',
        p: [
          'Ze Ri is the art of choosing an auspicious day; He Hun compares two BaZi charts for marriage compatibility, including how their animals and elements relate.',
        ],
      },
    ],
    inPlutto: [
      'Four Pillars — your BaZi chart',
      'Sheng Xiao — your animals, all four of them',
      'Wu Xing and Five Elements — your elemental balance',
      'Yong Shen — the element that balances you',
      'Da Yun — your ten-year luck pillars',
      'Liu Nian — this year laid over your chart',
      'He & Chong — combinations and clashes in your chart',
      'Ze Ri — auspicious days',
      'He Hun — compatibility for two',
      'Jiu Xing — the nine stars',
    ],
    faqs: [
      { q: 'What is BaZi?', a: 'BaZi ("eight characters"), also called the Four Pillars of Destiny, is the core system of Chinese astrology. It records the heavenly stem and earthly branch of the year, month, day and hour of birth — eight characters in all — and reads their five-element balance.' },
      { q: 'Is my Chinese zodiac animal just my birth year?', a: 'The year animal is the best-known, but a BaZi chart has four: one each for the year, month, day and hour. The Chinese year also begins at the start of spring (Li Chun, around 4 February), not on 1 January.' },
      { q: 'What are Da Yun luck pillars?', a: 'Da Yun are ten-year periods, each with its own stem and branch, that begin at an age calculated from your birth date and colour each decade of life.' },
    ],
    related: ['numerology', 'vedic-astrology'],
  },
  {
    slug: 'numerology',
    name: 'Numerology',
    title: 'Numerology: Ank Jyotish, Chaldean, Pythagorean, Lo Shu',
    description:
      'Numerology explained: life path and name numbers, Chaldean and Pythagorean systems, Vedic Ank Jyotish with its planetary numbers, the Lo Shu grid and gematria.',
    answer:
      'Numerology reads meaning in numbers derived from your birth date and name. Western (Pythagorean) numerology reduces them to a life path and expression number; Vedic numerology, Ank Jyotish, ties each number from 1 to 9 to a planet; Chinese numerology arranges your birth digits on the Lo Shu magic square. The same arithmetic is applied to names, businesses and phone numbers.',
    sections: [
      {
        h: 'Life path, expression and soul numbers',
        p: [
          'The life path number comes from adding the digits of a full birth date and reducing the sum to a single digit (keeping 11, 22 and 33 as master numbers in the Pythagorean system). Names are converted letter by letter: the Pythagorean system assigns 1–9 in alphabetical order; the Chaldean system uses 1–8 by the sound of each letter.',
        ],
      },
      {
        h: 'Ank Jyotish: numbers as planets',
        p: [
          'In Vedic numerology each number belongs to a graha: 1 the Sun, 2 the Moon, 3 Jupiter, 4 Rahu, 5 Mercury, 6 Venus, 7 Ketu, 8 Saturn and 9 Mars. Your birth day gives the psychic (moolank) number and your full date the destiny (bhagyank) number, and the friendships between their planets are read the way Jyotish reads the planets themselves.',
        ],
      },
      {
        h: 'The Lo Shu grid and gematria',
        p: [
          'The Lo Shu is the 3×3 magic square of Chinese tradition, in which every row, column and diagonal sums to 15. Placing the digits of a birth date on it shows which numbers are present, repeated or missing. Gematria, from Hebrew tradition, gives each letter of a word a number and reads words with equal sums as related.',
        ],
      },
    ],
    inPlutto: [
      'The Numbers — your core numbers',
      'Ank Jyotish — Vedic numerology',
      'Arithmancy — Western numerology',
      'Jiu Xing — the nine stars',
      'Lo Shu Grid — your birth numbers on the magic square',
      'Your Name and Business Name — how a name resonates',
      'Mobile Number — whether your digits add up for you',
      'Angel Numbers — the number you keep seeing',
      'Gematria — a Hebrew word’s number',
    ],
    faqs: [
      { q: 'How do I calculate my life path number?', a: 'Add every digit of your full birth date and reduce the total to one digit by adding its digits again. For 14 March 1994: 1+4+0+3+1+9+9+4 = 31, and 3+1 = 4. In Pythagorean numerology 11, 22 and 33 are kept as master numbers rather than reduced.' },
      { q: 'What is the difference between Chaldean and Pythagorean numerology?', a: 'Pythagorean numerology assigns the numbers 1–9 to letters in alphabetical order. Chaldean numerology assigns 1–8 according to the sound of each letter and treats 9 as sacred, so the same name can give different numbers in each.' },
      { q: 'What is the Lo Shu grid?', a: 'A 3×3 magic square from Chinese tradition in which every line sums to 15. Numerologists place the digits of a birth date on it to see which numbers are present, repeated or missing.' },
    ],
    related: ['vedic-astrology', 'chinese-astrology', 'tarot'],
  },
  {
    slug: 'tarot',
    name: 'Tarot and card readings',
    title: 'Tarot, Lenormand, Runes, Ogham, I Ching and Geomancy',
    description:
      'How tarot and the other casting traditions work: the 78-card tarot deck, the 36-card Lenormand, Elder Futhark runes, Ogham, the 64 hexagrams of the I Ching and geomancy.',
    answer:
      'Tarot is a deck of 78 cards — 22 Major Arcana and 56 Minor Arcana in four suits (wands, cups, swords and pentacles) — drawn and read in response to a question. It belongs to the family of "cast" traditions, which read what is drawn or thrown at the moment of asking rather than a birth chart; the others Plutto reads include the Lenormand deck, runes, Ogham, the I Ching and geomancy.',
    sections: [
      {
        h: 'The tarot deck',
        p: [
          'The Major Arcana run from The Fool to The World and are read as the large movements of a life; the Minor Arcana, fourteen cards in each suit from Ace to King, as its everyday matters. A reading lays cards in a spread, where each position asks its own part of the question.',
        ],
      },
      {
        h: 'Other decks and lots',
        p: [
          'Lenormand is a 36-card deck read in plain, concrete combinations. Runes are the letters of the Elder Futhark, drawn from a bag; Ogham is the early Irish tree alphabet. The I Ching builds one of 64 hexagrams from six lines cast with coins or yarrow stalks. Geomancy marks sixteen figures from random marks and reads them in a chart of its own.',
        ],
      },
    ],
    inPlutto: [
      'Tarot — shuffle, choose, and the draw is read for you; never the same draw twice',
      'Lenormand, Runes, Ogham, I Ching and Geomancy — each dealt and read in its own tradition',
      'The Blunt Seer — a straight answer, if you dare',
    ],
    faqs: [
      { q: 'How many cards are in a tarot deck?', a: 'A standard tarot deck has 78 cards: 22 Major Arcana and 56 Minor Arcana divided into four suits of 14 cards — wands, cups, swords and pentacles.' },
      { q: 'What is the difference between tarot and Lenormand?', a: 'Tarot has 78 cards with rich symbolic imagery and is read card by card within a spread. Lenormand has 36 cards with simple everyday images, and is read in pairs and lines like sentences.' },
      { q: 'What is the I Ching?', a: 'The I Ching, or Book of Changes, is an ancient Chinese text of 64 hexagrams. A reading builds one hexagram from six lines, traditionally cast with three coins or 50 yarrow stalks, and reads the text for it and any changing lines.' },
    ],
    related: ['numerology', 'chinese-astrology'],
  },
  {
    slug: 'astrocartography',
    name: 'Astrocartography',
    title: 'Astrocartography: Why Some Places Feel Like Home',
    description:
      'Astrocartography explained: Jim Lewis’s map of where each planet was rising, culminating, setting or at the lowest point at your birth — and what Plutto reads from it.',
    answer:
      'Astrocartography maps where on Earth each planet was on an angle — rising, culminating, setting or at its lowest point — at the moment you were born. Each planet draws four lines across the world map; the tradition reads places near a line as places where that planet’s themes are loud. It was developed by the astrologer Jim Lewis in San Francisco in the 1970s.',
    sections: [
      {
        h: 'The four lines',
        p: [
          'For every planet the map draws an Ascendant line (where it was rising), a Descendant line (setting), a Midheaven line (at its highest) and an Imum Coeli line (at its lowest). A Venus Midheaven line, for example, is read as a place where love and beauty show in public life; a Saturn Ascendant line as a place that asks for discipline.',
        ],
      },
      {
        h: 'Relocation',
        p: [
          'Relocation astrology goes one step further: it recasts your whole birth chart for another city — same moment, different place — so the houses and angles move while the planets stay put.',
        ],
      },
    ],
    inPlutto: [
      'Why Some Places Feel Like Home — the places your chart pulls you toward, and why',
      `The globe — ${102} traditions, each pinned where it began, each read from your chart`,
    ],
    faqs: [
      { q: 'Who invented astrocartography?', a: 'The American astrologer Jim Lewis, who developed and named it in San Francisco in the 1970s.' },
      { q: 'What do astrocartography lines mean?', a: 'Each planet has four lines: where it was rising (Ascendant), setting (Descendant), culminating (Midheaven) and at its lowest point (Imum Coeli) at your birth. Places near a line are read as places where that planet’s themes are strongest.' },
    ],
    related: ['western-astrology', 'vedic-astrology'],
  },
];

export const GUIDE_BY_SLUG = Object.fromEntries(GUIDES.map((g) => [g.slug, g]));
