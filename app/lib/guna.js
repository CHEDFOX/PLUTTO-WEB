/**
 * GUNA MILAN — the eight kootas (36 points) from two sidereal Moon longitudes.
 *
 * The tables are the classical ones as the standard references publish them
 * (Drik Panchang's Ashtakuta tutorials and the widely reproduced koota tables):
 * the Vashya groups with Sagittarius and Capricorn split at 15°, the 14×14
 * Yoni table, the directional Vashya table (bride's group down, groom's
 * across), Tara both ways, and Graha Maitri derived from the natural
 * friendships of Brihat Parashara Hora Shastra (reference.js). Where schools
 * differ — Gana's cross scores, the dosha exceptions — the page says so.
 *
 * Pure functions: the page and the tests use exactly this code.
 */
import { NAKSHATRAS, SIGNS, GRAHAS } from './reference';

const NAK = 360 / 27;
export const MAX = { Varna: 1, Vashya: 2, Tara: 3, Yoni: 4, 'Graha Maitri': 5, Gana: 6, Bhakoot: 7, Nadi: 8 };

// Varna of the Moon sign: water signs Brahmin, fire Kshatriya, earth Vaishya, air Shudra.
const VARNA = ['Kshatriya', 'Vaishya', 'Shudra', 'Brahmin'];
const VARNA_RANK = { Brahmin: 4, Kshatriya: 3, Vaishya: 2, Shudra: 1 };
export const varnaOf = (r) => VARNA[r % 4];

// Vashya group of a sidereal longitude (the sign, and for two signs the half).
export const VASHYA = ['Chatushpada', 'Manava', 'Jalachara', 'Vanachara', 'Keeta'];
export function vashyaOf(lon) {
  const r = Math.floor(lon / 30), d = lon - r * 30;
  if (r === 8) return d < 15 ? 'Manava' : 'Chatushpada';
  if (r === 9) return d < 15 ? 'Chatushpada' : 'Jalachara';
  return ['Chatushpada', 'Chatushpada', 'Manava', 'Jalachara', 'Vanachara', 'Manava', 'Manava', 'Keeta', null, null, 'Manava', 'Jalachara'][r];
}
// Bride's group (row) × groom's group (column), in VASHYA order.
export const VASHYA_TABLE = [
  [2, 1, 1, 1.5, 1],
  [1, 2, 1.5, 0, 1],
  [1, 1.5, 2, 1, 1],
  [0, 0, 0, 2, 0],
  [1, 1, 1, 0, 2],
];

// Tara: count from one nakshatra to the other (inclusive); remainder mod 9 of
// 3, 5 or 7 (Vipat, Pratyak, Naidhana) is inauspicious.
const TARA_NAMES = ['Janma', 'Sampat', 'Vipat', 'Kshema', 'Pratyak', 'Sadhana', 'Naidhana', 'Mitra', 'Parama Mitra'];
const taraOf = (from, to) => ((((to - from) % 27) + 27) % 27) % 9 + 1;
const taraGood = (t) => ![3, 5, 7].includes(t);

// Yoni: 14 animals; symmetric table.
export const YONIS = ['Horse', 'Elephant', 'Sheep', 'Serpent', 'Dog', 'Cat', 'Rat', 'Cow', 'Buffalo', 'Tiger', 'Deer', 'Monkey', 'Mongoose', 'Lion'];
export const YONI_TABLE = [
  [4, 2, 2, 3, 2, 2, 2, 1, 0, 1, 3, 3, 2, 1],
  [2, 4, 3, 3, 2, 2, 2, 2, 3, 1, 2, 3, 2, 0],
  [2, 3, 4, 2, 1, 2, 1, 3, 3, 1, 2, 0, 3, 1],
  [3, 3, 2, 4, 2, 1, 1, 1, 1, 2, 2, 2, 0, 2],
  [2, 2, 1, 2, 4, 2, 1, 2, 2, 1, 0, 2, 1, 1],
  [2, 2, 2, 1, 2, 4, 0, 2, 2, 1, 3, 3, 2, 1],
  [2, 2, 1, 1, 1, 0, 4, 2, 2, 2, 2, 2, 1, 2],
  [1, 2, 3, 1, 2, 2, 2, 4, 3, 0, 3, 2, 2, 1],
  [0, 3, 3, 1, 2, 2, 2, 3, 4, 1, 2, 2, 2, 1],
  [1, 1, 1, 2, 1, 1, 2, 0, 1, 4, 1, 1, 2, 1],
  [3, 2, 2, 2, 0, 3, 2, 3, 2, 1, 4, 2, 2, 1],
  [3, 3, 0, 2, 2, 3, 2, 2, 2, 1, 2, 4, 3, 2],
  [2, 2, 3, 0, 1, 2, 1, 2, 2, 2, 2, 3, 4, 2],
  [1, 0, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 2, 4],
];

