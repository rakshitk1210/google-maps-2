import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Alert, Box } from '@mui/material'
import { applyGoogleMapsPalette } from '../../shared/googleMapStyle'
import { LocationPuck } from './LocationPuck'
import { NavPuck } from './NavPuck'
import { drawTripRoute } from './mapRoute'
import {
  FALLBACK_ROUTE,
  fallbackToDest,
  NAV_ZOOM,
  SEATTLE_ORIGIN,
  STOPS,
  type NavDestination,
  stopMarkerPhoto,
} from './roadTripData'
import { tokens } from './theme'
import './mapMarkers.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export type MapPhase = 'preview' | 'nav'

// Google-red destination pin (Vancouver).
const DEST_PIN_SVG = `
<svg width="34" height="44" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z" fill="${tokens.red}"/>
  <circle cx="12" cy="12" r="4.5" fill="#7B1710"/>
</svg>`

/** Compass bearing (deg) of a route's first leg — iteration 8's formula. */
function firstLegBearing(coords: [number, number][]): number {
  const [a, b] = [coords[0], coords[1]]
  const dx = (b[0] - a[0]) * Math.cos((a[1] * Math.PI) / 180)
  const dy = b[1] - a[1]
  return (Math.atan2(dx, dy) * 180) / Math.PI
}

/** Point roughly `meters` along the route, for the nav camera to look ahead. */
function pointAlongRoute(coords: [number, number][], meters: number): [number, number] {
  const M_PER_DEG = 111_320
  let traveled = 0
  for (let i = 1; i < coords.length; i++) {
    const [ax, ay] = coords[i - 1]
    const [bx, by] = coords[i]
    const dx = (bx - ax) * Math.cos((ay * Math.PI) / 180) * M_PER_DEG
    const dy = (by - ay) * M_PER_DEG
    traveled += Math.hypot(dx, dy)
    if (traveled >= meters) return coords[i]
  }
  return coords[coords.length - 1]
}

interface TripMapCanvasProps {
  phase: MapPhase
  /** Active nav destination — Vancouver on a plain Start, stop 1 on a road-trip Start. */
  dest: NavDestination
  /** Whether the 4 road-trip stop photo markers are strung along the route. */
  stopsVisible: boolean
  /** Whether the AI trip sheet is open (drives a bounds refit above it). */
  sheetOpen: boolean
}

