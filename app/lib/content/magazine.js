/**
 * Magazine features at /magazine/<slug>, each built on a checkable fact with its sources listed. Pictures are openly
 * licensed Wikimedia Commons files loaded from Commons and credited with a link, or plates drawn in code (`plate`);
 * `app` is the app page a piece ends on, with screens recorded from the app in public/magazine/app.
 */

export const PUBLISHED = '2026-10-13';

/** A Commons file, at a width Commons serves (it redirects to the right thumbnail). */
export const commons = (file, width = 1280) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
export const commonsPage = (file) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, '_'))}`;

/** The pages of the app the magazine opens into (screens recorded from the app itself). */
export const APP_PAGES = [
  { key: 'cover', title: 'Today’s cover', line: 'Your day, set as an issue: one line written for you, and how it knows.' },
  { key: 'how-do-you-know', title: 'How do you know?', line: 'Every claim opens to its working: the method, the positions, and how much your birth time matters.' },
  { key: 'receipts', title: 'Receipts', line: 'What it said would happen, and whether it did. You mark each one.' },
  { key: 'ask', title: 'Ask', line: 'Ask anything, typed or out loud, in your own language.' },
  { key: 'what-is-coming', title: 'What is coming', line: 'The next two years on one line, drawn from your own sky, with a reminder for each date.' },
  { key: 'the-shells', title: 'Ask the shells', line: 'Hold a question. Throw. The answer follows the Yoruba names for each throw.' },
  { key: 'the-atlas', title: 'The atlas', line: 'The world’s divination traditions, each pinned where it began.' },
];
export const APP_PAGE = Object.fromEntries(APP_PAGES.map((p) => [p.key, p]));

export const ARTICLES = [
  {
    slug: 'the-sky-in-your-words',
    kicker: 'Language',
    title: 'Disaster, influenza, lunatic: the sky is hiding in your words',
    standfirst: 'You speak astrology every day without noticing. A disaster is a bad star, influenza was an influence from above, and a lunatic was touched by the Moon.',
    image: { file: 'Anatomical Man.jpg', alt: 'The zodiac man from the Très Riches Heures: a human figure with the twelve signs placed on the parts of the body they were said to rule.',
      caption: 'The “zodiac man” from the Très Riches Heures du duc de Berry, painted by the Limbourg brothers, 1411–1416. Each sign rules a part of the body, Aries at the head and Pisces at the feet.',
      credit: 'Limbourg brothers, Musée Condé, Chantilly. Public domain, via Wikimedia Commons.' },
    body: [
      { p: 'English is full of fossils from a time when the sky was thought to steer life on the ground. Most of them are still in daily use, and almost nobody hears the stars in them any more.' },
      { h: 'A bad star' },
      { p: '“Disaster” came into English in the late 1500s from the Italian disastro: dis-, a sense of something gone wrong, and astro, star. A disaster was an event under an ill-placed star. Shakespeare plays on it in King Lear, where Edmund mocks people who “make guilty of our disasters the sun, the moon, and the stars.” The same stage gave the world Romeo and Juliet, “a pair of star-cross’d lovers.”' },
      { quote: 'A disaster was, literally, an event under an ill-placed star.' },
      { h: 'An influence from above' },
      { p: '“Influenza” is the Italian word for influence, from the medieval Latin influentia, a flowing-in. Physicians described the power of the heavens as streaming down onto the earth, and epidemics that struck many people at once were put down to it. English borrowed the Italian name for the great epidemic of 1743, and the word for the illness stayed.' },
      { h: 'Moonstruck' },
      { p: '“Lunatic” is the Latin lunaticus, moonstruck, from luna. Madness was long believed to wax and wane with the Moon’s phases, and English law used “lunatic” as a legal category well into the twentieth century.' },
      { fact: 'Medieval physicians kept a “zodiac man” beside their books: a figure with each sign ruling a part of the body. The rule was never to bleed a part while the Moon stood in its sign.' },
      { h: 'Born under a planet' },
      { p: 'Temperament words come from the same source. Someone “jovial” was born under Jupiter (Jove) and expected to be good-humoured; someone “saturnine” under slow, cold Saturn; someone “mercurial” under quick, changeable Mercury; and “martial” things belong to Mars. “Ill-starred” and “thank your lucky stars” say the rest plainly.' },
      { p: 'Two more are often listed and are less certain. “Consider” comes from the Latin considerare, which some scholars read as “to examine the stars” (sidus, star); others disagree. “Desire,” from desiderare, has a similar disputed story. Either way, the habit of looking up before deciding left its mark on how we talk about deciding.' },
    ],
    app: 'cover',
    sources: [
      'Oxford English Dictionary, entries “disaster,” “influenza,” “lunatic,” “jovial,” “saturnine,” “mercurial.”',
      'Online Etymology Dictionary (etymonline.com), the same entries and “consider,” “desire.”',
      'William Shakespeare, King Lear, 1.2, and Romeo and Juliet, Prologue.',
      'Les Très Riches Heures du duc de Berry, Musée Condé, Chantilly, Ms. 65, f. 14v.',
    ],
  },
  {
    slug: 'leibniz-binary-i-ching',
    kicker: 'I Ching',
    title: 'The I Ching was already counting in binary',
    standfirst: 'In 1701 a Jesuit in Beijing posted a diagram of the I Ching’s hexagrams to Germany. When Gottfried Leibniz read it, he found his own new arithmetic of nothing but 0s and 1s.',
    image: { file: 'Diagram of I Ching hexagrams owned by Gottfried Wilhelm Leibniz, 1701.jpg', alt: 'A woodcut diagram of the sixty-four I Ching hexagrams arranged in a square and a circle, with numbers added by hand.',
      caption: 'The diagram Joachim Bouvet sent to Leibniz in 1701: the sixty-four hexagrams in the order attributed to Fuxi, set in a circle and a square. Leibniz wrote the matching numbers above them by hand.',
      credit: 'Gottfried Wilhelm Leibniz Bibliothek, Hannover. Public domain, via Wikimedia Commons.' },
    body: [
      { p: 'By 1679 Leibniz had worked out a way of writing every number with two digits, 0 and 1. He thought it beautiful and kept it in a drawer: it made sums longer, and no one had a use for it yet.' },
      { h: 'A letter from Beijing' },
      { p: 'Joachim Bouvet was a French Jesuit mathematician at the court of the Kangxi Emperor, and a correspondent of Leibniz. On 4 November 1701 he wrote from Beijing and enclosed a woodcut of the I Ching’s sixty-four hexagrams in the arrangement attributed to the legendary sage Fuxi, as set out by the eleventh-century scholar Shao Yong.' },
      { p: 'Each hexagram is six stacked lines, each line either broken or whole. Read a broken line as 0 and a whole line as 1, and Shao Yong’s order runs through the sixty-four hexagrams exactly as the numbers 0 to 63 run in binary.' },
      { quote: 'Read a broken line as 0 and a whole line as 1, and the hexagrams count from 0 to 63.' },
      { p: 'The letter reached Leibniz in 1703. He wrote the numbers over the hexagrams himself, and that year he finally published his binary arithmetic, in the journal of the French Academy of Sciences, with a section on the hexagrams of Fuxi.' },
      { fact: 'Six lines with two states each give 2 × 2 × 2 × 2 × 2 × 2 = 64 hexagrams. Three lines give the eight trigrams. A computer’s bits work the same way.' },
      { h: 'What it was, and what it wasn’t' },
      { p: 'The I Ching was not doing arithmetic; it is a book of divination and philosophy, and Shao Yong’s order is a picture of the cosmos unfolding from yin and yang. What Leibniz recognised was a structure: the same two-way choice, repeated, building everything. Today that structure runs every phone and computer on Earth.' },
    ],
    app: 'the-atlas',
    sources: [
      'G. W. Leibniz, “Explication de l’arithmétique binaire,” Mémoires de l’Académie Royale des Sciences (1703).',
      'James A. Ryan, “Leibniz’ Binary System and Shao Yong’s Yijing,” Philosophy East and West 46 (1996).',
      'Frank J. Swetz, “Leibniz, the Yijing, and the Religious Conversion of the Chinese,” Mathematics Magazine 76 (2003).',
    ],
  },
  {
    slug: 'the-computer-that-predicted-eclipses',
    kicker: 'Ancient Greece',
    title: 'A bronze computer, two thousand years old, that predicted eclipses',
    standfirst: 'In 1901 sponge divers lifted a corroded lump of bronze from a shipwreck off the Greek island of Antikythera. Inside were gears, and on the gears, the sky.',
    image: { file: "NAMA Machine d'Anticythère 1.jpg", alt: 'The largest surviving fragment of the Antikythera mechanism: a corroded bronze disc with the remains of gear wheels.',
      caption: 'The main fragment of the Antikythera mechanism, National Archaeological Museum, Athens (inv. 15987).',
      credit: 'Photo: Marsyas, Creative Commons licence, via Wikimedia Commons.' },
    body: [
      { p: 'The ship went down around 70 to 60 BC with a cargo of statues and glass. The fragment sat in the National Museum in Athens for months before anyone noticed a gear wheel in it. It took most of the next century, and in the end X-ray tomography, to read what the rest of it was.' },
      { h: 'The sky, on a crank' },
      { p: 'The Antikythera mechanism was a box about the size of a shoebox, worked by a hand crank. At least thirty bronze gears survive. Turning the crank moved a pointer for the Sun and one for the Moon around a zodiac dial on the front, while a small ball, half silver and half dark, turned to show the Moon’s phase.' },
      { p: 'One pair of gears is mounted off-centre with a pin running in a slot, so the Moon’s pointer speeds up and slows down through the month, just as the real Moon does. It is a working model of a Greek theory of the Moon’s motion, cut in bronze.' },
      { quote: 'Nothing of comparable complexity survives from the next thousand years.' },
      { h: 'Eclipses, by the calendar' },
      { p: 'On the back, a spiral dial counted 223 lunar months, the saros: after 223 months, the Sun, Earth and Moon line up in nearly the same way again, so eclipses repeat. Babylonian astronomers had found this cycle centuries earlier. Small glyphs on the dial marked the months that would bring an eclipse, and even the hour.' },
      { fact: 'A saros is about 18 years, 11 days and 8 hours. The extra third of a day means each repeat of an eclipse happens about a third of the way further round the Earth.' },
      { p: 'Another dial tracked the four-year cycle of the Panhellenic games, the Olympics among them. The device is a calendar, an almanac and a model of the cosmos at once, and nothing of comparable complexity survives from the next thousand years, until the astronomical clocks of medieval Europe.' },
    ],
    app: 'what-is-coming',
    link: { href: '/sky-calendar', label: 'Every eclipse and retrograde, on the sky calendar' },
    sources: [
      'T. Freeth et al., “Decoding the ancient Greek astronomical calculator known as the Antikythera Mechanism,” Nature 444 (2006).',
      'T. Freeth et al., “Calendars with Olympiad display and eclipse prediction on the Antikythera Mechanism,” Nature 454 (2008).',
      'T. Freeth et al., “A Model of the Cosmos in the ancient Greek Antikythera Mechanism,” Scientific Reports 11 (2021).',
      'Derek de Solla Price, Gears from the Greeks (1974).',
    ],
  },
  {
    slug: 'kepler-cast-horoscopes',
    kicker: 'Astronomy',
    title: 'The astronomer who cast horoscopes',
    standfirst: 'Johannes Kepler found the laws of planetary motion that still steer spacecraft. He also drew up birth charts for a living, including two for the most feared general in Europe.',
    image: { file: 'Kepler-Wallenstein-Horoskop.jpg', alt: 'A square horoscope chart drawn by Johannes Kepler for Albrecht von Wallenstein, with the planets written into the houses.', small: true,
      caption: 'Kepler’s horoscope for Albrecht von Wallenstein, first cast in 1608 and revised in 1625.',
      credit: 'Johannes Kepler. Public domain, via Wikimedia Commons.' },
    body: [
      { p: 'Kepler (1571–1630) is the man who showed that planets move in ellipses, sweep out equal areas in equal times, and take longer to go round the further out they are. Newton built on him. NASA named a planet-hunting telescope after him.' },
      { h: 'Astrology paid the bills' },
      { p: 'As a young teacher in Graz, Kepler had to write the town’s annual almanac. His first, for 1595, warned of a bitter cold winter and an attack by the Ottoman Turks. Both came, and his name was made. In Prague, as Imperial Mathematician to Rudolf II, giving astrological advice was part of the job.' },
      { h: 'A chart for Wallenstein' },
      { p: 'In 1608 an intermediary asked Kepler for the horoscope of an unnamed young nobleman. It was Albrecht von Wallenstein, then about twenty-five. Kepler described a restless, ambitious, suspicious man who would seek power. Wallenstein became commander of the Emperor’s armies in the Thirty Years’ War, and kept the chart, annotating it in his own hand.' },
      { p: 'In 1624 he asked Kepler to revise it, and Kepler, warning his client not to rely on the stars for decisions, corrected the birth time and carried the forecast forward. The revised reading runs out in 1634. Wallenstein was murdered on 25 February 1634.' },
      { quote: 'He warned against throwing out the baby with the bathwater.' },
      { h: 'The third man' },
      { p: 'Kepler thought most of the astrology of his day was rubbish, and said so. But in a 1610 book, Tertius Interveniens, “the third man intervening,” he warned the sceptics against throwing out the baby with the bathwater: he believed the angles between planets really did stir something in people. He even invented new ones, the quintile (72°) and the sesquiquadrate (135°) among them, which astrologers still use.' },
      { fact: 'Kepler’s Harmonices Mundi of 1619 announces his third law of planetary motion and, in the same book, discusses astrological aspects.' },
    ],
    app: 'how-do-you-know',
    sources: [
      'Max Caspar, Kepler, trans. C. Doris Hellman (1959).',
      'Johannes Kepler, Tertius Interveniens (1610) and Harmonices Mundi (1619).',
      'K. Einhorn and G. Wuchterl, on Kepler’s horoscopes for Wallenstein of 1608 and 1625.',
    ],
  },
  {
    slug: 'your-week-is-a-planetary-clock',
    kicker: 'The week',
    title: 'Why Monday follows Sunday: your week is a planetary clock',
    standfirst: 'The days of the week are named for the seven lights the ancient world saw wandering across the sky. But their order isn’t the planets’ order. It falls out of a clock that gave every hour of the day to a planet.',
    plate: 'week',
    plateCaption: 'The seven planets in their old order, slowest to fastest. Join every third one and the star you draw is the week: Saturn, Sun, Moon, Mars, Mercury, Jupiter, Venus.',
    body: [
      { p: 'Ancient astronomers counted seven bodies moving against the fixed stars: Saturn, Jupiter, Mars, the Sun, Venus, Mercury and the Moon. Listed like that, they run from the slowest to the fastest, the order Hellenistic astrologers used for everything.' },
      { h: 'A planet for every hour' },
      { p: 'Those astrologers gave each hour of the day a ruling planet, in that order, over and over. Give the first hour of a day to Saturn. Twenty-four hours later the cycle of seven has gone round three times with three hours to spare, so the first hour of the next day lands on the Sun. The day after that begins with the Moon, then Mars, then Mercury, Jupiter and Venus, and then Saturn again.' },
      { quote: 'Each day was named for the planet that ruled its first hour.' },
      { p: 'Each day was named for the planet that ruled its first hour, and that is the week we still keep: Saturday, Sunday, Monday. The Roman historian Cassius Dio described this explanation around AD 200.' },
      { h: 'The same week in many languages' },
      { p: 'English swapped four of the gods for their Norse counterparts: Tiw for Mars (Tuesday), Woden for Mercury (Wednesday), Thor for Jupiter (Thursday), Frigg for Venus (Friday). Spanish kept the planets: martes, miércoles, jueves, viernes. In Hindi the week runs Ravivar, Somvar, Mangalvar, Budhvar, Guruvar, Shukravar, Shanivar: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, in exactly the same order. Japanese names the days for the Sun, the Moon, fire, water, wood, metal and earth, the elements East Asian astronomy gave to the same planets.' },
      { fact: 'Draw the seven planets on a circle in the old order and join every third one: the seven-pointed star you get traces the days of the week in sequence.' },
      { h: 'The hours, still counted' },
      { p: 'Planetary hours are still used for choosing a time to begin things. In Sanskrit an hour of this kind is a horā, borrowed from the Greek hōra, the word that also gave English “hour” and “horoscope.” Plutto works out the day’s hours, Rahu kalam among them, from the real sunrise and sunset where you are, not from a fixed six o’clock.' },
    ],
    app: 'cover',
    link: { href: '/panchang', label: 'Today’s panchang' },
    sources: [
      'Cassius Dio, Roman History 37.18–19.',
      'F. H. Colson, The Week (Cambridge, 1926).',
      'Eviatar Zerubavel, The Seven Day Circle (1985).',
    ],
  },
  {
    slug: 'the-two-zodiacs-are-24-degrees-apart',
    kicker: 'The zodiac',
    title: 'The two zodiacs are 24° apart, and drifting further',
    standfirst: 'The zodiac in a magazine horoscope and the one an Indian astrologer uses were once the same. The Earth’s slow wobble has pulled them apart, by about a day every seventy-two years.',
    plate: 'zodiacs',
    plateCaption: 'Outside, the tropical zodiac, tied to the seasons. Inside, the sidereal zodiac, tied to the stars. Today the second sits about 24° behind the first.',
    body: [
      { p: 'The Earth spins like a slightly tipped top, and like a top its axis slowly circles. One full circle takes about 25,800 years. Astronomers call it the precession of the equinoxes, and the Greek astronomer Hipparchus noticed it in the second century BC by comparing his star positions with ones measured about 150 years earlier.' },
      { h: 'Seasons or stars' },
      { p: 'Western astrology fixes the start of Aries to the March equinox, so its signs stay tied to the seasons: Aries always begins around 21 March. That is the tropical zodiac. Vedic astrology, Jyotish, fixes its signs to the stars themselves: the sidereal zodiac. Because of precession, the March equinox slides backwards against the stars by about one degree every seventy-two years, and the two zodiacs move apart.' },
      { quote: 'For roughly four people in five, the Sun sits in a different sign in each zodiac.' },
      { p: 'The gap between them is the ayanamsa. On the Lahiri reckoning, the standard adopted by India’s Calendar Reform Committee in the 1950s and the most widely used in India, it is now a little over 24°. A sign is 30° wide, so anyone born in the first 24° or so of a tropical sign has their sidereal Sun in the sign before: roughly four people in five.' },
      { fact: 'The pole star changes too. Polaris is near the pole today; in about 12,000 years the bright star Vega will be the nearest bright star to it.' },
      { h: 'Which one is right?' },
      { p: 'Neither is a mistake. They answer different questions: one follows the year’s light and the seasons, the other the stars behind them. The so-called Age of Aquarius is the same drift, the equinox point backing out of Pisces towards Aquarius; astronomers do not agree on when, because the constellations have no fixed borders for it.' },
      { p: 'Plutto reads your chart in the zodiac your tradition uses, and the free calculator on this site shows your Moon sign in both.' },
    ],
    app: 'how-do-you-know',
    link: { href: '/tools/moon-sign-nakshatra', label: 'Your Moon sign in both zodiacs' },
    sources: [
      'Ptolemy, Almagest, Book VII (on Hipparchus and precession).',
      'Report of the Calendar Reform Committee, Government of India (1955).',
      'N. Capitaine et al., “Expressions for IAU 2000 precession quantities,” Astronomy & Astrophysics 412 (2003).',
    ],
  },
  {
    slug: 'oracle-bones-chinas-first-writing',
    kicker: 'Ancient China',
    title: 'China’s oldest writing is a list of questions',
    standfirst: 'Three thousand years ago, Shang kings asked about rain, the harvest, war, childbirth and toothache. The answers cracked across ox bones and turtle shells, and the questions were carved beside them.',
    image: { file: 'Shang dynasty inscribed scapula.jpg', alt: 'An ox shoulder blade from the Shang dynasty, covered in carved characters and the marks of heat cracks.',
      caption: 'An ox scapula inscribed with divinations, Shang dynasty, around 1200 BC.',
      credit: 'Photo: BabelStone, CC BY-SA 4.0, via Wikimedia Commons.' },
    body: [
      { p: 'At the late Shang capital near modern Anyang, in the thirteenth to eleventh centuries BC, the king’s diviners prepared ox shoulder blades and the flat underside of turtle shells. They carved hollows into the back, pressed a hot point into each hollow, and watched the bone crack with a sharp sound.' },
      { h: 'Read the crack' },
      { p: 'The shape of the crack was the answer. The Chinese character for divination, 卜 (bu), is a picture of it. Afterwards the question was carved beside the crack, sometimes with the king’s reading, and sometimes, later, with what actually happened.' },
      { quote: 'The Chinese character for divination is a picture of the crack.' },
      { p: 'The questions are startlingly ordinary. Will it rain? Will the harvest be good? Should the king go to war, or hunt? Will the queen’s childbirth go well? Why does the king’s tooth hurt? And, again and again: in the next ten days, will there be no disaster?' },
      { h: 'Medicine, then history' },
      { p: 'For centuries farmers turned up the bones and sold them as “dragon bones,” to be ground into medicine. The story goes that in 1899 a scholar-official, Wang Yirong, noticed writing on the pieces in his prescription; the details may be legend, but the bones were in the medicine trade, and collectors traced them back to Anyang. Excavations there began in 1928, and well over a hundred thousand inscribed fragments are now known.' },
      { fact: 'Some oracle bones record eclipses of the Moon. Astronomers have matched them to real eclipses to help date the Shang kings.' },
      { p: 'Oracle bone script is the oldest substantial body of Chinese writing, and the direct ancestor of the characters used today. The first great archive of Chinese words is a record of people asking about what was coming.' },
    ],
    app: 'ask',
    sources: [
      'David N. Keightley, Sources of Shang History: The Oracle-Bone Inscriptions of Bronze Age China (1978).',
      'David N. Keightley, The Ancestral Landscape (2000).',
      'David W. Pankenier, Astrology and Cosmology in Early China (2013).',
    ],
  },
  {
    slug: 'ifa-256-signs-and-a-byte',
    kicker: 'Ifá',
    title: 'Ifá reads 256 signs. A byte holds 256 values.',
    standfirst: 'In Yoruba Ifá divination, each cast gives eight marks, each one single or double. Eight two-way marks make 256 possible signs: the same count as the eight bits of a computer byte.',
    plate: 'odu',
    plateCaption: 'The sixteen principal figures of Ifá, each four marks of one line or two. Paired, they make the 256 odù. Write a single line as 1 and a double as 0, and each pair is a byte.',
    body: [
      { p: 'Ifá is the divination system of the Yoruba people of West Africa, now practised across Nigeria, Benin, Togo, Cuba, Brazil and beyond. In 2005 UNESCO proclaimed it a Masterpiece of the Oral and Intangible Heritage of Humanity.' },
      { h: 'Sixteen nuts, or a chain' },
      { p: 'A babaláwo, a priest of Ifá, either passes sixteen sacred palm nuts from hand to hand, or throws the opele, a chain of eight half seed-pods. Each pod lands open or closed. Each result is marked as one line or two, in two columns of four. That is eight marks, each one of two kinds: 2 × 2 × 2 × 2 × 2 × 2 × 2 × 2 = 256 possible figures, called odù.' },
      { quote: 'Eight marks, each one of two kinds, make 256 signs.' },
      { p: 'Each odù is a library, not a single answer. It carries verses, ẹsẹ Ifá, that the priest learns by heart over years of training and recites to find the one that speaks to the question. The full corpus is enormous, and it is passed on almost entirely by memory.' },
      { fact: 'A computer byte is eight bits, each 0 or 1, giving 256 values, from 0 to 255. Ifá arrived at the same number with seed-pods.' },
      { h: 'Cousins across the Sahara' },
      { p: 'The sixteen four-mark figures also appear in Arabic sand divination, ʿilm al-raml, in European geomancy and in the Malagasy sikidy. Historians still argue about the direction of travel, but the family resemblance is plain. The mathematician Ron Eglash has traced how these binary figures reached Europe and connects them to the long road to binary arithmetic.' },
      { h: 'Sixteen cowries' },
      { p: 'A related practice, ẹ̀rìndínlógún, throws sixteen cowrie shells and counts how many land mouth up. Each count has a name: five is Ọ̀ṣẹ́, eight is Èjì Ogbè, twelve is Èjìlá Ṣẹ̀bọ̀rà. Plutto’s shells follow those names.' },
    ],
    app: 'the-shells',
    sources: [
      'UNESCO, “Ifa divination system,” Representative List of the Intangible Cultural Heritage of Humanity (proclaimed 2005, inscribed 2008).',
      'William Bascom, Ifa Divination: Communication between Gods and Men in West Africa (1969).',
      'William Bascom, Sixteen Cowries: Yoruba Divination from Africa to the New World (1980).',
      'Ron Eglash, African Fractals: Modern Computing and Indigenous Design (1999).',
    ],
  },
];

export const ARTICLE_BY_SLUG = Object.fromEntries(ARTICLES.map((a) => [a.slug, a]));

/** Minutes to read, at an unhurried 220 words a minute. */
export const readMinutes = (a) => {
  const words = [a.standfirst, ...a.body.map((b) => b.p || b.quote || b.fact || b.h || '')].join(' ').split(/\s+/).length;
  return Math.max(2, Math.round(words / 220));
};

/** The order the contents page sets them in: the cover story first. */
export const COVER = 'leibniz-binary-i-ching';
