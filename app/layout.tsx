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

const GTM_SNIPPET = (id: string) => `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`;

const META_PIXEL_SNIPPET = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1513911753720634');
fbq('track', 'PageView');`;

const GTAG_SNIPPET = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18174121255');`;

const CONVERSION_SNIPPET = `function gtag_report_conversion(url) {
  var callback = function () {
    if (typeof(url) != 'undefined') {
      window.location = url;
    }
  };
  gtag('event', 'conversion', {
      'send_to': 'AW-18163740288/fQCPCOrrtb0cEIDdktVD',
      'event_callback': callback
  });
  return false;
}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const reviewsData = await getReviewsData();
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        {/* Google Tag Manager (two containers) */}
        <script dangerouslySetInnerHTML={{ __html: GTM_SNIPPET('GTM-56GNMQQB') }} />
        <script dangerouslySetInnerHTML={{ __html: GTM_SNIPPET('GTM-TC9JGBCL') }} />
        {/* Meta Pixel */}
        <script dangerouslySetInnerHTML={{ __html: META_PIXEL_SNIPPET }} />
        {/* Google tag (gtag.js) + Google Ads lead-form conversion helper */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18174121255" />
        <script dangerouslySetInnerHTML={{ __html: GTAG_SNIPPET }} />
        <script dangerouslySetInnerHTML={{ __html: CONVERSION_SNIPPET }} />
      </head>
      {/* suppressHydrationWarning: browser extensions (ColorZilla, Grammarly, etc.)
          inject attributes like cz-shortcut-listen onto <body> before React hydrates.
          That's a real DOM mismatch but not a bug in our markup — nothing to "fix"
          here, just tell React not to flag it. */}
      <body suppressHydrationWarning>
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-56GNMQQB"
                  height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
        </noscript>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: 'none' }} alt=""
               src="https://www.facebook.com/tr?id=1513911753720634&ev=PageView&noscript=1" />
        </noscript>
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
        {/* CallRail dynamic number swap — must stay immediately before </body> */}
        <script type="text/javascript" src="//cdn.calltrk.com/companies/936170131/7c30c8c39ddab4cc4f1f/12/swap.js" />
      </body>
    </html>
  );
}
