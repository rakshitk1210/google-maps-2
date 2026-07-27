import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Alert, Box } from '@mui/material'
import { applyGoogleMapsPalette } from '../../shared/googleMapStyle'
import { drawRoute } from './mapRoute'
import { driveAlong, offsetPoint, pointAlongRoute, type DriveHandle } from './drive'
import { NavPuck } from './NavPuck'
import {
  BILLBOARD_ALONG_METERS,
  BILLBOARD_OFFSET_METERS,
  CAFE_DEST,
  DRIVE_PITCH,
  DRIVE_SPEED_MPS,
  DRIVE_ZOOM,
  ROUTE_DEST,
  ROUTE_ORIGIN,
} from './tripData'
import billboardImg from './assets/billboard-ladro.png'
import { tokens } from './theme'
import './mapMarkers.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

type LngLat = [number, number]

export type DrivePhase = 'driving' | 'billboard' | 'preview' | 'navToCafe'

const DEST_PIN_SVG = `
  <svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 0C7.6 0 0 7.6 0 17c0 12.2 15.3 25.7 16 26.3.6.5 1.4.5 2 0 .7-.6 16-14.1 16-26.3C34 7.6 26.4 0 17 0z" fill="#0D5C63"/>
    <circle cx="17" cy="17" r="6.5" fill="#fff"/>
  </svg>`

interface DriveMapCanvasProps {
  phase: DrivePhase
  onBillboardClick: () => void
}

/**
 * The live drive behind the whole iteration. A real rAF loop moves the puck
 * along the fetched route while the camera trails it, so the road genuinely
 * ticks past — every earlier phone iteration faked this with a parked puck.
 *
 * The phase drives the camera:
 *   driving    → rolling along the trip route
 *   billboard  → frozen in place (rAF cancelled, progress banked)
 *   preview    → pitched flat and zoomed out over the detour leg, dest pin down
 *   navToCafe  → rolling again, now along the café leg from wherever we stopped
 */
