import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Alert } from '@mui/material'
import { CAR_POSITION, DESTINATION, GEM_POSITION } from './gemData'
import { tokens } from './theme'
import './mapMarkers.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const ROUTE_SOURCE_ID = 'gem-route'
const ROUTE_LAYER_ID = 'gem-route-line'

// Top-down car: white body, blue-tinted windshield/rear glass, gray roof.
const CAR_SVG = `
<svg class="car-svg" width="28" height="48" viewBox="0 0 28 48" xmlns="http://www.w3.org/2000/svg">
  <rect x="1.5" y="1.5" width="25" height="45" rx="10" fill="#ffffff" stroke="#5f6368" stroke-width="1.5"/>
  <path d="M5 13 L23 13 L21 21 L7 21 Z" fill="#aecbfa"/>
  <rect x="7" y="22" width="14" height="11" rx="2" fill="#e8eaed"/>
  <path d="M7 40 L21 40 L23 34 L5 34 Z" fill="#aecbfa"/>
</svg>`

const GEM_SVG = `
<svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M7 3h10l4 6-9 12L3 9l4-6z" fill="${tokens.teal}"/>
  <path d="M7 3l2.5 6L12 3H7zm5 0l2.5 6L17 3h-5zM3 9h6l3 12L3 9zm12 0h6l-9 12 3-12z" fill="rgba(255,255,255,0.25)"/>
</svg>`

interface MapCanvasProps {
  routeTarget: 'destination' | 'gem'
  carAtGem: boolean
  onGemClick: () => void
  onCarClick: () => void
}

export function MapCanvas({ routeTarget, carAtGem, onGemClick, onCarClick }: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const gemElRef = useRef<HTMLDivElement | null>(null)
  const carMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const onGemClickRef = useRef(onGemClick)
  onGemClickRef.current = onGemClick
  const onCarClickRef = useRef(onCarClick)
  onCarClickRef.current = onCarClick
  const [error, setError] = useState<string | null>(null)
  // 'style.load' fires once the style JSON is parsed (addSource/addLayer safe),
  // unlike 'load'/isStyleLoaded() which also wait on tiles and can stall the
  // route draw indefinitely if a tile request hangs.
  const [styleReady, setStyleReady] = useState(false)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    let map: mapboxgl.Map
    try {
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: CAR_POSITION,
        zoom: 11,
        pitch: 60,
        bearing: 0,
        attributionControl: false,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize map')
      return
    }
    mapRef.current = map

    map.on('style.load', () => setStyleReady(true))
    map.on('load', () => {
      map.resize()
    })
    map.on('error', (event) => {
      setError(event.error?.message ?? 'Map failed to load')
    })

    const carEl = document.createElement('div')
    carEl.className = 'car-marker-wrap'
    carEl.innerHTML = CAR_SVG
    // Hidden prototyping gesture: double-tap the car to jump to the gem.
    // Intentionally no cursor/animation cue so it stays invisible in the demo.
    carEl.addEventListener('dblclick', (event) => {
      event.stopPropagation()
      onCarClickRef.current()
    })
    carMarkerRef.current = new mapboxgl.Marker({ element: carEl }).setLngLat(CAR_POSITION).addTo(map)

    // Gem marker — a planted pin: the point at the bottom is the exact
    // coordinate, so anchor 'bottom' keeps it fixed to the ground on zoom
    // (a center-anchored icon billboards and appears to drift on a pitched
    // map). The click callback lives in a ref because this effect runs once.
    const gemEl = document.createElement('div')
    gemEl.className = 'gem-pin'
    gemEl.innerHTML = `
      <span class="gem-label">Gem</span>
      <div class="gem-head-wrap">
        <div class="gem-pulse"></div>
        <div class="gem-head">${GEM_SVG}</div>
      </div>
      <div class="gem-point"></div>`
    gemEl.addEventListener('click', (event) => {
      event.stopPropagation()
      onGemClickRef.current()
    })
    gemElRef.current = gemEl
    new mapboxgl.Marker({ element: gemEl, anchor: 'bottom' }).setLngLat(GEM_POSITION).addTo(map)

    return () => {
      map.remove()
      mapRef.current = null
      gemElRef.current = null
      carMarkerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Demo shortcut: double-tapping the car "arrives" it at the gem. Teleport
  // the marker, drop the route line, and ease the camera down to street level
  // so the gem reads as reached.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (!carAtGem) return

    carMarkerRef.current?.setLngLat(GEM_POSITION)
    gemElRef.current?.classList.add('gem-pin--destination')

    if (styleReady) {
      if (map.getLayer(ROUTE_LAYER_ID)) map.removeLayer(ROUTE_LAYER_ID)
      if (map.getSource(ROUTE_SOURCE_ID)) map.removeSource(ROUTE_SOURCE_ID)
    }
    map.easeTo({ center: GEM_POSITION, zoom: 16, pitch: 55, duration: 1400 })
  }, [carAtGem, styleReady])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    gemElRef.current?.classList.toggle('gem-pin--destination', routeTarget === 'gem')

    if (!styleReady || carAtGem) return

    const target = routeTarget === 'gem' ? GEM_POSITION : DESTINATION
    const coordString = `${CAR_POSITION.join(',')};${target.join(',')}`
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordString}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const route = data.routes?.[0]
        const currentMap = mapRef.current
        if (!route?.geometry || !currentMap) return
        if (currentMap.getLayer(ROUTE_LAYER_ID)) currentMap.removeLayer(ROUTE_LAYER_ID)
        if (currentMap.getSource(ROUTE_SOURCE_ID)) currentMap.removeSource(ROUTE_SOURCE_ID)
        currentMap.addSource(ROUTE_SOURCE_ID, {
          type: 'geojson',
          data: { type: 'Feature', properties: {}, geometry: route.geometry },
        })
        currentMap.addLayer({
          id: ROUTE_LAYER_ID,
          type: 'line',
          source: ROUTE_SOURCE_ID,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': tokens.route, 'line-width': 10, 'line-opacity': 0.9 },
        })
        // Frame the interesting region, not the whole 142-mi trip — like real
        // turn-by-turn nav. For the destination route that means car→gem (the
        // rest of the route trails off-screen toward Portland); for the gem
        // route it's the full short route. Generous top/bottom padding keeps
        // the gem clear of the banner and the ETA sheet.
        const bounds = new mapboxgl.LngLatBounds()
        bounds.extend(CAR_POSITION)
        bounds.extend(GEM_POSITION)
        if (routeTarget === 'gem') {
          for (const coord of route.geometry.coordinates as [number, number][]) {
            bounds.extend(coord)
          }
        }
        currentMap.fitBounds(bounds, {
          padding: { top: 210, bottom: 190, left: 56, right: 56 },
          duration: 1200,
        })
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load driving directions')
      })
  }, [routeTarget, styleReady, carAtGem])

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
