import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Alert, Box } from '@mui/material'
import { applyGoogleMapsPalette } from '../../shared/googleMapStyle'
import {
  MAP_CENTER,
  MAP_ZOOM,
  RESTAURANT_PLACES,
  SHARED_PLACES,
  visiblePlaces as visiblePlacesFor,
} from './tripData'
import { tokens } from './theme'
import './mapMarkers.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

/** Filled bookmark, drawn into the saved badge on a pin. */
const SAVED_ICON = `<svg viewBox="0 0 24 24"><path d="M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2z"/></svg>`

/** Camera framing that keeps pins clear of the top chrome and bottom cards.
    Right padding is generous because a pin's name sits ~125px to its right. */
const FIT_PADDING = { top: 170, bottom: 260, left: 60, right: 150 }

/**
 * Pins grow as you zoom in. At the trip overview they're the Figma's 32px, but
 * a place photo that stays 32px however far you push in is just a thumbnail —
 * zooming should actually let you see where you're going. The CSS derives every
 * pin dimension from --nc-pin, so setting it here resizes photo, tail, badge
 * and label together.
 */
const PIN_ZOOM_RANGE = [9.5, 13] as const
const PIN_SIZE_RANGE = [32, 88] as const

/** Zoom the camera settles at when a pin is opened — enough to read its photo. */
const SELECTED_ZOOM = 11.5

const pinSizeForZoom = (zoom: number) => {
  const [zMin, zMax] = PIN_ZOOM_RANGE
  const [sMin, sMax] = PIN_SIZE_RANGE
  const t = Math.min(Math.max((zoom - zMin) / (zMax - zMin), 0), 1)
  return Math.round(sMin + (sMax - sMin) * t)
}

interface TripMapCanvasProps {
  /** Restaurants filter is on — shared pins dim and restaurant pins drop in. */
  restaurantsMode: boolean
  /** Ids the user has saved; these pins stay put whatever the filter says. */
  savedIds: string[]
  /** Non-null while the detail sheet is up, so the camera can lift the pin. */
  selectedId: string | null
  onSelectPlace: (id: string) => void
}

/**
 * The live map behind the whole iteration. Places ride as photo pins on the map
 * surface rather than in a list, which is the point of this iteration — you see
 * the shared trip in context. The trip's pins arrive with the share; the
 * Restaurants filter dims them in place (never removes them, so the fade reads
 * as a fade) and drops the restaurant pins over the same corridor. Saved
 * restaurants stay mounted at full strength after the filter clears, which is
 * what makes a save feel like it stuck.
 */
