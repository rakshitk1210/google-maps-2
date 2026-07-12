import { Box, ButtonBase, Typography } from '@mui/material'
import { EASE_OUT, MODE_TRANSITION, NAV_SWAP_MS, useTokens } from './theme'

interface RoadTripChipProps {
  on: boolean
  onToggle: () => void
}

// The iteration 7 mode switch: a 44px pill chip (design.md §6.2) whose
// trailing element is a scaled-down M3 switch (§6.15). Off it reads as a plain
// white chip; on it fills with the tonal pink and the thumb pops mustard —
// the Gen Z sticker accent.
export function RoadTripChip({ on, onToggle }: RoadTripChipProps) {
  const t = useTokens()
  return (
    <ButtonBase
      onClick={onToggle}
      sx={{
        height: 44,
        px: '16px',
        borderRadius: 999,
        bgcolor: on ? t.cyanContainer : t.surface,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexShrink: 0,
        transition: MODE_TRANSITION,
        '&:active': { transform: 'scale(0.97)' },
      }}
    >
      <Typography sx={{ fontSize: 16, fontWeight: 500, color: on ? t.onCyan : t.ink, transition: MODE_TRANSITION }}>
        Road Trip
      </Typography>
      {/* Mini M3 switch: 36×22 track, 16px thumb */}
      <Box
        sx={{
          width: 36,
          height: 22,
          borderRadius: 999,
          bgcolor: on ? t.switchTrackOn : t.switchTrackOff,
          border: on ? '1px solid transparent' : `1px solid ${t.mapRoadCasing}`,
          position: 'relative',
          transition: MODE_TRANSITION,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: 3,
            width: 16,
            height: 16,
            borderRadius: '50%',
            bgcolor: on ? t.switchThumbOn : t.switchThumbOff,
            transition: `transform ${NAV_SWAP_MS}ms ${EASE_OUT}, ${MODE_TRANSITION}`,
            transform: on ? 'translate(14px, -50%)' : 'translate(0, -50%)',
          }}
        />
      </Box>
    </ButtonBase>
  )
}
