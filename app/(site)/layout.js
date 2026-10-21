/**
 * Layout of every marketing route (route group, no URL segment). /app is public/m through a rewrite
 * and never renders this layout.
 */
import Script from 'next/script';
import Nav from '../components/layout/Nav';
import Footer from '../components/layout/Footer';
import SiteChrome from '../components/layout/SiteChrome';
import { JsonLd } from '../components/seo/JsonLd';
import { organizationLd, websiteLd, appLd } from '../lib/seo/structuredData';

export default function SiteLayout({ children }) {
  return (
    <>
      {/* Organization, WebSite and app JSON-LD on every marketing page (app/lib/seo/structuredData.js). */}
      <JsonLd data={organizationLd()} />
      <JsonLd data={websiteLd()} />
      <JsonLd data={appLd()} />
      <Nav />
      <div className="flex-1 pt-[68px]">{children}</div>
      <Footer />
      <SiteChrome />
      {/* Meta pixel and consent (app/api/meta/pixel); a stub until META_PIXEL_ID is set. */}
      <Script src="/api/meta/pixel" strategy="afterInteractive" />
    </>
  );
}