export function TripMapCanvas({
  restaurantsMode,
  savedIds,
  selectedId,
  onSelectPlace,
}: TripMapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  /** Live markers by place id, so state changes can restyle without rebuilding. */
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map())
  const [mapReady, setMapReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Latest callback without re-subscribing the marker click handlers.
  const onSelectRef = useRef(onSelectPlace)
  onSelectRef.current = onSelectPlace

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    let map: mapboxgl.Map
    try {
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: MAP_CENTER,
        zoom: MAP_ZOOM,
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
      ;(window as unknown as { __iter16Map?: mapboxgl.Map }).__iter16Map = map
    }

    // Repaint streets-v12 into the Google Maps palette (design.md §9) as soon
    // as the style parses, so raw Mapbox colors never flash.
    map.on('style.load', () => applyGoogleMapsPalette(map))
    map.on('load', () => {
      map.resize()
      setMapReady(true)
    })
    map.on('error', (event) => setError(event.error?.message ?? 'Map failed to load'))

    return () => {
      markersRef.current.forEach((m) => m.remove())
      markersRef.current.clear()
      map.remove()
      mapRef.current = null
      setMapReady(false)
    }
  }, [])

  const visiblePlaces = visiblePlacesFor(restaurantsMode, savedIds)
  const visibleKey = visiblePlaces.map((p) => p.id).join(',')

  // Add / remove markers to match the visible set. Existing markers are left
  // alone so their pop-in doesn't replay every time state changes.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return
    const markers = markersRef.current
    const wanted = new Set(visiblePlaces.map((p) => p.id))

    markers.forEach((marker, id) => {
      if (!wanted.has(id)) {
        marker.remove()
        markers.delete(id)
      }
    })

    visiblePlaces.forEach((place, index) => {
      if (markers.has(place.id)) return
      const el = document.createElement('div')
      el.className = 'nc-marker'
      el.dataset.placeId = place.id
      el.setAttribute('role', 'button')
      el.setAttribute('aria-label', place.name)
      // Restaurant pins stagger in behind the filter; the trip's stagger on load.
      el.innerHTML = `
        <div class="nc-marker-inner" style="animation-delay: ${index * 70}ms">
          <div class="nc-marker-pin">
            <img class="nc-marker-photo" src="${place.pinPhoto}" alt="" />
            <div class="nc-marker-tail"></div>
          </div>
          <div class="nc-marker-label">${place.name}</div>
        </div>`
      el.addEventListener('click', (event) => {
        // Otherwise Mapbox reads the tap as a map click and nothing opens.
        event.stopPropagation()
        onSelectRef.current(place.id)
      })
      markers.set(
        place.id,
        new mapboxgl.Marker({ element: el, anchor: 'bottom' }).setLngLat(place.lngLat).addTo(map),
      )
    })
  }, [visibleKey, mapReady])

  // Resize the pins to match the camera. The variable lives on the container so
  // every marker inherits it, which keeps this a single write per frame rather
  // than a loop over markers.
  useEffect(() => {
    const map = mapRef.current
    const container = containerRef.current
    if (!map || !mapReady || !container) return

    const apply = () => {
      container.style.setProperty('--nc-pin', `${pinSizeForZoom(map.getZoom())}px`)
    }
    apply()
    map.on('zoom', apply)
    return () => {
      map.off('zoom', apply)
    }
  }, [mapReady])

  // Dim the trip's pins while the restaurants filter is on, and badge saved ones.
  useEffect(() => {
    if (!mapReady) return
    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement()
      const isRestaurant = RESTAURANT_PLACES.some((p) => p.id === id)
      const saved = savedIds.includes(id)
      el.classList.toggle('nc-dimmed', restaurantsMode && !isRestaurant && !saved)

      const inner = el.querySelector('.nc-marker-inner')
      const badge = el.querySelector('.nc-marker-saved-badge')
      if (saved && !badge && inner) {
        const mark = document.createElement('div')
        mark.className = 'nc-marker-saved-badge'
        mark.innerHTML = SAVED_ICON
        inner.appendChild(mark)
      } else if (!saved && badge) {
        badge.remove()
      }
    })
  }, [restaurantsMode, savedIds, mapReady, visibleKey])

  // Camera: frame the trip on arrival, the restaurants under the filter, and
  // lift a tapped pin above the detail sheet.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return

    const selected = visiblePlaces.find((p) => p.id === selectedId)
    if (selected) {
      map.easeTo({
        center: selected.lngLat,
        // Nudge the pin into the strip of map the sheet leaves visible.
        offset: [0, -140],
        // Never zoom back out if the user has already pushed in past this.
        zoom: Math.max(map.getZoom(), SELECTED_ZOOM),
        duration: 800,
      })
      return
    }

    const framed = restaurantsMode ? RESTAURANT_PLACES : SHARED_PLACES
    try {
      const bounds = framed.reduce(
        (b, p) => b.extend(p.lngLat),
        new mapboxgl.LngLatBounds(framed[0].lngLat, framed[0].lngLat),
      )
      map.fitBounds(bounds, { padding: FIT_PADDING, duration: 1100 })
    } catch {
      // Map torn down mid-flight.
    }
  }, [restaurantsMode, selectedId, mapReady])

  return (
    <Box sx={{ position: 'absolute', inset: 0, bgcolor: tokens.mapLand }}>
      <Box ref={containerRef} className="nc-map" sx={{ position: 'absolute', inset: 0 }} />
      {error && (
        <Alert severity="error" sx={{ position: 'absolute', top: 140, left: 16, right: 16, zIndex: 5 }}>
          {error}
        </Alert>
      )}
    </Box>
  )
}
