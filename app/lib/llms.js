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
import { SECTIONS, refPath, flat } from './refpages';
import { TOOLS, toolPath } from './tools';
import { CAL_YEARS, SOURCE, retrogrades, eclipses, ingresses, signAt } from './skycal';

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
    '## Reference',
    ...Object.values(SECTIONS).map((s) => `- [${s.hubTitle}](${url(s.base)}): ${s.hubDescription}`),
    '',
    '## Free calculators',
    ...TOOLS.map((t) => `- [${t.name}](${url(toolPath(t.slug))}): ${t.description}`),
    '',
    '## Sky calendar',
    `- [Today’s panchang](${url('/panchang')}): tithi, nakshatra, yoga, karana, vara, sunrise, sunset and Rahu Kaal, updated hourly`,
    ...CAL_YEARS.map((y) => `- ${y}: [Mercury retrograde](${url(`/mercury-retrograde/${y}`)}), [eclipses](${url(`/eclipses/${y}`)}), [transits](${url(`/transits/${y}`)})`),
    `- [Embed a calculator on your site](${url('/tools/embed')})`,
    '',
    `- [Editorial standards and sources](${url('/editorial-standards')}): how these pages are written and checked, and how to report a correction`,
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
  for (const [key, s] of Object.entries(SECTIONS)) {
    out.push('---', '', `# ${s.hubTitle}`, '', `Source: ${url(s.base)}`, '');
    for (const x of s.items) {
      const p = s.page(x);
      out.push(`## ${p.h1}`, '', `Source: ${url(refPath(key, x.slug))}`, '', p.answer, '', ...p.facts.map(([k, v]) => `- ${k}: ${flat(v)}`), '');
      for (const t of p.tables || []) out.push(`${t.caption}:`, '', `| ${t.head.join(' | ')} |`, `|${t.head.map(() => '---').join('|')}|`, ...t.rows.map((row) => `| ${row.map(flat).join(' | ')} |`), '');
    }
  }
  for (const t of TOOLS) {
    out.push('---', '', `# ${t.name}`, '', `Source: ${url(toolPath(t.slug))}`, '', t.answer, '', ...t.method.map((m, i) => `${i + 1}. ${m}`), '', t.note, '');
  }
  const d = (t) => new Date(t).toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
  for (const y of CAL_YEARS) {
    out.push('---', '', `# Sky calendar ${y}`, '', `Computed with ${SOURCE}. Sidereal = Lahiri ayanamsa.`, '', '## Retrogrades', '');
    for (const [p, ps] of Object.entries(retrogrades(y))) for (const r of ps) out.push(`- ${p}: retrograde ${d(r.from)} to ${d(r.to)} (${signAt(r.startTrop)} tropical, ${signAt(r.startSid)} sidereal)`);
    out.push('', '## Eclipses', '', ...eclipses(y).map((e) => `- ${d(e.t)}: ${e.kind} ${e.body} eclipse, ${signAt(e.trop)} tropical / ${signAt(e.sid)} sidereal`), '', '## Sidereal sign changes (Vedic)', '');
    for (const p of ['Saturn', 'Jupiter', 'Rahu', 'RahuMean', 'Mars', 'Venus', 'Mercury', 'Sun']) for (const x of ingresses(y, 'sidereal', p)) out.push(`- ${p === 'RahuMean' ? 'Rahu (mean node)' : p === 'Rahu' ? 'Rahu (true node)' : p} enters ${x.sign}: ${d(x.t)}${x.retro ? ' (retrograde)' : ''}`);
    out.push('');
  }
  return out.join('\n');
}
