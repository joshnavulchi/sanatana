"use client";
import dynamic from 'next/dynamic';
import useDeferAssets from '../../../lib/useDeferAssets';

// Dynamically import the heavy client component and disable SSR for it
const DigitalClock = dynamic(() => import('./clockclient'), { ssr: false, loading: () => null });

export default function DigitalClockLoader() {
  const ready = useDeferAssets();
  if (!ready) return null;
  return <DigitalClock />;
}
