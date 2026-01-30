/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import type { SvgOverlay } from "@/types/geo-svg";
import { OverlaySVG } from "@/app/components/overlaysvg/page";
import Loader from "@/app/components/loader/loader";

export default function WorldTransitionContent() {
  const [data, setData] = useState<SvgOverlay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load the JSON data asynchronously
    import('./output-svg.json')
      .then((module) => {
        setData(module.default as SvgOverlay);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main style={{ position: "relative", width: "100%", aspectRatio: "2 / 1" }}>
      <Image
        src="/maps/world-2048x1024-equal-earth.png"
        alt="Base world map"
        fill
        sizes="100vw"
        style={{ objectFit: "contain" }}
        priority
      />
      {loading ? (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.8)" }}>
          <Loader />
        </div>
      ) : data ? (
        <div style={{ position: "absolute", inset: 0 }}>
          <OverlaySVG data={data} />
        </div>
      ) : null}
    </main>
  );
}
