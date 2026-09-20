/**
 * THE SHELVES — the whole library, and the colour each part of it is filed in.
 *
 * A STATIC EXCERPT of the live library (`/api/public/library-map`), copied out
 * of the backend so the marketing pages can name a hundred and two real
 * traditions without a request. The `shelf` is the backend's own grouping (the
 * twelve REGIONS in library_map.py) — not a category invented for the website.
 *
 * THE COLOUR IS INFORMATION. Twelve shelves, twelve hues, evenly spaced around
 * the wheel and ordered as the library is: South Asia through to the body. A
 * spine's colour tells you which shelf it stands on, so the wall of them reads
 * as an organised collection rather than as decoration. Gold is NOT in this
 * palette — it stays the brand's own accent, spent on one thing at a time.
 *
 * The names are the traditions' own: `Merindinlogun` is not "African
 * astrology", and printing all of them is the point — none is a footnote.
 */

/** The twelve shelves, in the order the library keeps them. */
export const SHELVES = [
  { id: 'south_asia', name: 'South Asia',    color: '#E9A13B' },
  { id: 'himalaya',   name: 'Himalaya',      color: '#E0C24A' },
  { id: 'china',      name: 'China',         color: '#DC4B3E' },
  { id: 'east_asia',  name: 'East Asia',     color: '#D9497A' },
  { id: 'pacific',    name: 'Pacific',       color: '#C059C6' },
  { id: 'persia',     name: 'Persia & Araby', color: '#9061E0' },
  { id: 'letters',    name: 'Letters',       color: '#5B77E8' },
  { id: 'sky',        name: 'The Sky',       color: '#3FA3DD' },
  { id: 'folk',       name: 'Folk Europe',   color: '#27AFA6' },
  { id: 'americas',   name: 'The Americas',  color: '#2FB884' },
  { id: 'africa',     name: 'Africa',        color: '#77B93F' },
  { id: 'body',       name: 'The Body',      color: '#C3C43C' },
];

export const SHELF_COLOR = Object.fromEntries(SHELVES.map((s) => [s.id, s.color]));