// The single live Mapbox layer behind iteration 11. It stays mounted from the
// opening route preview through the Gemini flow and into the drive —
// remounting would flash the style load. The puck rides a center-anchored
// marker portal (blue dot on preview, chevron in nav); the route polyline and
// destination pin follow `dest` (Vancouver on preview / plain Start, Snow Goose
// when the Gemini road trip is active).
export function TripMapCanvas({ phase, dest, stopsVisible, sheetOpen }: TripMapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const destMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const stopMarkersRef = useRef<mapboxgl.Marker[]>([])
  // Drops stale Directions responses if the phase flips mid-fetch.
  const seqRef = useRef(0)
  // Last drawn route + current phase, for camera decisions outside deps.
  const coordsRef = useRef<[number, number][]>(FALLBACK_ROUTE)
  const phaseRef = useRef(phase)
  phaseRef.current = phase
  const [markerEl, setMarkerEl] = useState<HTMLDivElement | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [heading, setHeading] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    let map: mapboxgl.Map
    try {
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        // Mid-corridor so the opening fitBounds settles rather than flings.
        center: [-122.7, 48.4],
        zoom: 6.8,
        attributionControl: false,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize map')
      return
    }
    mapRef.current = map
    // Dev-only handle for demos and browser-pane verification.
    if (import.meta.env.DEV) {
      ;(window as unknown as { __iter11Map?: mapboxgl.Map }).__iter11Map = map
    }

    map.on('style.load', () => applyGoogleMapsPalette(map))
    map.on('load', () => {
      map.resize()
      setMapReady(true)
    })
    map.on('error', (event) => {
      setError(event.error?.message ?? 'Map failed to load')
    })

    // Puck marker (portal target — see JSX below).
    const el = document.createElement('div')
    el.style.pointerEvents = 'none'
    new mapboxgl.Marker({ element: el, anchor: 'center' }).setLngLat(SEATTLE_ORIGIN).addTo(map)
    setMarkerEl(el)

    return () => {
      stopMarkersRef.current.forEach((m) => m.remove())
      stopMarkersRef.current = []
      map.remove()
      mapRef.current = null
      destMarkerRef.current = null
      setMapReady(false)
    }
  }, [])

  // Route + destination pin + camera, re-run on phase / destination changes.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return
    const seq = ++seqRef.current
    const fallback = fallbackToDest(dest.lngLat)

    // Destination pin follows the active nav target.
    if (!destMarkerRef.current) {
      const pin = document.createElement('div')
      pin.className = 'dest-pin'
      pin.innerHTML = `<div class="dest-pin-inner">${DEST_PIN_SVG}</div>`
      destMarkerRef.current = new mapboxgl.Marker({ element: pin, anchor: 'bottom' })
        .setLngLat(dest.lngLat)
        .addTo(map)
    } else {
      destMarkerRef.current.setLngLat(dest.lngLat)
    }

    drawTripRoute(
      map,
      SEATTLE_ORIGIN,
      dest.lngLat,
      (coords) => {
        if (seq !== seqRef.current) return
        coordsRef.current = coords
        setHeading(firstLegBearing(coords))
        try {
          if (phase === 'preview') {
            const bounds = coords.reduce(
              (b, c) => b.extend(c),
              new mapboxgl.LngLatBounds(coords[0], coords[0]),
            )
            map.fitBounds(bounds, {
              padding: { top: 200, bottom: 230, left: 50, right: 50 },
              duration: 1200,
            })
          } else {
            // In nav, hold near the puck with a short lookahead — a long-haul
            // fitBounds would shrink it to a dot.
            map.easeTo({ center: pointAlongRoute(coords, 250), zoom: NAV_ZOOM, duration: 900 })
          }
        } catch {
          // Map torn down mid-flight.
        }
      },
      fallback,
    )
  }, [dest, phase, mapReady])

  // Stop photo markers + the sheet-open camera refit.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return

    if (stopsVisible) {
      if (stopMarkersRef.current.length === 0) {
        stopMarkersRef.current = STOPS.map((stop, i) => {
          const el = document.createElement('div')
          el.className = 'stop-marker'
          el.innerHTML = `
            <div class="stop-marker-inner" style="animation-delay: ${i * 80}ms">
              <img class="stop-photo" src="${stopMarkerPhoto(stop)}" alt="" />
              <div class="stop-tail"></div>
              <div class="stop-label">${stop.name}</div>
            </div>`
          return new mapboxgl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat(stop.lngLat)
            .addTo(map)
        })
      }

      if (sheetOpen) {
        // Fit the whole strung-out route above the sheet — bottom padding must
        // clear the ~420px sheet or Peace Arch hides behind it.
        try {
          const bounds = coordsRef.current.reduce(
            (b, c) => b.extend(c),
            new mapboxgl.LngLatBounds(coordsRef.current[0], coordsRef.current[0]),
          )
          STOPS.forEach((s) => bounds.extend(s.lngLat))
          map.fitBounds(bounds, {
            padding: { top: 110, bottom: 450, left: 50, right: 50 },
            duration: 1000,
          })
        } catch {
          // Map torn down mid-flight.
        }
      } else if (phaseRef.current === 'nav') {
        // Sheet closed but the trip is still driving — settle the nav camera.
        try {
          map.easeTo({
            center: pointAlongRoute(coordsRef.current, 250),
            zoom: NAV_ZOOM,
            duration: 900,
          })
        } catch {
          // Map torn down mid-flight.
        }
      }
    } else {
      stopMarkersRef.current.forEach((m) => m.remove())
      stopMarkersRef.current = []
      // Only refit the preview overview here — the route effect owns the nav
      // camera on a phase flip (iteration 10's browse-toggle pattern).
      if (phaseRef.current === 'preview') {
        try {
          const coords = coordsRef.current
          const bounds = coords.reduce(
            (b, c) => b.extend(c),
            new mapboxgl.LngLatBounds(coords[0], coords[0]),
          )
          map.fitBounds(bounds, {
            padding: { top: 200, bottom: 230, left: 50, right: 50 },
            duration: 1000,
          })
        } catch {
          // Map torn down mid-flight.
        }
      }
    }
    // `phase` is read via ref, deliberately not a dep — the route effect owns
    // phase-driven camera moves; this effect only reacts to stop/sheet toggles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopsVisible, sheetOpen, mapReady])

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: tokens.mapLand,
          // Every marker in this view is decorative — gestures pass through.
          '& .mapboxgl-marker': { pointerEvents: 'none !important' },
        }}
      >
        <Box ref={containerRef} sx={{ position: 'absolute', inset: 0 }} />
        {error && (
          <Alert severity="error" sx={{ position: 'absolute', top: 140, left: 16, right: 16, zIndex: 5 }}>
            {error}
          </Alert>
        )}
      </Box>
      {/* Plain wrapper keeps the portal object out of MUI prop-type checks */}
      <div style={{ display: 'contents' }}>
        {markerEl &&
          createPortal(phase === 'nav' ? <NavPuck heading={heading} /> : <LocationPuck />, markerEl)}
      </div>
    </>
  )
}
