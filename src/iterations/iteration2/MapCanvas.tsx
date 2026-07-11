import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Alert } from '@mui/material'
import type { ListPlace } from './lists'
import './mapMarkers.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

// Approximate landmarks around UW Seattle campus, styled to loosely
// match the reference screenshots (not exact Google Maps data).
const PLACES: { lngLat: [number, number]; label: string; icon: string }[] = [
  { lngLat: [-122.3067, 47.6598], label: 'Slurp Station Aburasoba', icon: 'ramen_dining' },
  { lngLat: [-122.308, 47.6608], label: 'Herkimer Coffee', icon: 'local_cafe' },
  { lngLat: [-122.3057, 47.6558], label: 'PACCAR Hall', icon: 'school' },
  { lngLat: [-122.305, 47.6553], label: 'Sultan Gyros Grill', icon: 'restaurant' },
  { lngLat: [-122.3086, 47.6633], label: 'Just Burgers', icon: 'lunch_dining' },
  { lngLat: [-122.324, 47.6508], label: 'Agua Verde Cafe', icon: 'restaurant' },
  { lngLat: [-122.322, 47.6497], label: 'Saint Bread', icon: 'bakery_dining' },
  { lngLat: [-122.319, 47.648], label: 'Oceanography Dock Building', icon: 'school' },
]

const YOU_ARE_HERE: [number, number] = [-122.3067, 47.6558]

const ROADTRIP_SOURCE_ID = 'roadtrip-route'
const ROADTRIP_LAYER_ID = 'roadtrip-route-line'

interface MapCanvasProps {
  center: [number, number]
  zoom: number
  roadtripPlaces?: ListPlace[]
  showRoute?: boolean
  onRouteInfo?: (info: { durationSec: number; distanceMeters: number } | null) => void
}

export function MapCanvas({ center, zoom, roadtripPlaces, showRoute = false, onRouteInfo }: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const roadtripMarkersRef = useRef<mapboxgl.Marker[]>([])
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
        pitch: 45,
        bearing: -20,
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

    for (const place of PLACES) {
      const el = document.createElement('div')
      el.className = 'map-poi-marker'
      el.innerHTML = `<span class="material-symbols-rounded" style="font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 18; font-size: 18px;">${place.icon}</span>`
      new mapboxgl.Marker({ element: el })
        .setLngLat(place.lngLat)
        .setPopup(new mapboxgl.Popup({ offset: 16, closeButton: false }).setText(place.label))
        .addTo(map)
    }

    const youEl = document.createElement('div')
    youEl.className = 'you-are-here-marker'
    youEl.innerHTML = '<div class="you-cone"></div><div class="you-dot"></div>'
    new mapboxgl.Marker({ element: youEl, rotationAlignment: 'map' })
      .setLngLat(YOU_ARE_HERE)
      .addTo(map)

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

    const applyRoadtrip = () => {
      roadtripMarkersRef.current.forEach((marker) => marker.remove())
      roadtripMarkersRef.current = []

      if (map.getLayer(ROADTRIP_LAYER_ID)) map.removeLayer(ROADTRIP_LAYER_ID)
      if (map.getSource(ROADTRIP_SOURCE_ID)) map.removeSource(ROADTRIP_SOURCE_ID)

      if (!roadtripPlaces || roadtripPlaces.length === 0) {
        onRouteInfo?.(null)
        return
      }

      roadtripPlaces.forEach((place, index) => {
        const el = document.createElement('div')
        el.className = 'roadtrip-marker'
        el.textContent = String(index + 1)
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(place.lngLat)
          .setPopup(new mapboxgl.Popup({ offset: 16, closeButton: false }).setText(place.name))
          .addTo(map)
        roadtripMarkersRef.current.push(marker)
      })

      if (roadtripPlaces.length === 1) {
        map.flyTo({ center: roadtripPlaces[0].lngLat, zoom: 15, duration: 600 })
        onRouteInfo?.(null)
        return
      }

      const bounds = new mapboxgl.LngLatBounds()
      roadtripPlaces.forEach((place) => bounds.extend(place.lngLat))
      map.fitBounds(bounds, { padding: 70, duration: 600 })

      if (!showRoute) {
        onRouteInfo?.(null)
        return
      }

      const coordString = roadtripPlaces.map((place) => place.lngLat.join(',')).join(';')
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordString}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          const route = data.routes?.[0]
          if (!route?.geometry || !mapRef.current) {
            onRouteInfo?.(null)
            return
          }
          const currentMap = mapRef.current
          if (currentMap.getLayer(ROADTRIP_LAYER_ID)) currentMap.removeLayer(ROADTRIP_LAYER_ID)
          if (currentMap.getSource(ROADTRIP_SOURCE_ID)) currentMap.removeSource(ROADTRIP_SOURCE_ID)
          currentMap.addSource(ROADTRIP_SOURCE_ID, {
            type: 'geojson',
            data: { type: 'Feature', properties: {}, geometry: route.geometry },
          })
          currentMap.addLayer({
            id: ROADTRIP_LAYER_ID,
            type: 'line',
            source: ROADTRIP_SOURCE_ID,
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#1a73e8', 'line-width': 5, 'line-opacity': 0.85 },
          })
          onRouteInfo?.({ durationSec: route.duration, distanceMeters: route.distance })
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Failed to plan roadtrip route')
          onRouteInfo?.(null)
        })
    }

    if (map.isStyleLoaded()) {
      applyRoadtrip()
    } else {
      map.once('load', applyRoadtrip)
    }
  }, [roadtripPlaces, showRoute])

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
