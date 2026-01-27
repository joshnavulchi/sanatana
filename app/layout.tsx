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
import ResourceHints from './components/resource-hints/ResourceHints';
import WebVitalsReporter from './components/web-vitals/WebVitalsReporter';

import "./globals.css"; // tailwind base styles

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400"], 
  preload: true,
  display: "swap" // Prevents layout shift from font loading
});
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
    
  // Resolve locale with minimal blocking - use synchronous detection when possible
  let lang = DEFAULT_LOCALE;
  try {
    const hdrs = await headers();
    const cookie = hdrs.get('cookie') || '';
    const match = cookie.match(/sanatana_dharma_language=([^;]+)/);
    if (match && SUPPORTED_LOCALES.includes(match[1])) {
      lang = match[1];
    } else {
      const al = hdrs.get('accept-language');
      if (al) {
        const primary = al.split(',')[0].split(';')[0].trim().split('-')[0];
        if (SUPPORTED_LOCALES.includes(primary)) lang = primary;
      }
    }
  } catch (err) {
    // Use default locale on error
  }
  
  return (
    <html lang={lang} translate="no">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes" />
        {/* Prevent browser automatic translation UI (Chrome/Google Translate) */}
        <meta name="google" content="notranslate" />
        {/* Early resource hints to reduce network latency */}
        <ResourceHints />
        {/* Preload LCP image with high priority - matches hero img tag */}
        <link 
          rel="preload" 
          as="image" 
          href="/images/home/mobile-hero.png"
          imageSrcSet="/images/home/hero.png 1024w, /images/home/mobile-hero.png 768w" 
          imageSizes="(min-width: 1024px) 50vw, 100vw"
          fetchPriority="high"
        />
        {/* Page-specific override: cache for 30 days */}
        <meta httpEquiv="Cache-Control" content="max-age=2592000, must-revalidate" />
        <meta httpEquiv="Pragma" content="cache" />
        <meta httpEquiv="Expires" content="2592000" />
        {/* Defer non-critical global styles */}
        <link rel="preload" href="/globals.from-scss.css" as="style" />
        <Script
          id="load-deferred-css"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var l=document.createElement('link');
                l.rel='stylesheet';
                l.href='/globals.from-scss.css';
                document.head.appendChild(l);
              })();
            `
          }}
        />
        <noscript><link rel="stylesheet" href="/globals.from-scss.css" /></noscript>
        {/* JSON-LD structured data for Website/Organization */}
        <meta name="google-site-verification" content="kxWcUTvXW7Ag5H1jtSxNuYUoKcWm-sq0on2s-h5ILF8" />
        {/* Organization & WebSite JSON-LD - defer non-critical structured data */}
        <Script
          id="jsonld-site"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={renderJsonLdScript(siteJson)}
        />
          <Script
            id="jsonld-org"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={renderJsonLdScript(orgJson)}
          />
        <Script
          id="jsonld-web"
          type="application/ld+json"
          strategy="afterInteractive"
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
          id="jsonld-organization"
          type="application/ld+json"
          strategy="afterInteractive"
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
        {/* Preload local font with high priority to reduce font loading delay */}
        <link 
          rel="preload" 
          href="/_next/static/media/a218039a3287bcfd-s.p.4a23d71b.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous"
          fetchPriority="high"
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Prevent FOIT/FOUT and layout shift from font loading */
            @font-face {
              font-family: '__Poppins_Fallback';
              src: local('Arial'), local('Helvetica'), local('sans-serif');
              font-display: swap;
              ascent-override: 105%;
              descent-override: 35%;
              line-gap-override: 10%;
              size-adjust: 95%;
            }
          `
        }} />
        {/* Disable right-click context menu in production to reduce casual copy */}
        {process.env.NODE_ENV === "production" && (
          <Script
            id="disable-contextmenu"
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
              <WebVitalsReporter />
            </ThemeProvider>
          </LocaleProvider>
        </Suspense>
      </body>
    </html>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */