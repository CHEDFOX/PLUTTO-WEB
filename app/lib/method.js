/**
 * THE METHOD — every system Plutto reads, what it is read from, and what it rests on.
 *
 * Written from the backend's own record, not from memory: the method registry and
 * bibliography in Plutto-Backend app/services/provenance (every computed technique is
 * declared there beside the work it comes from), the tradition table in
 * features/library_shelves.py, and each engine's own notes (the Maya correlation, the
 * tarot deck, the calendar a Vietnamese chart is cast on). A line here that the code
 * cannot back is a line to delete. When a system is added to the app, it gets a line.
 *
 * `from` is what a reading needs: a chart, a date, a name, a throw you make, the
 * moment you ask, or something you look at yourself. No counts of systems anywhere.
 */

export const FROM = {
  chart: 'Your birth chart',
  date: 'Your birth date',
  name: 'A name or a word',
  cast: 'A throw you make',
  moment: 'The moment you ask',
  place: 'Your chart and a place',
  here: 'Where you are',
  look: 'What you observe',
  taught: 'Taught, not computed',
};

export const METHOD = [
  {
    id: 'sky',
    title: 'Under every reading',
    lead: 'The astronomy is computed, never estimated, and it is the same for every tradition that reads the sky.',
    items: [
      { name: 'Planetary positions', from: 'chart', basis: 'Swiss Ephemeris (Astrodienst), built on NASA JPL’s planetary ephemeris: every planet, node, house cusp and ayanamsa for the exact minute and place of birth. Retrogrades, stations and eclipses come from the same files; the algorithms follow Jean Meeus’ Astronomical Algorithms and the IAU’s SOFA standards.' },
      { name: 'Sunrise, sunset and the hours of the day', from: 'here', basis: 'Sunrise and sunset are computed for your place on each day, and every hour that depends on them (Rahu kalam, Yamaganda, Gulika, Abhijit, the choghadiya, the planetary horas) is a fraction of that real span, not of a fixed six-to-six day.' },
      { name: 'Birth times', from: 'chart', basis: 'Converted to universal time with the historical time-zone and daylight-saving rules of the place, so a birth in 1971 uses the clocks of 1971.' },
    ],
  },
  {
    id: 'south-asia',
    title: 'South Asia',
    items: [
      { name: 'Jyotish (Parashari)', from: 'chart', basis: 'Sidereal zodiac with the Lahiri ayanamsa. The rashi chart and the divisional charts, Vimshottari dasha, shadbala, Ashtakavarga with its reductions, the yogas, the avasthas and planetary war, and transits over the natal chart. From the Brihat Parashara Hora Shastra (attributed to Parashara), Varahamihira’s Brihat Jataka, Kalyana Varma’s Saravali, Mantreswara’s Phaladeepika, Vaidyanatha Dikshita’s Jataka Parijata and the Laghu Parashari; the nakshatra division after the Surya Siddhanta.' },
      { name: 'Jaimini', from: 'chart', basis: 'Chara karakas, arudha padas, argala and the chara dasha, from the Upadesa Sutras attributed to Jaimini.' },
      { name: 'KP (Krishnamurti Paddhati)', from: 'chart', basis: 'Krishnamurti ayanamsa with Placidus cusps; sign, star and sub-lords across the 249 divisions; the four-step significators; timing by dasha and transit; and horary by a number from 1 to 249. From K. S. Krishnamurti’s KP Readers.' },
      { name: 'Nadi', from: 'chart', basis: 'Planet-in-sign readings on the principles of the Bhrigu Nandi Nadi.' },
      { name: 'Tajika (the annual chart)', from: 'chart', basis: 'The Varshaphal, cast for the Sun’s return to its birth degree, with the muntha, the year lord and the Tajika yogas, from Neelakantha Daivajna’s Tajika Neelakanthi; and the Tithi Pravesh, cast for the return of the birth tithi.' },
      { name: 'Prashna (horary)', from: 'moment', basis: 'A chart for the moment a question is asked, judged by the Prashna Marga and Prithuyasas’ Shatpanchasika, with the Ashtamangala refinements of Kerala.' },
      { name: 'Muhurta and the panchang', from: 'here', basis: 'Tithi, nakshatra, yoga, karana and weekday for your place and day; auspicious windows chosen by the rules of Ram Daivagya’s Muhurta Chintamani and the Kalaprakasika, and checked against your own dasha.' },
      { name: 'Ank Jyotish (Indian numerology)', from: 'date', basis: 'Moolank and bhagyank from the birth date, the planet of each number, and name numbers by Chaldean (Cheiro’s table) and Pythagorean values.' },
      { name: 'Tamil numerology', from: 'name', basis: 'Its own practice, not a translation of the North Indian: psychic, destiny and name numbers, the name graded against the other two, Chaldean letter values, and 4 and 8 treated as burdened.' },
      { name: 'Sarvatobhadra chakra', from: 'chart', basis: 'The all-directions grid of nakshatras, signs, vowels and weekdays, read for the obstruction (vedha) a transit casts across it.' },
      { name: 'Svara shastra', from: 'moment', basis: 'Which nostril the breath flows through, phased by the lunar fortnight and the weekday, after the Shiva Svarodaya, and which acts suit each flow.' },
      { name: 'Ramala and Ashtamangala', from: 'cast', basis: 'Indian geomancy, cast in figures of points; and the Kerala prashna of eight auspicious objects.' },
      { name: 'Sinhala nekath', from: 'taught', basis: 'Sri Lanka’s auspicious times, set by astrologers for the New Year and life’s beginnings. Described, not computed.' },
      { name: 'Vastu', from: 'chart', basis: 'The directions that favour you, read from the chart.' },
      { name: 'Ayurveda', from: 'chart', basis: 'Prakriti, the lifelong balance of vata, pitta and kapha, after the Charaka and Sushruta Samhitas, set beside the chart. Never offered as medical advice.' },
      { name: 'Mandala (astrocartography)', from: 'place', basis: 'Your planetary lines across the globe and your chart relocated to real cities, ranked for the places that favour you; nations read by their own founding charts.' },
    ],
  },
  {
    id: 'china',
    title: 'China',
    items: [
      { name: 'BaZi (Four Pillars)', from: 'chart', basis: 'Year, month, day and hour pillars on the solar-term calendar, so the year turns at Li Chun rather than on 1 January; the ten gods, the hidden stems, the ten-year luck pillars, Na Yin, the twelve life stages and the useful god. From the Yuan Hai Zi Ping (compiled by Xu Sheng), Wan Minying’s San Ming Tong Hui, the Di Tian Sui with Ren Tieqiao’s commentary, and the Qiong Tong Bao Jian.' },
      { name: 'Zi Wei Dou Shu (Purple Star)', from: 'chart', basis: 'The purple-star chart on the Chinese lunar calendar, attributed to Chen Tuan.' },
      { name: 'Guo Lao Xing Zong', from: 'chart', basis: 'China’s horoscopic astrology before BaZi: twelve houses, the 28 mansions and eleven bodies, among them Rahu, Ketu and the lunar apogee, computed from the Moon’s real apsidal motion.' },
      { name: 'Tie Ban Shen Shu (Iron Plate)', from: 'chart', basis: 'The condition numbers derived from the pillars, with every parameter stated. Its verse book is held within a lineage and is not reproduced.' },
      { name: 'Cheng Gu (bone weight)', from: 'chart', basis: 'Each pillar given its weight in liang and qian; the total indexes a verse. Attributed to Yuan Tiangang of the Tang.' },
      { name: 'Qi Men Dun Jia', from: 'moment', basis: 'The moment mapped onto the nine palaces, from the Yan Bo Diao Sou Ge and the Qi Men Dun Jia Tong Zong.' },
      { name: 'Da Liu Ren', from: 'moment', basis: 'The heaven plate turned over the earth plate until the month general sits on the hour, from the Liu Ren Da Quan and the Bi Fa Fu.' },
      { name: 'Tai Yi Shen Shu', from: 'moment', basis: 'From Wang Ximing’s Tai Yi Jin Jing Shi Jing.' },
      { name: 'Mei Hua Yi Shu (Plum Blossom)', from: 'moment', basis: 'Hexagrams from the numbers of the moment, attributed to Shao Yong.' },
      { name: 'Xiao Liu Ren', from: 'moment', basis: 'The small six ren, counted on the finger joints from the lunar month, day and hour.' },
      { name: 'I Ching', from: 'cast', basis: 'You choose the lower and the upper trigram; the hexagram and its text follow the Yijing with the Ten Wings, and line readings (Liu Yao) follow the Huo Zhu Lin, Wang Weide’s Bu Shi Zheng Zong and the Zeng Shan Bu Yi.' },
      { name: 'Feng shui', from: 'date', basis: 'Eight Mansions from your birth year, after the Ba Zhai Ming Jing; Flying Star (Xuan Kong) after Shen Zhureng’s Shen Shi Xuan Kong Xue; and the San He school of form and water. Where the schools disagree, both are shown.' },
      { name: 'Kau Chim and Ling Qi Jing', from: 'cast', basis: 'Temple lot sticks, and the classic of the numinous chess pieces.' },
      { name: 'Lo Shu grid', from: 'date', basis: 'The three-by-three magic square filled with the digits of the birth date: the missing and repeated numbers, and the lines they make.' },
      { name: 'The five phases and the Tao', from: 'date', basis: 'The day master’s phase in the cycles of generation and control, yin and yang, and the season; the Dao De Jing and the Zhuangzi for the teaching.' },
    ],
  },
  {
    id: 'east-asia',
    title: 'Japan, Korea and Vietnam',
    items: [
      { name: 'Saju Palja', from: 'chart', basis: 'Korean four pillars, with the refinements Korea developed over six centuries that change the chart itself, not only its words.' },
      { name: 'Tojeong Bigyeol', from: 'date', basis: 'The Korean almanac for the year, attributed to Yi Ji-ham (1517–1578) and read at the lunar New Year.' },
      { name: 'Gunghap', from: 'date', basis: 'Korean marriage compatibility, its two halves read separately because they can disagree.' },
      { name: 'Tử Vi Đẩu Số and Tứ Trụ', from: 'chart', basis: 'Purple Star and four pillars on the Vietnamese lunar calendar, which is computed at UTC+7 and can put a birth on a different day or month than the Chinese calendar does.' },
      { name: 'Shichū Suimei and Sanmei-gaku', from: 'chart', basis: 'Japanese four pillars, with the hidden stems (zōkan) read by how far into the solar month a birth falls.' },
      { name: 'Seimei handan', from: 'name', basis: 'Japanese name divination by the stroke counts of the characters.' },
      { name: 'Onmyōdō', from: 'date', basis: 'The Japanese almanac: rokuyō, jūnichoku and the 28 mansions.' },
      { name: 'Nine Star Ki', from: 'date', basis: 'The principal star of the birth year, the year turning at risshun, with the month and annual stars and the directions they open.' },
      { name: 'Omikuji', from: 'cast', basis: 'Temple lots, drawn so the same question gives the same answer.' },
    ],
  },
  {
    id: 'himalaya',
    title: 'The Himalaya',
    items: [
      { name: 'Tibetan elemental astrology (jung-tsi)', from: 'date', basis: 'The year sign (element, gender and animal) in the sixty-year Rabjung cycle counted from 1027 CE, with the mewa and the parkha; after Desi Sangye Gyatso’s Vaidurya Karpo (the White Beryl).' },
      { name: 'Kar-tsi', from: 'date', basis: 'Tibetan calendrical astronomy from the Kālacakra, whose lunar days make the calendar skip and repeat dates.' },
      { name: 'Zurkhai', from: 'date', basis: 'Mongolian astrology, Tibetan in descent, with its own animal names and mewa reckoning.' },
    ],
  },
  {
    id: 'persia',
    title: 'Persia and Arabia',
    items: [
      { name: 'Firdaria', from: 'chart', basis: 'The Persian time-lord periods of a seventy-five-year cycle, carried into Arabic by Abū Maʿshar and the Baghdad astrologers.' },
      { name: 'Manāzil al-qamar', from: 'chart', basis: 'The 28 Arabic lunar mansions, measured tropically and distinct from the Indian nakshatras, as Dorotheus and Bonatti use them.' },
      { name: 'Abjad and jafr', from: 'name', basis: 'Arabic letter values in the old abjad order, from one to a thousand.' },
      { name: 'Zāʾirja and ikhtiyārāt', from: 'moment', basis: 'The letter-wheel of the question, and the choosing of times.' },
      { name: 'Istikhāra and Fāl-e Hāfez', from: 'cast', basis: 'The prayer for guidance, and an opening of Hafez’s Divan.' },
    ],
  },
  {
    id: 'europe-sky',
    title: 'Europe: the sky',
    items: [
      { name: 'Western astrology', from: 'chart', basis: 'Tropical zodiac and Placidus houses; aspects and configurations, essential dignities, the lots, annual profections, zodiacal releasing, progressions, solar arcs, primary directions and solar returns. From Ptolemy’s Tetrabiblos, Vettius Valens’ Anthology, Dorotheus’ Carmen Astrologicum, Paulus Alexandrinus, Firmicus Maternus’ Mathesis, Guido Bonatti and Placidus de Titis’ Primum Mobile.' },
      { name: 'Horary and electional', from: 'moment', basis: 'A chart for the question or the chosen time, judged by William Lilly’s Christian Astrology and Bonatti, with antiscia.' },
      { name: 'Western sidereal', from: 'chart', basis: 'The tropical chart re-read against the fixed stars by the Fagan–Bradley synetic vernal point.' },
      { name: 'Uranian (Hamburg School)', from: 'chart', basis: 'The hypothetical bodies Cupido to Poseidon, computed with Swiss Ephemeris, with Alfred Witte’s attributions.' },
      { name: 'Cosmobiology, harmonics and degrees', from: 'chart', basis: 'Reinhold Ebertin’s 90° dial and midpoint trees; John Addey’s harmonic and draconic charts; the Sabian degree symbols of Marc Edmund Jones and Elsie Wheeler.' },
      { name: 'Psychological and evolutionary', from: 'chart', basis: 'Dane Rudhyar’s lunation cycle, and the evolutionary astrology of Jeff Green and Steven Forrest.' },
      { name: 'Medical astrology', from: 'chart', basis: 'Nicholas Culpeper’s decumbiture, as history. Never offered as medical advice.' },
      { name: 'Mundane cycles', from: 'moment', basis: 'André Barbault’s cyclic index, Donald Bradley’s siderograph and Theodor Landscheidt’s solar cycles, each kept beside the work that tests it.' },
      { name: 'Human Design, Gene Keys and the enneagram', from: 'chart', basis: 'Modern systems, dated as such: Human Design from Ra Uru Hu in 1987, Richard Rudd’s Gene Keys, and the enneagram from Oscar Ichazo and Claudio Naranjo.' },
      { name: 'Egyptian decans', from: 'date', basis: 'The 36 ten-degree decans of the Sun’s position, with their names and Chaldean rulers.' },
      { name: 'Hermetic principles', from: 'date', basis: 'The seven principles of The Kybalion (1908), read beside the Corpus Hermeticum.' },
      { name: 'Alchemy and sacred geometry', from: 'chart', basis: 'Symbolic lenses, not divination: the seven metals as the seven planets, the Platonic solids as the elements.' },
    ],
  },
  {
    id: 'europe-letters',
    title: 'Europe: letters and number',
    items: [
      { name: 'Kabbalah', from: 'date', basis: 'The Tree of Life (ten sefirot, twenty-two paths, four worlds), after the Sefer Yetzirah and the Zohar.' },
      { name: 'Gematria and isopsephy', from: 'name', basis: 'Hebrew and Greek letter values, computed exactly.' },
      { name: 'Mazalot', from: 'date', basis: 'The Hebrew calendar’s own signs, mapped to the months and the tribes, and the planetary hour of each hour of the week; Talmudic in origin.' },
      { name: 'Goralot', from: 'cast', basis: 'Jewish lot-casting, in the later form of the Goral ha-Gra attributed to the Vilna Gaon.' },
      { name: 'Pythagorean numerology', from: 'date', basis: 'The life path from the birth date, and name numbers by Pythagorean letter values.' },
      { name: 'Angel numbers', from: 'name', basis: 'A modern practice: the pattern in a number you keep seeing, detected exactly, and read from its published meanings.' },
    ],
  },
  {
    id: 'europe-folk',
    title: 'Europe: cards, runes and lots',
    items: [
      { name: 'Tarot', from: 'cast', basis: 'The Rider–Waite–Smith deck of A. E. Waite and Pamela Colman Smith (1909), with its own numbering (Strength VIII, Justice XI) and what each card shows. You pick every card.' },
      { name: 'Lenormand, Kipper, Sibilla and playing cards', from: 'cast', basis: 'The 36-card Petit Lenormand read in combination; Kipper read by position around the significators; the Italian Sibilla; and playing-card cartomancy by suit and rank.' },
      { name: 'Runes', from: 'cast', basis: 'The Elder Futhark (c. 150–800 CE), the Younger Futhark and the Anglo-Saxon Futhorc, each its own row of staves.' },
      { name: 'Ogham', from: 'cast', basis: 'The twenty feda in their four aicmí, each a tree with its lore.' },
      { name: 'Celtic tree calendar', from: 'date', basis: 'The thirteen tree months in the line of Robert Graves’ The White Goddess (1948): a modern calendar, named as one.' },
      { name: 'Geomancy', from: 'cast', basis: 'The sixteen figures and the shield chart, with its witnesses and judge.' },
      { name: 'Bibliomancy and cleromancy', from: 'cast', basis: 'Draws into a fixed text or set of lots, seeded so the same question asked twice gives the same answer.' },
      { name: 'Slavic and Baltic', from: 'taught', basis: 'The attested folk calendar and customs, marked as reconstructed. No zodiac is invented for them.' },
      { name: 'Tea leaves, scrying and dowsing', from: 'look', basis: 'Taught, for you to do yourself.' },
    ],
  },
  {
    id: 'africa',
    title: 'Africa',
    items: [
      { name: 'Ifá', from: 'cast', basis: 'The cast is computed: the odù among the sixteen principal figures and the 256 they make in pairs, its seniority, and whether it is doubled. The verses of the Odù Ifá are an oral corpus held by initiated babaláwo and are not reproduced; any reading around the odù is Plutto’s own, and says so.' },
      { name: 'Mẹ́rìndínlógún (the cowries)', from: 'cast', basis: 'Sixteen cowries: the number that land mouth up names the throw, Oshe at five, Eji Ogbe at eight, Ejila Sebora at twelve.' },
      { name: 'Sikidy', from: 'cast', basis: 'Malagasy divination with seeds laid out in the figures of geomancy.' },
      { name: 'Akan day names', from: 'date', basis: 'The soul name given by the weekday of birth: Kwame and Ama for Saturday, Kofi and Afua for Friday.' },
      { name: 'Ngombo, Bamana sand and bone throwing', from: 'taught', basis: 'Described, not computed: each needs the diviner and the throw.' },
    ],
  },
  {
    id: 'americas',
    title: 'The Americas',
    items: [
      { name: 'Maya', from: 'date', basis: 'The Tzolkʼin, the Haab and the Long Count by the Goodman–Martínez–Thompson correlation (Julian Day 584283), the standard scholarly one; the Popol Vuh for the cosmology.' },
      { name: 'Aztec (Tonalpohualli)', from: 'date', basis: 'Twenty day-signs and thirteen numbers by Alfonso Caso’s correlation, which fixes 13 August 1521 as 1 Serpent.' },
      { name: 'Mixtec and Zapotec', from: 'date', basis: 'The 260-day count as kept in Oaxaca, with the day-sign names of the codices.' },
      { name: 'Andean', from: 'date', basis: 'The Inca months as the chroniclers recorded them after the conquest, with what is not known said plainly.' },
      { name: 'Birth totems', from: 'date', basis: 'The birth-totem wheel of twelve moons as it was popularised in the twentieth century. It is not the practice of any one nation, and is presented as what it is.' },
    ],
  },
  {
    id: 'pacific',
    title: 'Southeast Asia and Oceania',
    items: [
      { name: 'Mahabote (Burma)', from: 'date', basis: 'The seven-house chart from the weekday and the Burmese year, not only the day-lord.' },
      { name: 'Horasat (Thailand)', from: 'chart', basis: 'Sidereal and Indian in descent, after Varahamihira, with eight day-lords: Wednesday has a day and a night half, and Rahu rules the night.' },
      { name: 'Khmer and Lao', from: 'date', basis: 'The same Indic frame as the Thai, with their own year-animal names and New Year.' },
      { name: 'Pawukon (Bali)', from: 'date', basis: 'The 210-day calendar of ten weeks running at once, from the lontar palm-leaf manuscripts. Where the sources differ on the irregular weeks, the reading says so.' },
      { name: 'Weton (Java)', from: 'date', basis: 'The 35-day pairing of the seven-day week with the five-day market week, read by the neptu arithmetic of the Primbon.' },
      { name: 'Polynesian moon reckoning', from: 'date', basis: 'The Hawaiian nights of the Moon and the Māori maramataka, with Tahitian and Samoan reckonings.' },
      { name: 'Aboriginal Australian sky knowledge', from: 'taught', basis: 'Told with care and not computed. It belongs to its nations, and Plutto does not turn it into a horoscope.' },
    ],
  },
  {
    id: 'body',
    title: 'Read from the body',
    items: [
      { name: 'Palm, face and mole reading', from: 'look', basis: 'Western chiromancy and physiognomy, Chinese palm and face reading, India’s Samudrika Shastra and moleosophy. Nothing is computed from a birthday and there is no camera: Plutto teaches each tradition’s map so you can read your own.' },
    ],
  },
  {
    id: 'dreams',
    title: 'Dreams',
    items: [
      { name: 'Dream reading', from: 'look', basis: 'Artemidorus’ Oneirocritica, the Taʿbīr al-Ruʾyā attributed to Ibn Sirin, the Zhou Gong Jie Meng and Jagaddeva’s Svapna Chintamani, read side by side, because they disagree most about what a dream is.' },
    ],
  },
];

/** Kept beside the methods: what the published tests found, the negative results included. */
export const EVIDENCE = 'Shawn Carlson’s double-blind test (Nature, 1985); Michel Gauquelin’s “Mars effect”, the French committee’s test of it and Suitbert Ertel’s re-analysis; Geoffrey Dean and Ivan Kelly’s review (2003); and Lois Rodden’s rating of birth data, which every timing claim depends on.';
