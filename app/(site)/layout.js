/**
 * THE SITE — everything except the app.
 *
 * The marketing chrome lives here and nowhere else: the nav, the footer, the
 * grain, the custom cursor, the floating logo. It used to sit in the ROOT
 * layout, which meant /app inherited all of it — the app opened with a website
 * header over it, a wordmark and an About link across the top, and a floating
 * badge in the corner. None of that exists on the phone.
 *
 * A route group (this folder's parentheses) keeps the URLs exactly as they were:
 * /(site)/page.js is still /, /(site)/about is still /about.
 */
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import SiteChrome from '../components/SiteChrome';

export default function SiteLayout({ children }) {
  return (
    <>
      <Nav />
      <div className="flex-1 pt-16">{children}</div>
      <Footer />
      <SiteChrome />
    </>
  );
}
