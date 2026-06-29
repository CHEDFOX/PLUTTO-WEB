import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Starfield from '../components/Starfield';

export const metadata = {
  title: 'About',
  description:
    'The world doesn’t need another astrology app. It needs a place that treats ancient knowledge with curiosity instead of certainty.',
};

export default function AboutPage() {
  return (
    <>
      <Starfield />
      <Nav />

      <main className="relative z-10">
        <section className="min-h-[80svh] flex items-center justify-center px-6 md:px-12 pt-40 md:pt-48 pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] uppercase tracking-[0.42em] text-white/45 mb-14">
              Why We Exist
            </p>

            <h1 className="font-serif font-light text-white text-[40px] md:text-[64px] leading-[1.05] tracking-[-0.01em] mb-16">
              The World Doesn&rsquo;t Need
              <br />
              <em className="italic">Another Astrology App.</em>
            </h1>

            <div className="font-serif font-light text-white/80 text-[20px] md:text-[26px] leading-[1.6] space-y-7 max-w-2xl mx-auto">
              <p>
                It Needs A Place That Treats Ancient Knowledge With Curiosity
                Instead Of Certainty.
              </p>
              <p>A Place Where Questions Matter As Much As Answers.</p>
              <p>A Place Where Exploration Is Encouraged.</p>
              <p className="italic text-white pt-5">That&rsquo;s Why Plutto Exists.</p>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
