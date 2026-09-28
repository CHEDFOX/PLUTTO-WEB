/**
 * robots.txt — everyone is welcome to read the site, the answer engines by name.
 *
 * Being QUOTED by ChatGPT, Perplexity, Claude and Google's AI answers needs
 * their crawlers to be allowed in; naming each one says it on purpose rather
 * than by omission, and survives a future default-deny on their side.
 *
 * /m/ is the web app's bundle (JavaScript, wasm, fonts): nothing there is a page,
 * so it stays out of the index — except the icons, which the manifest names.
 * /app itself is NOT disallowed: it carries its own noindex header
 * (next.config.mjs), and a crawler has to be let in to read that.
 */
import { SITE } from './lib/seo';

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
