import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { applyGoogleMapsPalette } from '../../shared/googleMapStyle'
import { Alert } from '@mui/material'
import { CAR_POSITION, MEMBER_AVATAR_URLS } from './jamData'
import type { RouteTarget } from './jamData'
import { drawJamRoute } from './mapRoute'
import './mapMarkers.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const ROUTE_SOURCE_ID = 'phone-jam-route'
const ROUTE_LAYER_ID = 'phone-jam-route-line'

// Top-down car: white body, blue-tinted windshield/rear glass, gray roof.
const CAR_SVG = `
<svg class="car-svg" width="28" height="48" viewBox="0 0 28 48" xmlns="http://www.w3.org/2000/svg">
  <rect x="1.5" y="1.5" width="25" height="45" rx="10" fill="#ffffff" stroke="#5f6368" stroke-width="1.5"/>
  <path d="M5 13 L23 13 L21 21 L7 21 Z" fill="#aecbfa"/>
  <rect x="7" y="22" width="14" height="11" rx="2" fill="#e8eaed"/>
  <path d="M7 40 L21 40 L23 34 L5 34 Z" fill="#aecbfa"/>
</svg>`

interface PhoneNavMapProps {
  routeTarget: RouteTarget
}

// The invitee's phone mirrors the shared Jam navigation once joined: same
// route and the same car (with all four members' avatars). It re-routes in
// lockstep with the CarPlay map when a cafe stop is sent. Rendered as the
// phone's base layer at native size — outside the scaled content box — so
// tiles stay crisp.
export function PhoneNavMap({ routeTarget }: PhoneNavMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const firstRouteEffect = useRef(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    let map: mapboxgl.Map
    try {
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: CAR_POSITION,
        zoom: 15.6,
        pitch: 55,
        bearing: -15,
        attributionControl: false,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize map')
      return
    }
    mapRef.current = map

    // Google Maps tile palette (design.md §9) over the raw Mapbox style.
    map.on('style.load', () => applyGoogleMapsPalette(map))
    map.on('load', () => {
      map.resize()
      drawJamRoute(map, ROUTE_SOURCE_ID, ROUTE_LAYER_ID, 'destination', { onError: setError })
    })
    map.on('error', (event) => {
      setError(event.error?.message ?? 'Map failed to load')
    })

    const wrap = document.createElement('div')
    wrap.className = 'car-marker-wrap'
    wrap.innerHTML = `
      <div class="car-avatars">
        ${MEMBER_AVATAR_URLS.map(
          (src, index) =>
            `<img class="car-avatar${index > 0 ? ' car-avatar-overlap' : ''}" src="${src}" alt="" />`,
        ).join('')}
      </div>
      ${CAR_SVG}`
    new mapboxgl.Marker({ element: wrap }).setLngLat(CAR_POSITION).addTo(map)

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (firstRouteEffect.current) {
      firstRouteEffect.current = false
      return
    }
    const run = () =>
      drawJamRoute(map, ROUTE_SOURCE_ID, ROUTE_LAYER_ID, routeTarget, {
        fit: routeTarget === 'cafe',
        onError: setError,
      })
    if (map.isStyleLoaded()) run()
    else map.once('load', run)
  }, [routeTarget])

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
