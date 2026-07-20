import { useState } from 'react'
import { Box, ThemeProvider } from '@mui/material'
import { TripMapCanvas } from './TripMapCanvas'
import { PhoneStatusBar } from './PhoneStatusBar'
import { NavBanner } from './NavBanner'
import { NavRail } from './NavRail'
import { NavBottomBar } from './NavBottomBar'
import { RoutePreview } from './RoutePreview'
import { AiTripSheet } from './AiTripSheet'
import { RoadTripChip } from './RoadTripChip'
import { StopDetailSheet } from './StopDetailSheet'
import {
  NAV_ETA,
  STOPS,
  TRIP_DEST,
  chipNextForStop,
  navEtaForStop,
  navForStop,
  type TripStop,
} from './roadTripData'
import { theme, tokens } from './theme'

type Screen = 'preview' | 'nav'

// Iteration 11 — "Make it a Road Trip". The app opens on a Seattle → Vancouver
// route preview. Next to the usual Start pill sits a Gemini-branded "Make it a
// Road Trip" button; tapping it opens an AI-planned itinerary sheet (4 stops
// along I-5) and strings photo markers across the map. Starting *that* trip
// navigates to the first stop (Snow Goose Produce) with a "SEA → VAN Road Trip"
// chip under the banner — tapping the chip reopens the itinerary with that stop
// as "Next stop". Plain Start drives to Vancouver with no chip or markers, so
// the AI button demonstrably changes the drive.
export function GoogleMapsClone() {
  const [screen, setScreen] = useState<Screen>('preview')
  const [aiSheetOpen, setAiSheetOpen] = useState(false)
  const [tripActive, setTripActive] = useState(false)
  // Which stop is the trip's first destination (default: stop 1).
  const [selectedStopId, setSelectedStopId] = useState(STOPS[0].id)
  // Stop whose detail page is open on top of the itinerary (null = closed).
  const [detailStop, setDetailStop] = useState<TripStop | null>(null)

  const selectedStop = STOPS.find((s) => s.id === selectedStopId) ?? STOPS[0]

  // Plain Start — straight to Vancouver, no Gemini trip.
  const handleStart = () => {
    setScreen('nav')
  }

  // Sheet's Start — commit the Gemini trip, then drive to the chosen first stop.
  const handleTripStart = () => {
    setAiSheetOpen(false)
    setDetailStop(null)
    setTripActive(true)
    setScreen('nav')
  }

  // "Go here first" from a stop's detail page — make it the first stop and drive.
  const handleGoFirst = (stop: TripStop) => {
    setSelectedStopId(stop.id)
    setDetailStop(null)
    setAiSheetOpen(false)
    setTripActive(true)
    setScreen('nav')
  }

  const handleExit = () => {
    setScreen('preview')
    setTripActive(false)
    setAiSheetOpen(false)
    setDetailStop(null)
    setSelectedStopId(STOPS[0].id)
  }

  // Stop markers are on while the sheet is open (either mode) or the committed
  // trip is driving.
  const stopsVisible = aiSheetOpen || (tripActive && screen === 'nav')
  const sheetMode = tripActive && screen === 'nav' ? 'active' : 'plan'
  // Preview always shows the full SEA→VAN corridor; once the road trip is
  // active, nav routes to the chosen first stop instead of Vancouver.
  const mapDest = tripActive && screen === 'nav' ? navForStop(selectedStop) : TRIP_DEST
  const navEta = tripActive ? navEtaForStop(selectedStop) : NAV_ETA

  return (
    <ThemeProvider theme={theme}>
      {/* overflow: clip — the sheets overhang the frame; a focus inside one
          would otherwise scroll this box off-kilter. */}
      <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'clip', bgcolor: tokens.mapLand }}>
        <TripMapCanvas
          phase={screen === 'preview' ? 'preview' : 'nav'}
          dest={mapDest}
          stopsVisible={stopsVisible}
          sheetOpen={aiSheetOpen}
        />
        <PhoneStatusBar />

        {screen === 'nav' && (
          <>
            <NavBanner road={mapDest.bannerRoad} />
            {tripActive && (
              <RoadTripChip onClick={() => setAiSheetOpen(true)} nextText={chipNextForStop(selectedStop)} />
            )}
            <NavRail />
            <NavBottomBar duration={navEta.duration} meta={navEta.meta} onExit={handleExit} />
          </>
        )}

        {screen === 'preview' && (
          <RoutePreview onStart={handleStart} onMakeRoadTrip={() => setAiSheetOpen(true)} />
        )}

        {aiSheetOpen && (
          <AiTripSheet
            mode={sheetMode}
            selectedStopId={selectedStopId}
            nextText={chipNextForStop(selectedStop)}
            onClose={() => setAiSheetOpen(false)}
            onStart={handleTripStart}
            onSelectStop={setSelectedStopId}
            onOpenStop={setDetailStop}
          />
        )}

        {detailStop && (
          <StopDetailSheet
            stop={detailStop}
            stopIndex={STOPS.findIndex((s) => s.id === detailStop.id)}
            onClose={() => setDetailStop(null)}
            onGoFirst={handleGoFirst}
          />
        )}
      </Box>
    </ThemeProvider>
  )
}
