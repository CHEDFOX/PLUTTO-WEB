/**
 * /about: how Plutto works, what it will not do and what it costs. Sections live in
 * app/components/about/sections.
 */

import { pageMeta } from '../../lib/seo/pageMeta';
import AboutHead from '../../components/about/sections/AboutHead';
import Movements from '../../components/about/sections/Movements';
import Refusals from '../../components/about/sections/Refusals';
import Pricing from '../../components/about/sections/Pricing';
import Door from '../../components/about/sections/Door';

export const metadata = pageMeta({
  title: 'How Plutto Works',
  description:
    'Plutto computes real charts with Swiss Ephemeris, reads them through the tradition that fits your question — a library of the world’s traditions — and answers out loud in your language.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <>

      <div data-no-auto-case className="sentence-case relative z-10 font-ui">
        <AboutHead />
        <Movements />
        <Refusals />
        <Pricing />
        <Door />
      </div>
    </>
  );
}
