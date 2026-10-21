/**
 * Questions about Plutto, each answered in its first sentence. Rendered at /faq with FAQPage structured data and
 * folded into /llms.txt. Every answer must be true of the app as shipped: a price or a platform changes here.
 */
import { SITE } from '../seo/site';

const p = SITE.plans;

export const FAQS = [
  {
    q: 'What is Plutto?',
    a: SITE.definition,
  },
  {
    q: 'Is Plutto free?',
    a: `Yes, Plutto is free to start: your chart, the time wheels, your grahas, dashas and today's transits cost nothing. Plutto Star unlocks every reading in every tradition, unlimited compatibility matches and the live Oracle chat, for $${p[0].price} a week, $${p[1].price} a quarter or $${p[2].price} a year.`,
  },
  {
    q: 'Which astrology systems does Plutto use?',
    a: `Plutto reads Vedic astrology (Jyotish), KP astrology, Western astrology, Chinese astrology (BaZi) and numerology from your birth chart, plus tarot, Lenormand, runes, Ogham, the I Ching and geomancy — a library of the world's traditions, each pinned on a globe where it began.`,
  },
  {
    q: 'How does Plutto calculate my chart?',
    a: 'Plutto computes planetary positions with Swiss Ephemeris, the astronomical library used across professional astrology software, from your date, time and place of birth. Vedic charts use the Lahiri ayanamsa, KP charts the Krishnamurti ayanamsa with Placidus cusps, and Western charts the tropical zodiac with Placidus houses.',
  },
  {
    q: 'Can I talk to Plutto?',
    a: 'Yes. You can type or speak your question, and Plutto answers out loud in your language and keeps the thread of the conversation, so you can push back and ask what it means.',
  },
  {
    q: 'What languages does Plutto support?',
    a: 'Plutto works in your own language. You choose it when you start and every reading arrives in it, spoken and written.',
  },
  {
    q: 'Where can I get Plutto?',
    a: `Plutto is on Android through Google Play and runs in any browser at plutto.space/app. The iPhone app is coming to the App Store.`,
  },
  {
    q: 'Is Plutto accurate?',
    a: 'The astronomy is exact: planetary positions come from Swiss Ephemeris, to a fraction of a degree. The interpretations are the traditions’ own, read faithfully — but astrology is not a science, and Plutto does not claim to predict your future. It is built for reflection and for the question you keep to yourself, and it says so when a question is not one it can answer.',
  },
  {
    q: 'What is Plutto Star?',
    a: `Plutto Star is Plutto's subscription. It opens every reading across every tradition — Vedic, Western, Chinese, KP and numerology — unlimited compatibility matches and the live Oracle chat. It renews automatically until cancelled: $${p[0].price} a week, $${p[1].price} every three months or $${p[2].price} a year.`,
  },
  {
    q: 'Can I cancel Plutto Star?',
    a: 'Yes, at any time, and you keep it until the end of the period you have paid for. On Android, cancel in your Google Play subscriptions. Purchases are otherwise non-refundable except where the law requires a refund.',
  },
  {
    q: 'What does Plutto do with my data?',
    a: 'Plutto uses your birth details to compute your chart and your questions to answer them. It does not sell your data, and you can delete your account and everything with it from Settings in one tap.',
  },
  {
    q: 'Does Plutto send a daily horoscope?',
    a: 'If you turn on notifications, Plutto sends one line about your day each morning at nine your time, written from your own chart and today’s sky rather than your sun sign.',
  },
  {
    q: 'Who makes Plutto?',
    a: `Plutto is made by ${SITE.companyShort} (${SITE.company}), a studio building voice-first tools for the ancient sciences.`,
  },
];