// Graha Maitri from each lord's view of the other.
const REL = Object.fromEntries(GRAHAS.filter((g) => g.friends).map((g) => [g.key, g]));
const view = (a, b) => (a === b ? 'friend' : REL[a].friends.includes(b) ? 'friend' : REL[a].enemies.includes(b) ? 'enemy' : 'neutral');
const MAITRI = { 'friend|friend': 5, 'friend|neutral': 4, 'neutral|neutral': 3, 'enemy|friend': 1, 'enemy|neutral': 0.5, 'enemy|enemy': 0 };
export const signLord = (r) => SIGNS[r].ruler.split(' ')[0];

// Gana: same 6; Deva–Manushya 5; Manushya–Rakshasa 1; Deva–Rakshasa 0.
const GANA = { 'Deva|Deva': 6, 'Manushya|Manushya': 6, 'Rakshasa|Rakshasa': 6, 'Deva|Manushya': 5, 'Manushya|Rakshasa': 1, 'Deva|Rakshasa': 0 };
const pair = (a, b, order) => [a, b].sort((x, y) => order.indexOf(x) - order.indexOf(y)).join('|');

// Nadi from the nakshatra: Adi, Madhya, Antya, Antya, Madhya, Adi, repeating.
const nadiOf = (n) => ['Adi', 'Madhya', 'Antya'][[0, 1, 2, 2, 1, 0][n % 6]];

export function person(lon) {
  const n = Math.floor(lon / NAK), r = Math.floor(lon / 30);
  const x = NAKSHATRAS[n];
  return { lon, n, r, nakshatra: x, sign: SIGNS[r], varna: varnaOf(r), vashya: vashyaOf(lon), yoni: x.yoni, gana: x.gana, nadi: nadiOf(n), lord: signLord(r) };
}

/** Both Moons → every koota with its points and the reason, plus the total. */
export function gunaMilan(brideLon, groomLon) {
  const b = person(brideLon), g = person(groomLon);
  const k = [];
  k.push({ name: 'Varna', points: VARNA_RANK[g.varna] >= VARNA_RANK[b.varna] ? 1 : 0, bride: b.varna, groom: g.varna });
  k.push({ name: 'Vashya', points: VASHYA_TABLE[VASHYA.indexOf(b.vashya)][VASHYA.indexOf(g.vashya)], bride: b.vashya, groom: g.vashya });
  const tb = taraOf(b.n, g.n), tg = taraOf(g.n, b.n);
  const good = [taraGood(tb), taraGood(tg)].filter(Boolean).length;
  k.push({ name: 'Tara', points: good === 2 ? 3 : good === 1 ? 1.5 : 0, bride: `${TARA_NAMES[tb - 1]} (${tb})`, groom: `${TARA_NAMES[tg - 1]} (${tg})` });
  k.push({ name: 'Yoni', points: YONI_TABLE[YONIS.indexOf(b.yoni)][YONIS.indexOf(g.yoni)], bride: b.yoni, groom: g.yoni });
  const v = [view(b.lord, g.lord), view(g.lord, b.lord)].sort().join('|');
  k.push({ name: 'Graha Maitri', points: MAITRI[v], bride: b.lord, groom: g.lord });
  k.push({ name: 'Gana', points: GANA[pair(b.gana, g.gana, ['Deva', 'Manushya', 'Rakshasa'])], bride: b.gana, groom: g.gana });
  const d1 = ((g.r - b.r + 12) % 12) + 1, d2 = ((b.r - g.r + 12) % 12) + 1;
  const bhakootDosha = [[2, 12], [12, 2], [5, 9], [9, 5], [6, 8], [8, 6]].some(([x, y]) => x === d1 && y === d2);
  k.push({ name: 'Bhakoot', points: bhakootDosha ? 0 : 7, bride: `${d2}/${d1}`, groom: `${d1}/${d2}`, dosha: bhakootDosha });
  k.push({ name: 'Nadi', points: b.nadi === g.nadi ? 0 : 8, bride: b.nadi, groom: g.nadi, dosha: b.nadi === g.nadi });
  const total = k.reduce((s, x) => s + x.points, 0);
  return { bride: b, groom: g, kootas: k, total, doshas: k.filter((x) => x.dosha).map((x) => `${x.name} dosha`) };
}

// The customary bands: under 18 is below the traditional minimum.
export const verdict = (t) => (t >= 33 ? 'Excellent' : t >= 25 ? 'Very good' : t >= 18 ? 'Average' : 'Below the traditional minimum of 18');
