/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
import { Metadata } from 'next';
import Image from "next/image";
import overlay from "./output-svg.json";
import type { SvgOverlay } from "@/types/geo-svg";
import { OverlaySVG } from "@/app/components/overlaysvg/page";

export const metadata: Metadata = {
  title: 'World Transition Map',
  description: 'Interactive world map visualization',
};

export default function Page() {
  const data = overlay as SvgOverlay;
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
      <div style={{ position: "absolute", inset: 0 }}>
        <OverlaySVG data={data} />
      </div>
    </main>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */