import type { Map as MapboxMap, Marker } from 'mapbox-gl'

type LngLat = [number, number]

const R = 6371000 // Earth radius, metres.
const toRad = (deg: number) => (deg * Math.PI) / 180
const toDeg = (rad: number) => (rad * 180) / Math.PI

function haversine(a: LngLat, b: LngLat): number {
  const dLat = toRad(b[1] - a[1])
  const dLng = toRad(a[0] - b[0]) === 0 ? 0 : toRad(b[0] - a[0])
  const lat1 = toRad(a[1])
  const lat2 = toRad(b[1])
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)))
}

// Compass bearing from a to b, degrees clockwise from north.
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
}

// Animate a continuous drive along `coords`: the marker rides the route while
// the camera trails just behind it, always looking in the direction of travel
// (the puck stays pointing "up" as the map rotates, Google-nav style). Returns
// a stop function. The Seattle → Olympic route is far longer than any demo run,
// so this simply keeps moving forward — no looping needed.
export function driveAlong(
  map: MapboxMap,
  getMarker: () => Marker | null,
  coords: LngLat[],
  options: DriveOptions = {},
): () => void {
  const { metersPerSecond = 34, lookaheadMeters = 130, zoom = 15.2, pitch = 60 } = options

  // Cumulative distance to each vertex.
  const cumulative: number[] = [0]
  for (let i = 1; i < coords.length; i++) {
    cumulative.push(cumulative[i - 1] + haversine(coords[i - 1], coords[i]))
  }
  const total = cumulative[cumulative.length - 1]

  // Interpolated point at distance `d` along the route.
  const pointAt = (d: number): LngLat => {
    const clamped = Math.max(0, Math.min(d, total))
    let i = 1
    while (i < cumulative.length && cumulative[i] < clamped) i++
    if (i >= coords.length) return coords[coords.length - 1]
    const segStart = cumulative[i - 1]
    const segLen = cumulative[i] - segStart || 1
    return lerp(coords[i - 1], coords[i], (clamped - segStart) / segLen)
  }

  let travelled = 0
  let raf = 0
  let last = performance.now()
  const maxTravel = Math.max(0, total - lookaheadMeters - 1)

  const frame = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    travelled = Math.min(travelled + metersPerSecond * dt, maxTravel)

    const here = pointAt(travelled)
    const ahead = pointAt(travelled + lookaheadMeters)
    getMarker()?.setLngLat(here)
    map.jumpTo({ center: ahead, bearing: bearing(here, ahead), pitch, zoom })

    if (travelled < maxTravel) raf = requestAnimationFrame(frame)
  }

  raf = requestAnimationFrame(frame)
  return () => cancelAnimationFrame(raf)
}
