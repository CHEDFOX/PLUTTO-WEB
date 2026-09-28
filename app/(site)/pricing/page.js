/**
 * THE PRICING PAGE — what Plutto Star costs, and what a reader gets for free.
 *
 * Quiet on purpose: not in the nav, but in the footer on every page (beside the
 * legal links) and on the information page (/about). It exists because Paddle
 * approves a selling domain only when the site says what is sold and at what
 * price before the checkout does.
 *
 * The prices are the Paddle prices the web paywall sells (the catalog's
 * `subscription.paddle.prices`), in US dollars. They are written here by hand:
 * change a price in Paddle and change it here too. The paywall itself shows
 * each reader's live, localised price, so this page says so rather than
 * promising the dollar figure everywhere.
 */

import Link from 'next/link';
import { pageMeta } from '../../lib/seo';
import FadeUp from '../../components/FadeUp';

export const metadata = pageMeta({
  title: 'Pricing',
  description:
    'Plutto is free to start. Plutto Star unlocks every reading in every tradition: $5.99 a week, $19.99 a quarter or $29.99 a year.',
  path: '/pricing',
});

const MONO = 'text-[14px] font-semibold text-[#A78BFA]';
const LINK = 'text-white underline decoration-white/30 underline-offset-4 hover:decoration-white';

const PLANS = [
  { name: 'Weekly', price: '$5.99', per: 'week' },
  { name: 'Quarterly', price: '$19.99', per: '3 months' },
  { name: 'Annual', price: '$29.99', per: 'year' },
];

export default function PricingPage() {
  return (
    <div data-no-auto-case data-no-binary className="sentence-case relative z-10 font-ui">
      {/* ───────────────────────── HEAD ───────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-8 md:pt-16">
        <FadeUp>
          <p className={MONO}>Pricing</p>
        </FadeUp>
        <FadeUp delay={0.08}>
          <h1
            className="mt-5 font-semibold tracking-[-0.04em] text-white"
            style={{ fontSize: 'clamp(2.1rem,5.6vw,3.6rem)', lineHeight: 1.08, maxWidth: '18ch' }}
          >
            Free to start. Plutto Star for everything.
          </h1>
        </FadeUp>
        <FadeUp delay={0.16}>
          <p className="mt-8 max-w-2xl text-[18px] leading-[1.65] text-white/60">
            Your chart, the wheels, the Grahas, your dashas and today&rsquo;s
            transits are free. Plutto Star unlocks every
            reading across every tradition (Vedic, Western, Chinese, KP &amp;
            numerology), unlimited compatibility matches, and the live Oracle
            chat.
          </p>
        </FadeUp>
      </section>

      {/* ───────────────────────── PLANS ───────────────────────── */}
      <section className="border-t border-white/[0.07] bg-[#050509]/40">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <FadeUp>
            <p className={MONO}>Plutto Star</p>
          </FadeUp>
          <ul className="mt-10 divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {PLANS.map((p, i) => (
              <FadeUp key={p.name} delay={0.05 * i}>
                <li className="flex items-baseline justify-between gap-6 py-6">
                  <span className="text-[20px] font-semibold tracking-[-0.02em] text-white">{p.name}</span>
                  <span className="text-right">
                    <span className="text-[22px] font-semibold tracking-[-0.02em] text-white">{p.price}</span>
                    <span className="text-[15px] text-white/50"> / {p.per}</span>
                  </span>
                </li>
              </FadeUp>
            ))}
          </ul>

          <FadeUp delay={0.2}>
            <ul className="mt-10 space-y-4 text-[15px] leading-[1.65] text-white/55">
              <li>
                Plutto Star is an auto-renewing subscription. It renews at the end
                of each period at the price shown until you cancel, and you can
                cancel at any time — you keep it until the end of the period you
                have paid for.
              </li>
              <li>
                Prices are in US dollars. The checkout shows your price in your
                own currency, including any local tax, before you pay.
              </li>
              <li>
                On the web, payment is processed by Paddle.com, our authorised
                reseller and Merchant of Record; cancel from the link in your
                receipt or at{' '}
                <a href="https://paddle.net" className={LINK}>paddle.net</a>. In
                the iPhone and Android apps, Apple or Google bill you at the local
                price shown in the app, and you cancel in your store account.
              </li>
              <li>
                All purchases are final — see our{' '}
                <a href="https://api.plutto.space/refunds" className={LINK}>refund policy</a>{' '}
                for the cases the law or Paddle covers.
              </li>
            </ul>
          </FadeUp>
        </div>
      </section>

      {/* ───────────────────────── THE DOOR ───────────────────────── */}
      <section className="border-t border-white/[0.07]">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center md:py-20">
          <FadeUp>
            <Link
              href="/app"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-[15px] font-semibold text-black transition-opacity hover:opacity-90"
            >
              Open it in this browser
            </Link>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="mt-10 flex justify-center gap-6 text-[13px] text-white/45">
              <a href="https://api.plutto.space/terms" className="hover:text-white">Terms of Use</a>
              <a href="https://api.plutto.space/privacy" className="hover:text-white">Privacy Policy</a>
              <a href="https://api.plutto.space/refunds" className="hover:text-white">Refund Policy</a>
            </p>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
