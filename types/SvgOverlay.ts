export interface SvgPathFeature {
  id: string | number;
  props: Record<string, unknown>;
  d: string;
}

export interface SvgOverlayDoc {
  viewBox: string;
  projection: string;
  width: number;
  height: number;
  features: SvgPathFeature[];
}