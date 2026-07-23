import { Box, ButtonBase, Typography } from '@mui/material'
import NavigationIcon from '@mui/icons-material/Navigation'
import { RatingRow } from './TripPanel'
import type { TripPlace } from './tripData'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface DirectionsCardProps {
  place: TripPlace
  onGo: () => void
}

// Frame-3 directions preview: a floating white card over the fitted route —
// place header, an inset "Fastest route" stat strip, and the More routes / Go
// pill pair. Flat per design.md rule 0.10.
export function DirectionsCard({ place, onGo }: DirectionsCardProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 6,
        width: 280,
        bgcolor: tokens.surface,
        borderRadius: '24px',
        p: '16px',
        boxShadow: tokens.shadowFloat,
        animation: `preview-in 360ms ${MOTION_EMPHASIZED} both`,
        '@keyframes preview-in': {
          from: { opacity: 0, transform: 'translateX(-16px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
      }}
    >
      <Typography sx={{ fontSize: 20, fontWeight: 500, color: tokens.ink, lineHeight: 1.2 }}>
        {place.name}
      </Typography>
      <RatingRow rating={place.rating} reviewCount={place.reviewCount} size={14} />

      <Box sx={{ mt: '12px', bgcolor: tokens.surfaceDim, borderRadius: '16px', p: '12px' }}>
        <Typography sx={{ fontSize: 13, fontWeight: 500, color: tokens.inkSecondary }}>
          Fastest route
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px', mt: '8px' }}>
          <Stat value={place.arrival} label="arrival" />
          <Stat value={place.durationMin} label="min" highlight />
          <Stat value={place.distanceMi} label="mi" />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mt: '14px' }}>
        <ButtonBase
          aria-label="See more routes"
          sx={{
            height: 40,
            borderRadius: 999,
            bgcolor: tokens.cyanContainer,
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: tokens.onCyan }}>
            More routes
          </Typography>
        </ButtonBase>
        <ButtonBase
          aria-label={`Start navigation to ${place.name}`}
          onClick={onGo}
          sx={{
            height: 40,
            borderRadius: 999,
            bgcolor: tokens.tealBanner,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <NavigationIcon sx={{ fontSize: 16, color: '#fff' }} />
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: '#fff' }}>Go</Typography>
        </ButtonBase>
      </Box>
    </Box>
  )
}

function Stat({ value, label, highlight }: { value: string; label: string; highlight?: boolean }) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 600,
          lineHeight: 1.15,
          letterSpacing: '-0.2px',
          color: highlight ? tokens.red : tokens.ink,
        }}
      >
        {value}
      </Typography>
      <Typography sx={{ fontSize: 12, fontWeight: 400, color: tokens.inkSecondary, lineHeight: 1.15 }}>
        {label}
      </Typography>
    </Box>
  )
}
