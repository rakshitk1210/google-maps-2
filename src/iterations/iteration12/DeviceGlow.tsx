import { Box } from '@mui/material'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface DeviceGlowProps {
  active: boolean
}

// Voice-session glow (scoped exception to design.md rule 0.10): while Gemini
// is engaged the screen gains a subtle blue inner glow. An inset box-shadow on
// the screen container would paint behind the Mapbox canvas, so the glow
// lives on a click-transparent overlay above every in-screen layer.
export function DeviceGlow({ active }: DeviceGlowProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        pointerEvents: 'none',
        borderRadius: 'inherit',
        boxShadow: tokens.innerGlow,
        opacity: active ? 1 : 0,
        transition: `opacity 360ms ${MOTION_EMPHASIZED}`,
      }}
    />
  )
}
