/**
 * THE FREE CALCULATORS — what each one is, in words. The arithmetic is in
 * calc.js; the widgets in components/site/tools. Every page states its method
 * in full, so a reader (or an answer engine) can check a result by hand.
 */
export const TOOLS = [
  {
    slug: 'moon-sign-nakshatra',
    name: 'Moon sign, nakshatra and dasha calculator',
    short: 'Moon sign & nakshatra',
    title: 'Moon Sign & Nakshatra Calculator — Rashi, Pada, Dasha',
    description: 'Find your Moon sign (rashi), janma nakshatra and pada, and your Vimshottari dasha dates from your birth date and time. Vedic and Western, computed in your browser.',
    answer: 'Your Moon sign is the sign the Moon occupied at the moment you were born. Vedic astrology reads it in the sidereal zodiac as your rashi, together with your janma nakshatra — the lunar mansion the Moon was in — which also sets your Vimshottari dasha, the sequence of planetary periods through life. Western astrology uses the tropical zodiac, so the two often differ by a sign.',
    method: [
      'Your local birth time is converted to UTC using your birthplace’s time-zone history for that date — summer time, war time and, before standard time, local mean time.',
      'The Moon’s apparent geocentric longitude is computed for that instant. That is your Western (tropical) Moon.',
      'For Vedic astrology the Lahiri ayanamsa (24°13′ in 2026) is subtracted, giving the sidereal longitude: each 30° is a rashi, each 13°20′ a nakshatra, each 3°20′ a pada.',
      'The nakshatra’s lord opens the Vimshottari dasha. Its balance at birth is that lord’s years times the share of the nakshatra the Moon had still to cross; the rest follow in order — Ketu 7, Venus 20, Sun 6, Moon 10, Mars 7, Rahu 18, Jupiter 16, Saturn 19, Mercury 17 — with years of 365.25 days.',
    ],
    note: 'Accuracy: in a test of 5,000 random moments from 1900 to 2100, the Moon computed here was within 4.2 arcseconds of Swiss Ephemeris — the engine the Plutto app uses — and the dasha arithmetic is the app’s own. 4 arcseconds is how far the Moon moves in about 7 seconds, so the birth time matters far more: a birth recorded one minute out shifts a dasha date by up to five days. Without a time, the calculator checks the whole day and tells you whether it changes the answer. Nothing you enter leaves your browser.',
    faqs: [
      { q: 'Why is my Vedic Moon sign different from my Western one?', a: 'Vedic astrology measures the zodiac against the stars (sidereal); Western astrology measures it from the March equinox (tropical). The two are now about 24° apart, so a Moon in the first 24° of a Western sign is in the previous sign in Vedic astrology.' },
      { q: 'What if I don’t know my birth time?', a: 'The Moon moves about 13° a day — roughly one nakshatra — so for many dates the nakshatra and Moon sign are the same all day. The calculator checks the whole day: if they change, it tells you the minute they changed, so you can decide from what you know about your birth.' },
      { q: 'What is a pada?', a: 'A quarter of a nakshatra, 3°20′ wide. There are 108 in the zodiac. The pada sets your Moon’s navamsa sign and the syllable a name traditionally begins with.' },
      { q: 'What is the Vimshottari dasha?', a: 'The 120-year cycle of planetary periods (mahadashas) Vedic astrology reads a life by. Where it starts, and how much of the first period is left, depends on the Moon’s nakshatra and how far through it the Moon was at birth. Each mahadasha divides into nine antardashas.' },
      { q: 'Why doesn’t this give my ascendant (lagna)?', a: 'The ascendant changes sign about every two hours and depends on the exact latitude and longitude of the birthplace, not only its time zone. Plutto computes it, with the houses, from your place of birth.' },
    ],
    guide: '/guides/vedic-astrology',
  },
  {
    slug: 'kundli-matching',
    name: 'Kundli matching (Guna Milan) calculator',
    short: 'Kundli matching',
    title: 'Kundli Matching Calculator — Guna Milan, 36 Points',
    description: 'Free kundli matching by date of birth: Guna Milan (Ashtakoota) score out of 36 with all eight kootas, Nadi and Bhakoot dosha, and every classical table shown.',
    answer: 'Kundli matching (Guna Milan, or Ashtakoota) compares the Moons of two birth charts across eight kootas worth 36 points: Varna 1, Vashya 2, Tara 3, Yoni 4, Graha Maitri 5, Gana 6, Bhakoot 7 and Nadi 8. Tradition asks for at least 18; 25 or more is considered a very good match. It needs each person’s date, time and place of birth.',
    method: [
      'Each birth is converted to UTC with the birthplace’s time-zone history, and the Moon’s sidereal (Lahiri) longitude is computed for that instant — the same method as the Moon sign calculator.',
      'From each Moon: the nakshatra (for Tara, Yoni, Gana and Nadi), the sign (for Varna, Bhakoot and the sign lord of Graha Maitri) and the Vashya group, which for Sagittarius and Capricorn depends on which half of the sign the Moon is in.',
      'Each koota is scored from its classical table — all of them are printed below the calculator — and the eight are added.',
      'Nadi dosha (the same nadi, 0 of 8) and Bhakoot dosha (Moon signs 2/12, 5/9 or 6/8 apart, 0 of 7) are flagged.',
    ],
    note: 'Schools differ in a few places — the Gana cross scores, and the exceptions that cancel Nadi or Bhakoot dosha — and the page says which choice it makes. Guna Milan reads only the two Moons; a full compatibility reading also weighs Mangal dosha, the seventh house and both whole charts. Nothing you enter leaves your browser.',
    faqs: [
      { q: 'How many gunas are needed for marriage?', a: 'Tradition sets the minimum at 18 of 36. 18–24 is considered average, 25–32 very good and 33–36 excellent — though a score is weighed together with the doshas and the full charts, not on its own.' },
      { q: 'What is Nadi dosha?', a: 'Both partners’ Moons in nakshatras of the same nadi (Adi, Madhya or Antya), which scores 0 of Nadi’s 8 points. It is the most heavily weighted koota; classical texts give exceptions, for example when both Moons are in the same sign but different nakshatras.' },
      { q: 'What is Bhakoot dosha?', a: 'The two Moon signs 2/12, 5/9 or 6/8 from each other, which scores 0 of Bhakoot’s 7 points. It is traditionally cancelled when the two sign lords are the same planet or friends.' },
      { q: 'Can kundli matching be done by name?', a: 'Name matching uses the naming syllable to guess a nakshatra, and is only an approximation. Matching by date, time and place of birth uses the actual position of each Moon.' },
      { q: 'Why does a birth time matter?', a: 'The Moon crosses a nakshatra in about a day and a sign in two and a half, so on some dates the nakshatra — and several kootas with it — depends on the hour. Without a time the calculator warns you when that is the case.' },
    ],
    guide: '/guides/vedic-astrology',
  },
  {
    slug: 'sade-sati',
    name: 'Sade Sati calculator',
    short: 'Sade Sati',
    title: 'Sade Sati Calculator — Your Exact Dates, Every Phase',
    description: 'Check if you are in Shani Sade Sati now and see every Sade Sati of your life with exact dates for each phase, plus Dhaiya (small panoti), from Saturn’s real transits.',
    answer: 'Sade Sati is the roughly seven-and-a-half-year period in which Saturn passes through the sign before your Moon sign, your Moon sign itself, and the sign after it. It comes about every 30 years, so most people meet it two or three times. The dates depend only on your Moon sign — and on Saturn, whose retrograde returns can stretch each phase.',
    method: [
      'Your Moon sign is computed from your birth date, time and time zone (sidereal, Lahiri) — or you pick it if you already know it.',
      'Saturn’s sidereal sign ingresses from 1900 to 2100 were computed with Swiss Ephemeris, the engine the Plutto app uses, including every retrograde step back into the previous sign.',
      'A Sade Sati runs from Saturn’s first entry into the 12th sign from your Moon to its final exit from the 2nd; its three phases — rising, peak and setting — are listed with their exact dates.',
      'The two small panotis (Dhaiya) are Saturn in the 4th sign from the Moon (Kantaka Shani) and the 8th (Ashtama Shani).',
    ],
    note: 'These are the actual crossing dates, to the day, not the rounded 7½-year blocks many lists give — which is why a phase can repeat when Saturn turns retrograde. Nothing you enter leaves your browser.',
    faqs: [
      { q: 'How long does Sade Sati last?', a: 'About seven and a half years — Saturn spends around two and a half years in each of the three signs — but retrograde returns can make a particular Sade Sati a few months longer or shorter.' },
      { q: 'Which Moon signs are in Sade Sati in 2026?', a: 'Saturn is in sidereal Pisces from 29 March 2025 to June 2027, so the Moon signs in Sade Sati are Aquarius (setting phase), Pisces (peak) and Aries (rising). The table on this page lists every sign’s dates from 2000 to 2050.' },
      { q: 'What is Dhaiya (small panoti)?', a: 'Saturn’s two-and-a-half-year stay in the 4th sign from the Moon (Kantaka Shani) or the 8th (Ashtama Shani). Tradition reads them as lighter versions of Sade Sati.' },
      { q: 'Is Sade Sati always difficult?', a: 'Tradition reads it as a period of pressure, responsibility and consolidation rather than as a misfortune, and says its effect depends on Saturn’s own strength and placement in the birth chart — which a Moon-sign table cannot show.' },
    ],
    guide: '/guides/vedic-astrology',
  },
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
      { q: 'What if I was born on 3, 4 or 5 February?', a: 'Li Chun falls on one of those days at a specific minute that changes each year — the moment the Sun reaches 315° of ecliptic longitude. Add your birth time and time zone and the calculator computes that moment for your year and tells you which side of it you were born on.' },
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
