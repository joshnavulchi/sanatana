declare module 'd3-geo-projection' {
  import { GeoProjection } from 'd3-geo';
  
  export function geoEqualEarth(): GeoProjection;
  export function geoRobinson(): GeoProjection;
  export function geoPath(): any;
}
