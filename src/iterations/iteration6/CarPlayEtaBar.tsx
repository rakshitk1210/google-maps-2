import { Box, Button, Typography } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf'
import {
  CAFE_TRIP_DISTANCE_ETA,
  CAFE_TRIP_DURATION,
  FULL_TRIP_DISTANCE_ETA,
  FULL_TRIP_DURATION,
} from './jamData'
import { tokens } from './theme'

interface CarPlayEtaBarProps {
  toCafe: boolean
}

// Bottom bar, design.md §6.13 adapted to the landscape CarPlay canvas:
// Gemini spark circle · ETA in --green + leaf with gray meta · Exit pill
// (6.7 destructive tonal). No drag handle — car UI doesn't swipe. Shows the
// short cafe ETA once the phone re-routes the car.
export function CarPlayEtaBar({ toCafe }: CarPlayEtaBarProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 5,
        height: 68,
        bgcolor: tokens.surface,
        borderRadius: '16px 16px 0 0',
        boxShadow: tokens.shadowSheet,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        px: '16px',
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          flexShrink: 0,
          bgcolor: tokens.surface,
          border: `1px solid ${tokens.hairline}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AutoAwesomeIcon sx={{ fontSize: 22, color: tokens.blue }} />
      </Box>

      <Box sx={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <Typography sx={{ fontSize: 22, fontWeight: 600, color: tokens.green, lineHeight: 1.2 }}>
            {toCafe ? CAFE_TRIP_DURATION : FULL_TRIP_DURATION}
          </Typography>
          <EnergySavingsLeafIcon sx={{ fontSize: 14, color: tokens.green }} />
        </Box>
        <Typography sx={{ fontSize: 14, fontWeight: 400, color: tokens.inkSecondary, lineHeight: 1.2 }}>
          {toCafe ? CAFE_TRIP_DISTANCE_ETA : FULL_TRIP_DISTANCE_ETA}
        </Typography>
      </Box>

      <Button
        sx={{
          flexShrink: 0,
          height: 44,
          px: '22px',
          borderRadius: 999,
          bgcolor: tokens.redContainer,
          color: tokens.red,
          fontSize: 16,
          fontWeight: 500,
          textTransform: 'none',
          '&:hover': { bgcolor: tokens.redContainer },
        }}
      >
        Exit
      </Button>
    </Box>
  )
}
