import { Box } from '@mui/material'
import { tokens } from './theme'

interface NavPuckProps {
  /** Compass bearing of travel in degrees; 0 = north, 90 = east. */
  heading: number
}

// The active-nav location puck (iteration 8): Google-blue chevron on a soft
// translucent white disc, with the gentle blue halo pulse from the design.md
// §2 blue-dot. Per rule 0.10 this is a map element, so it carries the pin
// shadow. Rendered inside a center-anchored mapboxgl.Marker (map stays
// bearing 0, so the chevron's CSS rotation alone conveys direction of travel).
export function NavPuck({ heading }: NavPuckProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 80,
        height: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          bgcolor: tokens.puckHalo,
          animation: 'nav-puck-pulse 2400ms ease-in-out infinite',
          '@keyframes nav-puck-pulse': {
            '0%, 100%': { transform: 'scale(0.8)', opacity: 0.9 },
            '50%': { transform: 'scale(1)', opacity: 0.55 },
          },
        }}
      />

      {/* Translucent white disc under the chevron */}
      <Box
        sx={{
          position: 'absolute',
          width: 52,
          height: 52,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.75)',
          boxShadow: tokens.shadowPin,
        }}
      />

      {/* The chevron itself, rotated to the direction of travel */}
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          transform: `rotate(${heading}deg)`,
          filter: 'drop-shadow(0 1px 2px rgba(60,64,67,0.35))',
        }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.5 L20 20.5 L12 16.2 L4 20.5 Z" fill={tokens.puck} />
        </svg>
      </Box>
    </Box>
  )
}
