import type { Metadata, Viewport } from 'next';
import { Poppins, Inter } from 'next/font/google';
import Script from 'next/script';
import { business, SITE_URL } from '@/lib/business';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyCallBar from '@/components/StickyCallBar';
import { graph, businessNode, websiteNode, JsonLdScript } from '@/lib/schema';
import { cities } from '@/lib/routes';
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
    'Tub-to-shower conversions, walk-in bathtubs, accessible bathrooms and full bath remodels across Northern Virginia, Maryland and the DC metro. Locally owned. Free estimates.',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        {/* One root entity for the whole site. Every page references it by @id
            rather than repeating a LocalBusiness block 235 times. */}
        <JsonLdScript data={graph([businessNode(cities), websiteNode()])} />
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
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
