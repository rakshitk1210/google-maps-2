import { useRef, useState } from 'react'
import { Box, ThemeProvider } from '@mui/material'
import { TripMapCanvas } from './TripMapCanvas'
import { PhoneStatusBar } from './PhoneStatusBar'
import { BottomNav } from './BottomNav'
import { YouListsSheet } from './YouListsSheet'
import { ListDetailSheet } from './ListDetailSheet'
import { TripSheet, type SheetSnap } from './TripSheet'
import { RoutePreview } from './RoutePreview'
import { NavBanner } from './NavBanner'
import { RoadTripBadge } from './RoadTripBadge'
import { NavBottomBar } from './NavBottomBar'
import { CONTRIBUTABLE_PLACES, TRIP_PLACES, type TripPlace } from './tripData'
import { theme, tokens } from './theme'

type Screen = 'lists' | 'listDetail' | 'roadtrip' | 'preview' | 'nav'

// Iteration 13 — the Road Trip Jam. The fam's shared "Skagit Valley" list lives
// under the "You" tab; opening it shows the collaborative itinerary with a
// "Start a road trip" CTA that drops into a road-trip mode map (every marked
// place as a photo pin). Picking one previews the drive, Start begins nav, and
// the persistent "Road Trip" chip reopens the itinerary mid-drive so the fam
// can switch destinations — which always lands back on route preview (Start
// again) rather than re-routing live underneath the driver.
export function GoogleMapsClone() {
  const [screen, setScreen] = useState<Screen>('lists')
  const [selectedPlace, setSelectedPlace] = useState<TripPlace | null>(null)
  // Hoisted so the filter + list scroll survive the roadtrip ↔ switcher trip.
  const [category, setCategory] = useState('All')
  const [snap, setSnap] = useState<SheetSnap>('peek')
  const [switcherOpen, setSwitcherOpen] = useState(false)
  // Live contributions the fam adds mid-trip — prepended to the itinerary and
  // dropped onto the map, so the shared list visibly grows (never static).
  const [extraPlaces, setExtraPlaces] = useState<TripPlace[]>([])
  const [justAddedId, setJustAddedId] = useState<string | null>(null)
  const addIndexRef = useRef(0)
  const hornPlayed = useRef(false)

  const mode = screen === 'preview' ? 'preview' : screen === 'nav' ? 'nav' : 'overview'
  const allPlaces = [...extraPlaces, ...TRIP_PLACES]

  // "Add places" — pulls the next spot off the contribution pool, tags it onto
  // the top of the list, and clears the filter so the new pin is always seen.
  const handleAddPlace = () => {
    const pool = CONTRIBUTABLE_PLACES
    const base = pool[addIndexRef.current % pool.length]
    addIndexRef.current += 1
    const place: TripPlace = { ...base, id: `${base.id}-${addIndexRef.current}` }
    setExtraPlaces((prev) => [place, ...prev])
    setJustAddedId(place.id)
    setCategory('All')
    // Open the sheet fully so the new row's pop-in is always in view.
    setSnap('full')
  }

  const openSkagit = () => {
    setSnap('peek')
    setScreen('listDetail')
  }

  const closeListDetail = () => setScreen('lists')

  const startRoadtrip = () => {
    setSelectedPlace(null)
    setSnap('peek')
    setScreen('roadtrip')
    // The little horn toot from iteration 7, once per session.
    if (!hornPlayed.current) {
      hornPlayed.current = true
      const horn = new Audio('/audio/road-trip-toggle.mp3')
      horn.volume = 0.5
      horn.play().catch(() => {})
    }
  }

  // From the itinerary (roadtrip) or the mid-drive switcher: preview the route.
  const handleDirections = (next: TripPlace) => {
    setSelectedPlace(next)
    setSwitcherOpen(false)
    setScreen('preview')
  }

  const startNav = () => setScreen('nav')

  const backFromPreview = () => {
    setSelectedPlace(null)
    setScreen('roadtrip')
  }

  const exitNav = () => {
    setSelectedPlace(null)
    setSwitcherOpen(false)
    setScreen('roadtrip')
  }

  return (
    <ThemeProvider theme={theme}>
      {/* overflow: clip (not hidden) — the parked sheet overhangs the frame,
          and a focus inside it would otherwise scroll this box off-kilter. */}
      <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'clip', bgcolor: tokens.mapLand }}>
        <TripMapCanvas mode={mode} place={selectedPlace} places={allPlaces} />
        <PhoneStatusBar />

        {screen === 'lists' && (
          <>
            <YouListsSheet onOpenSkagit={openSkagit} />
            <BottomNav activeTab="you" onSelectTab={() => {}} />
          </>
        )}

        {screen === 'listDetail' && (
          <ListDetailSheet
            snap={snap}
            onSnapChange={setSnap}
            category={category}
            onCategoryChange={setCategory}
            extraPlaces={extraPlaces}
            justAddedId={justAddedId}
            onAnimatedIn={() => setJustAddedId(null)}
            onClose={closeListDetail}
            onStartRoadtrip={startRoadtrip}
            onAddPlace={handleAddPlace}
            onDirections={handleDirections}
          />
        )}

        {screen === 'preview' && selectedPlace && (
          <>
            <RoutePreview place={selectedPlace} onBack={backFromPreview} onStart={startNav} />
            <RoadTripBadge onClick={() => setSwitcherOpen(true)} />
          </>
        )}

        {screen === 'nav' && selectedPlace && (
          <>
            <NavBanner road={selectedPlace.bannerRoad} />
            <RoadTripBadge onClick={() => setSwitcherOpen(true)} />
            <NavBottomBar duration={selectedPlace.driveTime} meta={selectedPlace.tripMeta} onExit={exitNav} />
          </>
        )}

        {/* Always mounted — parking it off-screen preserves the category filter
            and scroll position across the roadtrip → switcher round trip. Shown
            as the itinerary tab on the roadtrip screen, or as an over-nav
            switcher (scrim + drag-to-dismiss) from preview / nav. */}
        <TripSheet
          visible={screen === 'roadtrip' || switcherOpen}
          variant={switcherOpen ? 'overNav' : 'tab'}
          snap={snap}
          onSnapChange={setSnap}
          category={category}
          onCategoryChange={setCategory}
          extraPlaces={extraPlaces}
          onDirections={handleDirections}
          onClose={() => setSwitcherOpen(false)}
        />
      </Box>
    </ThemeProvider>
  )
}
