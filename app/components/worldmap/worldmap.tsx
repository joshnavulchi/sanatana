"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

// Add a style tag for responsive label hiding
const labelStyle = `
  @media (max-width: 600px) {
    .wm-country-label { display: none !important; }
  }
`;

const ERA_OPTIONS = [
  {
    label: "Modern (Present Day)",
    value: "modern",
    file: "/data/countries-110m.json"
  },
  {
    label: "750 million years ago (Cryogenian)",
    value: "cryogenian",
    file: "/data/cryogenian-750m.json"
  },
  {
    label: "240 million years ago (Pangea)",
    value: "pangea",
    file: "/data/pangea-240m.json"
  },
  {
    label: "120 million years ago (Cretaceous)",
    value: "cretaceous",
    file: "/data/cretaceous-120m.json"
  },
  {
    label: "66 million years ago (Post-dinosaur)",
    value: "postdinosaur",
    file: "/data/postdinosaur-66m.json"
  },
];

function pickGeometryObject(world: any) {
  if (!world?.objects) return null;

  // Preferred keys if present
  const preferred = ["countries", "landmasses", "land", "land_750Ma_schematic", "land_240Ma_schematic", "land_120Ma_schematic", "land_66Ma_schematic"];
  for (const key of preferred) {
    if (world.objects[key]) return world.objects[key];
  }

  // Otherwise, pick the first GeometryCollection
  const firstGC = Object.values(world.objects).find(
    (o: any) => o && o.type === "GeometryCollection"
  );
  return firstGC || null;
}

const WorldMap = () => {
  const ref = useRef<SVGSVGElement>(null);
  const [era, setEra] = useState('modern');
  const [error, setError] = useState<string | null>(null);

  // Render routine split so we can reuse on resize without resetting era
  const render = useCallback((features: any[], width: number, height: number) => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height).attr("viewBox", `0 0 ${width} ${height}`);

    // Background gradient
    const defs = svg.append("defs");
    const lg = defs.append("linearGradient").attr("id", "bg-gradient")
      .attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "100%");
    lg.selectAll("stop").data([
      { offset: "0%", color: "#0f2027" },
      { offset: "50%", color: "#2c5364" },
      { offset: "100%", color: "#203a43" },
    ]).enter().append("stop")
      .attr("offset", d => d.offset).attr("stop-color", d => d.color);

    svg.append("rect").attr("width", width).attr("height", height).attr("fill", "url(#bg-gradient)");
    const projection = d3.geoNaturalEarth1().fitExtent([[0, 0], [width, height]], { type: "Sphere" });
    const path = d3.geoPath().projection(projection);

    // Land/ country paths
    svg.append("g")
      .selectAll("path")
      .data(features)
      .enter()
      .append("path")
      .attr("d", path as any)
      .attr("fill", "#a3d9a5")
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.1)
      .attr("opacity", 0.93)
      .style("filter", "drop-shadow(0 2px 8px #0008)")
      .on("mouseover", function () { d3.select(this).attr("fill", "#f7b05b").attr("opacity", 1); })
      .on("mouseout", function () { d3.select(this).attr("fill", "#a3d9a5").attr("opacity", 0.93); });

    // Labels (best-effort centroid)
    svg.append("g")
      .selectAll("text")
      .data(features)
      .enter()
      .append("text")
      .attr("class", "wm-country-label")
      .attr("x", d => path.centroid(d as any)[0])
      .attr("y", d => path.centroid(d as any)[1])
      .text((d: any) => d.properties?.iso_a2 || d.properties?.code || d.properties?.name?.slice(0, 2) || "?")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("font-size", 10)
      .attr("font-weight", 400)
      .attr("fill", "#fff")
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.0)
      .attr("pointer-events", "none");
  }, []);

  useEffect(() => {
    let aborter = new AbortController();
    setError(null);
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    // Recompute size on each render (era change or resize)
    const width = window.innerWidth;
    const height = Math.max(400, Math.floor(window.innerWidth * 0.55));
    const eraFile = ERA_OPTIONS.find(e => e.value === era)?.file;
    if (!eraFile) {
      setError("No dataset configured for this era.");
      return;
    }
    (async () => {
      try {
        const world: any = await d3.json(eraFile, { signal: aborter.signal } as any);
        if (!world?.objects) {
          setError("No map data found. Missing `objects` in TopoJSON.");
          return;
        }
        const obj = pickGeometryObject(world);
        if (!obj) {
          setError("Could not find a GeometryCollection in this TopoJSON.");
          return;
        }
        const feat = topojson.feature(world, obj);
        const features = (feat as any)?.features ?? [];
        if (!features.length) {
          setError("No features found in this TopoJSON object.");
          return;
        }
        render(features, width, height);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          setError("Could not load map data for this era. File may be missing or invalid.");
        }
      }
    })();
    const onResize = () => {
      // re-render the most recent data by refetching (simplest)
      aborter.abort(); // cancel in-flight
      aborter = new AbortController();
      // trigger a rerun by updating width/height route:
      // simplest approach: call the effect again by toggling a dummy state
      // or refetch directly; here we refetch again:
      const width = window.innerWidth;
      const height = Math.max(400, Math.floor(window.innerWidth * 0.55));
      const eraFile = ERA_OPTIONS.find(e => e.value === era)?.file;
      if (!eraFile) return;
      d3.json(eraFile, { signal: aborter.signal } as any)
        .then((world: any) => {
          if (!world?.objects) return;
          const obj = pickGeometryObject(world);
          if (!obj) return;
          const feat = topojson.feature(world, obj);
          const features = (feat as any)?.features ?? [];
          if (features.length) render(features, width, height);
        })
        .catch(() => { /* ignore aborted/resize errors */ });
    };
    window.addEventListener("resize", onResize);
    return () => {
      aborter.abort();
      window.removeEventListener("resize", onResize);
    };
  }, [era, render]);

  return (
    <div className="w-full min-h-[200px] m-0 p-0 overflow-hidden relative">
      <style>{labelStyle}</style>
      <div className="absolute top-5 left-0 z-10 bg-white/90 rounded-sm px-3 py-1 mx-3 shadow-md">
        <label htmlFor="era-select" className="text-sm font-semibold mr-2">Geological Era:</label>
        <select id="era-select" value={era} onChange={e => setEra(e.target.value)} className="text-sm px-2 py-1 rounded">
          {ERA_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <svg ref={ref} className="w-full h-auto block" />
      {error && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-95 text-red-700 px-4 py-3 rounded shadow-lg font-semibold text-base z-50">
          {error}
        </div>
      )}
    </div>
  );
};

export default WorldMap;