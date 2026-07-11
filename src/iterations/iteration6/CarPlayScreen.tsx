import { Box } from '@mui/material'
import { CarPlayStatusBar } from './CarPlayStatusBar'
import { CarPlayMap } from './CarPlayMap'
import { CarPlayBanner } from './CarPlayBanner'
import { CompassBadge } from './CompassBadge'
import { CarPlayRail } from './CarPlayRail'
import { CarPlayEtaBar } from './CarPlayEtaBar'
import { DeviceGlow } from './DeviceGlow'
import { MOTION_EMPHASIZED, tokens } from './theme'
import type { JamFlow, RouteTarget } from './jamData'

interface CarPlayScreenProps {
  jamFlow: JamFlow
  routeTarget: RouteTarget
  onInvite: () => void
}

// CarPlay head unit: 720×432 screen (800×480 aspect) inside a dark bezel.
// Layout follows design.md §6.13 active navigation, scaled to the landscape
// canvas, plus the narrow CarPlay system column on the left.
export function CarPlayScreen({ jamFlow, routeTarget, onInvite }: CarPlayScreenProps) {
  const joined = jamFlow === 'joined'
  const toCafe = routeTarget === 'cafe'

  return (
    <Box
      sx={{
        p: '12px',
        bgcolor: tokens.carPlayBezel,
        borderRadius: '24px',
        boxShadow: joined ? `${tokens.shadowDevice}, ${tokens.outerGlow}` : tokens.shadowDevice,
        transition: `box-shadow 360ms ${MOTION_EMPHASIZED}`,
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
          <CarPlayMap joined={joined} routeTarget={routeTarget} />
          <CarPlayBanner toCafe={toCafe} />
          <CompassBadge />
          <CarPlayRail jamFlow={jamFlow} onInvite={onInvite} />
          <CarPlayEtaBar toCafe={toCafe} />
        </Box>

        <DeviceGlow active={joined} />
      </Box>
    </Box>
  )
}
