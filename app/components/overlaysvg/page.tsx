"use client";

import * as React from "react";
import type { SvgOverlay } from "@/types/geo-svg";

export function OverlaySVG({ data, fill = "#1f77b4", fillOpacity = 0.35 }: {
  data: SvgOverlay;
  fill?: string;
  fillOpacity?: number;
}) {
  return (
    <svg
      viewBox={data.viewBox}
      role="img"
      aria-label="Geographic overlay"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <desc>SVG overlay generated from GeoJSON using D3‑Geo projection.</desc>
      {data.features.map(f => (
        <path
          key={String(f.id)}
          d={f.d}
          fill={fill}
          fillOpacity={fillOpacity}
          stroke="#111"
          strokeWidth={0.75}
          strokeOpacity={0.8}
        >
          <title>{String(f.properties?.name ?? f.id)}</title>
        </path>
      ))}
    </svg>
  );
}