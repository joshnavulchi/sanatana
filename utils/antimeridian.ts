// utils/antimeridian.ts
type Pos = [number, number];           // [lon, lat]
type Ring = Pos[];
type Rings = Ring[];

const wrapLon = (lon: number) => {
  // Wrap to [-180, 180]
  const x = ((lon + 180) % 360 + 360) % 360 - 180;
  // collapse -180 and 180 to same canonical value (optional)
  return x === -180 ? 180 : x;
};

function crossesAntimeridian(a: Pos, b: Pos) {
  const dLon = Math.abs(wrapLon(b[0]) - wrapLon(a[0]));
  return dLon > 180;
}

/**
 * Linear interpolation of latitude at lonCut (±180)
 * Assumes nearly-linear segment over small arc (OK at segment scale).
 */
function interpolateAtMeridian(a: Pos, b: Pos, lonCut: number): Pos {
  const [lon1, lat1] = [wrapLon(a[0]), a[1]];
  const [lon2, lat2] = [wrapLon(b[0]), b[1]];

  // adjust longitudes so we always interpolate across the short way
  let L1 = lon1, L2 = lon2;
  if (L2 - L1 > 180) L1 += 360;
  if (L1 - L2 > 180) L2 += 360;

  const t = (lonCut - L1) / (L2 - L1);
  const lat = lat1 + t * (lat2 - lat1);
  // snap lonCut to exactly ±180 canonically
  const lon = lonCut === -180 ? 180 : lonCut;
  return [lon, lat];
}

/**
 * Split a ring/line at the antimeridian into multiple parts,
 * adding vertices at ±180° where segments cross.
 */
export function splitRingAtAntimeridian(coords: Ring): Rings {
  if (coords.length < 2) return [coords];

  const parts: Rings = [];
  let current: Ring = [ [wrapLon(coords[0][0]), coords[0][1]] ];

  for (let i = 1; i < coords.length; i++) {
    const prev = current[current.length - 1];
    const raw = coords[i];
    const pt: Pos = [wrapLon(raw[0]), raw[1]];

    if (!crossesAntimeridian(prev, pt)) {
      current.push(pt);
      continue;
    }

    // Segment crosses the antimeridian → compute the cut(s)
    const lonCut = (prev[0] < 0 && pt[0] > 0) || (prev[0] - pt[0] < -180)
      ? 180 : -180;

    const cutPoint = interpolateAtMeridian(prev, pt, lonCut);

    // Finish current part at cut
    current.push(cutPoint);
    parts.push(current);

    // Start new part at cut (on "other side")
    const nextStart: Pos = [lonCut, cutPoint[1]];
    const nextPoint: Pos = [pt[0] < 0 ? pt[0] + 360 : (pt[0] > 0 ? pt[0] - 360 : pt[0]), pt[1]];

    current = [ nextStart, nextPoint ];
  }

  parts.push(current);
  return parts;
}