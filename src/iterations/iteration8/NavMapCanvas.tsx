import { useEffect, useRef, useState } from 'react'
import type { MutableRefObject } from 'react'
import { createPortal } from 'react-dom'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Alert, Box } from '@mui/material'
import { applyGoogleMapsPalette } from '../../shared/googleMapStyle'
import { NavPuck } from './NavPuck'
import { NAV_CENTER, NAV_ZOOM, PUCK_POSITION, TRAFFIC_LIGHTS } from './navData'
import { drawNavRoute } from './mapRoute'
import { tokens } from './theme'
import './mapMarkers.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

// Small three-lamp traffic light standing on the jammed block.
const TRAFFIC_LIGHT_SVG = `
<svg width="14" height="32" viewBox="0 0 14 32" xmlns="http://www.w3.org/2000/svg">
  <rect x="6" y="20" width="2" height="12" rx="1" fill="#5F6368"/>
  <rect x="1" y="0" width="12" height="24" rx="4" fill="#3C4043"/>
  <circle cx="7" cy="5" r="2.6" fill="#EA4335"/>
  <circle cx="7" cy="12" r="2.6" fill="#FBBC04"/>
  <circle cx="7" cy="19" r="2.6" fill="#34A853"/>
</svg>`

function makeTrafficLight(): HTMLDivElement {
  const el = document.createElement('div')
  el.className = 'traffic-light'
  el.innerHTML = TRAFFIC_LIGHT_SVG
  return el
}

interface NavMapCanvasProps {
  /** Filled with an easeTo-home function for the Re-center pill. */
  recenterRef: MutableRefObject<(() => void) | null>
}

// Live Mapbox base layer for the active-nav view (structure from iteration 7's
// MapCanvas): full-bleed, top-down, Google-palette repaint on style load. The
// nav chevron rides a center-anchored mapboxgl.Marker via a React portal; the
// route polyline comes from the Directions API with a hardcoded fallback.
export function NavMapCanvas({ recenterRef }: NavMapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [markerEl, setMarkerEl] = useState<HTMLDivElement | null>(null)
  const [heading, setHeading] = useState(270)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    let map: mapboxgl.Map
    try {
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: NAV_CENTER,
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
      ;(window as unknown as { __iter8Map?: mapboxgl.Map }).__iter8Map = map
    }

    // Repaint streets-v12 into the Google Maps palette (design.md §9) as soon
    // as the style is parsed, so raw Mapbox colors never flash.
    map.on('style.load', () => applyGoogleMapsPalette(map))
    map.on('load', () => {
      map.resize()
      drawNavRoute(map, 'iter8-route', 'iter8-route-line', (coords) => {
        // Aim the chevron along the route's first leg (compass bearing).
        const [a, b] = [coords[0], coords[1]]
        const dx = (b[0] - a[0]) * Math.cos((a[1] * Math.PI) / 180)
        const dy = b[1] - a[1]
        setHeading((Math.atan2(dx, dy) * 180) / Math.PI)
      })
    })
    map.on('error', (event) => {
      setError(event.error?.message ?? 'Map failed to load')
    })

    // Nav puck marker (portal target — see JSX below).
    const el = document.createElement('div')
    el.style.pointerEvents = 'none'
    new mapboxgl.Marker({ element: el, anchor: 'center' }).setLngLat(PUCK_POSITION).addTo(map)
    setMarkerEl(el)

    // Decorative jam dressing: queued traffic lights on the block ahead.
    for (const lngLat of TRAFFIC_LIGHTS) {
      new mapboxgl.Marker({ element: makeTrafficLight(), anchor: 'bottom' }).setLngLat(lngLat).addTo(map)
    }

    recenterRef.current = () => {
      map.easeTo({ center: NAV_CENTER, zoom: NAV_ZOOM, bearing: 0, duration: 700 })
    }

    return () => {
      recenterRef.current = null
      map.remove()
      mapRef.current = null
    }
  }, [recenterRef])

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
        {markerEl && createPortal(<NavPuck heading={heading} />, markerEl)}
      </div>
    </>
  )
}
