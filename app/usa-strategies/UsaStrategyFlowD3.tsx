"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';

interface UsaStrategyFlowD3Props {
  readonly mermaidContent: string;
}

interface FlowNode {
  readonly id: string;
  readonly label: string;
}

interface FlowLink {
  readonly source: string;
  readonly target: string;
}

function parseMermaidFlow(mermaidContent: string) {
  const nodeLabels = new Map<string, string>();
  const links: FlowLink[] = [];

  const lines = mermaidContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('flowchart'));

  const edgeRegex = /^(\w+)(?:\[([^\]]+)\])?\s*-->\s*(\w+)(?:\[([^\]]+)\])?/;

  for (const line of lines) {
    const match = line.match(edgeRegex);
    if (!match) continue;

    const [, sourceId, sourceLabel, targetId, targetLabel] = match;

    if (!nodeLabels.has(sourceId)) {
      nodeLabels.set(sourceId, sourceLabel?.trim() || sourceId);
    }
    if (!nodeLabels.has(targetId)) {
      nodeLabels.set(targetId, targetLabel?.trim() || targetId);
    }

    links.push({ source: sourceId, target: targetId });
  }

  const nodes: FlowNode[] = Array.from(nodeLabels.entries()).map(([id, label]) => ({ id, label }));

  return { nodes, links };
}

