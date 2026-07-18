import mapboxgl from 'mapbox-gl'
import { DESTINATION, FALLBACK_ROUTE, PUCK_POSITION } from './navData'
import { tokens } from './theme'

// Fetch driving directions from the stuck car to the destination up
// 11th Ave NE and draw the route polyline (iteration 6's drawJamRoute,
// adapted). If the Directions API fails, the hand-plotted FALLBACK_ROUTE is
// drawn instead — the demo must never show a bare map. The resolved
// coordinates are passed to onRoute so the caller can aim the nav puck.
export function drawNavRoute(
  map: mapboxgl.Map,
  sourceId: string,
  layerId: string,
  onRoute?: (coords: [number, number][]) => void,
) {
  const coordString = `${PUCK_POSITION.join(',')};${DESTINATION.join(',')}`
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordString}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`

  const draw = (coords: [number, number][]) => {
    try {
      if (map.getLayer(layerId)) map.removeLayer(layerId)
      if (map.getSource(sourceId)) map.removeSource(sourceId)
      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: coords },
        },
      })
      map.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        // design.md §6.13 — active nav polyline is --route at 10px; red here
        // to signal the heavy traffic on the road ahead.
        paint: { 'line-color': tokens.route, 'line-width': 10, 'line-opacity': 0.95 },
      })
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
