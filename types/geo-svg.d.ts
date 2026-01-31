export type SvgFeature = {
  id?: string | number;
  d: string;
  properties?: {
    name?: string;
    [key: string]: any;
  } | null;
};

export type SvgOverlay = {
  viewBox: string;
  features: SvgFeature[];
};
