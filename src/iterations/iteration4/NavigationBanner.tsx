import { Box, IconButton, Typography } from '@mui/material'
import TurnRightIcon from '@mui/icons-material/TurnRight'
import TurnLeftIcon from '@mui/icons-material/TurnLeft'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { GEM_NAV_DISTANCE, GEM_NAV_INSTRUCTION, NAV_DISTANCE, NAV_INSTRUCTION } from './gemData'
import { tokens } from './theme'

interface NavigationBannerProps {
  rerouted: boolean
}

// Instruction banner, design.md 6.13: floating card, radius 24, 12px side
// margins, top 58px, 20px padding, 40px white maneuver arrow.
export function NavigationBanner({ rerouted }: NavigationBannerProps) {
  const ArrowIcon = rerouted ? TurnLeftIcon : TurnRightIcon

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 58,
        left: 12,
        right: 12,
        zIndex: 5,
        bgcolor: tokens.tealBanner,
        borderRadius: '24px',
        p: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: tokens.shadowFloat,
      }}
    >
      <ArrowIcon sx={{ fontSize: 40, color: '#fff', flexShrink: 0 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 400, color: 'rgba(255,255,255,0.85)', lineHeight: 1.25 }}>
          {rerouted ? GEM_NAV_DISTANCE : NAV_DISTANCE}
        </Typography>
        <Typography
          sx={{ fontSize: 30, fontWeight: 500, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.2px' }}
        >
          {rerouted ? GEM_NAV_INSTRUCTION : NAV_INSTRUCTION}
        </Typography>
      </Box>
      <IconButton
        aria-label="Ask Maps"
        sx={{
          width: 40,
          height: 40,
          flexShrink: 0,
          bgcolor: 'rgba(255,255,255,0.16)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.24)' },
        }}
      >
        <AutoAwesomeIcon sx={{ fontSize: 22, color: '#fff' }} />
      </IconButton>
    </Box>
  )
}
