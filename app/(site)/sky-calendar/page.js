import { pageMeta } from '../../lib/seo';
import { cardPath } from '../../lib/cards';
import { SkyHub } from '../../components/site/Sky';

export const metadata = pageMeta({
  title: 'Sky Calendar: Retrogrades, Eclipses and Transits',
  description: 'Mercury retrograde, eclipse and planetary transit dates for 2026, 2027 and 2028 — Western and Vedic, to the minute, computed with Swiss Ephemeris.',
  path: '/sky-calendar',
  image: cardPath('sky-calendar'),
});

export default function Page() { return <SkyHub />; }
