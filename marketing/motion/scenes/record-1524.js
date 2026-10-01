/** ON THE RECORD 03 — the predicted flood of February 1524 (Stöffler's almanac; 133 pamphlets by 56 authors, per Zambelli). */
import { take } from '../takes.js';
export default take({
  n: 3, label: 'ON THE RECORD',
  claim: [['IN 1524 EUROPE', 'k'], ['BUILT ARKS', 'r'], ['FOR A FLOOD', 'k'], ['THAT NEVER CAME.', 'k']],
  fact: 'Astrologers read a crowd of planets in Pisces as a second Flood. Some *56 authors* printed *133 pamphlets*. People sold land and built boats. February 1524 came, and the rain didn’t.',
  prompt: 'What’s today’s 1524? ↓',
});
