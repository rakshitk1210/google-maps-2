import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { applyGoogleMapsPalette } from '../../shared/googleMapStyle'
import { Alert } from '@mui/material'
import { CAR_START } from './data'
import { drawRoute } from './mapRoute'
import { driveAlong } from './drive'
import { tokens } from './theme'
import './mapMarkers.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const ROUTE_SOURCE_ID = 'carplay-offline-route'
const ROUTE_LAYER_ID = 'carplay-offline-route-line'

// Google-nav puck: a blue chevron with a white outline, pointing up. The map
// rotates under it as the drive follows I-5, so the arrow always reads as
// "forward" (matching the reference screenshot's heading arrow).
const PUCK_SVG = `
<svg class="nav-puck" width="30" height="34" viewBox="0 0 30 34" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 2 L28 30 L15 23 L2 30 Z" fill="${tokens.navPuck}" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round"/>
</svg>`

// Live navigation map for the CarPlay screen: the camera drives north on I-5
// toward Vancouver so the scene reads as moving, not parked. Navigation is
// already active on load, so the route draws immediately in a close-up
// driving view and the camera starts following it.
export function CarPlayMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const stopDriveRef = useRef<(() => void) | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    let map: mapboxgl.Map
    try {
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: CAR_START,
        zoom: 15.2,
        pitch: 60,
        bearing: 0,
        attributionControl: false,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize map')
      return
    }
    mapRef.current = map

    // Google Maps tile palette (design.md §9) over the raw Mapbox style.
    map.on('style.load', () => applyGoogleMapsPalette(map))
    map.on('load', () => {
      map.resize()
      drawRoute(map, ROUTE_SOURCE_ID, ROUTE_LAYER_ID, {
        onError: setError,
        onRoute: (coords) => {
          stopDriveRef.current = driveAlong(map, () => markerRef.current, coords)
        },
      })
    })
    map.on('error', (event) => {
      setError(event.error?.message ?? 'Map failed to load')
    })

    const wrap = document.createElement('div')
    wrap.className = 'car-marker-wrap'
    wrap.innerHTML = PUCK_SVG
    markerRef.current = new mapboxgl.Marker({ element: wrap }).setLngLat(CAR_START).addTo(map)

    return () => {
      stopDriveRef.current?.()
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, [])

  return (
    <>
      <div ref={containerRef} className="map-canvas" />
      {error && (
        <Alert severity="error" sx={{ position: 'absolute', top: '50%', left: 16, right: 16, zIndex: 5 }}>
          Map error: {error}
        </Alert>
      )}
    </>
  )
}
