/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
'use client';

import { useEffect } from 'react';
import { reportWebVitals, monitorResourceTiming } from '../../../lib/webVitals';

/**
 * WebVitalsReporter component integrates with next/web-vitals
 * to track and report Core Web Vitals metrics.
 */
export default function WebVitalsReporter() {
  useEffect(() => {
    // Initialize resource timing monitoring
    monitorResourceTiming();

    // Import and setup web-vitals reporting
    // Note: onFID removed as FID has been replaced by INP in web-vitals v3+
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
        onCLS(reportWebVitals);
        onFCP(reportWebVitals);
        onLCP(reportWebVitals);
        onTTFB(reportWebVitals);
        onINP(reportWebVitals);
      }).catch(() => {
        // web-vitals package not installed, skip reporting
      });
    }
  }, []);

  return null;
}
