/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

/**
 * Web Vitals reporting utility for tracking Core Web Vitals metrics
 * including LCP (Largest Contentful Paint), FID, CLS, FCP, and TTFB.
 * 
 * This utility helps monitor the impact of network dependency optimizations.
 */

export interface WebVitalsMetric {
  id: string;
  name: 'CLS' | 'FCP' | 'LCP' | 'TTFB' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  entries: PerformanceEntry[];
}

export function reportWebVitals(metric: WebVitalsMetric) {
  if (typeof window === 'undefined') return;

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta
    });
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    });

    // Use sendBeacon if available for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', body);
    } else {
      // Fallback to fetch with keepalive
      fetch('/api/analytics', {
        body,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true
      }).catch(() => {
        // Ignore errors in analytics reporting
      });
    }
  }

  // Send to Google Analytics if gtag is available
  const win = window as any;
  if (win.gtag) {
    win.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }
}

/**
 * Monitors resource loading timing to identify dependency chains
 */
export function monitorResourceTiming() {
  if (typeof window === 'undefined' || !window.performance) return;

  window.addEventListener('load', () => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    // Group by resource type
    const byType: Record<string, PerformanceResourceTiming[]> = {};
    resources.forEach(resource => {
      const type = resource.initiatorType;
      if (!byType[type]) byType[type] = [];
      byType[type].push(resource);
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[Resource Timing] Summary:', {
        total: resources.length,
        byType: Object.keys(byType).map(type => ({
          type,
          count: byType[type].length,
          totalDuration: byType[type].reduce((sum, r) => sum + r.duration, 0).toFixed(2) + 'ms'
        }))
      });

      // Identify critical chain resources (those loaded early)
      const criticalResources = resources
        .filter(r => r.startTime < 2000) // First 2 seconds
        .sort((a, b) => a.startTime - b.startTime)
        .slice(0, 10);

      console.log('[Critical Chain] First 10 resources:', 
        criticalResources.map(r => ({
          name: r.name.split('/').pop(),
          type: r.initiatorType,
          start: r.startTime.toFixed(0) + 'ms',
          duration: r.duration.toFixed(0) + 'ms'
        }))
      );
    }
  });
}
