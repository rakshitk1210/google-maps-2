import { Box } from '@mui/material'
import { tokens } from './theme'

// The design.md §2 location puck: --blue-dot with white ring + gentle pulsing
// halo. Shown while the drive is paused on the route-preview screen (the nav
// chevron takes over once driving resumes). Per rule 0.10 this is a map
// element, so it carries the pin shadow. Rendered inside a center-anchored
// mapboxgl.Marker, so it stays pinned to the location through pans and zooms.
export function LocationPuck() {
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
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          bgcolor: tokens.puckHalo,
          animation: 'puck-pulse 2400ms ease-in-out infinite',
          '@keyframes puck-pulse': {
            '0%, 100%': { transform: 'scale(0.8)', opacity: 0.9 },
            '50%': { transform: 'scale(1)', opacity: 0.55 },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 22,
          height: 22,
          borderRadius: '50%',
          bgcolor: tokens.puck,
          border: '3px solid #FFFFFF',
          boxSizing: 'content-box',
          boxShadow: tokens.shadowPin,
        }}
      />
    </Box>
  )
}
