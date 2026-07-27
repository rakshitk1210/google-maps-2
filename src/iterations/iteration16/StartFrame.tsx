import { Box, ButtonBase, Typography } from '@mui/material'
import shareSheet from './assets/yt-share-sheet.png'
import mapsLogo from './assets/maps-logo.png'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface StartFrameProps {
  onOpenMaps: () => void
}

/**
 * Where the flow starts: a YouTube share sheet with Google Maps first in the app
 * row. The sheet itself is a flat screenshot — as in the Figma frame, the Maps
 * icon and label are drawn over the first app slot, so only the one target that
 * matters is live. A pulsing ring points at it and the whole frame is tappable.
 */
export function StartFrame({ onOpenMaps }: StartFrameProps) {
  return (
    <Box sx={{ position: 'absolute', inset: 0, bgcolor: '#000', overflow: 'hidden' }}>
      <Box
        component="img"
        src={shareSheet}
        alt="Sharing a YouTube video, with Google Maps in the share row"
        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />

      <ButtonBase
        onClick={onOpenMaps}
        aria-label="Share to Google Maps"
        sx={{ position: 'absolute', inset: 0, display: 'block', borderRadius: 0 }}
      >
        {/* Maps icon over the first share slot — Figma (23, 655), 59 × 59 */}
        <Box
          sx={{
            position: 'absolute',
            left: 23,
            top: 655,
            width: 59,
            height: 59,
            borderRadius: '50%',
            bgcolor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box component="img" src={mapsLogo} alt="" sx={{ width: 42, height: 42 }} />
        </Box>

        {/* Its label, over the slot's original one — Figma (20, 722) */}
        <Box
          sx={{
            position: 'absolute',
            left: 20,
            top: 722,
            bgcolor: '#fff',
            px: '1px',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Roboto, sans-serif',
              fontSize: 12,
              color: 'rgba(96,96,96,0.85)',
              letterSpacing: '-0.36px',
              lineHeight: '14px',
              whiteSpace: 'nowrap',
            }}
          >
            Google Maps
          </Typography>
        </Box>

        {/* Affordance only — the prototype needs to say "tap here". */}
        <Box
          sx={{
            position: 'absolute',
            left: 23,
            top: 655,
            width: 59,
            height: 59,
            borderRadius: '50%',
            border: `2.5px solid ${tokens.blue}`,
            animation: `nc-start-pulse 1800ms ${MOTION_EMPHASIZED} infinite`,
            '@keyframes nc-start-pulse': {
              '0%': { transform: 'scale(1)', opacity: 0.9 },
              '60%': { transform: 'scale(1.18)', opacity: 0 },
              '100%': { transform: 'scale(1.18)', opacity: 0 },
            },
          }}
        />
      </ButtonBase>
    </Box>
  )
}
