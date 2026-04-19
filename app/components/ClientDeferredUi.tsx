"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const TopProgress = dynamic(() => import('@components/topprogress'), { ssr: false });
const ScrollToTop = dynamic(() => import('@components/scroll-to-top'), { ssr: false });
const CookieConsent = dynamic(() => import('@components/cookie-consent/CookieConsent'), { ssr: false });
const ConsentAnalyticsLoader = dynamic(() => import('@components/analytics/ConsentAnalyticsLoader'), { ssr: false });

type ClientDeferredUiProps = {
  gaId?: string;
  gtmId?: string;
};

export default function ClientDeferredUi({ gaId, gtmId }: ClientDeferredUiProps) {
  const [showTopProgress, setShowTopProgress] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [showAnalyticsLoader, setShowAnalyticsLoader] = useState(false);

  useEffect(() => {
    const idle = typeof window !== 'undefined' && 'requestIdleCallback' in window
      ? window.requestIdleCallback(() => {
        setShowTopProgress(true);
        setShowAnalyticsLoader(true);
      }, { timeout: 2000 })
      : window.setTimeout(() => {
        setShowTopProgress(true);
        setShowAnalyticsLoader(true);
      }, 1500);

    const onFirstIntent = () => {
      setShowScrollToTop(true);
      setShowCookieConsent(true);
    };

    window.addEventListener('scroll', onFirstIntent, { passive: true, once: true });
    window.addEventListener('pointerdown', onFirstIntent, { passive: true, once: true });
    window.addEventListener('keydown', onFirstIntent, { once: true });

    return () => {
      if (typeof idle === 'number') {
        window.clearTimeout(idle);
      } else if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idle);
      }
      window.removeEventListener('scroll', onFirstIntent);
      window.removeEventListener('pointerdown', onFirstIntent);
      window.removeEventListener('keydown', onFirstIntent);
    };
  }, []);

  return (
    <>
      {showTopProgress ? <TopProgress /> : null}
      {showScrollToTop ? <ScrollToTop /> : null}
      {showCookieConsent ? <CookieConsent /> : null}
      {showAnalyticsLoader ? <ConsentAnalyticsLoader gaId={gaId} gtmId={gtmId} /> : null}
    </>
  );
}