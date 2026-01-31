export interface SvgPathFeature {
  id: string | number;
  properties: Record<string, unknown>;
  bbox: [[number, number], [number, number]];
  d: string;
}
export interface SvgOverlay {
  viewBox: string;
  projection: "equal-earth" | "robinson" | string;
  width: number;
  height: number;
  features: SvgPathFeature[];
}