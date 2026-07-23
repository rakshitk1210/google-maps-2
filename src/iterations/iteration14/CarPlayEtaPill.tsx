import { Box, Typography } from '@mui/material'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface CarPlayEtaPillProps {
  arrival: string
  duration: string
  distance: string
}

// Floating ETA pill, bottom-left — matches the real CarPlay layout: a compact
// dark rounded card (arrival · min · mi) that sits over the map instead of a
// full-width bar covering it. Duration is the emphasized value (red per the
// Figma frame). Props-driven so the pill can swap to the selected place's leg
// after "Go".
export function CarPlayEtaPill({ arrival, duration, distance }: CarPlayEtaPillProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 16,
        bottom: 16,
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
        bgcolor: tokens.overlaySurface,
        borderRadius: '18px',
        px: '18px',
        py: '10px',
        gap: '18px',
        backdropFilter: 'blur(2px)',
        animation: `pill-in 240ms ${MOTION_EMPHASIZED} both`,
        '@keyframes pill-in': {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Stat value={arrival} label="arrival" />
      <Divider />
      <Stat value={duration} label="min" highlight />
      <Divider />
      <Stat value={distance} label="mi" />
    </Box>
  )
}

function Stat({ value, label, highlight }: { value: string; label: string; highlight?: boolean }) {
  return (
    <Box sx={{ textAlign: 'center', minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: 20,
          fontWeight: 600,
          lineHeight: 1.15,
          letterSpacing: '-0.2px',
          color: highlight ? tokens.redOnDark : tokens.overlayOn,
        }}
      >
        {value}
      </Typography>
      <Typography sx={{ fontSize: 12, fontWeight: 400, color: tokens.overlayOnDim, lineHeight: 1.15 }}>
        {label}
      </Typography>
    </Box>
  )
}

function Divider() {
  return <Box sx={{ width: '1px', alignSelf: 'stretch', bgcolor: 'rgba(255,255,255,0.16)' }} />
}
