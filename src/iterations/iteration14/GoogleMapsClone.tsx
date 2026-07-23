import { useState } from 'react'
import { Box, ThemeProvider } from '@mui/material'
import { CarPlayScreen } from './CarPlayScreen'
import type { Phase } from './CarPlayMap'
import type { TripPlace } from './tripData'
import { theme } from './theme'

// Iteration 14 renders a single CarPlay head unit instead of the shared
// 402×872 .phone-frame — PhoneFrame early-returns here. Mid-drive, the
// road-trip faces button opens Kelley's Roadtrip as a side panel (frame 2);
// "Get directions" on any place previews the leg (frame 3); "Go" starts
// navigation toward it. Reopening the panel from the preview swaps between
// saved places without ever entering search.
export function GoogleMapsClone() {
  const [phase, setPhase] = useState<Phase>('driving')
  const [panelOpen, setPanelOpen] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<TripPlace | null>(null)

  const handleDirections = (place: TripPlace) => {
    setSelectedPlace(place)
    setPanelOpen(false)
    setPhase('preview')
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CarPlayScreen
          phase={phase}
          panelOpen={panelOpen}
          selectedPlace={selectedPlace}
          onTogglePanel={() => setPanelOpen((open) => !open)}
          onDirections={handleDirections}
          onGo={() => setPhase('navToPlace')}
        />
      </Box>
    </ThemeProvider>
  )
}
