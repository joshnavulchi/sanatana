// components/WorldOverlay.tsx
"use client";
type Item = { id: string | number; props: Record<string, unknown>; d: string };
type Doc = { viewBox: string; features: Item[]; width?: number; height?: number };

export default function WorldOverlay({ data }: { data: Doc }) {
  const [minX, minY, vbW, vbH] = data.viewBox.split(/\s+/).map((v) => Number(v));

  return (
    <svg viewBox={data.viewBox} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id="waterGrad" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#9fd7ff" />
          <stop offset="100%" stopColor="#4b9be6" />
        </linearGradient>

        <linearGradient id="landGrad" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#f0f4e6" />
          <stop offset="60%" stopColor="#cfe6b6" />
          <stop offset="100%" stopColor="#9dbb78" />
        </linearGradient>

        <pattern id="trees" patternUnits="userSpaceOnUse" width="24" height="24">
          <rect width="24" height="24" fill="transparent" />
          <circle cx="6" cy="6" r="2.2" fill="#2b7a1f" />
          <circle cx="18" cy="16" r="2" fill="#20621a" />
        </pattern>

        <pattern id="buildings" patternUnits="userSpaceOnUse" width="20" height="20">
          <rect width="20" height="20" fill="transparent" />
          <rect x="3" y="10" width="3" height="4" fill="#cfcfcf" />
          <rect x="9" y="8" width="4" height="6" fill="#bfbfbf" />
          <rect x="15" y="12" width="3" height="3" fill="#d7d7d7" />
        </pattern>

        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0.6" stdDeviation="0.6" floodColor="#000" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* water background */}
      <rect x={minX} y={minY} width={vbW} height={vbH} fill="url(#waterGrad)" />

      {/* land shapes */}
      <g filter="url(#softShadow)" stroke="#65706c" strokeWidth={0.35}>
        {data.features.map((f) => (
          <path
            key={String(f.id)}
            d={f.d}
            fill="url(#landGrad)"
            style={{ transition: 'fill 200ms ease' }}
          >
            <title>{String((f.props && (f.props as any).name) ?? f.id)}</title>
          </path>
        ))}
      </g>

      {/* subtle tree pattern overlay clipped to land for a natural texture */}
      <g fill="url(#trees)" opacity={0.12} pointerEvents="none">
        {data.features.map((f) => (
          <path key={String(f.id) + "-trees"} d={f.d} />
        ))}
      </g>

      {/* faint building pattern in low opacity to hint urban areas */}
      <g fill="url(#buildings)" opacity={0.06} pointerEvents="none">
        {data.features.map((f) => (
          <path key={String(f.id) + "-bldgs"} d={f.d} />
        ))}
      </g>
    </svg>
  );
}