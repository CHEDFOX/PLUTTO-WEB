import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Starfield from '../components/Starfield';
import NatalWheel from '../components/NatalWheel';
import ChartForm from '../components/ChartForm';

export const metadata = {
  title: 'Natal Chart',
  description:
    'Enter your birth details to cast your personalised natal chart — Vedic, Western, Chinese, KP and Numerology in one.',
};

export default function NatalChartPage() {
  return (
    <>
      <Starfield />
      <Nav />

      <main className="relative z-10 pt-32 md:pt-40 px-4 md:px-12">
        <section className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-14 md:gap-12 items-start">
            {/* Form column */}
            <div className="md:col-span-6">
              <h1 className="font-serif font-light text-white text-[42px] md:text-[56px] leading-[1.02] tracking-[-0.01em]">
                Your Natal Chart
              </h1>
              <p className="mt-6 max-w-md text-[14px] leading-relaxed text-white/55">
                Enter your birth details to see your personalised chart,
                and receive timely astrological insights — free.
              </p>

              <div className="mt-12">
                <ChartForm />
              </div>
            </div>

            {/* Chart column */}
            <div className="md:col-span-6 flex justify-center md:justify-end">
              <div className="md:sticky md:top-32">
                <div className="rounded-full border border-white/8 bg-white/[0.015] p-6">
                  <NatalWheel variant="solid" size={460} />
                </div>
                <p className="mt-6 text-center text-[10px] uppercase tracking-[0.4em] text-white/40">
                  Western · Sidereal · Tropical
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
