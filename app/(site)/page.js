/**
 * THE LANDING PAGE — built the way a product company builds one.
 *
 * WHAT CHANGED, AND WHY. The earlier pages were set in an editorial serif with
 * wide-spaced mono captions, under a custom cursor and a per-word glitch. Each
 * choice was defensible; together they read as a studio's portfolio, not a
 * company's product. Big product pages share a grammar a visitor recognises
 * before reading a word:
 *
 *   · one sans face, heavy and tightly tracked for headlines (Inter)
 *   · the product, on a phone, in the first screen
 *   · a bento of features, each tile one claim with its own picture
 *   · a closing band with the store badges
 *
 * The app's own face (Baloo 2) appears only INSIDE the phones, where it is the
 * app's type, not the site's.
 *
 * Kept from before: the six decks you can turn over (#draw) — the one thing on
 * the page that is play rather than description. The plain sentence Google's
 * OAuth brand verification needs is the page description (see `metadata`).
 */

import HomeHero from '../components/home/sections/HomeHero';
import LibrarySection from '../components/home/sections/LibrarySection';
import HowItWorksSection from '../components/home/sections/HowItWorksSection';
import FeaturesSection from '../components/home/sections/FeaturesSection';
import DrawSection from '../components/home/sections/DrawSection';
import MagazineSection from '../components/home/sections/MagazineSection';
import DownloadSection from '../components/home/sections/DownloadSection';

// The sentence Google's OAuth brand verification needs (it once rejected this
// page for not saying what the app does) lives in the description now, not on
// the page. Do not remove it without checking the consent screen still reads
// "Plutto" rather than the raw Supabase host.
export const metadata = {
  description:
    'Plutto is an astrology app you can talk to. Give it your birth date, time and place; it reads your real chart out loud — Vedic, Western, Chinese, KP and numerology.',
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <div data-no-auto-case className="sentence-case relative z-10 font-ui">
      <HomeHero />
      <LibrarySection />
      <HowItWorksSection />
      <FeaturesSection />
      <DrawSection />
      <MagazineSection />
      <DownloadSection />
    </div>
  );
}
