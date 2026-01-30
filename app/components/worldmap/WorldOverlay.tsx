// components/WorldOverlay.tsx
"use client";
type Item = { id: string | number; props: Record<string, unknown>; d: string };
type Doc = { viewBox: string; features: Item[] };

export default function WorldOverlay({ data }: { data: Doc }) {
  return (
    <svg viewBox={data.viewBox} style={{ width: "100%", height: "auto" }}>
      <g fill="#e6e6e6" stroke="#999" strokeWidth={0.5}>
        {data.features.map((f) => (
          <path key={String(f.id)} d={f.d}>
            <title>{String(f.props?.name ?? f.id)}</title>
          </path>
        ))}
      </g>
    </svg>
  );
}