import mapboxgl from 'mapbox-gl'
import { CAFES, CAR_POSITION, MOUNT_RAINIER } from './jamData'
import type { RouteTarget } from './jamData'
import { tokens } from './theme'

interface DrawOptions {
  // Ease the camera to frame the whole route (used when the target changes, so
  // the re-route reads clearly). Left off for the initial close-up nav view.
  fit?: boolean
  fitPadding?: number
  onError?: (message: string) => void
}

// Fetch driving directions from the car to the active target and (re)draw the
// route polyline. Shared by the CarPlay and phone navigation maps so both stay
// in sync. The async body is guarded because the map may unmount mid-flight.
export function drawJamRoute(
  map: mapboxgl.Map,
  sourceId: string,
  layerId: string,
  target: RouteTarget,
  options: DrawOptions = {},
) {
  const destination = target === 'cafe' ? CAFES[0].lngLat : MOUNT_RAINIER
  const coordString = `${CAR_POSITION.join(',')};${destination.join(',')}`
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
        if (options.fit) {
          const bounds = new mapboxgl.LngLatBounds()
          for (const coord of route.geometry.coordinates as [number, number][]) {
            bounds.extend(coord)
          }
          map.fitBounds(bounds, { padding: options.fitPadding ?? 60, duration: 1200 })
        }
      } catch {
        // Map was removed while the request was in flight — nothing to draw.
      }
    })
    .catch((err) => {
      options.onError?.(err instanceof Error ? err.message : 'Failed to load driving directions')
    })
}
