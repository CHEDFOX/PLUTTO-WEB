import Link from 'next/link';
import FadeUp from '../../motion/FadeUp';
import StoreBadges from '../../store/StoreBadges';

export default function Door() {
  return (
    <section className="border-t border-white/[0.07]">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
        <FadeUp>
          <p
            data-no-auto-case
            className="font-semibold tracking-[-0.04em] text-white"
            style={{ fontSize: 'clamp(1.9rem,5.4vw,3.4rem)', lineHeight: 1.1 }}
          >
            Ask it something you actually want to know.
          </p>
        </FadeUp>

        <FadeUp delay={0.15}>
          <div className="mt-12 flex justify-center">
            <Link
              href="/app"
              className="inline-flex h-12 items-center justify-center rounded-[2px] bg-white px-7 font-mono text-[13px] uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-90"
            >
              Open it in this browser
            </Link>
          </div>
        </FadeUp>

        <FadeUp delay={0.25}>
          <div className="mt-20 border-t border-white/[0.07] pt-16">
            <StoreBadges />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
