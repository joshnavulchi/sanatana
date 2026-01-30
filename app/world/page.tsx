// app/world/page.tsx
import Image from "next/image";
import overlay from "./output-svg.json";
import type { SvgOverlay } from "@/types/geo-svg";
import { OverlaySVG } from "@/app/components/overlaysvg/page";

export default function MapPage() {
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