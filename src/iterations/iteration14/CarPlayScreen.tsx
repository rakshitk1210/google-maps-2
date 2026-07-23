import { Box } from '@mui/material'
import { CarPlayStatusBar } from './CarPlayStatusBar'
import { CarPlayMap, type Phase } from './CarPlayMap'
import { CarPlayBanner } from './CarPlayBanner'
import { CompassBadge } from './CompassBadge'
import { CarPlayEtaPill } from './CarPlayEtaPill'
import { MapButtonColumn } from './MapButtonColumn'
import { TripPanel } from './TripPanel'
import { DirectionsCard } from './DirectionsCard'
import {
  BANNER_DISTANCE,
  BANNER_TOWARD,
  ETA_ARRIVAL,
  ETA_DISTANCE,
  ETA_DURATION,
  type TripPlace,
} from './tripData'
import { tokens } from './theme'

interface CarPlayScreenProps {
  phase: Phase
  panelOpen: boolean
  selectedPlace: TripPlace | null
  onTogglePanel: () => void
  onDirections: (place: TripPlace) => void
  onGo: () => void
}

// CarPlay head unit: 720×432 screen (800×480 aspect) inside a dark bezel.
// Layout is [system rail 64px][map area flex][itinerary panel] — the panel's
// width animation is what splits the screen in frame 2. Turn banner top-left,
// compass top-right over the button column, floating ETA pill bottom-left.
// In preview the banner/pill yield to the directions card (frame 3).
export function CarPlayScreen({
  phase,
  panelOpen,
  selectedPlace,
  onTogglePanel,
  onDirections,
  onGo,
}: CarPlayScreenProps) {
  const showNavChrome = phase !== 'preview'
  // After "Go" the banner and pill carry the selected place's leg.
  const toPlace = phase === 'navToPlace' && selectedPlace ? selectedPlace : null

  return (
    <Box
      sx={{
        p: '12px',
        bgcolor: tokens.carPlayBezel,
        borderRadius: '24px',
        boxShadow: tokens.shadowDevice,
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 720,
          height: 432,
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          bgcolor: tokens.mapLand,
        }}
      >
        <CarPlayStatusBar />

        <Box sx={{ position: 'relative', flex: 1, minWidth: 0 }}>
          <CarPlayMap phase={phase} place={selectedPlace} />
          {showNavChrome && (
            <CarPlayBanner
              distance={toPlace ? toPlace.bannerDistance : BANNER_DISTANCE}
              road={toPlace ? toPlace.bannerToward : BANNER_TOWARD}
            />
          )}
          <CompassBadge />
          {showNavChrome && (
            <CarPlayEtaPill
              arrival={toPlace ? toPlace.arrival : ETA_ARRIVAL}
              duration={toPlace ? toPlace.durationMin : ETA_DURATION}
              distance={toPlace ? toPlace.distanceMi : ETA_DISTANCE}
            />
          )}
          {phase === 'preview' && !panelOpen && selectedPlace && (
            <DirectionsCard place={selectedPlace} onGo={onGo} />
          )}
          <MapButtonColumn panelOpen={panelOpen} onToggle={onTogglePanel} />
        </Box>

        <TripPanel open={panelOpen} onDirections={onDirections} />
      </Box>
    </Box>
  )
}
