/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
'use client';

import { Suspense, lazy } from 'react';
import Loader from "@/app/components/loader/loader";

const WorldTransitionContent = lazy(() => import('./world-transition-client'));

export default function Page() {
  return (
    <Suspense fallback={
      <div style={{ position: "relative", width: "100%", aspectRatio: "2 / 1", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader />
      </div>
    }>
      <WorldTransitionContent />
    </Suspense>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */