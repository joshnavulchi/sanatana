/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

/**
 * ResourceHints component provides preconnect and dns-prefetch hints
 * to reduce network latency for critical third-party resources.
 * These hints establish early connections to external domains before
 * they are actually needed, reducing DNS, TCP, and TLS overhead.
 */
export default function ResourceHints() {
  return (
    <>
      {/* Preconnect to Google services for analytics/tag manager */}
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      {/* DNS prefetch for additional Google services */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      {/* Preconnect to schema.org for JSON-LD validation */}
      <link rel="dns-prefetch" href="https://schema.org" />
    </>
  );
}
