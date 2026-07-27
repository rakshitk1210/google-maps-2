import type { Map as MapboxMap, Marker } from 'mapbox-gl'

type LngLat = [number, number]

const R = 6371000 // Earth radius, metres.
const toRad = (deg: number) => (deg * Math.PI) / 180
const toDeg = (rad: number) => (rad * 180) / Math.PI

function haversine(a: LngLat, b: LngLat): number {
  const dLat = toRad(b[1] - a[1])
  const dLng = toRad(b[0] - a[0])
  const lat1 = toRad(a[1])
  const lat2 = toRad(b[1])
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)))
}

/** Compass bearing from a to b, degrees clockwise from north. */
function bearing(a: LngLat, b: LngLat): number {
  const lat1 = toRad(a[1])
  const lat2 = toRad(b[1])
  const dLng = toRad(b[0] - a[0])
  const y = Math.sin(dLng) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

const lerp = (a: LngLat, b: LngLat, t: number): LngLat => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
]

interface DriveOptions {
  metersPerSecond?: number
  lookaheadMeters?: number
  zoom?: number
  pitch?: number
  /**
   * Resume point. Iteration 14's drive always restarted from zero because it
   * only ever stopped for good; here the billboard pauses the drive mid-route
   * and the user can dismiss without rerouting, so the trip has to pick up
   * exactly where it left off rather than teleporting back to the start.
   */
  startAtMeters?: number
  /** Fires each frame with distance travelled, so the caller can bank it. */
  onProgress?: (metersTravelled: number) => void
}

export interface DriveHandle {
  /** Cancels the rAF loop. The puck stays wherever it stopped. */
  stop: () => void
  /** Distance covered so far — feed back in as startAtMeters to resume. */
  travelled: () => number
}

/**
 * Animate a continuous drive along `coords`: the marker rides the route while
 * the camera trails just behind it, always looking in the direction of travel,
 * so the puck holds its place on screen and the road ticks past underneath
 * (Google-nav style). Ported from iteration 14's CarPlay drive and extended
 * with resume support.
 */
export function driveAlong(
  map: MapboxMap,
  getMarker: () => Marker | null,
  coords: LngLat[],
  options: DriveOptions = {},
): DriveHandle {
  const {
    metersPerSecond = 22,
    lookaheadMeters = 130,
    zoom = 15.2,
    pitch = 60,
    startAtMeters = 0,
    onProgress,
  } = options

  // Cumulative distance to each vertex.
  const cumulative: number[] = [0]
  for (let i = 1; i < coords.length; i++) {
    cumulative.push(cumulative[i - 1] + haversine(coords[i - 1], coords[i]))
  }
  const total = cumulative[cumulative.length - 1]

  /** Interpolated point at distance `d` along the route. */
  const pointAt = (d: number): LngLat => {
    const clamped = Math.max(0, Math.min(d, total))
    let i = 1
    while (i < cumulative.length && cumulative[i] < clamped) i++
    if (i >= coords.length) return coords[coords.length - 1]
    const segStart = cumulative[i - 1]
    const segLen = cumulative[i] - segStart || 1
    return lerp(coords[i - 1], coords[i], (clamped - segStart) / segLen)
  }

  const maxTravel = Math.max(0, total - lookaheadMeters - 1)
  let travelled = Math.min(startAtMeters, maxTravel)
  let raf = 0
  let last = performance.now()

  const place = () => {
    const here = pointAt(travelled)
    const ahead = pointAt(travelled + lookaheadMeters)
    getMarker()?.setLngLat(here)
    map.jumpTo({ center: ahead, bearing: bearing(here, ahead), pitch, zoom })
  }

  const frame = (now: number) => {
    // Cap dt so a backgrounded tab doesn't teleport the puck down the road.
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    travelled = Math.min(travelled + metersPerSecond * dt, maxTravel)
    place()
    onProgress?.(travelled)
    if (travelled < maxTravel) raf = requestAnimationFrame(frame)
  }

  // Seat the camera before the first frame so a resume doesn't flash the old
  // position for a beat.
  place()
  raf = requestAnimationFrame(frame)

  return {
    stop: () => cancelAnimationFrame(raf),
    travelled: () => travelled,
  }
}

/**
 * The point `metres` along a route, plus the bearing of travel there.
 *
 * Roadside furniture has to be positioned off the real geometry rather than a
 * hand-picked coordinate: this route curves, so a point projected along a fixed
 * compass bearing from the origin drifts well off the carriageway and out of
 * frame.
 */
export function pointAlongRoute(
  coords: LngLat[],
  metres: number,
): { point: LngLat; bearing: number } {
  if (coords.length < 2) return { point: coords[0] ?? [0, 0], bearing: 0 }

  let covered = 0
  for (let i = 1; i < coords.length; i++) {
    const seg = haversine(coords[i - 1], coords[i])
    if (covered + seg >= metres) {
      const t = seg === 0 ? 0 : (metres - covered) / seg
      return { point: lerp(coords[i - 1], coords[i], t), bearing: bearing(coords[i - 1], coords[i]) }
    }
    covered += seg
  }
  const last = coords.length - 1
  return { point: coords[last], bearing: bearing(coords[last - 1], coords[last]) }
}

/** Shift a point `metres` along a compass bearing — used to set the billboard beside the road. */
export function offsetPoint(point: LngLat, bearingDeg: number, metres: number): LngLat {
  const rad = toRad(bearingDeg)
  const dLat = (metres * Math.cos(rad)) / R
  const dLng = (metres * Math.sin(rad)) / (R * Math.cos(toRad(point[1])))
  return [point[0] + toDeg(dLng), point[1] + toDeg(dLat)]
}
