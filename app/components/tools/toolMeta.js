import { toolPath, toolBySlug } from '../../lib/content/tools';
import { pageMeta } from '../../lib/seo/pageMeta';
import { cardPath } from '../../lib/seo/shareCards';

export function toolMeta(slug) {
  const t = toolBySlug(slug);
  return pageMeta({ title: t.title, description: t.description, path: toolPath(slug), image: cardPath('tools', slug) });
}
