import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Alert, Box } from '@mui/material'
import { LocationPuck } from './LocationPuck'
import { REMOTE_GEMS } from './roadTripData'
import { applyGoogleMapsPalette } from '../../shared/googleMapStyle'
import { MODE_TRANSITION, useTokens } from './theme'
import './mapMarkers.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

// U District, Seattle — same neighborhood as iteration 6's demo.
const CENTER: [number, number] = [-122.3067, 47.6558]

// Diamond for the gem-pin head (iteration 4's marker SVG, purple-filled).
const GEM_SVG = `
<svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M7 3h10l4 6-9 12L3 9l4-6z" fill="#5B2C9D"/>
  <path d="M7 3l2.5 6L12 3H7zm5 0l2.5 6L17 3h-5zM3 9h6l3 12L3 9zm12 0h6l-9 12 3-12z" fill="rgba(255,255,255,0.25)"/>
</svg>`

// Planted pin with the friend's name stamped into the label (styles in
// mapMarkers.css; anchor 'bottom' puts the point's tip on the coordinate).
// The inner wrapper carries a gentle bob — mapbox owns the root's transform,
// so the animated transform lives one level down to avoid fighting it.
function makeGemPin(name: string): HTMLDivElement {
  const el = document.createElement('div')
  el.className = 'gem-pin'
  el.innerHTML = `
    <div class="gem-pin-inner">
      <span class="gem-label">${name}</span>
      <div class="gem-head">${GEM_SVG}</div>
      <div class="gem-point"></div>
    </div>`
  // Desync the bob so a field of gems feels alive, not marching in lockstep.
  const inner = el.firstElementChild as HTMLElement
  inner.style.animationDelay = `${-Math.random() * 3}s`
  return el
}

// Counted badge for a group of gems too close together at the current zoom.
function makeGemCluster(count: number): HTMLDivElement {
  const el = document.createElement('div')
  el.className = 'gem-cluster'
  el.innerHTML = `
    <div class="gem-cluster-head">${GEM_SVG}</div>
    <span class="gem-cluster-count">${count}</span>`
  return el
}

// Pins whose screen positions fall within this radius merge into one cluster
// (roughly the footprint of a pin plus its name label, so nothing overlaps).
const CLUSTER_RADIUS_PX = 80

interface MapCanvasProps {
  roadTrip: boolean
}

// Live Mapbox base layer for the Explore home (design.md §5 layer 1):
// full-bleed, top-down, freely pannable and zoomable. The puck/car rides a
// mapboxgl.Marker so it stays pinned to the location through camera moves.
// In Road Trip mode, gems left by friends who aren't on the trip appear as
// clickable pins — tapping one flies the camera to that spot.
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
    // Dev-only handle so demos and browser-pane verification can drive the
    // camera deterministically (synthetic wheel/keyboard zoom is unreliable).
    if (import.meta.env.DEV) {
      ;(window as unknown as { __iter7Map?: mapboxgl.Map }).__iter7Map = map
    }

    // Repaint streets-v12 into the Google Maps palette (design.md §9) as soon
    // as the style is parsed, so raw Mapbox colors never flash.
    map.on('style.load', () => applyGoogleMapsPalette(map))
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

  // Remote friends' gems come and go with Road Trip mode. The camera stays at
  // the street-level Explore view — only the nearby gems show at first, and
  // panning/zooming out reveals the rest scattered across Washington. Leaving
  // the mode (unless the user flew to a distant gem) resets back home.
  const firstModeRun = useRef(true)
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (!roadTrip) {
      if (firstModeRun.current) {
        firstModeRun.current = false
      } else {
        map.easeTo({ center: CENTER, zoom: 15.2, duration: 900 })
      }
      return
    }
    firstModeRun.current = false

    const pins = REMOTE_GEMS.map((gem) => {
      const el = makeGemPin(gem.name)
      el.addEventListener('click', (event) => {
        event.stopPropagation()
        map.flyTo({ center: gem.lngLat, zoom: 15, duration: 1400 })
      })
      return {
        gem,
        el,
        marker: new mapboxgl.Marker({ element: el, anchor: 'bottom' }).setLngLat(gem.lngLat).addTo(map),
      }
    })

    // Screen-space clustering keeps zoomed-out views readable: pins that would
    // overlap collapse into a counted badge, and tapping the badge zooms in
    // until the group breaks apart into labeled pins.
    let clusterMarkers: mapboxgl.Marker[] = []
    const updateClusters = () => {
      clusterMarkers.forEach((marker) => marker.remove())
      clusterMarkers = []

      interface Cluster {
        x: number
        y: number
        members: typeof pins
      }
      const clusters: Cluster[] = []
      pins.forEach((pin) => {
        const p = map.project(pin.gem.lngLat)
        const hit = clusters.find((c) => Math.hypot(c.x - p.x, c.y - p.y) < CLUSTER_RADIUS_PX)
        if (hit) {
          // Nudge the centroid toward the newcomer so the badge sits mid-group.
          hit.x = (hit.x * hit.members.length + p.x) / (hit.members.length + 1)
          hit.y = (hit.y * hit.members.length + p.y) / (hit.members.length + 1)
          hit.members.push(pin)
        } else {
          clusters.push({ x: p.x, y: p.y, members: [pin] })
        }
      })

      clusters.forEach((cluster) => {
        if (cluster.members.length === 1) {
          cluster.members[0].el.style.display = ''
          return
        }
        cluster.members.forEach((pin) => {
          pin.el.style.display = 'none'
        })
        const center = map.unproject([cluster.x, cluster.y])
        const el = makeGemCluster(cluster.members.length)
        el.addEventListener('click', (event) => {
          event.stopPropagation()
          map.easeTo({ center, zoom: map.getZoom() + 2.2, duration: 800 })
        })
        clusterMarkers.push(new mapboxgl.Marker({ element: el, anchor: 'center' }).setLngLat(center).addTo(map))
      })
    }

    updateClusters()
    // Panning doesn't change screen-space distances (no rotation here), so
    // re-clustering only on zoom changes is enough.
    map.on('zoomend', updateClusters)

    return () => {
      map.off('zoomend', updateClusters)
      clusterMarkers.forEach((marker) => marker.remove())
      pins.forEach((pin) => pin.marker.remove())
    }
  }, [roadTrip])

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: t.mapLand,
          transition: MODE_TRANSITION,
          // The puck is decorative — gestures on it must pass through to the
          // map (Mapbox re-enables pointer events on marker elements). Gem
          // pins and cluster badges are excluded: they're tappable.
          '& .mapboxgl-marker:not(.gem-pin):not(.gem-cluster)': { pointerEvents: 'none !important' },
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
