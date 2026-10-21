/**
 * Two rows of the app's real cards drifting in opposite directions: the tarot's 22 trumps above, five other
 * decks below. Each row is rendered twice and slid by half its width, so the loop has no seam; hover pauses
 * it, reduced motion stops it. next/image serves each card at its drawn size.
 */

import { DECKS } from '../../../lib/content/decks';
import { Row } from './Row';

const deck = (id) => DECKS.find((d) => d.id === id);

const TOP = deck('tarot').cards.slice(0, 22).map((c) => ['tarot', c, deck('tarot').nameOf(c)]);

const others = ['lenormand', 'runes', 'ogham', 'geomancy', 'iching'].map((id) => deck(id).cards.slice(0, 6).map((c) => [id, c, deck(id).nameOf(c)]));
const BOTTOM = [];
for (let k = 0; k < 6; k += 1) others.forEach((row) => row[k] && BOTTOM.push(row[k]));

export default function Marquee() {
  return (
    <div className="space-y-4">
      <Row items={TOP} dur="80s" />
      <Row items={BOTTOM} dur="70s" reverse />
    </div>
  );
}
