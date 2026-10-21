/** The path a phone of the hero stack follows as the stack turns, and its layer along the way. */
// A phone's place is u = (index − turn) mod 3: 0 is the front, 1 and 2 are behind, fanned up and to the
// right. Leaving the front, u runs 3 → 2 along a loop: a small lift, out to the right above everything,
// then tucked in behind the others. The path is one Catmull-Rom curve through these points, so a phone
// never stops at a joint; it only rests at the front.
const PATH = [
  // u     x     y    scale  rotate  (unused)  bright
  [0,      0,    0,   1,     0,      0,    1],
  [1,     74,  -30,   0.9,   5,     -5,    0.5],
  [2,    140,  -58,   0.8,   9,     -8,    0.32],
  [2.3,  270,  -42,   0.8,  13,     16,    0.4],
  [2.62, 352,   -6,   0.87, 10,     22,    0.62],
  [2.88,  92,    8,   1.03,  3,      7,    0.95],
  [3,      0,    0,   1,     0,      0,    1],
];
const N = PATH[0].length - 1;
export const wrap = (v) => ((v % 3) + 3) % 3;
// Tangent at each point: Catmull-Rom (neighbours' chord, over their u gap),
// wrapping round the loop, and zero at the front so the phone settles there.
const TAN = PATH.map((pt, k) => {
  if (k === 0 || k === PATH.length - 1) return Array(N).fill(0);
  const prev = PATH[k - 1], next = PATH[k + 1];
  const du = next[0] - prev[0];
  return Array.from({ length: N }, (_, i) => (next[i + 1] - prev[i + 1]) / du);
});
export function along(u) {
  let k = 0;
  while (k < PATH.length - 2 && u > PATH[k + 1][0]) k += 1;
  const p0 = PATH[k], p1 = PATH[k + 1], m0 = TAN[k], m1 = TAN[k + 1];
  const h = p1[0] - p0[0];
  const t = Math.max(0, Math.min(1, (u - p0[0]) / h));
  const t2 = t * t, t3 = t2 * t;
  const h00 = 2 * t3 - 3 * t2 + 1, h10 = t3 - 2 * t2 + t, h01 = -2 * t3 + 3 * t2, h11 = t3 - t2;
  const v = Array.from({ length: N }, (_, i) => h00 * p0[i + 1] + h10 * h * m0[i] + h01 * p1[i + 1] + h11 * h * m1[i]);
  return { x: v[0], y: v[1], scale: v[2], rotate: v[3], rotateY: v[4], bright: v[5] };
}
// Layers: the stack in order (front on top), the leaving phone above everything
// while it swings out, and below everything once it tucks back in. It changes
// layer only at u = 2.62, where it is clear of every other phone.
export const layer = (u) => (u > 2.62 ? 40 : u > 2 ? 5 : 30 - Math.round(u * 10));
