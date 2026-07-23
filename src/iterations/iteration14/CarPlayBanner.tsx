import { Box, Typography } from '@mui/material'
import TurnLeftIcon from '@mui/icons-material/TurnLeft'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface CarPlayBannerProps {
  distance: string
  /** Road name — rendered as "toward {road}" per the Figma frame. */
  road: string
}

// Instruction banner, design.md §6.13 scaled for the CarPlay canvas:
// --teal-banner card radius 24 with white maneuver arrow + distance and the
// dim "toward" street line. Flat (rule 0.10). Props-driven so the banner can
// swap to the selected place's leg after "Go".
export function CarPlayBanner({ distance, road }: CarPlayBannerProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 6,
        width: 320,
        animation: `banner-in 240ms ${MOTION_EMPHASIZED} both`,
        '@keyframes banner-in': {
          from: { opacity: 0, transform: 'translateY(-8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Box
        sx={{
          bgcolor: tokens.tealBanner,
          borderRadius: '24px',
          p: '14px 18px',
          boxShadow: tokens.shadowFloat,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <TurnLeftIcon sx={{ fontSize: 36, color: '#fff', flexShrink: 0 }} />
          <Typography
            sx={{ fontSize: 28, fontWeight: 500, color: '#fff', letterSpacing: '-0.2px', lineHeight: 1.1 }}
          >
            {distance}
          </Typography>
        </Box>
        <Typography
          sx={{ fontSize: 17, fontWeight: 400, color: 'rgba(255,255,255,0.85)', mt: '4px', ml: '48px' }}
        >
          toward {road}
        </Typography>
      </Box>
    </Box>
  )
}
