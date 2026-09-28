import { pageMeta } from '../../lib/seo';
import { ToolsHub } from '../../components/site/tools/Tool';

export const metadata = pageMeta({
  title: 'Free Astrology & Numerology Calculators',
  description: 'Free calculators that show their working: life path number, Chinese zodiac animal and element, Pythagorean and Chaldean name numerology. No sign-up, nothing sent.',
  path: '/tools',
});

export default function Page() {
  return <ToolsHub />;
}
