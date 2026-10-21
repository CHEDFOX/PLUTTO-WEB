import Link from 'next/link';
import FadeUp from '../../motion/FadeUp';

export default function Pricing() {
  return (
    <section className="border-t border-white/[0.07] bg-white/[0.03]">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <FadeUp>
          <p data-no-auto-case className="max-w-2xl text-[17px] leading-[1.65] text-white/60">
            It is free to start; Plutto Star opens every reading.{' '}
            <Link
              href="/pricing"
              className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
            >
              What it costs
            </Link>
            , and our{' '}
            <a
              href="https://api.plutto.space/refunds"
              className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
            >
              refund policy
            </a>
            .
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
