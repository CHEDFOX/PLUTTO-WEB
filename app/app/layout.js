/**
 * THE APP — no site chrome, by design.
 *
 * Everything the marketing pages wear (nav, footer, grain, cursor, floating
 * logo) is in the site's own layout, so this route gets none of it. What is
 * left is what the phone has: a black screen and the app inside it.
 */
export const metadata = {
  title: 'Plutto',
  // The app is a private screen behind an account; it has nothing to offer a
  // crawler and should not appear in a search result ahead of the site itself.
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }) {
  return children;
}
