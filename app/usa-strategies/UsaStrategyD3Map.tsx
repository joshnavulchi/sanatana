

import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';

interface MapPoint {
  readonly name?: string;
  readonly iso3?: string;
  readonly lat?: number;
  readonly lon?: number;
  readonly group?: string;
}

interface MapVisualization {
  readonly description?: string;
  readonly categories?: Record<string, string>;
}

interface UsaStrategyD3MapProps {
  readonly points: readonly MapPoint[];
  readonly mapVisualization?: MapVisualization;
  readonly className?: string;
}

interface TopologyLike {
  readonly type: string;
  readonly objects: Record<string, unknown>;
}

const CATEGORY_COLORS: Record<string, string> = {
  LATAM_SANCTIONS_INTERVENTIONS: '#ef4444',
  ASIA_WARS_OCCUPATIONS: '#0ea5e9',
  ALLIES_MINILATERALS: '#10b981',
};

const FALLBACK_COLOR = '#6366f1';

function getCategoryColor(group?: string) {
  if (!group) return FALLBACK_COLOR;
  return CATEGORY_COLORS[group] ?? FALLBACK_COLOR;
}

export default function UsaStrategyD3Map({
  points,
  mapVisualization,
  className,
}: UsaStrategyD3MapProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [loadError, setLoadError] = useState<string>('');

  const legendEntries = useMemo(() => {
    const categories = mapVisualization?.categories ?? {};
    return Object.entries(categories).map(([key, label]) => ({
      key,
      label,
      color: getCategoryColor(key),
    }));
  }, [mapVisualization]);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const width = 1100;
    const height = 560;
    const margin = 24;

    const drawMap = async () => {
      try {
        setLoadError('');

        const response = await fetch('/data/countries-110m.json');
        if (!response.ok) {
          throw new Error('Unable to load map topology');
        }

        const topology = (await response.json()) as TopologyLike;
        const objectKey =
          Object.prototype.hasOwnProperty.call(topology.objects, 'countries')
            ? 'countries'
            : Object.keys(topology.objects)[0];

        if (!objectKey) {
          throw new Error('Map topology does not contain objects');
        }

        const geoData = feature(
          topology as never,
          topology.objects[objectKey] as never
        ) as GeoJSON.FeatureCollection;

        const projection = d3
          .geoNaturalEarth1()
          .fitExtent(
            [
              [margin, margin],
              [width - margin, height - margin],
            ],
            geoData
          );

        const geoPath = d3.geoPath(projection);

        const svg = d3
          .select(svgEl)
          .attr('viewBox', `0 0 ${width} ${height}`)
          .attr('role', 'img')
          .attr('aria-label', 'World map showing USA strategy focus regions');

        svg.selectAll('*').remove();

        svg
          .append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', width)
          .attr('height', height)
          .attr('fill', '#f8fafc');

        const graticule = d3.geoGraticule10();
        svg
          .append('path')
          .datum(graticule)
          .attr('d', geoPath)
          .attr('fill', 'none')
          .attr('stroke', '#e2e8f0')
          .attr('stroke-width', 0.6)
          .attr('opacity', 0.8);

        svg
          .append('g')
          .selectAll('path')
          .data(geoData.features)
          .join('path')
          .attr('d', geoPath)
          .attr('fill', '#eef2ff')
          .attr('stroke', '#94a3b8')
          .attr('stroke-width', 0.45);

        const dotsLayer = svg.append('g');

        points.forEach((point) => {
          if (typeof point.lat !== 'number' || typeof point.lon !== 'number') return;
          const projected = projection([point.lon, point.lat]);
          if (!projected) return;

          const [x, y] = projected;
          const color = getCategoryColor(point.group);

          dotsLayer
            .append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', 5.5)
            .attr('fill', color)
            .attr('fill-opacity', 0.9)
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 1.5)
            .append('title')
            .text(`${point.name ?? 'Unknown'} (${point.group ?? 'Uncategorized'})`);

          dotsLayer
            .append('text')
            .attr('x', x + 7)
            .attr('y', y - 7)
            .attr('font-size', 10)
            .attr('font-weight', 600)
            .attr('fill', '#0f172a')
            .text(point.iso3 ?? '');
        });
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : 'Failed to render world map');
      }
    };

    void drawMap();
  }, [points]);

  return (
    <div className={className}>
      {mapVisualization?.description ? (
        <p className="text-sm text-slate-600 md:text-base">{mapVisualization.description}</p>
      ) : null}

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <svg ref={svgRef} className="h-auto w-full" />
      </div>

      {loadError ? <p className="mt-3 text-sm text-rose-600">{loadError}</p> : null}

      {legendEntries.length ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {legendEntries.map((entry) => (
            <div
              key={entry.key}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
            >
              <span className="inline-flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                  aria-hidden="true"
                />
                <span className="font-semibold">{entry.key}</span>
              </span>
              <p className="mt-1 text-xs text-slate-600">{entry.label}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
