import mapboxgl from 'mapbox-gl'
import { FALLBACK_ROUTE } from './jamTripData'
import { tokens } from './theme'

const SOURCE_ID = 'iter10-route'
const LAYER_ID = 'iter10-route-line'

// Fetch driving directions and draw the route polyline (iteration 9's
// drawTripRoute with the origin parameterized too). When the source already
// exists the GeoJSON is swapped in place via setData — no layer teardown — so
// switching destinations after a match re-draws smoothly instead of
// flickering. If the Directions API fails, the hand-plotted I-5 spine is
// drawn; the demo must never show a bare map.
export function drawJamRoute(
  map: mapboxgl.Map,
  origin: [number, number],
  dest: [number, number],
  onRoute?: (coords: [number, number][]) => void,
) {
  const coordString = `${origin.join(',')};${dest.join(',')}`
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordString}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`

  const draw = (coords: [number, number][]) => {
    try {
      const data = {
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: coords },
      } as const
      const source = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource | undefined
      if (source) {
        source.setData(data)
      } else {
        map.addSource(SOURCE_ID, { type: 'geojson', data })
        map.addLayer({
          id: LAYER_ID,
          type: 'line',
          source: SOURCE_ID,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          // design.md §6.13 — active nav polyline is --route at 10px.
          paint: { 'line-color': tokens.route, 'line-width': 10, 'line-opacity': 0.95 },
        })
      }
      onRoute?.(coords)
    } catch {
      // Map was removed while the request was in flight — nothing to draw.
    }
  }

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const coords = data.routes?.[0]?.geometry?.coordinates as [number, number][] | undefined
      draw(coords && coords.length >= 2 ? coords : FALLBACK_ROUTE)
    })
    .catch(() => draw(FALLBACK_ROUTE))
}
