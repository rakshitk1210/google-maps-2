import { Box, Typography } from '@mui/material'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import TurnLeftIcon from '@mui/icons-material/TurnLeft'
import { BANNER_INSTRUCTION, CAFE_BANNER_INSTRUCTION } from './jamData'
import { tokens } from './theme'

interface NavigationBannerProps {
  toCafe: boolean
}

// Instruction banner, design.md §6.13: --teal-banner card, radius 24, 12px side
// margins, top 58px, 20px padding, 40px white maneuver arrow. Ask Maps lives on
// the bottom sheet spark — kept off this banner so the turn stays primary.
export function NavigationBanner({ toCafe }: NavigationBannerProps) {
  const ArrowIcon = toCafe ? TurnLeftIcon : ArrowUpwardIcon

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
      <Typography
        sx={{
          flex: 1,
          minWidth: 0,
          fontSize: 30,
          fontWeight: 500,
          color: '#fff',
          lineHeight: 1.15,
          letterSpacing: '-0.2px',
        }}
      >
        {toCafe ? CAFE_BANNER_INSTRUCTION : BANNER_INSTRUCTION}
      </Typography>
    </Box>
  )
}
