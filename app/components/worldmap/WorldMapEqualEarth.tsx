// src/components/WorldMapEqualEarth.tsx
import * as React from "react";

type Props = React.SVGProps<SVGSVGElement> & {
  title?: string;
  desc?: string;
};

export default function WorldMapEqualEarth({ title = "World map (Equal Earth)", desc, ...rest }: Props) {
  return (
    <svg
      viewBox="0 0 2048 997"
      role="img"
      aria-label={title}
      {...rest}
    // Tip: width/height controlled by parent (use CSS or inline style)
    >
      {desc ? <desc>{desc}</desc> : null}

      {/* 
        --- Paste only the <path>/<g> elements from your SVG below ---
        For brevity, here’s a tiny example group. Replace with the full paths
        from your downloaded SVG to render the entire world.
      */}
      <g id="land">
        <path d="M 180 470 L 220 470 L 230 490 L 185 495 Z" fill="#e6e6e6" stroke="#999" strokeWidth="0.5" />
        {/* ... ALL other country shapes from the SVG ... */}
      </g>
    </svg>
  );
}