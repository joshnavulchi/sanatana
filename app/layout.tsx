/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { Poppins } from 'next/font/google';
import { headers } from 'next/headers';

import Script from 'next/script';
import { Suspense } from 'react';

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@lib/i18n';
import { buildOrganizationJsonLd, buildWebSiteJsonLd, renderJsonLdScript } from '@lib/jsonld';
import { secrets } from '@lib/secrets';
import CookieConsent from '@components/cookie-consent/CookieConsent';

import Header from '@components/header';
import Footer from '@components/footer';

import TopProgress from '@components/topprogress';
import ScrollToTop from '@components/scroll-to-top';

import { LocaleProvider } from './context/locale-context';
import { ThemeProvider } from './context/theme-context';

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
        {/* Favicons: use site logo for broad compatibility */}
        <link rel="icon" href="/images/logo.png" type="image/png" sizes="64x64" />
        <link rel="shortcut icon" href="/images/logo.png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
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
        {/* Defer non-critical global styles (preload → convert to stylesheet onload) */}
        <Script
          id="load-deferred-css"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var l=document.createElement('link');
                l.rel='preload';
                l.as='style';
                l.href='/globals.from-scss.css';
                l.onload=function(){this.onload=null;this.rel='stylesheet'};
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
          // strategy="afterInteractive"
          dangerouslySetInnerHTML={renderJsonLdScript(siteJson)}
        />
        <Script
          id="jsonld-org"
          type="application/ld+json"
          // strategy="afterInteractive"
          dangerouslySetInnerHTML={renderJsonLdScript(orgJson)}
        />
        <Script
          id="jsonld-web"
          type="application/ld+json"
          // strategy="afterInteractive"
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
          // strategy="afterInteractive"
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
        {/* Hint the font for later use (non-blocking) */}
        <link
          rel="prefetch"
          href="/_next/static/media/a218039a3287bcfd-s.p.4a23d71b.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
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
        {/* Google Analytics (GA4) */}
        {secrets.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${secrets.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${secrets.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
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