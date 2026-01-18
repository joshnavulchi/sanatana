/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { Suspense } from 'react';
import { Poppins } from 'next/font/google';
import { LocaleProvider } from './context/locale-context';
import { ThemeProvider } from './context/theme-context';
import { headers } from 'next/headers';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '../lib/i18n';
import { secrets } from '../lib/secrets';
import { buildOrganizationJsonLd, buildWebSiteJsonLd, renderJsonLdScript } from '../lib/jsonld';
import Script from 'next/script';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import CookieConsent from './components/cookie-consent/CookieConsent';
import TopProgress from './components/progress/TopProgress';
import DigitalClockLoader from './components/digitalclock/DigitalClockLoader';
import ScrollToTop from './components/scroll-to-top/scroll-to-top';

import "./globals.css"; // tailwind base styles

const poppins = Poppins({ subsets: ["latin"], weight: ["400"] });
// Compose a safe font-family string: Playfair primary, Poppins fallback
const bodyFontFamily = `${poppins.style?.fontFamily || "Poppins, sans-serif"}`;
const SITE_URL = secrets.NEXT_PUBLIC_SITE_URL || "https://sanatanadharmam.in";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const orgJson = buildOrganizationJsonLd({
    logo: `${(secrets.NEXT_PUBLIC_SITE_URL || 'https://sanatanadharmam.in').replace(/\/$/, '')}/assets/logo.png`,
    description: 'Explore Sanātana Dharma: eternal principles of Hinduism, Vedic traditions, and spiritual practices.'
  });
  const siteJson = buildWebSiteJsonLd();
    
  // Resolve a server-side locale from cookie or Accept-Language header
  async function resolveServerLocale(): Promise<string> {
    const supported = SUPPORTED_LOCALES;
    try {
      // headers() may throw in some environments; guard usage
      const hdrs = await headers();
      if (!hdrs || typeof hdrs.get !== 'function') {
        return DEFAULT_LOCALE;
      }
      // cookie named `sanatana_dharma_language` was used in client-side code
      const cookie = hdrs.get('cookie') || '';
      const match = typeof cookie === 'string' ? cookie.match(/sanatana_dharma_language=([^;]+)/) : null;
      if (match && supported.includes(match[1])) return match[1];
      // Accept-Language header may be missing or not a string
      const al = hdrs.get('accept-language');
      if (al && typeof al === 'string') {
        const first = al.split(',')[0].split(';')[0].trim();
        const primary = first.split('-')[0];
        if (supported.includes(primary)) return primary;
      }
    } catch (err) {
      // headers() can throw; fall back to DEFAULT_LOCALE
    }
    return DEFAULT_LOCALE;
  }
  const lang = await resolveServerLocale();
  
  return (
    <html lang={lang} translate="no">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes" />
        {/* Prevent browser automatic translation UI (Chrome/Google Translate) */}
        <meta name="google" content="notranslate" />
        <link rel="preload" as="image" imageSrcSet="/images/home/hero.png 1024w, /images/home/mobile-hero.png 768w" imageSizes="(max-width: 1980px) 100vw, 1980" href="/images/home/hero.png" />
        {/* Page-specific override: cache for 30 days */}
        <meta httpEquiv="Cache-Control" content="max-age=2592000, must-revalidate" />
        <meta httpEquiv="Pragma" content="cache" />
        <meta httpEquiv="Expires" content="2592000" />
        <link rel="stylesheet" href="/globals.from-scss.css" />
        {/* JSON-LD structured data for Website/Organization */}
        <meta name="google-site-verification" content="kxWcUTvXW7Ag5H1jtSxNuYUoKcWm-sq0on2s-h5ILF8" />
        {/* Organization & WebSite JSON-LD */}
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={renderJsonLdScript(siteJson)}
        />
          <Script
            type="application/ld+json"
            dangerouslySetInnerHTML={renderJsonLdScript(orgJson)}
          />
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Sanātana Dharma",
              url: SITE_URL,
              description: "Sanātana Dharma — Explore the Vedas, Puranas, Shastras, and timeless teachings of Indian philosophy, spirituality, and culture.",
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        {/* Removed Microsoft Clarity tracking code (no third-party Clarity scripts) */}
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Sanātana Dharma",
              url: SITE_URL,
              logo: `${SITE_URL}/globe.svg`,
              sameAs: []
            })
          }}
        />
        {/* Google Analytics is loaded on user consent via the CookieConsent component. */}
        {/* Disable right-click context menu in production to reduce casual copy */}
        {process.env.NODE_ENV === "production" && (
          <Script
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `(() => {
                try {
                  document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
                } catch (err) {
                  // ignore
                }
              })();`
            }}
          />
        )}
        {/* Google Tag Manager removed from automatic load — now loaded after user consent to reduce unused JS. */}
      </head>
      <body style={{ fontFamily: bodyFontFamily }} translate="no">
        <TopProgress />
        {/* Google Tag Manager (noscript) inserted when `NEXT_PUBLIC_GTM_ID` is set */}
        {secrets.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${secrets.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <Suspense fallback={null}>
          <LocaleProvider>
            <ThemeProvider>
              <Suspense fallback={null}>
                <Header />
              </Suspense>
              <Suspense fallback={null}>
                {children}
              </Suspense>
              <Suspense fallback={null}>
                <Footer />
              </Suspense>
              <DigitalClockLoader />
              <ScrollToTop />
              <CookieConsent />
            </ThemeProvider>
          </LocaleProvider>
        </Suspense>
      </body>
    </html>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */