import mapboxgl from 'mapbox-gl'
import { tokens } from './theme'

type LngLat = [number, number]

const SOURCE_ID = 'iter17-route'
const LAYER_ID = 'iter17-route-line'

/**
 * Fetch driving directions and draw the route polyline. When the source already
 * exists the GeoJSON is swapped in place via setData — no layer teardown — so
 * rerouting to the café re-draws smoothly instead of flickering. If the
 * Directions API fails, a straight origin→destination line is drawn; the demo
 * must never show a bare map.
 */
export function drawRoute(
  map: mapboxgl.Map,
  origin: LngLat,
  dest: LngLat,
  onRoute?: (coords: LngLat[]) => void,
) {
  const coordString = `${origin.join(',')};${dest.join(',')}`
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordString}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`

  const draw = (coords: LngLat[]) => {
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
      const coords = data.routes?.[0]?.geometry?.coordinates as LngLat[] | undefined
      draw(coords && coords.length >= 2 ? coords : [origin, dest])
    })
    .catch(() => draw([origin, dest]))
}
