import mapboxgl from 'mapbox-gl'
import { CAR_START, VANCOUVER } from './data'
import { tokens } from './theme'

type LngLat = [number, number]

interface DrawOptions {
  onError?: (message: string) => void
  // Handed the full route geometry so the caller can animate the drive along it.
  onRoute?: (coords: LngLat[]) => void
}

// Fetch driving directions from Seattle up I-5 to Vancouver and draw the route
// polyline. The async body is guarded because the map may unmount mid-flight.
export function drawRoute(
  map: mapboxgl.Map,
  sourceId: string,
  layerId: string,
  options: DrawOptions = {},
) {
  const coordString = `${CAR_START.join(',')};${VANCOUVER.join(',')}`
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordString}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const route = data.routes?.[0]
      if (!route?.geometry) return
      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId)
        if (map.getSource(sourceId)) map.removeSource(sourceId)
        map.addSource(sourceId, {
          type: 'geojson',
          data: { type: 'Feature', properties: {}, geometry: route.geometry },
        })
        map.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          // design.md §6.13 — active nav polyline is --route at 10px.
          paint: { 'line-color': tokens.route, 'line-width': 10, 'line-opacity': 0.95 },
        })
        options.onRoute?.(route.geometry.coordinates as LngLat[])
      } catch {
        // Map was removed while the request was in flight — nothing to draw.
      }
    })
    .catch((err) => {
      options.onError?.(err instanceof Error ? err.message : 'Failed to load driving directions')
    })
}
