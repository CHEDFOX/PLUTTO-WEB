/**
 * THE DECKS — the app's own cards, as the landing page draws them.
 *
 * These are the same files the Oracle deals from in the app (backend
 * static/<deck>/), copied into /public/library so the marketing page never
 * waits on the API to show its best picture. The tarot is Pamela Colman
 * Smith's 1909 deck, public domain; the other five are Plutto's own line art.
 *
 * A card's name is derived from its file name, so adding a card is dropping a
 * file in and adding its id here — no second list of names to keep in step.
 */

const TAROT_MAJOR = [
  'the_fool', 'the_magician', 'the_high_priestess', 'the_empress', 'the_emperor',
  'the_hierophant', 'the_lovers', 'the_chariot', 'strength', 'the_hermit',
  'wheel_of_fortune', 'justice', 'the_hanged_man', 'death', 'temperance',
  'the_devil', 'the_tower', 'the_star', 'the_moon', 'the_sun', 'judgement',
  'the_world',
];
const RANKS = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
  'nine', 'ten', 'page', 'knight', 'queen', 'king'];
const SUITS = ['wands', 'cups', 'swords', 'pentacles'];
const TAROT = [
  ...TAROT_MAJOR,
  ...SUITS.flatMap((s) => RANKS.map((r) => `${s}_${r}`)),
];

// The eight trigrams, with the thing each one is.
const TRIGRAM = {
  qian: 'Heaven', kun: 'Earth', zhen: 'Thunder', kan: 'Water',
  gen: 'Mountain', xun: 'Wind', li: 'Fire', dui: 'Lake',
};

const title = (s) => s.split('_').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');

function tarotName(id) {
  const [suit, rank] = id.split('_');
  if (SUITS.includes(suit) && RANKS.includes(rank)) return `${title(rank)} of ${title(suit)}`;
  return title(id);
}

export const DECKS = [
  { id: 'tarot', name: 'Tarot', cards: TAROT, nameOf: tarotName },
  {
    id: 'lenormand', name: 'Lenormand',
    cards: ['rider', 'clover', 'ship', 'house', 'tree', 'clouds', 'snake', 'coffin',
      'bouquet', 'scythe', 'whip', 'birds', 'child', 'fox', 'bear', 'star', 'stork',
      'dog', 'tower', 'garden', 'mountain', 'crossroads', 'mice', 'heart', 'ring',
      'book', 'letter', 'man', 'woman', 'lily', 'sun', 'moon', 'key', 'fish',
      'anchor', 'cross'],
    nameOf: title,
  },
  {
    id: 'runes', name: 'Runes',
    cards: ['fehu', 'uruz', 'thurisaz', 'ansuz', 'raidho', 'kenaz', 'gebo', 'wunjo',
      'hagalaz', 'nauthiz', 'isa', 'jera', 'eihwaz', 'perthro', 'algiz', 'sowilo',
      'tiwaz', 'berkano', 'ehwaz', 'mannaz', 'laguz', 'ingwaz', 'dagaz', 'othala'],
    nameOf: title,
  },
  {
    id: 'ogham', name: 'Ogham',
    cards: ['beith', 'luis', 'fearn', 'sail', 'nion', 'uath', 'dair', 'tinne', 'coll',
      'ceirt', 'muin', 'gort', 'ngeadal', 'straif', 'ruis', 'ailm', 'onn', 'ur',
      'eadhadh', 'iodhadh'],
    nameOf: title,
  },
  {
    id: 'iching', name: 'I Ching',
    cards: Object.keys(TRIGRAM),
    nameOf: (id) => `${title(id)} · ${TRIGRAM[id]}`,
  },
  {
    id: 'geomancy', name: 'Geomancy',
    cards: ['via', 'populus', 'coniunctio', 'carcer', 'fortuna_major', 'fortuna_minor',
      'acquisitio', 'amissio', 'laetitia', 'tristitia', 'puer', 'puella', 'albus',
      'rubeus', 'caput_draconis', 'cauda_draconis'],
    nameOf: title,
  },
];

export const cardSrc = (deck, id) => `/library/${deck}/${id}.webp`;
export const backSrc = (deck) => `/library/${deck}/back.webp`;

// The files are 300 × 527. Every card on the page is drawn at this ratio, so no
// deck is cropped and no two decks disagree about what a card's shape is.
export const CARD_RATIO = 527 / 300;
