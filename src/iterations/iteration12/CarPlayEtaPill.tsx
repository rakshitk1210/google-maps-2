import { Box, Typography } from '@mui/material'
import { ETA_ARRIVAL, ETA_DISTANCE, ETA_DURATION } from './data'
import { tokens } from './theme'

// Floating ETA pill, bottom-left — matches the real CarPlay layout: a compact
// dark rounded card (arrival · duration · distance) that sits over the map
// instead of a full-width bar covering it. Duration is the emphasized value.
export function CarPlayEtaPill() {
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
      }}
    >
      <Stat value={ETA_ARRIVAL} label="arrival" />
      <Divider />
      <Stat value={ETA_DURATION} label="min" highlight />
      <Divider />
      <Stat value={ETA_DISTANCE} label="mi" />
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
          color: highlight ? tokens.overlayHighlight : tokens.overlayOn,
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
