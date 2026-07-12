import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Alert, Box } from '@mui/material'
import { LocationPuck } from './LocationPuck'
import { MODE_TRANSITION, useTokens } from './theme'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

// U District, Seattle — same neighborhood as iteration 6's demo.
const CENTER: [number, number] = [-122.3067, 47.6558]

interface MapCanvasProps {
  roadTrip: boolean
}

// Live Mapbox base layer for the Explore home (design.md §5 layer 1):
// full-bleed, top-down, freely pannable and zoomable. The puck/car rides a
// mapboxgl.Marker so it stays pinned to the location through camera moves.
export function MapCanvas({ roadTrip }: MapCanvasProps) {
  const t = useTokens()
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [markerEl, setMarkerEl] = useState<HTMLDivElement | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    let map: mapboxgl.Map
    try {
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: CENTER,
        zoom: 15.2,
        attributionControl: false,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize map')
      return
    }
    mapRef.current = map

    map.on('load', () => map.resize())
    map.on('error', (event) => {
      setError(event.error?.message ?? 'Map failed to load')
    })

    const el = document.createElement('div')
    el.style.pointerEvents = 'none'
    new mapboxgl.Marker({ element: el, anchor: 'center' }).setLngLat(CENTER).addTo(map)
    setMarkerEl(el)

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: t.mapLand,
          transition: MODE_TRANSITION,
          // The puck is decorative — gestures on it must pass through to the
          // map (Mapbox re-enables pointer events on marker elements).
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
        {markerEl && createPortal(<LocationPuck roadTrip={roadTrip} />, markerEl)}
      </div>
    </>
  )
}
