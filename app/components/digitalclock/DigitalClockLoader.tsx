"use client";
import dynamic from 'next/dynamic';
import useDeferAssets from '@lib/useDeferAssets';
import { useLocale } from '@app/context/locale-context';

// Dynamically import the heavy client component and disable SSR for it
const DigitalClock = dynamic(() => import('./clockclient'), { ssr: false, loading: () => null });

export default function DigitalClockLoader() {
  const ready = useDeferAssets();
  const { isLoading } = useLocale();

  // Delay rendering the clock until non-critical assets are safe to load
  // and the current page locale has finished loading. This avoids
  // hydration mismatches caused by client-only time-dependent markup.
  if (!ready || isLoading) return null;
  return <DigitalClock />;
}
