import { useEffect, useRef, useState } from 'react'
import { Box, ThemeProvider, Typography } from '@mui/material'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { TripMapCanvas } from './TripMapCanvas'
import { StartFrame } from './StartFrame'
import { MapChrome } from './MapChrome'
import { TripListPage } from './TripListPage'
import { PlaceDetailSheet } from './PlaceDetailSheet'
import { HomeIndicator, PhoneStatusBar } from './PhoneStatusBar'
import { RESTAURANT_PLACES, SHARED_PLACES, findPlace, visiblePlaces } from './tripData'
import { MOTION_EMPHASIZED, theme, tokens } from './theme'

/**
 * Iteration 16 — a shared YouTube video becomes a trip. Sharing a national-parks
 * video into Google Maps opens the North Cascades with the trip's places sitting
 * on the map as photo pins, so the group's picks read in geographic context
 * instead of as a list. From there the map is the interface: filter to
 * restaurants and the trip's pins fade while food pins take the frame, tap any
 * pin for its details, swipe the sheet sideways to walk the rest, and saving one
 * commits it to the trip — the pin stays after the filter clears and the place
 * shows up on the trip page.
 */
export function GoogleMapsClone() {
  const [screen, setScreen] = useState<'start' | 'map'>('start')
  const [listOpen, setListOpen] = useState(false)
  const [restaurantsMode, setRestaurantsMode] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  // The one source of truth for "this is in my trip now" — the map keeps these
  // pins, the trip page lists them, and the sheet shows them as saved.
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [toast, setToast] = useState<string | null>(null)
  // Holds the wording while the pill fades out, so it doesn't blank mid-fade.
  const lastToast = useRef('')
  if (toast) lastToast.current = toast

  const selected = findPlace(selectedId)

  // The trip as it stands: the shared places plus whatever's been saved.
  const tripPlaces = [...SHARED_PLACES, ...RESTAURANT_PLACES.filter((p) => savedIds.includes(p.id))]

  // The pins currently on the map, in the order the sheet pages through them.
  const pins = visiblePlaces(restaurantsMode, savedIds)
  const pinIndex = pins.findIndex((p) => p.id === selectedId)

  // Wraps at both ends so paging never dead-ends mid-trip.
  const stepPin = (delta: number) => {
    if (pins.length === 0 || pinIndex === -1) return
    const next = (pinIndex + delta + pins.length) % pins.length
    setSelectedId(pins[next].id)
  }

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2400)
    return () => clearTimeout(timer)
  }, [toast])

  const toggleSave = (id: string) => {
    const place = findPlace(id)
    setSavedIds((prev) => {
      if (prev.includes(id)) return prev.filter((saved) => saved !== id)
      return [...prev, id]
    })
    setToast(
      savedIds.includes(id)
        ? `Removed ${place?.name ?? 'place'}`
        : `Saved to North Cascades trip`,
    )
  }

  // Opening a place from the trip page drops back to the map so the camera can
  // fly to its pin — the sheet always reads against the map behind it.
  const openPlaceFromList = (id: string) => {
    setListOpen(false)
    setSelectedId(id)
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'clip',
          bgcolor: tokens.mapLand,
        }}
      >
        {/* The map mounts once the share is tapped and then stays — remounting
            would replay the style load and lose the pins' camera. */}
        {screen === 'map' && (
          <>
            <TripMapCanvas
              restaurantsMode={restaurantsMode}
              savedIds={savedIds}
              selectedId={selectedId}
              onSelectPlace={setSelectedId}
            />
            <PhoneStatusBar />
            <MapChrome
              restaurantsMode={restaurantsMode}
              onFilterRestaurants={() => setRestaurantsMode(true)}
              onClearFilter={() => setRestaurantsMode(false)}
              onOpenTrip={() => setListOpen(true)}
              placeCount={tripPlaces.length}
              dimmed={selectedId !== null}
            />
            <HomeIndicator />

            <PlaceDetailSheet
              place={selected}
              saved={selectedId !== null && savedIds.includes(selectedId)}
              onToggleSave={() => selectedId && toggleSave(selectedId)}
              onClose={() => setSelectedId(null)}
              onPrev={() => stepPin(-1)}
              onNext={() => stepPin(1)}
              position={{ index: Math.max(pinIndex, 0), total: pins.length }}
            />

            <TripListPage
              open={listOpen}
              places={tripPlaces}
              savedIds={savedIds}
              onClose={() => setListOpen(false)}
              onOpenPlace={openPlaceFromList}
            />
          </>
        )}

        {screen === 'start' && <StartFrame onOpenMaps={() => setScreen('map')} />}

        {/* Save confirmation. It rides the top strip rather than the bottom
            because the detail sheet owns the lower two-thirds of the frame. */}
        <Box
          sx={{
            position: 'absolute',
            left: 24,
            right: 24,
            top: 118,
            zIndex: 40,
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none',
            opacity: toast ? 1 : 0,
            transform: toast ? 'translateY(0)' : 'translateY(-8px)',
            transition: `opacity 200ms ${MOTION_EMPHASIZED}, transform 200ms ${MOTION_EMPHASIZED}`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              px: '16px',
              py: '10px',
              borderRadius: '999px',
              bgcolor: tokens.ink,
            }}
          >
            <BookmarkIcon sx={{ fontSize: 16, color: tokens.surface }} />
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 500,
                color: tokens.surface,
                whiteSpace: 'nowrap',
              }}
            >
              {toast ?? lastToast.current}
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
