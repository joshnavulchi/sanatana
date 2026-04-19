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
  const [deferReady, setDeferReady] = useState(false);

  useEffect(() => {
    setEnabled(canLoadAnalytics());

    const onPrefsUpdate = () => setEnabled(canLoadAnalytics());
    window.addEventListener("sd_cookie_prefs_updated", onPrefsUpdate as EventListener);
    return () => window.removeEventListener("sd_cookie_prefs_updated", onPrefsUpdate as EventListener);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setDeferReady(false);
      return;
    }

    let timeoutId: number | undefined;
    let idleId: number | undefined;
    let armed = false;

    const arm = () => {
      if (armed) return;
      armed = true;
      setDeferReady(true);
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
      window.removeEventListener("scroll", arm);
    };

    window.addEventListener("pointerdown", arm, { once: true, passive: true });
    window.addEventListener("keydown", arm, { once: true });
    window.addEventListener("scroll", arm, { once: true, passive: true });

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(() => arm(), { timeout: 5000 }) as unknown as number;
    } else {
      timeoutId = window.setTimeout(() => arm(), 5000);
    }

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (idleId && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId as unknown as number);
      }
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
      window.removeEventListener("scroll", arm);
    };
  }, [enabled]);

  if (!enabled || !deferReady) return null;

  const useGtm = Boolean(gtmId);
  const useDirectGa = Boolean(gaId) && !useGtm;

  return (
    <>
      {useDirectGa && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="lazyOnload"
          />
          <Script id="ga-init" strategy="lazyOnload">
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
      {useGtm && (
        <Script id="gtm-init" strategy="lazyOnload">
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
