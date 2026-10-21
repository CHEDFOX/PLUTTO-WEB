/**
 * THE INFORMATION PAGE.
 *
 * The landing page's job is to make someone curious; this page's job is to make
 * them trust it, which is a different job and wants a different shape. So it is
 * built as a document rather than as a sequence of scenes: a numbered spine of
 * three movements down the left, one claim each, with the plain machinery
 * spelled out beside it — and then, before the close, the list of things Plutto
 * will NOT do. That list is the most persuasive block on the page. Anyone who
 * has been sold a horoscope app already suspects everything here; naming the
 * suspicions in our own words, in the affirmative, is what answers them.
 *
 * Every number on this page is real and comes from the backend catalog: 79
 * sections, 102 traditions on the globe, 19 vargas, the languages already
 * warmed in onboarding_translations.json. If a claim here cannot be pointed at
 * in the code, it does not belong on this page.
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
