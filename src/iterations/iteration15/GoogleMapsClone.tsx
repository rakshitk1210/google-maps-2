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
import { AskMapsSheet } from './AskMapsSheet'
import { FakeKeyboard } from './FakeKeyboard'
import { CONTRIBUTABLE_PLACES, TRIP_PLACES, type TripPlace } from './tripData'
import { theme, tokens } from './theme'

type Screen = 'lists' | 'listDetail' | 'roadtrip' | 'preview' | 'nav'

// Iteration 15 — Ask Maps inside the itinerary. Iteration 13's Road Trip Jam
// (shared "Skagit Valley" list → road-trip mode → preview → nav) gains an AI
// search entry: the gradient "Ask Maps" pill on the list sheet expands into an
// inline query card, typing happens over a fake iOS keyboard, and submitting
// opens a results sheet — user bubble, typewritten answer, two cafe cards.
// A card's ↗ drops into the existing route preview, so "found by AI" places
// navigate exactly like curated ones.
export function GoogleMapsClone() {
  const [screen, setScreen] = useState<Screen>('lists')
  const [selectedPlace, setSelectedPlace] = useState<TripPlace | null>(null)
  // Hoisted so the filter + list scroll survive the roadtrip ↔ switcher trip.
  const [category, setCategory] = useState('All')
  const [snap, setSnap] = useState<SheetSnap>('peek')
  const [switcherOpen, setSwitcherOpen] = useState(false)
  // The shared itinerary — a single ordered list that the fam grows mid-trip
  // ("Add places") and rearranges by dragging rows (drag-to-reorder in the
  // list-detail sheet). One source of truth so the arranged order shows up on
  // the map and in the road-trip itinerary too.
  const [places, setPlaces] = useState<TripPlace[]>(TRIP_PLACES)
  const [justAddedId, setJustAddedId] = useState<string | null>(null)
  const addIndexRef = useRef(0)
  const hornPlayed = useRef(false)

  // Ask Maps — overlay state on top of the listDetail screen. The inline card
  // (askOpen + draft) lives up here so it survives the results → preview →
  // back round trip; askQuery non-null means the results sheet is up.
  const [askOpen, setAskOpen] = useState(false)
  const [askDraft, setAskDraft] = useState('')
  const [askQuery, setAskQuery] = useState<string | null>(null)
  const [askKeyboard, setAskKeyboard] = useState(false)
  const [askReturning, setAskReturning] = useState(false)
  const cameFromAsk = useRef(false)

  const mode = screen === 'preview' ? 'preview' : screen === 'nav' ? 'nav' : 'overview'

  // "Add places" — pulls the next spot off the contribution pool, tags it onto
  // the top of the list, and clears the filter so the new pin is always seen.
  const handleAddPlace = () => {
    const pool = CONTRIBUTABLE_PLACES
    const base = pool[addIndexRef.current % pool.length]
    addIndexRef.current += 1
    const place: TripPlace = { ...base, id: `${base.id}-${addIndexRef.current}` }
    setPlaces((prev) => [place, ...prev])
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

  // ── Ask Maps ──────────────────────────────────────────────────────────────
  const openAsk = () => {
    setAskOpen(true)
    // Same precedent as handleAddPlace — the card (plus keyboard, once the
    // field focuses) needs the full sheet.
    setSnap('full')
  }

  const closeAsk = () => {
    setAskOpen(false)
    setAskKeyboard(false)
  }

  const submitAsk = () => {
    if (!askDraft.trim()) return
    setAskQuery(askDraft.trim())
    setAskReturning(false)
    // Keyboard drops as the results sheet rises.
    setAskKeyboard(false)
  }

  // A result card's ↗ — straight into the shared preview → nav flow. Remember
  // where we came from so Back returns to the results, not the roadtrip.
  const handleAskOpenPlace = (place: TripPlace) => {
    cameFromAsk.current = true
    setSelectedPlace(place)
    setScreen('preview')
  }

  const startNav = () => {
    // Once driving, the trip owns navigation — Back no longer returns to Ask.
    cameFromAsk.current = false
    setScreen('nav')
  }

  const backFromPreview = () => {
    setSelectedPlace(null)
    if (cameFromAsk.current) {
      cameFromAsk.current = false
      // Reopen the results sheet exactly as it was — no typewriter replay.
      setAskReturning(true)
      setScreen('listDetail')
      return
    }
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
        <TripMapCanvas mode={mode} place={selectedPlace} places={places} />
        <PhoneStatusBar />

        {screen === 'lists' && (
          <>
            <YouListsSheet onOpenSkagit={openSkagit} />
            <BottomNav activeTab="you" onSelectTab={() => {}} />
          </>
        )}

        {screen === 'listDetail' && (
          <>
            <ListDetailSheet
              snap={snap}
              onSnapChange={setSnap}
              category={category}
              onCategoryChange={setCategory}
              places={places}
              onReorder={setPlaces}
              justAddedId={justAddedId}
              onAnimatedIn={() => setJustAddedId(null)}
              onClose={closeListDetail}
              onStartRoadtrip={startRoadtrip}
              onAddPlace={handleAddPlace}
              onDirections={handleDirections}
              askOpen={askOpen}
              askDraft={askDraft}
              onAskDraftChange={setAskDraft}
              onAskOpen={openAsk}
              onAskClose={closeAsk}
              onAskFocus={() => setAskKeyboard(true)}
              onAskSubmit={submitAsk}
            />
            {/* Results sheet + fake keyboard overlay the list sheet; both stay
                mounted so their translateY slides animate in and out. */}
            <AskMapsSheet
              open={askQuery !== null}
              query={askQuery}
              skipAnimation={askReturning}
              onOpenPlace={handleAskOpenPlace}
              onClose={() => setAskQuery(null)}
            />
            <FakeKeyboard visible={askKeyboard} />
          </>
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
          places={places}
          onDirections={handleDirections}
          onClose={() => setSwitcherOpen(false)}
        />
      </Box>
    </ThemeProvider>
  )
}
