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
import { NAV_ETA, NEXT_STOP_NAV, NEXT_STOP_NAV_ETA, TRIP_DEST } from './roadTripData'
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

  // Plain Start — straight to Vancouver, no Gemini trip.
  const handleStart = () => {
    setScreen('nav')
  }

  // Sheet's Start — commit the Gemini trip, then drive to stop 1.
  const handleTripStart = () => {
    setAiSheetOpen(false)
    setTripActive(true)
    setScreen('nav')
  }

  const handleExit = () => {
    setScreen('preview')
    setTripActive(false)
    setAiSheetOpen(false)
  }

  // Stop markers are on while the sheet is open (either mode) or the committed
  // trip is driving.
  const stopsVisible = aiSheetOpen || (tripActive && screen === 'nav')
  const sheetMode = tripActive && screen === 'nav' ? 'active' : 'plan'
  // Preview always shows the full SEA→VAN corridor; once the road trip is
  // active, nav routes to the first stop instead of Vancouver.
  const mapDest = tripActive && screen === 'nav' ? NEXT_STOP_NAV : TRIP_DEST
  const navEta = tripActive ? NEXT_STOP_NAV_ETA : NAV_ETA

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
            {tripActive && <RoadTripChip onClick={() => setAiSheetOpen(true)} />}
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
            onClose={() => setAiSheetOpen(false)}
            onStart={handleTripStart}
          />
        )}
      </Box>
    </ThemeProvider>
  )
}
