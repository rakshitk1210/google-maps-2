import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { applyGoogleMapsPalette } from '../../shared/googleMapStyle'
import { Alert } from '@mui/material'
import { CAR_START, DRIVE_DEST, type TripPlace } from './tripData'
import { drawRoute } from './mapRoute'
import { driveAlong } from './drive'
import { tokens } from './theme'
import './mapMarkers.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export type Phase = 'driving' | 'preview' | 'navToPlace'

// Google-nav puck: a blue chevron with a white outline, pointing up. The map
// rotates under it as the drive follows the route, so the arrow always reads
// as "forward".
const PUCK_SVG = `
<svg class="nav-puck" width="30" height="34" viewBox="0 0 30 34" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 2 L28 30 L15 23 L2 30 Z" fill="${tokens.navPuck}" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round"/>
</svg>`

// Google-red destination pin (iteration 13's).
const DEST_PIN_SVG = `
<svg width="34" height="44" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z" fill="${tokens.red}"/>
  <circle cx="12" cy="12" r="4.5" fill="#7B1710"/>
</svg>`

interface CarPlayMapProps {
  phase: Phase
  place: TripPlace | null
}

// Live navigation map for the CarPlay screen. On mount the camera drives
// north up 11th Ave NE (navigation is already active). Selecting a place from
// the road-trip panel freezes the drive, swaps the polyline to the frozen
// puck → place leg and fits the camera to it; "Go" resumes the drive along
// that same geometry.
export function CarPlayMap({ phase, place }: CarPlayMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const destMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const stopDriveRef = useRef<(() => void) | null>(null)
  // The previewed leg's geometry, reused by "Go" so it never re-fetches.
  const routeCoordsRef = useRef<[number, number][] | null>(null)
  // Drops stale Directions responses when places switch rapidly (iter 13).
  const seqRef = useRef(0)
  const [mapReady, setMapReady] = useState(false)
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
    // Dev-only handle so demos and browser-pane verification can drive the
    // camera deterministically (iteration 13's pattern).
    if (import.meta.env.DEV) {
      ;(window as unknown as { __iter14Map?: mapboxgl.Map }).__iter14Map = map
    }

    // Google Maps tile palette (design.md §9) over the raw Mapbox style.
    map.on('style.load', () => applyGoogleMapsPalette(map))
    map.on('load', () => {
      map.resize()
      drawRoute(map, CAR_START, DRIVE_DEST, (coords) => {
        // A place may already be previewing if the intro fetch was slow —
        // don't let the intro drive stomp the preview camera.
        if (seqRef.current > 0) return
        stopDriveRef.current = driveAlong(map, () => markerRef.current, coords)
      })
      setMapReady(true)
    })
    map.on('error', (event) => {
      setError(event.error?.message ?? 'Map failed to load')
    })

    const wrap = document.createElement('div')
    wrap.className = 'car-marker-wrap'
    wrap.innerHTML = PUCK_SVG
    markerRef.current = new mapboxgl.Marker({ element: wrap }).setLngLat(CAR_START).addTo(map)

    // The itinerary panel animates this container's width, and this mapbox
    // build only auto-resizes on WINDOW resize — so glue the canvas to the
    // container ourselves, every layout change including transition frames.
    const observer = new ResizeObserver(() => {
      try {
        map.resize()
      } catch {
        // Map torn down mid-callback.
      }
    })
    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
      stopDriveRef.current?.()
      map.remove()
      mapRef.current = null
      markerRef.current = null
      destMarkerRef.current = null
      setMapReady(false)
    }
  }, [])

  // Preview / nav-to-place choreography.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady || !place || phase === 'driving') return
    const seq = ++seqRef.current

    if (phase === 'preview') {
      // Freeze the drive FIRST — driveAlong jumpTo's every frame and would
      // stomp the fitBounds. The puck stays put; it is the leg's origin.
      stopDriveRef.current?.()
      stopDriveRef.current = null
      routeCoordsRef.current = null
      const origin = (markerRef.current?.getLngLat().toArray() ?? CAR_START) as [number, number]

      if (!destMarkerRef.current) {
        const pin = document.createElement('div')
        pin.className = 'dest-pin'
        pin.innerHTML = `<div class="dest-pin-inner">${DEST_PIN_SVG}</div>`
        destMarkerRef.current = new mapboxgl.Marker({ element: pin, anchor: 'bottom' })
          .setLngLat(place.lngLat)
          .addTo(map)
      } else {
        destMarkerRef.current.setLngLat(place.lngLat)
      }

      drawRoute(map, origin, place.lngLat, (coords) => {
        if (seq !== seqRef.current) return
        routeCoordsRef.current = coords
        try {
          const bounds = coords.reduce(
            (b, c) => b.extend(c),
            new mapboxgl.LngLatBounds(coords[0], coords[0]),
          )
          // Left padding clears the 280px directions card; right clears the
          // button column. Flatten to a top-down overview of the leg.
          map.fitBounds(bounds, {
            padding: { top: 40, bottom: 40, left: 300, right: 80 },
            pitch: 0,
            bearing: 0,
            duration: 1000,
          })
        } catch {
          // Map torn down mid-flight.
        }
      })
    } else if (phase === 'navToPlace') {
      const start = (coords: [number, number][]) => {
        stopDriveRef.current?.()
        stopDriveRef.current = driveAlong(map, () => markerRef.current, coords, { zoom: 15.6 })
      }
      if (routeCoordsRef.current && routeCoordsRef.current.length >= 2) {
        start(routeCoordsRef.current)
      } else {
        // "Go" beat the preview fetch — draw the leg first, then drive it.
        const origin = (markerRef.current?.getLngLat().toArray() ?? CAR_START) as [number, number]
        drawRoute(map, origin, place.lngLat, (coords) => {
          if (seq !== seqRef.current) return
          routeCoordsRef.current = coords
          start(coords)
        })
      }
    }
  }, [phase, place, mapReady])

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
