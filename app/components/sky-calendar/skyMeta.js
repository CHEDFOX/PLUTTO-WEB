import { pageMeta } from '../../lib/seo/pageMeta';
import { cardPath } from '../../lib/seo/shareCards';

export const skyMeta = (kind, year, title, description) => pageMeta({ title, description, path: `/${kind}/${year}`, type: 'article', image: cardPath(kind, String(year)) });
