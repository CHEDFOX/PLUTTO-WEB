/**
 * /llms.txt and /llms-full.txt — the site as plain Markdown for language models
 * (the llms.txt convention: a title, a one-paragraph summary, then links).
 *
 * An answer engine that reads this gets Plutto's facts in Plutto's own words,
 * without parsing a page built for eyes. Generated from the same modules the
 * pages use, so it can never say something the site does not.
 */
import { SITE } from './seo';
import { FAQS } from './faq';
import { GUIDES } from './guides';
import ATLAS from './atlas.json';

const url = (p) => `${SITE.url}${p}`;

export function llmsTxt() {
  return [
    `# ${SITE.name}`,
    '',
    `> ${SITE.definition}`,
    '',
    `Made by ${SITE.companyShort} (${SITE.company}). Free to start; Plutto Star is ${SITE.plans.map((p) => `$${p.price}/${p.label}`).join(', ')}. Available on Android (Google Play) and on the web; iPhone app coming to the App Store.`,
    '',
    '## Pages',
    `- [Home](${url('/')}): what Plutto is and what it reads`,
    `- [How it works](${url('/about')}): the moment, the reading, the voice; what Plutto will not do`,
    `- [Pricing](${url('/pricing')}): free tier and Plutto Star plans`,
    `- [FAQ](${url('/faq')}): price, accuracy, languages, systems, data`,
    `- [Traditions](${url('/traditions')}): all ${ATLAS.traditions.length} traditions, by region, with where each began`,
    '',
    '## Guides',
    ...GUIDES.map((g) => `- [${g.title}](${url(`/guides/${g.slug}`)}): ${g.description}`),
    '',
    '## Optional',
    `- [Full text](${url('/llms-full.txt')}): every answer and guide on this site in one file`,
    `- [Web app](${SITE.webAppUrl}), [Google Play](${SITE.playUrl})`,
    '',
  ].join('\n');
}

export function llmsFullTxt() {
  const out = [llmsTxt(), '---', '', '# FAQ', ''];
  for (const f of FAQS) out.push(`## ${f.q}`, '', f.a, '');
  for (const g of GUIDES) {
    out.push('---', '', `# ${g.title}`, '', `Source: ${url(`/guides/${g.slug}`)}`, '', g.answer, '');
    for (const s of g.sections) out.push(`## ${s.h}`, '', ...s.p.flatMap((t) => [t, '']));
    out.push(`## What Plutto reads for ${g.name}`, '', ...g.inPlutto.map((x) => `- ${x}`), '');
    for (const f of g.faqs) out.push(`### ${f.q}`, '', f.a, '');
  }
  out.push('---', '', `# ${ATLAS.traditions.length} traditions on Plutto's globe`, '', `Source: ${url('/traditions')}`, '');
  for (const r of ATLAS.regions) {
    const items = ATLAS.traditions.filter((t) => t.region === r.id);
    if (!items.length) continue;
    out.push(`## ${r.title}`, '', ...items.map((t) => `- **${t.name}** (${t.place}): ${t.note}`), '');
  }
  return out.join('\n');
}
