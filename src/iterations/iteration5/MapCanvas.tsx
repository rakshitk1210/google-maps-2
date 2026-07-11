import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Alert } from '@mui/material'
import { CAFES, CAR_POSITION, KYLE_AVATAR_URL, MOUNT_RAINIER, YOUR_AVATAR_URL } from './jamData'
import { tokens } from './theme'
import './mapMarkers.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const ROUTE_SOURCE_ID = 'jam-route'
const ROUTE_LAYER_ID = 'jam-route-line'

// Top-down car: white body, blue-tinted windshield/rear glass, gray roof.
const CAR_SVG = `
<svg class="car-svg" width="28" height="48" viewBox="0 0 28 48" xmlns="http://www.w3.org/2000/svg">
  <rect x="1.5" y="1.5" width="25" height="45" rx="10" fill="#ffffff" stroke="#5f6368" stroke-width="1.5"/>
  <path d="M5 13 L23 13 L21 21 L7 21 Z" fill="#aecbfa"/>
  <rect x="7" y="22" width="14" height="11" rx="2" fill="#e8eaed"/>
  <path d="M7 40 L21 40 L23 34 L5 34 Z" fill="#aecbfa"/>
</svg>`

interface MapCanvasProps {
  center: [number, number]
  zoom: number
  joined: boolean
  routeTarget: 'destination' | 'cafe'
}

export function MapCanvas({ center, zoom, joined, routeTarget }: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const avatarsRef = useRef<HTMLDivElement | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    let map: mapboxgl.Map
    try {
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center,
        zoom,
        pitch: 60,
        bearing: -15,
        attributionControl: false,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize map')
      return
    }
    mapRef.current = map

    map.on('load', () => {
      map.resize()
    })
    map.on('error', (event) => {
      setError(event.error?.message ?? 'Map failed to load')
    })

    // Avatars live inside the marker element so they track the car through
    // any map pan/zoom, rather than floating at a fixed screen position.
    const wrap = document.createElement('div')
    wrap.className = 'car-marker-wrap'
    wrap.innerHTML = `
      <div class="car-avatars" style="display: none">
        <img class="car-avatar" src="${YOUR_AVATAR_URL}" alt="" />
        <img class="car-avatar car-avatar-overlap" src="${KYLE_AVATAR_URL}" alt="" />
      </div>
      ${CAR_SVG}`
    avatarsRef.current = wrap.querySelector<HTMLDivElement>('.car-avatars')
    new mapboxgl.Marker({ element: wrap }).setLngLat(CAR_POSITION).addTo(map)

    return () => {
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    mapRef.current?.jumpTo({ center, zoom })
  }, [center, zoom])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (avatarsRef.current) avatarsRef.current.style.display = joined ? 'flex' : 'none'

    const applyRoute = () => {
      if (map.getLayer(ROUTE_LAYER_ID)) map.removeLayer(ROUTE_LAYER_ID)
      if (map.getSource(ROUTE_SOURCE_ID)) map.removeSource(ROUTE_SOURCE_ID)

      if (!joined) return

      const target = routeTarget === 'cafe' ? CAFES[0].lngLat : MOUNT_RAINIER
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
            // design.md §6.13 — active nav polyline is --route at 10px.
            paint: { 'line-color': tokens.route, 'line-width': 10, 'line-opacity': 0.95 },
          })
          const bounds = new mapboxgl.LngLatBounds()
          for (const coord of route.geometry.coordinates as [number, number][]) {
            bounds.extend(coord)
          }
          currentMap.fitBounds(bounds, { padding: 60, duration: 1200 })
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Failed to load driving directions')
        })
    }

    if (map.isStyleLoaded()) {
      applyRoute()
    } else {
      map.once('load', applyRoute)
    }
  }, [joined, routeTarget])

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
