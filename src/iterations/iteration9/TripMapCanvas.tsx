import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Alert, Box } from '@mui/material'
import { applyGoogleMapsPalette } from '../../shared/googleMapStyle'
import { LocationPuck } from './LocationPuck'
import { NavPuck } from './NavPuck'
import { drawTripRoute, clearTripRoute } from './mapRoute'
import { HOME_ZOOM, NAV_ZOOM, ORIGIN, type TripPlace } from './tripData'
import { tokens } from './theme'
import './mapMarkers.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export type Phase = 'home' | 'preview' | 'nav'

// Google-red destination pin.
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
  phase: Phase
  place: TripPlace | null
}

// The single live Mapbox layer behind all three road-trip phases. It stays
// mounted from Explore through route preview into active nav — remounting
// would flash the style load and break the seamless mid-nav destination
// switch, which is the whole point of this iteration. The origin puck rides a
// center-anchored marker portal and swaps dot → chevron when driving starts;
// the destination pin and route polyline follow the selected place.
export function TripMapCanvas({ phase, place }: TripMapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const destMarkerRef = useRef<mapboxgl.Marker | null>(null)
  // Drops stale Directions responses when destinations switch rapidly mid-nav.
  const seqRef = useRef(0)
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
        center: ORIGIN,
        zoom: HOME_ZOOM,
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
      ;(window as unknown as { __iter9Map?: mapboxgl.Map }).__iter9Map = map
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

    // Origin puck marker (portal target — see JSX below).
    const el = document.createElement('div')
    el.style.pointerEvents = 'none'
    new mapboxgl.Marker({ element: el, anchor: 'center' }).setLngLat(ORIGIN).addTo(map)
    setMarkerEl(el)

    return () => {
      map.remove()
      mapRef.current = null
      destMarkerRef.current = null
      setMapReady(false)
    }
  }, [])

  // Route + destination pin + camera, re-run on phase/destination changes.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return
    const seq = ++seqRef.current

    if (!place) {
      clearTripRoute(map)
      destMarkerRef.current?.remove()
      destMarkerRef.current = null
      map.easeTo({ center: ORIGIN, zoom: HOME_ZOOM, duration: 900 })
      return
    }

    // Destination pin follows the selected place.
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

    drawTripRoute(map, place.lngLat, (coords) => {
      if (seq !== seqRef.current) return
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
        } else if (phase === 'nav') {
          // Simulated drive stays near the origin — a 60-mile fitBounds would
          // shrink the puck to a dot. Look a little way up the route instead.
          map.easeTo({ center: pointAlongRoute(coords, 600), zoom: NAV_ZOOM, duration: 900 })
        }
      } catch {
        // Map torn down mid-flight.
      }
    })
  }, [place, phase, mapReady])

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
