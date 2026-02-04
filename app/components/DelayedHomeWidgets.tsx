"use client";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const CookieConsent = dynamic(() => import('./cookie-consent/CookieConsent'), { ssr: false });

const DigitalClockClient = dynamic(() => import('./digitalclock/digitalclock'), { ssr: false });

export default function DelayedHomeWidgets() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 2000); // 2 seconds after DOM rendered
    return () => clearTimeout(timer);
  }, []);
  if (!show) return null;
  return (
    <>
      <CookieConsent />
      <DigitalClockClient />
    </>
  );
}
