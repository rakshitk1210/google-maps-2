import { Box, Typography } from '@mui/material'
import TurnRightIcon from '@mui/icons-material/TurnRight'
import RoundaboutLeftIcon from '@mui/icons-material/RoundaboutLeft'
import {
  BANNER_DISTANCE,
  BANNER_INSTRUCTION,
  CAFE_BANNER_DISTANCE,
  CAFE_BANNER_INSTRUCTION,
} from './jamData'
import { tokens } from './theme'

interface CarPlayBannerProps {
  toCafe: boolean
}

// Instruction banner, design.md §6.13 scaled for the CarPlay canvas:
// --teal-banner card radius 24 with white maneuver arrow + distance, dim
// "toward" line, and the darker-teal "Then" chip attached below the left
// corner. Flat (rule 0.10). Swaps to the cafe approach when the phone
// re-routes the car to a cafe stop.
export function CarPlayBanner({ toCafe }: CarPlayBannerProps) {
  return (
    <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 5, width: 296 }}>
      <Box
        sx={{
          bgcolor: tokens.tealBanner,
          borderRadius: '24px',
          p: '14px 18px',
          boxShadow: tokens.shadowFloat,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <TurnRightIcon sx={{ fontSize: 36, color: '#fff', flexShrink: 0 }} />
          <Typography
            sx={{ fontSize: 28, fontWeight: 500, color: '#fff', letterSpacing: '-0.2px', lineHeight: 1.1 }}
          >
            {toCafe ? CAFE_BANNER_DISTANCE : BANNER_DISTANCE}
          </Typography>
        </Box>
        <Typography
          sx={{ fontSize: 17, fontWeight: 400, color: 'rgba(255,255,255,0.85)', mt: '4px', ml: '48px' }}
        >
          {toCafe ? CAFE_BANNER_INSTRUCTION : BANNER_INSTRUCTION}
        </Typography>
      </Box>

      {!toCafe && (
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            bgcolor: tokens.tealThen,
            borderRadius: '0 0 16px 16px',
            height: 40,
            px: '14px',
            ml: '20px',
            mt: '-4px',
            position: 'relative',
          }}
        >
          <Typography sx={{ fontSize: 15, fontWeight: 400, color: 'rgba(255,255,255,0.85)' }}>Then</Typography>
          <RoundaboutLeftIcon sx={{ fontSize: 20, color: '#fff' }} />
        </Box>
      )}
    </Box>
  )
}
