import { Box, Typography } from '@mui/material'
import { CURRENT_SPEED, SPEED_LIMIT } from './data'
import { tokens } from './theme'

// Speed cluster, top-right under the compass — mirrors the real CarPlay
// reference: a posted speed-limit sign (black on white) above a dark
// speedometer reading the live speed as the car drives I-5.
export function CarPlaySpeed() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 68,
        right: 12,
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 52,
          borderRadius: '10px',
          bgcolor: tokens.surface,
          border: `2px solid ${tokens.ink}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
        }}
      >
        <Typography sx={{ fontSize: 8, fontWeight: 700, color: tokens.ink, letterSpacing: '0.2px' }}>
          LIMIT
        </Typography>
        <Typography sx={{ fontSize: 22, fontWeight: 700, color: tokens.ink, lineHeight: 1 }}>
          {SPEED_LIMIT}
        </Typography>
      </Box>

      <Box
        sx={{
          width: 44,
          borderRadius: '12px',
          bgcolor: tokens.overlaySurface,
          py: '6px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          lineHeight: 1,
        }}
      >
        <Typography sx={{ fontSize: 20, fontWeight: 600, color: tokens.overlayOn, lineHeight: 1 }}>
          {CURRENT_SPEED}
        </Typography>
        <Typography sx={{ fontSize: 10, fontWeight: 400, color: tokens.overlayOnDim }}>mph</Typography>
      </Box>
    </Box>
  )
}
