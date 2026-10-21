/**
 * Home (/). Sections live in app/components/home/sections. metadata.description is what Google's
 * OAuth brand verification reads: keep it describing the app.
 */

import HomeHero from '../components/home/sections/HomeHero';
import LibrarySection from '../components/home/sections/LibrarySection';
import HowItWorksSection from '../components/home/sections/HowItWorksSection';
import FeaturesSection from '../components/home/sections/FeaturesSection';
import DrawSection from '../components/home/sections/DrawSection';
import MagazineSection from '../components/home/sections/MagazineSection';
import DownloadSection from '../components/home/sections/DownloadSection';

// After changing the description, check that Google's consent screen reads "Plutto", not the Supabase host.
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
