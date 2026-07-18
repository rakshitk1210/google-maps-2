import { Box, Typography } from '@mui/material'
import StraightIcon from '@mui/icons-material/Straight'
import TurnRightIcon from '@mui/icons-material/TurnRight'
import { BANNER_ROAD, BANNER_TOWARD, THEN_LABEL } from './navData'
import { MOTION_EMPHASIZED, tokens } from './theme'

// Portrait instruction banner, design.md §6.13: --teal-banner card, radius 24,
// 16px side margins, top 58px, 40px white maneuver arrow. Flat (rule 0.10).
// The "Then ↱" chip hangs off the banner's bottom-left — the banner's own
// bottom-left corner squares off so the two read as one connected shape.
export function NavBanner() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 58,
        left: 16,
        right: 16,
        zIndex: 5,
        animation: `nav-banner-in 360ms ${MOTION_EMPHASIZED} both`,
        '@keyframes nav-banner-in': {
          from: { opacity: 0, transform: 'translateY(-16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Box
        sx={{
          bgcolor: tokens.tealBanner,
          borderRadius: '24px 24px 24px 0',
          p: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: tokens.shadowFloat,
        }}
      >
        <StraightIcon sx={{ fontSize: 40, color: '#fff', flexShrink: 0 }} />
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '8px', minWidth: 0 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 400, color: 'rgba(255,255,255,0.85)' }}>
            {BANNER_TOWARD}
          </Typography>
          <Typography
            noWrap
            sx={{ fontSize: 30, fontWeight: 500, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.2px' }}
          >
            {BANNER_ROAD}
          </Typography>
        </Box>
      </Box>

      {/* Next-maneuver chip */}
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          height: 52,
          px: '18px',
          bgcolor: tokens.tealThen,
          borderRadius: '0 0 20px 20px',
          boxShadow: tokens.shadowFloat,
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 400, color: '#fff' }}>{THEN_LABEL}</Typography>
        <TurnRightIcon sx={{ fontSize: 26, color: '#fff' }} />
      </Box>
    </Box>
  )
}