function wrapLabel(label: string, maxCharsPerLine = 22, maxLines = 3) {
  const words = label.split(/\s+/).filter(Boolean);
  if (!words.length) return [''];

  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxCharsPerLine) {
      current = candidate;
      continue;
    }

    if (current) lines.push(current);
    current = word;

    if (lines.length === maxLines - 1) break;
  }

  if (lines.length < maxLines && current) {
    lines.push(current);
  }

  const joined = words.join(' ');
  const shown = lines.join(' ');
  if (shown.length < joined.length && lines.length) {
    lines[lines.length - 1] = `${lines[lines.length - 1].slice(0, Math.max(0, maxCharsPerLine - 1))}…`;
  }

  return lines.slice(0, maxLines);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function UsaStrategyFlowD3({ mermaidContent }: UsaStrategyFlowD3Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(1100);

  const graph = useMemo(() => parseMermaidFlow(mermaidContent), [mermaidContent]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => {
      setContainerWidth(container.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    const { nodes, links } = graph;
    const BASE_WIDTH = 1200;
    const BASE_HEIGHT = 560;
    const TOP_BOTTOM_MARGIN = 82;

    const svg = d3
      .select(svgElement)
      .attr('viewBox', `0 0 ${BASE_WIDTH} ${BASE_HEIGHT}`)
      .attr('role', 'img')
      .attr('aria-label', 'USA strategies flow chart rendered with D3');

    svg.selectAll('*').remove();

    if (!nodes.length) {
      svg
        .append('text')
        .attr('x', BASE_WIDTH / 2)
        .attr('y', BASE_HEIGHT / 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', 16)
        .attr('fill', '#334155')
        .text('Flow chart data unavailable');
      return;
    }

    const incoming = new Map<string, number>();
    const outgoing = new Map<string, string[]>();

    for (const node of nodes) {
      incoming.set(node.id, 0);
      outgoing.set(node.id, []);
    }

    for (const link of links) {
      incoming.set(link.target, (incoming.get(link.target) ?? 0) + 1);
      const existing = outgoing.get(link.source) ?? [];
      existing.push(link.target);
      outgoing.set(link.source, existing);
    }

    const roots = nodes.filter((node) => (incoming.get(node.id) ?? 0) === 0).map((node) => node.id);
    const queue: string[] = roots.length ? [...roots] : [nodes[0].id];
    const depth = new Map<string, number>();
    queue.forEach((id) => depth.set(id, 0));

    while (queue.length) {
      const current = queue.shift();
      if (!current) break;
      const currentDepth = depth.get(current) ?? 0;
      const children = outgoing.get(current) ?? [];

      for (const child of children) {
        const nextDepth = currentDepth + 1;
        if (!depth.has(child) || nextDepth > (depth.get(child) ?? 0)) {
          depth.set(child, nextDepth);
        }
        queue.push(child);
      }
    }

    for (const node of nodes) {
      if (!depth.has(node.id)) {
        depth.set(node.id, 0);
      }
    }

    const maxDepth = Math.max(...Array.from(depth.values()));
    const levels = d3.range(maxDepth + 1).map((level) =>
      nodes.filter((node) => (depth.get(node.id) ?? 0) === level)
    );

    const maxNodesPerLevel = Math.max(1, ...levels.map((levelNodes) => levelNodes.length));

    const width = Math.max(360, containerWidth || BASE_WIDTH);
    const sideMargin = clamp(Math.round(width * 0.08), 26, 92);
    const slotWidth = (width - sideMargin * 2) / maxNodesPerLevel;
    const nodeWidth = clamp(slotWidth - 16, 118, 208);
    const nodeHeight = 92;
    const levelGap = Math.max(136, nodeHeight + 50);
    const maxCharsPerLine = clamp(Math.floor(nodeWidth / 7.2), 14, 28);

    const height = Math.max(520, (maxDepth + 1) * levelGap + TOP_BOTTOM_MARGIN * 2);

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const positioned = new Map<string, { x: number; y: number; label: string; lines: string[] }>();
    const yScale = d3
      .scaleLinear()
      .domain([0, Math.max(1, maxDepth)])
      .range([TOP_BOTTOM_MARGIN, height - TOP_BOTTOM_MARGIN]);

    levels.forEach((levelNodes, levelIndex) => {
      const xScale = d3
        .scaleLinear()
        .domain([0, Math.max(1, levelNodes.length - 1)])
        .range([sideMargin + nodeWidth / 2, width - sideMargin - nodeWidth / 2]);

      levelNodes.forEach((node, nodeIndex) => {
        positioned.set(node.id, {
          x: xScale(nodeIndex),
          y: yScale(levelIndex),
          label: node.label,
          lines: wrapLabel(node.label, maxCharsPerLine, 4),
        });
      });
    });

    svg
      .append('defs')
      .append('marker')
      .attr('id', 'flow-arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 10)
      .attr('refY', 5)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', '#475569');

    const linksLayer = svg.append('g');
    const nodesLayer = svg.append('g');

    for (const link of links) {
      const source = positioned.get(link.source);
      const target = positioned.get(link.target);
      if (!source || !target) continue;

      const path = d3.path();
      const cy = (source.y + target.y) / 2;
      path.moveTo(source.x, source.y + nodeHeight / 2);
      path.bezierCurveTo(source.x, cy, target.x, cy, target.x, target.y - nodeHeight / 2);

      linksLayer
        .append('path')
        .attr('d', path.toString())
        .attr('fill', 'none')
        .attr('stroke', '#64748b')
        .attr('stroke-width', 1.5)
        .attr('marker-end', 'url(#flow-arrow)');
    }

    for (const node of nodes) {
      const point = positioned.get(node.id);
      if (!point) continue;

      const group = nodesLayer.append('g').attr('transform', `translate(${point.x}, ${point.y})`);

      group
        .append('rect')
        .attr('x', -nodeWidth / 2)
        .attr('y', -nodeHeight / 2)
        .attr('width', nodeWidth)
        .attr('height', nodeHeight)
        .attr('rx', 12)
        .attr('fill', '#f8fafc')
        .attr('stroke', '#cbd5e1')
        .attr('stroke-width', 1.2);

      const text = group
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('font-weight', 600)
        .attr('fill', '#0f172a');

      const lineHeight = 15;
      const startDy = -((point.lines.length - 1) * lineHeight) / 2;
      point.lines.forEach((line, lineIndex) => {
        text
          .append('tspan')
          .attr('x', 0)
          .attr('dy', lineIndex === 0 ? startDy : lineHeight)
          .text(line);
      });

      group.append('title').text(point.label);
    }
  }, [containerWidth, graph]);

  return (
    <div ref={containerRef} className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">
      <svg ref={svgRef} className="h-auto w-full" />
    </div>
  );
}