export function DriveMapCanvas({ phase, onBillboardClick }: DriveMapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const puckRef = useRef<mapboxgl.Marker | null>(null)
  const destPinRef = useRef<mapboxgl.Marker | null>(null)
  const driveRef = useRef<DriveHandle | null>(null)

  /** Route the drive is currently following. */
  const routeCoordsRef = useRef<LngLat[]>([])
  /** Distance covered on the current route — survives a pause. */
  const travelledRef = useRef(0)

  const [puckEl, setPuckEl] = useState<HTMLDivElement | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Latest callback without re-subscribing the billboard listener.
  const onBillboardRef = useRef(onBillboardClick)
  onBillboardRef.current = onBillboardClick

  /* ------------------------------------------------------------ map setup */

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    let map: mapboxgl.Map
    try {
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: ROUTE_ORIGIN,
        zoom: DRIVE_ZOOM,
        pitch: DRIVE_PITCH,
        attributionControl: false,
        // The drive owns the camera; stray gestures would fight it.
        interactive: false,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize map')
      return
    }
    mapRef.current = map
    if (import.meta.env.DEV) {
      ;(window as unknown as { __iter17Map?: mapboxgl.Map }).__iter17Map = map
    }

    map.on('style.load', () => applyGoogleMapsPalette(map))
    map.on('load', () => {
      map.resize()

      // Puck — a React portal into an empty marker element, so it can use the
      // theme like any other component.
      const el = document.createElement('div')
      puckRef.current = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat(ROUTE_ORIGIN)
        .addTo(map)
      setPuckEl(el)

      // Billboard — the one marker that takes taps.
      const board = document.createElement('div')
      board.className = 'iter17-billboard'
      board.setAttribute('role', 'button')
      board.setAttribute('aria-label', 'Cafe Ladro, 4 mi ahead')
      board.innerHTML = `<div class="iter17-billboard-inner"><img src="${billboardImg}" alt="" /></div>`
      board.addEventListener('click', (event) => {
        event.stopPropagation()
        onBillboardRef.current()
      })
      const billboardMarker = new mapboxgl.Marker({ element: board, anchor: 'bottom' })
        .setLngLat(ROUTE_ORIGIN)
        .addTo(map)

      drawRoute(map, ROUTE_ORIGIN, ROUTE_DEST, (coords) => {
        routeCoordsRef.current = coords
        // Stand the billboard beside the road, off the geometry we just got.
        const { point, bearing } = pointAlongRoute(coords, BILLBOARD_ALONG_METERS)
        billboardMarker.setLngLat(offsetPoint(point, bearing - 90, BILLBOARD_OFFSET_METERS))
        setMapReady(true)
      })
    })
    map.on('error', (event) => setError(event.error?.message ?? 'Map failed to load'))

    return () => {
      driveRef.current?.stop()
      driveRef.current = null
      destPinRef.current?.remove()
      map.remove()
      mapRef.current = null
      setMapReady(false)
    }
  }, [])

  /* -------------------------------------------------------- drive / phases */

  // Rolling phases. Keyed on phase alone: 'driving' and 'navToCafe' each start
  // a loop, and the cleanup banks progress so the next start resumes in place.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return
    if (phase !== 'driving' && phase !== 'navToCafe') return

    const handle = driveAlong(map, () => puckRef.current, routeCoordsRef.current, {
      metersPerSecond: DRIVE_SPEED_MPS,
      zoom: DRIVE_ZOOM,
      pitch: DRIVE_PITCH,
      startAtMeters: travelledRef.current,
      onProgress: (m) => {
        travelledRef.current = m
      },
    })
    driveRef.current = handle

    return () => {
      travelledRef.current = handle.travelled()
      handle.stop()
      driveRef.current = null
    }
  }, [phase, mapReady])

  // Previewing the detour: flatten out and frame the whole leg with the café
  // pin, so the choice is legible before Start commits it.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady || phase !== 'preview') return

    const from = (puckRef.current?.getLngLat().toArray() ?? ROUTE_ORIGIN) as LngLat

    if (!destPinRef.current) {
      const el = document.createElement('div')
      el.className = 'iter17-dest-pin'
      el.innerHTML = `<div class="iter17-dest-pin-inner">${DEST_PIN_SVG}</div>`
      destPinRef.current = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(CAFE_DEST)
        .addTo(map)
    }

    // Re-draw from where we actually stopped, and hold the geometry so Start
    // can resume along it without a second round trip to Directions.
    drawRoute(map, from, CAFE_DEST, (coords) => {
      routeCoordsRef.current = coords
      travelledRef.current = 0
      try {
        const bounds = coords.reduce(
          (b, c) => b.extend(c),
          new mapboxgl.LngLatBounds(coords[0], coords[0]),
        )
        map.fitBounds(bounds, {
          // Big bottom padding — the sheet owns the lower half of the frame.
          padding: { top: 190, bottom: 460, left: 70, right: 70 },
          pitch: 0,
          bearing: 0,
          duration: 900,
        })
      } catch {
        // Map torn down mid-flight.
      }
    })
  }, [phase, mapReady])

  // Backing out of the billboard without rerouting: drop the pin and put the
  // original trip route back under the puck.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady || phase !== 'driving') return
    if (!destPinRef.current) return

    destPinRef.current.remove()
    destPinRef.current = null

    const from = (puckRef.current?.getLngLat().toArray() ?? ROUTE_ORIGIN) as LngLat
    drawRoute(map, from, ROUTE_DEST, (coords) => {
      routeCoordsRef.current = coords
      travelledRef.current = 0
    })
  }, [phase, mapReady])

  return (
    <>
      <Box sx={{ position: 'absolute', inset: 0, bgcolor: tokens.mapLand }}>
        <Box
          ref={containerRef}
          sx={{
            position: 'absolute',
            inset: 0,
            // Markers are decorative by default so nothing steals a tap; the
            // billboard opts back in via its own class.
            '& .mapboxgl-marker': { pointerEvents: 'none' },
          }}
        />
        {error && (
          <Alert
            severity="error"
            sx={{ position: 'absolute', top: 140, left: 16, right: 16, zIndex: 5 }}
          >
            {error}
          </Alert>
        )}
      </Box>
      {/* Outside the Box on purpose: MUI's children propType rejects a portal,
          which logs a spurious "Invalid prop children" warning in dev. */}
      {puckEl && createPortal(<NavPuck />, puckEl)}
    </>
  )
}
