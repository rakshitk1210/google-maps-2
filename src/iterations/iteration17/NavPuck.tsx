import { Box } from '@mui/material'
import { tokens } from './theme'

/**
 * The active-nav location puck, per the Figma frame: a blue chevron on a
 * translucent white disc. The map itself rotates to the direction of travel
 * (driveAlong sets the camera bearing), so unlike iteration 8's puck this
 * chevron never rotates — it just points up the screen while the road turns
 * underneath it. Rendered into a center-anchored mapboxgl.Marker.
 */
export function NavPuck() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 89,
        height: 89,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      {/* Halo — the soft gray ring behind the disc in the Figma */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          bgcolor: tokens.puckHalo,
          animation: 'iter17-puck-pulse 2400ms ease-in-out infinite',
          '@keyframes iter17-puck-pulse': {
            '0%, 100%': { transform: 'scale(0.82)', opacity: 0.9 },
            '50%': { transform: 'scale(1)', opacity: 0.55 },
          },
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          width: 72,
          height: 72,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.85)',
          boxShadow: tokens.shadowPin,
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          filter: 'drop-shadow(0 1px 2px rgba(60,64,67,0.35))',
        }}
      >
        <svg width="42" height="42" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.5 L20 20.5 L12 16.2 L4 20.5 Z" fill={tokens.puck} />
        </svg>
      </Box>
    </Box>
  )
}
