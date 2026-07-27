import { useState } from 'react'
import { Box, ThemeProvider } from '@mui/material'
import { DriveMapCanvas, type DrivePhase } from './DriveMapCanvas'
import { NavChrome } from './NavChrome'
import { BillboardSheet } from './BillboardSheet'
import { TripListPage } from './TripListPage'
import { HomeIndicator, PhoneStatusBar } from './PhoneStatusBar'
import { NAV_CAFE, NAV_TRIP, TRIP_PLACES } from './tripData'
import { theme, tokens } from './theme'

/**
 * Iteration 17 — the trip from inside the drive. The user is already
 * navigating: a real animated drive, camera trailing the puck, road ticking
 * past. Two things reach into that drive without stopping it dead.
 *
 * A billboard stands beside the road. Tapping it freezes the trip and opens the
 * café — Directions frames the detour so it can be judged, Start commits it and
 * the car rolls on toward Cafe Ladro with the banner and ETA relabelled. Back
 * out instead and the original trip picks up exactly where it paused.
 *
 * A chip under the instruction banner opens the trip list. The drive keeps
 * running underneath it, so coming back puts you further down the road.
 */
export function GoogleMapsClone() {
  const [phase, setPhase] = useState<DrivePhase>('driving')
  const [listOpen, setListOpen] = useState(false)

  // Once the detour is committed the whole drive re-labels — same screen, new
  // destination, which is the point of rerouting rather than starting over.
  const nav = phase === 'navToCafe' ? NAV_CAFE : NAV_TRIP
  const sheetOpen = phase === 'billboard' || phase === 'preview'

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
        <DriveMapCanvas phase={phase} onBillboardClick={() => setPhase('billboard')} />

        <PhoneStatusBar />

        <NavChrome
          nav={nav}
          visible={!sheetOpen}
          onOpenTrip={() => setListOpen(true)}
          onExit={() => setPhase('driving')}
        />

        <BillboardSheet
          open={sheetOpen}
          previewing={phase === 'preview'}
          onStart={() => setPhase('navToCafe')}
          onDirections={() => setPhase('preview')}
          onClose={() => setPhase('driving')}
        />

        <TripListPage open={listOpen} places={TRIP_PLACES} onClose={() => setListOpen(false)} />

        <HomeIndicator />
      </Box>
    </ThemeProvider>
  )
}
