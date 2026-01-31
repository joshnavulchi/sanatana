import fs from "node:fs";
import path from "node:path";

import { geoPath, geoEqualEarth } from "d3-geo";
import { topology } from "topojson-server";
import { feature as topoToFeature } from "topojson-client";
import { quantize } from "topojson-client";
import { presimplify, simplify, quantile } from "topojson-simplify";

import type { FeatureCollection } from "geojson";

// ---------- Config ----------
const INPUT = path.join(process.cwd(), "utils", "world.geojson");
const OUTPUT = path.join(process.cwd(), "public", "world-equal-earth-paths.json");

// Match the Equal Earth base viewBox you use elsewhere
const WIDTH = 2048;
const HEIGHT = 997;

(async () => {
  if (!fs.existsSync(INPUT)) {
    console.error(`✗ Missing input: ${INPUT}`);
    process.exit(1);
  }

  // 1) Read GeoJSON (WGS84 / EPSG:4326)
  const raw = fs.readFileSync(INPUT, "utf-8");
  const fc: FeatureCollection = JSON.parse(raw);

  // 2) Build topology
  const topo = topology({ layer: fc });

  // 3) Optional: quantize to reduce size (adjust grid size if needed)
  // `topo` can carry `null` properties which the topojson typings don't accept
  // for some helper functions — cast to `any` here to avoid a strict type error.
  const topoQ = quantize(topo as any, 1e5);

  // 4) Presimplify → choose min weight by quantile → simplify
  const topoP = presimplify(topoQ);
  const minW = quantile(topoP, 0.02); // keep the ~98% most significant points
  const topoS = simplify(topoP, minW);

  // 5) Back to GeoJSON
  const geo = topoToFeature(topoS, topoS.objects.layer) as FeatureCollection;

  // 6) Projection: Equal Earth (from d3-geo) fitted to canvas
  const projection = geoEqualEarth().fitExtent([[0, 0], [WIDTH, HEIGHT]], { type: "Sphere" } as any);
  const pathGen = geoPath(projection);

  // 7) SVG path strings
  const features = geo.features.map((f, i) => ({
    id: f.id ?? `feat_${i}`,
    props: f.properties ?? {},
    d: pathGen(f as any) || ""
  }));

  // 8) Write JSON your Next.js page can render
  const out = {
    viewBox: `0 0 ${WIDTH} ${HEIGHT}`,
    projection: "equal-earth",
    width: WIDTH,
    height: HEIGHT,
    features
  };

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(out, null, 2), "utf-8");
  console.log(`✓ Wrote ${OUTPUT} with ${features.length} paths`);
})();