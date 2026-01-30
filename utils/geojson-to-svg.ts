// scripts/geojson-to-svg.ts
import fs from "node:fs";
import path from "node:path";
import { geoEqualEarth, geoPath as geoPathCore } from "d3-geo";
import type { FeatureCollection, Geometry } from "geojson";
import { feature as topoToFeature } from "topojson-client";
import { presimplify, simplify } from "topojson-simplify";
import { quantize } from "topojson-client";
import { topology } from "topojson-server";

// ---------- Config ----------
const INPUT = path.join(process.cwd(), "utils", "input.geojson");
const OUTPUT = path.join(process.cwd(), "utils", "output-svg.json");

// Desired drawing canvas
const WIDTH = 2048;
const HEIGHT = 1024;

// Choose one projection only:
const projection = geoEqualEarth()
  // const projection = geoRobinson()
  .fitExtent([[0, 0], [WIDTH, HEIGHT]], { type: "Sphere" } as any);

// Build a geoPath with the projection
const pathGen = geoPathCore(projection);

// ---------- Helpers ----------
function toTopoJSON(fc: FeatureCollection) {
  return topology({ layer: fc });
}

function topoSimplify(topo: any, q = 1e5, weight = 0.5) {
  // quantize -> presimplify -> simplify
  const qTopo = quantize(topo, q);
  const pre = presimplify(qTopo);
  const simp = simplify(pre, weight);
  return simp;
}

// ---------- Main ----------
(async () => {
  // Check if input file exists
  if (!fs.existsSync(INPUT)) {
    console.log(`Input file ${INPUT} does not exist. Skipping geo build.`);
    return;
  }
  
  const raw = fs.readFileSync(INPUT, "utf-8");
  const fc: FeatureCollection = JSON.parse(raw);

  // Optional: convert to TopoJSON and simplify (tune Q and weight)
  const topo = toTopoJSON(fc);
  const topoS = topoSimplify(topo, 1e5, 0.02);

  // Back to GeoJSON (merged or per feature as needed)
  const layer = topoS.objects.layer;
  const geo = topoToFeature(topoS, layer) as FeatureCollection;

  // Generate SVG path "d" strings per feature
  const results = geo.features.map((feat, i) => {
    const d = pathGen(feat as any) || ""; // d3 generates path data
    const b = pathGen.bounds(feat as any); // [[x0,y0],[x1,y1]]
    return {
      id: feat.id ?? `feat_${i}`,
      properties: feat.properties ?? {},
      bbox: b,
      d
    };
  });

  // Save with viewBox info to align in the UI
  const out = {
    viewBox: `0 0 ${WIDTH} ${HEIGHT}`,
    projection: "equal-earth", // or "robinson"
    width: WIDTH,
    height: HEIGHT,
    features: results
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(out, null, 2), "utf-8");
  console.log(`Wrote ${OUTPUT} with ${results.length} paths.`);
})();