"use client";

import dynamic from 'next/dynamic';

const DripIrrigation = dynamic(() => import('./dripirrigation'), {
  ssr: false,
});

export default function DripIrrigationClient() {
  return <DripIrrigation />;
}
