import { Box, Typography } from '@mui/material'
import TurnRightIcon from '@mui/icons-material/TurnRight'
import {
  BANNER_DISTANCE,
  BANNER_INSTRUCTION,
  CAFE_BANNER_DISTANCE,
  CAFE_BANNER_INSTRUCTION,
} from './jamData'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface PhoneNavBannerProps {
  toCafe: boolean
}

// Portrait instruction banner, design.md §6.13: --teal-banner card, radius 24,
// 16px side margins, top 58px, 40px white maneuver arrow, distance + "toward"
// line. Flat (rule 0.10). Mirrors the CarPlay banner so both devices show the
// same turn — and the same cafe re-route.
export function PhoneNavBanner({ toCafe }: PhoneNavBannerProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 58,
        left: 16,
        right: 16,
        zIndex: 5,
        bgcolor: tokens.tealBanner,
        borderRadius: '24px',
        p: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: tokens.shadowFloat,
        animation: `phone-nav-banner-in 360ms ${MOTION_EMPHASIZED} both`,
        '@keyframes phone-nav-banner-in': {
          from: { opacity: 0, transform: 'translateY(-16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <TurnRightIcon sx={{ fontSize: 40, color: '#fff', flexShrink: 0 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{ fontSize: 30, fontWeight: 500, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.2px' }}
        >
          {toCafe ? CAFE_BANNER_DISTANCE : BANNER_DISTANCE}
        </Typography>
        <Typography sx={{ fontSize: 18, fontWeight: 400, color: 'rgba(255,255,255,0.85)', mt: '2px' }}>
          {toCafe ? CAFE_BANNER_INSTRUCTION : BANNER_INSTRUCTION}
        </Typography>
      </Box>
    </Box>
  )
}
