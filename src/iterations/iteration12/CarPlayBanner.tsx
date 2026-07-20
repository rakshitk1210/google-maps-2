import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import TurnLeftIcon from '@mui/icons-material/TurnLeft'
import { BANNER_DISTANCE, BANNER_INSTRUCTION } from './data'
import { tokens } from './theme'

interface CarPlayBannerProps {
  // Gemini orb slot — rendered inside the banner, anchored to the right edge,
  // so the voice session lives within the turn card.
  geminiSlot?: ReactNode
}

// Instruction banner, design.md §6.13 scaled for the CarPlay canvas:
// --teal-banner card radius 24 with white maneuver arrow + distance and the
// dim street line. Flat (rule 0.10).
export function CarPlayBanner({ geminiSlot }: CarPlayBannerProps) {
  return (
    <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 6, width: 320 }}>
      <Box
        sx={{
          position: 'relative',
          bgcolor: tokens.tealBanner,
          borderRadius: '24px',
          p: '14px 18px',
          // Reserve room on the right for the orb so the text never collides.
          pr: geminiSlot ? '76px' : '18px',
          boxShadow: tokens.shadowFloat,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <TurnLeftIcon sx={{ fontSize: 36, color: '#fff', flexShrink: 0 }} />
          <Typography
            sx={{ fontSize: 28, fontWeight: 500, color: '#fff', letterSpacing: '-0.2px', lineHeight: 1.1 }}
          >
            {BANNER_DISTANCE}
          </Typography>
        </Box>
        <Typography
          sx={{ fontSize: 17, fontWeight: 400, color: 'rgba(255,255,255,0.85)', mt: '4px', ml: '48px' }}
        >
          {BANNER_INSTRUCTION}
        </Typography>

        {geminiSlot && (
          <Box
            sx={{
              position: 'absolute',
              right: 14,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            {geminiSlot}
          </Box>
        )}
      </Box>
    </Box>
  )
}
