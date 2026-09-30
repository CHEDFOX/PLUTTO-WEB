/** HOT TAKE 01 — the tropical zodiac is pinned to the seasons, and the sky has drifted since it was fixed. */
import { take } from '../takes.js';
export default take({
  n: 1,
  claim: [['YOUR SIGN', 'k'], ['IS PROBABLY', 'k'], ['WRONG.', 'r']],
  fact: 'The zodiac in your horoscope is pinned to the seasons, not the stars. The sky has drifted *about 24°* since it was fixed. Against the real stars, most people are the sign *before* theirs.',
  prompt: 'Which sign did you just lose? ↓',
});
