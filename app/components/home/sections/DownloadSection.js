import Link from 'next/link';
import FadeUp from '../../motion/FadeUp';
import StoreBadges from '../../store/StoreBadges';
import { Note } from '../../ink/Note';
import { H2 } from '../H2';

export default function DownloadSection() {
  return (
    <section id="download" className="lazy-section scroll-mt-20 px-6 pb-16 md:pb-20">
      <FadeUp>
        <div className="relative mx-auto max-w-6xl overflow-hidden border-y-[3px] border-white px-6 py-20 text-center md:py-24">
          <div className="relative z-10">
          <H2 className="mx-auto max-w-[20ch]">Perhaps the question was never whether the universe speaks.</H2>
          <p className="mx-auto mt-8 max-w-[34ch] text-[15px] text-white/50">Perhaps it was whether you were listening.</p>
          <div className="mt-9 flex justify-center">
            <Link href="/app" className="inline-flex h-12 items-center rounded-[2px] bg-white px-7 font-mono text-[13px] uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-90">
              Ask.
            </Link>
          </div>
          <StoreBadges className="mt-6" />
          <div className="mt-8"><Note tilt={-3} delay={0.4}>the stars have been waiting.</Note></div>
          </div>
        </div>
      </FadeUp>

    </section>
  );
}
