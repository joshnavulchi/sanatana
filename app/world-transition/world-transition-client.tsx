/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
'use client';

import { useState, useEffect } from 'react';
import type { SvgOverlay } from "@/types/geo-svg";
import Loader from "@/app/components/loader/loader";
import BlankWorldMapEqualEarth from "@/app/components/worldmap/WorldMapEqualEarth";
import WorldOverlay from "@/app/components/worldmap/WorldOverlay";

// Load the heavy map JSON at runtime to avoid bundling/parsing it during initial page load

export default function WorldTransitionContent() {
  const [data, setData] = useState<SvgOverlay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the optimized path JSON from the public folder (served statically)
    (async () => {
      try {
        const resp = await fetch('/world-equal-earth-paths.json');
        if (!resp.ok) throw new Error('Failed to fetch');
        const obj = await resp.json();
        setData(obj as SvgOverlay);
      } catch (e) {
        // fallback: attempt dynamic import if public file missing
        try {
          const mod = await import('./../../utils/output-svg.json');
          setData(mod.default as unknown as SvgOverlay);
        } catch (_err) {
          // leave data null
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main style={{ position: "relative", width: "100%", aspectRatio: "2 / 1" }}>
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
