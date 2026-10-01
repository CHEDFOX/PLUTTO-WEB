/** ON THE RECORD 05 — John Dee chose Elizabeth I's coronation date, 15 January 1559. */
import { take } from '../takes.js';
export default take({
  n: 5, label: 'ON THE RECORD',
  claim: [['A QUEEN WAS', 'k'], ['CROWNED ON AN', 'k'], ['ASTROLOGER’S DATE.', 'r']],
  fact: 'Elizabeth I asked her astrologer *John Dee* to choose her coronation day. He chose *15 January 1559*. She reigned for *44 years*.',
  prompt: 'Would you pick your wedding date this way? ↓',
});
