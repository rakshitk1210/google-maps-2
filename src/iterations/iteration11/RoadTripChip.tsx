import { Box, ButtonBase, Typography } from '@mui/material'
import { GeminiSpark } from './GeminiSpark'
import { CHIP_NEXT, CHIP_TITLE } from './roadTripData'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface RoadTripChipProps {
  /** Reopens the itinerary sheet over the drive. */
  onClick: () => void
}

// The active-trip chip that hangs under the banner while driving the
// Gemini-planned route (iteration 10's JamChip slot). Two lines carry the
// "destination No. 1" framing from the sketch — the route itself stays
// SEA → VAN, so the chip does the textual work. Tapping reopens the itinerary.
export function RoadTripChip({ onClick }: RoadTripChipProps) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        position: 'absolute',
        // Below the banner (58 + ~76) and its hanging Then chip (52) + gap.
        top: 196,
        left: 16,
        zIndex: 5,
        borderRadius: '20px',
        bgcolor: tokens.cyanContainer,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        p: '8px 14px',
        textAlign: 'left',
        animation: `badge-in 360ms 150ms ${MOTION_EMPHASIZED} both`,
        '@keyframes badge-in': {
          from: { opacity: 0, transform: 'translateY(-10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <GeminiSpark size={20} />
      <Box sx={{ minWidth: 0 }}>
        <Typography noWrap sx={{ fontSize: 14, fontWeight: 600, color: tokens.onCyan, lineHeight: 1.25 }}>
          {CHIP_TITLE}
        </Typography>
        <Typography noWrap sx={{ fontSize: 12.5, fontWeight: 400, color: tokens.onCyan, opacity: 0.8, lineHeight: 1.25 }}>
          {CHIP_NEXT}
        </Typography>
      </Box>
    </ButtonBase>
  )
}
