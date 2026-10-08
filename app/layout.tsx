import type { Metadata, Viewport } from 'next';
import { Poppins, Inter } from 'next/font/google';
import Script from 'next/script';
import { business, SITE_URL } from '@/lib/business';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyCallBar from '@/components/StickyCallBar';
import { graph, businessNode, websiteNode, JsonLdScript } from '@/lib/schema';
import { cities } from '@/lib/routes';
import { getReviewsData } from '@/lib/googleReviews';
import './globals.css';

const display = Poppins({
  subsets: ['latin'], weight: ['600', '700'], variable: '--font-display', display: 'swap',
});
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Bathroom Remodeling in Northern Virginia & Maryland | ${business.name}`,
    template: `%s | ${business.name}`,
  },
  description:
    'Tub-to-shower conversions, walk-in bathtubs, accessible bathrooms and full bath remodels across Northern Virginia and Maryland. Locally owned. Free estimates.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website', siteName: business.name, locale: 'en_US', url: SITE_URL,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#1E3A33',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const reviewsData = await getReviewsData();
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      {/* suppressHydrationWarning: browser extensions (ColorZilla, Grammarly, etc.)
          inject attributes like cz-shortcut-listen onto <body> before React hydrates.
          That's a real DOM mismatch but not a bug in our markup — nothing to "fix"
          here, just tell React not to flag it. */}
      <body suppressHydrationWarning>
        {/* One root entity for the whole site. Every page references it by @id
            rather than repeating a LocalBusiness block 235 times. */}
        <JsonLdScript data={graph([businessNode(cities, reviewsData), websiteNode()])} />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded-full focus:bg-teal focus:px-5 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <StickyCallBar />
        {/* Accessibility widget — matches the one on the existing cleardaybaths.com site */}
        <Script
          src="https://cdn.userway.org/widget.js"
          data-account="YOUR_USERWAY_ACCOUNT_ID"
          data-position="bottom_right"
          strategy="lazyOnload"
        />
        {/* Zoho SalesIQ live chat — same widget as the existing cleardaybaths.com site */}
        <Script id="zsiqscript-loader" strategy="lazyOnload">
          {`
            window.$zoho = window.$zoho || {};
            $zoho.salesiq = $zoho.salesiq || { ready: function () {} };
            var d = document;
            var s = d.createElement('script');
            s.type = 'text/javascript';
            s.id = 'zsiqscript';
            s.defer = true;
            s.src = 'https://salesiq.zohopublic.com/widget?plugin_source=wordpress&wc=siq54c2e9dfe84e31debce1abe771ad29d5';
            d.head.appendChild(s);
          `}
        </Script>
      </body>
    </html>
  );
}
