/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
'use client';

import { useState, useEffect } from 'react';
import type { SvgOverlay } from "@/types/geo-svg";
import Loader from "@/app/components/loader/loader";
import BlankWorldMapEqualEarth from "@/app/components/worldmap/WorldMapEqualEarth";
import WorldOverlay from "@/app/components/worldmap/WorldOverlay";

type LocaleIndex = Record<string, any>;

function findWorldTransitionObject(locale: LocaleIndex) {
  // Common possibilities: top-level keys or nested under pages/sections
  if (!locale) return null;
  // direct key variants
  const candidates = [
    'world-transition',
    'worldTransition',
    'world_transition',
    'worldtransition',
  ];

  for (const key of candidates) {
    if (key in locale) return locale[key];
  }

  // search a few likely namespaces
  if (locale.pages && locale.pages['world-transition']) return locale.pages['world-transition'];
  if (locale.sections && locale.sections['world-transition']) return locale.sections['world-transition'];

  // fallback: try to read nav label
  if (locale.others?.nav?.['world-transition']) {
    return { title: locale.others.nav['world-transition'] };
  }

  return null;
}

// Load the heavy map JSON at runtime to avoid bundling/parsing it during initial page load

export default function WorldTransitionContent() {
  const [data, setData] = useState<SvgOverlay | null>(null);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState<LocaleIndex | null>(null);
  const [pageContent, setPageContent] = useState<any>(null);

  useEffect(() => {
    // Fetch locale (en) and the optimized path JSON in parallel
    (async () => {
      try {
        const [locResp, mapResp] = await Promise.all([
          fetch('/locales/en/index.json').catch(() => null),
          fetch('/world-equal-earth-paths.json').catch(() => null),
        ]);

        if (locResp && locResp.ok) {
          const lobj = await locResp.json();
          setLocale(lobj as LocaleIndex);
          const wc = findWorldTransitionObject(lobj as LocaleIndex);
          setPageContent(wc);
        }

        if (mapResp && mapResp.ok) {
          const obj = await mapResp.json();
          setData(obj as SvgOverlay);
        } else {
          // fallback import if public file missing
          try {
            const mod = await import('./../../utils/output-svg.json');
            setData(mod.default as unknown as SvgOverlay);
          } catch (_err) {
            // leave data null
          }
        }
      } catch (e) {
        // ignore; leave defaults
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main style={{ position: "relative", width: "100%", aspectRatio: "2 / 1" }}>
      <header style={{ padding: '1rem 0' }}>
        <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ margin: 0 }}>
            {pageContent?.title ?? locale?.others?.nav?.['world-transition'] ?? 'World Transition'}
          </h1>
          {pageContent?.intro && <p style={{ marginTop: 8 }}>{pageContent.intro}</p>}
          {pageContent?.description && <p style={{ marginTop: 8 }}>{pageContent.description}</p>}
        </div>
      </header>
      {/* <Image
        src="/maps/world-2048x1024-equal-earth.png"
        alt="Base world map"
        fill
        sizes="100vw"
        style={{ objectFit: "contain" }}
        priority
      /> */}

      <BlankWorldMapEqualEarth
        role="img"
        aria-label="World map (Equal Earth)"
        style={{ width: "100%", height: "auto", display: "block" }}
      />

      {loading ? (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.8)" }}>
          <Loader />
        </div>
      ) : data ? (
        <div style={{ position: "absolute", inset: 0 }}>
          {/* <OverlaySVG data={data} /> */}
          <WorldOverlay data={data as any} />
        </div>
      ) : null}
    </main>
  );
}
