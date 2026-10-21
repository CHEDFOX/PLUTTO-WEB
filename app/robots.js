/**
 * robots.txt: every crawler may read the site. Being quoted by ChatGPT, Perplexity, Claude and Google's
 * AI answers needs their crawlers let in, so each is named: allowed on purpose, and still allowed if
 * their default turns to deny.
 */
// /m/ is the web app's bundle (JavaScript, wasm, fonts) and stays out of the index, except the icons
// the manifest names. /app is not disallowed: its noindex header (next.config.mjs) is only read by a
// crawler that is let in.
import { SITE } from './lib/seo/site';

const AI_CRAWLERS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',            // OpenAI
  'ClaudeBot', 'Claude-User', 'Claude-SearchBot',       // Anthropic
  'PerplexityBot', 'Perplexity-User',                   // Perplexity
  'Google-Extended', 'GoogleOther',                     // Gemini / AI Overviews
  'Applebot', 'Applebot-Extended',                      // Siri / Apple Intelligence
  'Bingbot', 'CCBot', 'DuckAssistBot', 'meta-externalagent', 'Amazonbot', 'YouBot', 'MistralAI-User',
];

export default function robots() {
  const rule = { allow: ['/', '/m/icons/'], disallow: ['/m/'] };
  return {
    rules: [{ userAgent: '*', ...rule }, ...AI_CRAWLERS.map((userAgent) => ({ userAgent, ...rule }))],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
