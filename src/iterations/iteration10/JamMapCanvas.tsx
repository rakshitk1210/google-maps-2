import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Alert, Box } from '@mui/material'
import { applyGoogleMapsPalette } from '../../shared/googleMapStyle'
import { LocationPuck } from './LocationPuck'
import { NavPuck } from './NavPuck'
import { drawJamRoute } from './mapRoute'
import {
  FALLBACK_ROUTE,
  NAV_ZOOM,
  PUCK_POSITION,
  RESTAURANT_MARKERS,
  type NavDestination,
} from './jamTripData'
import { tokens } from './theme'
import './mapMarkers.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export type MapPhase = 'nav' | 'preview'

// Google-red destination pin.
const DEST_PIN_SVG = `
<svg width="34" height="44" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z" fill="${tokens.red}"/>
  <circle cx="12" cy="12" r="4.5" fill="#7B1710"/>
</svg>`

// White fork-and-knife glyph for the restaurant rating pills.
const FORK_SVG = `
<svg width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 0 0 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" fill="#fff"/>
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

interface JamMapCanvasProps {
  phase: MapPhase
  /** Committed nav destination, or the pending one while previewing. */
  dest: NavDestination
  /** Rating-pill markers shown while browsing restaurants along the route. */
  restaurantsVisible: boolean
}

// The single live Mapbox layer behind the whole iteration. It stays mounted
// from the opening drive through search, Quick Decide, the match, and the
// post-match route preview — remounting would flash the style load. The puck
// rides a center-anchored marker portal (chevron while driving, blue dot on
// the preview screen); the route polyline and destination pin follow `dest`.
export function JamMapCanvas({ phase, dest, restaurantsVisible }: JamMapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const destMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const restMarkersRef = useRef<mapboxgl.Marker[]>([])
  // Drops stale Directions responses when the destination switches quickly.
  const seqRef = useRef(0)
  // Last drawn route + current visibility, for camera decisions outside deps.
  const coordsRef = useRef<[number, number][]>(FALLBACK_ROUTE)
  const restaurantsVisibleRef = useRef(restaurantsVisible)
  restaurantsVisibleRef.current = restaurantsVisible
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
        center: PUCK_POSITION,
        zoom: NAV_ZOOM,
        attributionControl: false,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize map')
      return
    }
    mapRef.current = map
    // Dev-only handle so demos and browser-pane verification can drive the
    // camera deterministically.
    if (import.meta.env.DEV) {
      ;(window as unknown as { __iter10Map?: mapboxgl.Map }).__iter10Map = map
    }

    // Repaint streets-v12 into the Google Maps palette (design.md §9) as soon
    // as the style is parsed, so raw Mapbox colors never flash.
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
    new mapboxgl.Marker({ element: el, anchor: 'center' }).setLngLat(PUCK_POSITION).addTo(map)
    setMarkerEl(el)

    return () => {
      map.remove()
      mapRef.current = null
      destMarkerRef.current = null
      restMarkersRef.current = []
      setMapReady(false)
    }
  }, [])

  // Route + destination pin + camera, re-run on phase/destination changes.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return
    const seq = ++seqRef.current

    // Destination pin follows the current destination.
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

    drawJamRoute(map, PUCK_POSITION, dest.lngLat, (coords) => {
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
            padding: { top: 200, bottom: 230, left: 60, right: 60 },
            duration: 1200,
          })
        } else if (!restaurantsVisibleRef.current) {
          // Simulated drive stays near the puck — an 86-mile fitBounds would
          // shrink it to a dot. A short lookahead keeps the puck in the lower
          // third of the frame like real turn-by-turn.
          map.easeTo({ center: pointAlongRoute(coords, 250), zoom: NAV_ZOOM, duration: 900 })
        }
      } catch {
        // Map torn down mid-flight.
      }
    })
  }, [dest, phase, mapReady])

  // Restaurant rating pills + the browse camera (zoom out over the corridor).
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return

    if (restaurantsVisible) {
      if (restMarkersRef.current.length === 0) {
        restMarkersRef.current = RESTAURANT_MARKERS.map((r, i) => {
          const el = document.createElement('div')
          el.className = 'rest-marker'
          el.innerHTML = `
            <div class="rest-marker-inner" style="animation-delay: ${i * 70}ms">
              <div class="rest-pill">${FORK_SVG}<span>${r.rating.toFixed(1)}</span></div>
              <div class="rest-tail"></div>
            </div>`
          return new mapboxgl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat(r.lngLat)
            .addTo(map)
        })
      }
      try {
        const bounds = RESTAURANT_MARKERS.reduce(
          (b, r) => b.extend(r.lngLat),
          new mapboxgl.LngLatBounds(PUCK_POSITION, PUCK_POSITION),
        )
        map.fitBounds(bounds, {
          padding: { top: 90, bottom: 380, left: 60, right: 60 },
          duration: 1000,
        })
      } catch {
        // Map torn down mid-flight.
      }
    } else {
      restMarkersRef.current.forEach((m) => m.remove())
      restMarkersRef.current = []
      // Only settle back to the driving frame if we're still in nav — the
      // preview phase runs its own fitBounds from the route effect.
      if (phase === 'nav') {
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
    }
    // `phase` is read but deliberately not a dep — the route effect owns
    // phase-driven camera moves; this effect only reacts to browse toggles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantsVisible, mapReady])

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: tokens.mapLand,
          // Every marker in this view is decorative — gestures must pass
          // through to the map (Mapbox re-enables pointer events on markers).
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
