"use client";
import { useRef, useEffect } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

const ERA_OPTIONS = [
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

const WORLD_MAP_URL = "/data/countries-110m.json"; // Local TopoJSON world map

const WorldMap = () => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const renderMap = () => {
      let svg = d3.select(ref.current);
      svg.selectAll("*").remove();
      // Responsive full width, taller aspect for full globe
      const width = window.innerWidth;
      const height = Math.max(600, Math.floor(window.innerWidth * 0.55));
      svg.attr("width", width).attr("height", height).attr("viewBox", `0 0 ${width} ${height}`);

      // Natural Earth projection, fit full world vertically
      const projection = d3.geoNaturalEarth1()
        .fitExtent([[0, 0], [width, height]], {type: "Sphere"});
      const path = d3.geoPath().projection(projection);

      // Gradient background
      svg.append("defs")
        .append("linearGradient")
        .attr("id", "bg-gradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "100%")
        .selectAll("stop")
        .data([
          { offset: "0%", color: "#0f2027" },
          { offset: "50%", color: "#2c5364" },
          { offset: "100%", color: "#203a43" }
        ])
        .enter()
        .append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);

      svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "url(#bg-gradient)");

      // Fetch world map
      d3.json(WORLD_MAP_URL).then((world: any) => {
        const countries = topojson.feature(world, world.objects.countries);
        svg
          .append("g")
          .selectAll("path")
          .data(countries.features)
          .enter()
          .append("path")
          .attr("d", path as any)
          .attr("fill", "#a3d9a5")
          .attr("stroke", "#fff")
          .attr("stroke-width", 0.7)
          .attr("opacity", 0.93)
          .style("filter", "drop-shadow(0 2px 8px #0008)")
          .on("mouseover", function () {
            d3.select(this).attr("fill", "#f7b05b").attr("opacity", 1);
          })
          .on("mouseout", function () {
            d3.select(this).attr("fill", "#a3d9a5").attr("opacity", 0.93);
          })
          .on("click", function (event, d: any) {
            alert("Country: " + (d.properties?.name || "Unknown"));
          });
        // Add country/landmass code labels
        svg.append("g")
          .selectAll("text")
          .data(countries.features)
          .enter()
          .append("text")
          .attr("x", (d: any) => {
            const c = path.centroid(d);
            return c[0];
          })
          .attr("y", (d: any) => {
            const c = path.centroid(d);
            return c[1];
          })
          .text((d: any) => d.properties?.iso_a2 || d.properties?.code || d.properties?.name?.slice(0, 3) || "?")
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .attr("font-size", 10)
          .attr("font-weight", 400)
          .attr("fill", "#fff")
          .attr("stroke", "#fff")
          .attr("stroke-width", 0.0)
          .attr("pointer-events", "none");
      });
    };
    renderMap();
    window.addEventListener("resize", renderMap);
    return () => window.removeEventListener("resize", renderMap);
  }, []);

  return (
    <div style={{ width: "100%", minHeight: "600px", margin: 0, padding: 0, overflow: "hidden", position: "relative" }}>
      <svg ref={ref} style={{ width: "100%", height: "auto", display: "block" }} />
    </div>
  );
};

export default WorldMap;