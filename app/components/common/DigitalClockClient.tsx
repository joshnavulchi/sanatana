"use client";
import dynamic from 'next/dynamic';

const DigitalClock = dynamic(() => import('./DigitalClock'), { ssr: false });

export default function DigitalClockClient() {
  return <DigitalClock />;
}
