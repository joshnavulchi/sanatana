"use client";

import * as d3 from "d3";
import { feature } from "topojson-client";
import { useEffect, useRef } from "react";

export default function IndiaRiversFlow() {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    (async () => { 
      const topo = await fetch("/data/india_adm0.geojson").then(r => r.json());

      const indiaFC = feature(topo, topo.objects.india) as any;   // GeoJSON FeatureCollection
      const riversFC = feature(topo, topo.objects.rivers) as any; // GeoJSON FeatureCollection

      const svg = d3.select(ref.current!);
      const width = 1000, height = 700;
      svg.attr("viewBox", `0 0 ${width} ${height}`);
      svg.selectAll("*").remove();

      const projection = d3.geoMercator()
        .center([82.8, 22.5]) // India center
        .scale(1200)
        .translate([width/2, height/2]);

      const path = d3.geoPath(projection as any);

      // Background
      svg.append("rect").attr("width", width).attr("height", height).attr("fill", "#0b132b");

      const g = svg.append("g");

      // India polygon
      g.append("path")
        .datum(indiaFC.features[0]) // ADM0 single feature
        .attr("d", path as any)
        .attr("fill", "#1b263b")
        .attr("stroke", "#cfe0ff")
        .attr("stroke-width", 0.8);

      // Scales (by Strahler order if present)
      const ord = (f: any) => f.properties?.ORD_STRA ?? f.properties?.RIV_ORD ?? f.properties?.streamorde ?? 3;
      const w = d3.scaleLinear().domain([1, 8]).range([0.6, 3.2]);
      const c = d3.scaleSequential(d3.interpolateBlues).domain([1, 8]);

      // Base rivers
      g.append("g")
        .selectAll("path.river-base")
        .data(riversFC.features)
        .join("path")
        .attr("class", "river-base")
        .attr("d", path as any)
        .attr("fill", "none")
        .attr("stroke", (d: any) => c(ord(d)))
        .attr("stroke-width", (d: any) => w(ord(d)))
        .attr("stroke-opacity", 0.55)
        .attr("stroke-linecap", "round");

      // Flow overlay (moving dashes)
      g.append("g")
        .selectAll("path.river-flow")
        .data(riversFC.features)
        .join("path")
        .attr("class", "river-flow")
        .attr("d", path as any)
        .attr("fill", "none")
        .attr("stroke", (d: any) => c(ord(d)))
        .attr("stroke-width", (d: any) => w(ord(d)) + 0.6)
        .attr("stroke-linecap", "round")
        .attr("stroke-dasharray", "6 10")
        .append("animate")
        .attr("attributeName", "stroke-dashoffset")
        .attr("from", 0)
        .attr("to", -1000)
        .attr("dur", "8s")
        .attr("repeatCount", "indefinite");

      // Zoom/pan
      svg.call(
        d3.zoom<SVGSVGElement, unknown>()
          .scaleExtent([1, 8])
          .on("zoom", (ev) => g.attr("transform", ev.transform)) as any
      );
    })();
  }, []);

  return <svg ref={ref} width="100%" height="680" />;
}