export const TRADITIONS = [
  { label: "Aṣṭamaṅgala Praśna", place: "Thrissur", shelf: "south_asia" },
  { label: "KP (Krishnamurti)", place: "Chennai", shelf: "south_asia" },
  { label: "Numerology", place: "Varanasi", shelf: "south_asia" },
  { label: "Ramala", place: "Delhi", shelf: "south_asia" },
  { label: "Sarvatobhadra Chakra", place: "Awadh", shelf: "south_asia" },
  { label: "Sinhala Nekath", place: "Kandy", shelf: "south_asia" },
  { label: "Tamil numerology", place: "Madurai", shelf: "south_asia" },
  { label: "Vedic (BPHS)", place: "Varanasi", shelf: "south_asia" },
  { label: "Mongolian Zurhai", place: "Ulaanbaatar", shelf: "himalaya" },
  { label: "Tibetan", place: "Lhasa", shelf: "himalaya" },
  { label: "Tibetan Kar-tsi", place: "Lhasa", shelf: "himalaya" },
  { label: "Ba Zhai (Eight Mansions)", place: "Xi'an", shelf: "china" },
  { label: "Cheng Gu (bone weight)", place: "Xi'an", shelf: "china" },
  { label: "Chinese (BaZi)", place: "Xi'an", shelf: "china" },
  { label: "Da Liu Ren (this moment)", place: "Luoyang", shelf: "china" },
  { label: "Flying Star feng shui", place: "Guangzhou", shelf: "china" },
  { label: "Guo Lao Xing Zong", place: "Xi'an", shelf: "china" },
  { label: "Kau Chim (temple lots)", place: "Quanzhou", shelf: "china" },
  { label: "Ling Qi Jing", place: "Nanjing", shelf: "china" },
  { label: "Lo Shu grid", place: "Luoyang", shelf: "china" },
  { label: "Plum Blossom (this moment)", place: "Luoyang", shelf: "china" },
  { label: "Qi Men Dun Jia (this moment)", place: "Luoyang", shelf: "china" },
  { label: "San He feng shui", place: "Ganzhou", shelf: "china" },
  { label: "Tai Yi Shen Shu (era)", place: "Luoyang", shelf: "china" },
  { label: "Taoist phase", place: "Mount Qingcheng", shelf: "china" },
  { label: "Tie Ban Shen Shu", place: "Luoyang", shelf: "china" },
  { label: "Xiao Liu Ren", place: "Central China", shelf: "china" },
  { label: "Gunghap (Korean compatibility)", place: "Seoul", shelf: "east_asia" },
  { label: "Nine Star Ki", place: "Tokyo", shelf: "east_asia" },
  { label: "Omikuji", place: "Kyoto", shelf: "east_asia" },
  { label: "Onmyōdō (Japanese almanac)", place: "Kyoto", shelf: "east_asia" },
  { label: "Saju Palja (Korean)", place: "Seoul", shelf: "east_asia" },
  { label: "Sanmei-gaku", place: "Tokyo", shelf: "east_asia" },
  { label: "Seimei Handan", place: "Tokyo", shelf: "east_asia" },
  { label: "Shichū Suimei (Japanese)", place: "Kyoto", shelf: "east_asia" },
  { label: "Tojeong Bigyeol (Korean almanac)", place: "Boryeong", shelf: "east_asia" },
  { label: "Tứ Trụ (Vietnamese)", place: "Hanoi", shelf: "east_asia" },
  { label: "Tử Vi Đẩu Số (Vietnamese)", place: "Hanoi", shelf: "east_asia" },
  { label: "Aboriginal Australian sky knowledge", place: "Central Australia", shelf: "pacific" },
  { label: "Khmer Horasastra", place: "Angkor", shelf: "pacific" },
  { label: "Lao calendar", place: "Luang Prabang", shelf: "pacific" },
  { label: "Mahabote", place: "Bagan", shelf: "pacific" },
  { label: "Pawukon (Bali)", place: "Bali", shelf: "pacific" },
  { label: "Polynesian moon nights", place: "Aotearoa", shelf: "pacific" },
  { label: "Tahitian moon nights", place: "Tahiti", shelf: "pacific" },
  { label: "Thai Horasat", place: "Ayutthaya", shelf: "pacific" },
  { label: "Weton (Java)", place: "Yogyakarta", shelf: "pacific" },
  { label: "Abjad (Arabic)", place: "Kufa", shelf: "persia" },
  { label: "Firdaria (Persian time-lords)", place: "Isfahan", shelf: "persia" },
  { label: "Fāl-e Ḥāfeẓ", place: "Shiraz", shelf: "persia" },
  { label: "Ikhtiyārāt", place: "Baghdad", shelf: "persia" },
  { label: "Istikhāra", place: "Medina", shelf: "persia" },
  { label: "Jafr", place: "Medina", shelf: "persia" },
  { label: "Lunar mansions (manazil)", place: "Hejaz", shelf: "persia" },
  { label: "Zāʾirja", place: "Fez", shelf: "persia" },
  { label: "Angel numbers", place: "Sedona", shelf: "letters" },
  { label: "Gematria (all methods)", place: "Jerusalem", shelf: "letters" },
  { label: "Isopsephy (Greek)", place: "Athens", shelf: "letters" },
  { label: "Kabbalah", place: "Safed", shelf: "letters" },
  { label: "Mazalot", place: "Jerusalem", shelf: "letters" },
  { label: "Alchemy", place: "Alexandria", shelf: "sky" },
  { label: "Astrocartography", place: "San Francisco", shelf: "sky" },
  { label: "Barbault cyclic index (world)", place: "Paris", shelf: "sky" },
  { label: "Bradley siderograph (markets)", place: "Los Angeles", shelf: "sky" },
  { label: "Egyptian decan", place: "Thebes", shelf: "sky" },
  { label: "Evolutionary astrology", place: "Boulder", shelf: "sky" },
  { label: "Hermetic law", place: "Alexandria", shelf: "sky" },
  { label: "Human Design", place: "Ibiza", shelf: "sky" },
  { label: "Sacred geometry", place: "Athens", shelf: "sky" },
  { label: "Solar barycentric (Landscheidt)", place: "Hamburg", shelf: "sky" },
  { label: "Traditional medical astrology", place: "Kos", shelf: "sky" },
  { label: "Western", place: "Alexandria", shelf: "sky" },
  { label: "Anglo-Saxon Futhorc", place: "York", shelf: "folk" },
  { label: "Baltic and Finnic folk", place: "The Baltic", shelf: "folk" },
  { label: "Bibliomancy", place: "Rome", shelf: "folk" },
  { label: "Celtic tree", place: "Tara", shelf: "folk" },
  { label: "Cleromancy (lots)", place: "Babylon", shelf: "folk" },
  { label: "Dowsing / pendulum", place: "The Harz", shelf: "folk" },
  { label: "Goralot", place: "Kraków", shelf: "folk" },
  { label: "Kipper cards", place: "Munich", shelf: "folk" },
  { label: "Playing-card cartomancy", place: "Paris", shelf: "folk" },
  { label: "Scrying", place: "Memphis", shelf: "folk" },
  { label: "Sibilla deck", place: "Milan", shelf: "folk" },
  { label: "Slavic folk divination", place: "Kyiv", shelf: "folk" },
  { label: "Tasseography", place: "London", shelf: "folk" },
  { label: "Younger Futhark", place: "Uppsala", shelf: "folk" },
  { label: "Andean / Inca wata", place: "Cusco", shelf: "americas" },
  { label: "Aztec", place: "Tenochtitlan", shelf: "americas" },
  { label: "Mayan", place: "Tikal", shelf: "americas" },
  { label: "Native totem", place: "The Plains", shelf: "americas" },
  { label: "Zapotec / Mixtec count", place: "Monte Albán", shelf: "americas" },
  { label: "Akan day names", place: "Kumasi", shelf: "africa" },
  { label: "Mérìndínlógún", place: "Ile-Ife", shelf: "africa" },
  { label: "Ngombo, Bamana, bone throwing", place: "Bamako", shelf: "africa" },
  { label: "Sikidy", place: "Antananarivo", shelf: "africa" },
  { label: "Chiromancy (palmistry)", place: "Athens", shelf: "body" },
  { label: "Mian Xiang (face reading)", place: "Xi'an", shelf: "body" },
  { label: "Moleosophy", place: "London", shelf: "body" },
  { label: "Physiognomy (European)", place: "Athens", shelf: "body" },
  { label: "Shou Xiang", place: "Xi'an", shelf: "body" },
  { label: "Svara Śāstra", place: "Varanasi", shelf: "body" },
  { label: "Sāmudrika Śāstra", place: "Varanasi", shelf: "body" },
];

export default TRADITIONS;
