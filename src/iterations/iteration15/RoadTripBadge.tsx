import { ButtonBase, Typography } from '@mui/material'
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface RoadTripBadgeProps {
  onClick: () => void
}

// The in-drive "Road Trip" chip from the iteration 9 sketch: a cyan tonal pill
// hanging beside the banner's Then-chip. Tapping it opens the trip itinerary
// over the driving view so the fam can reroute without ever exiting nav.
export function RoadTripBadge({ onClick }: RoadTripBadgeProps) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        position: 'absolute',
        // Below the banner (58 + ~76) and its hanging Then chip (52) + gap.
        top: 196,
        left: 16,
        zIndex: 5,
        height: 40,
        px: '16px',
        borderRadius: 999,
        bgcolor: tokens.cyanContainer,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        animation: `badge-in 360ms 150ms ${MOTION_EMPHASIZED} both`,
        '@keyframes badge-in': {
          from: { opacity: 0, transform: 'translateY(-10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <DirectionsCarFilledIcon sx={{ fontSize: 20, color: tokens.teal }} />
      <Typography sx={{ fontSize: 15, fontWeight: 600, color: tokens.onCyan }}>Road Trip</Typography>
    </ButtonBase>
  )
}
