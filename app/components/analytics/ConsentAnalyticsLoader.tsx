"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import storage from "@lib/storage";

type Prefs = {
  strictlyNecessary: boolean;
  functionality?: boolean;
  performance?: boolean;
  targeting?: boolean;
};

type Props = {
  gaId?: string;
  gtmId?: string;
};

function canLoadAnalytics(): boolean {
  try {
    const raw = storage.getItem("sd_cookie_prefs");
    if (!raw) return false;
    const prefs = JSON.parse(raw) as Prefs;
    return Boolean(prefs?.performance || prefs?.targeting);
  } catch {
    return false;
  }
}

export default function ConsentAnalyticsLoader({ gaId, gtmId }: Props) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(canLoadAnalytics());

    const onPrefsUpdate = () => setEnabled(canLoadAnalytics());
    window.addEventListener("sd_cookie_prefs_updated", onPrefsUpdate as EventListener);
    return () => window.removeEventListener("sd_cookie_prefs_updated", onPrefsUpdate as EventListener);
  }, []);

  if (!enabled) return null;

  return (
    <>
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}
      {gtmId && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </Script>
      )}
    </>
  );
}
