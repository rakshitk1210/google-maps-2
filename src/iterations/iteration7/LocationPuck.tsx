import { Box } from '@mui/material'
import { EASE_OUT, MODE_TRANSITION, NAV_SWAP_MS, useTokens } from './theme'

interface LocationPuckProps {
  roadTrip: boolean
}

const MORPH_TRANSITION = `transform ${NAV_SWAP_MS}ms ${EASE_OUT}, opacity ${NAV_SWAP_MS}ms ${EASE_OUT}`

// Top-down car from iteration 6's nav maps; in Road Trip mode the car tokens
// turn it purple (violet body, deep-indigo outline, lilac glass).
function CarMarker() {
  const t = useTokens()
  return (
    <svg width="28" height="48" viewBox="0 0 28 48" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="25" height="45" rx="10" fill={t.carBody} stroke={t.carStroke} strokeWidth="1.5" />
      <path d="M5 13 L23 13 L21 21 L7 21 Z" fill={t.carGlass} />
      <rect x="7" y="22" width="14" height="11" rx="2" fill={t.carRoof} />
      <path d="M7 40 L21 40 L23 34 L5 34 Z" fill={t.carGlass} />
    </svg>
  )
}

// The design.md §2 location puck (--blue-dot with white ring + light halo),
// which morphs into the car when Road Trip mode switches on: the dot scales up
// and fades out while the car scales in — 350ms ease-out. Both stay mounted so
// mid-animation re-toggles reverse smoothly. Per rule 0.10, this is a map
// element, so it carries the soft pin shadow (plus the violet glow in Road Trip).
// Rendered inside a center-anchored mapboxgl.Marker, so it sizes itself and
// stays pinned to the location through pans and zooms.
export function LocationPuck({ roadTrip }: LocationPuckProps) {
  const t = useTokens()
  return (
    <Box
      sx={{
        position: 'relative',
        width: 72,
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      {/* Halo — pulses gently; re-tints blue ↔ purple with the mode */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          bgcolor: t.puckHalo,
          transition: MODE_TRANSITION,
          animation: 'puck-pulse 2400ms ease-in-out infinite',
          '@keyframes puck-pulse': {
            '0%, 100%': { transform: 'scale(0.8)', opacity: 0.9 },
            '50%': { transform: 'scale(1)', opacity: 0.55 },
          },
        }}
      />

      {/* Blue dot: 22px --blue-dot circle with 3px white ring */}
      <Box
        sx={{
          position: 'absolute',
          width: 22,
          height: 22,
          borderRadius: '50%',
          bgcolor: t.puck,
          border: '3px solid #FFFFFF',
          boxSizing: 'content-box',
          boxShadow: t.shadowPin,
          transition: `${MORPH_TRANSITION}, ${MODE_TRANSITION}`,
          transform: roadTrip ? 'scale(1.6)' : 'scale(1)',
          opacity: roadTrip ? 0 : 1,
        }}
      />

      {/* Car — takes over in Road Trip mode with the soft violet glow */}
      <Box
        sx={{
          position: 'absolute',
          width: 28,
          height: 48,
          display: 'flex',
          borderRadius: '10px',
          boxShadow: t.shadowPin,
          transition: `${MORPH_TRANSITION}, ${MODE_TRANSITION}`,
          transform: roadTrip ? 'scale(1)' : 'scale(0.6)',
          opacity: roadTrip ? 1 : 0,
          '& svg rect, & svg path': { transition: MODE_TRANSITION },
        }}
      >
        <CarMarker />
      </Box>
    </Box>
  )
}
