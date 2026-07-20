import { Box } from '@mui/material'
import { WIPE_MS } from './data'
import { MOTION_EMPHASIZED, tokens } from './theme'

// Blue-and-white sweep across the whole screen — the sketch's subtle visual
// affirmation that the offline map finished downloading. Mounted only while
// the flow is in `downloaded` (keyed by run) so it plays exactly once per run.
export function DownloadWipe() {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 15,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: tokens.wipeGradient,
          transform: 'translateX(-100%)',
          animation: `wipe-sweep ${WIPE_MS}ms ${MOTION_EMPHASIZED} forwards`,
          '@keyframes wipe-sweep': {
            to: { transform: 'translateX(100%)' },
          },
        }}
      />
    </Box>
  )
}
