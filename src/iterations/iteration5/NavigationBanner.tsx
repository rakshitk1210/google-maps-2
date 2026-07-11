import { Box, IconButton, Typography } from '@mui/material'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import TurnLeftIcon from '@mui/icons-material/TurnLeft'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { BANNER_INSTRUCTION, CAFE_BANNER_INSTRUCTION } from './jamData'
import { tokens } from './theme'

interface NavigationBannerProps {
  joined: boolean
  toCafe: boolean
  onAiClick: () => void
}

// Instruction banner, design.md §6.13: --teal-banner card, radius 24, 12px side
// margins, top 58px, 20px padding, 40px white maneuver arrow, Ask Maps spark
// on the right. Flat (no shadow) per rule 0.10.
export function NavigationBanner({ joined, toCafe, onAiClick }: NavigationBannerProps) {
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
      <IconButton
        aria-label="Ask Maps"
        onClick={joined ? onAiClick : undefined}
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
