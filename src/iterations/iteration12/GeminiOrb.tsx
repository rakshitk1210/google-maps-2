import { Box } from '@mui/material'
import MicIcon from '@mui/icons-material/Mic'
import { GeminiSpark } from './GeminiSpark'
import { MOTION_EMPHASIZED, tokens } from './theme'
import type { GeminiState } from './useGeminiFlow'

interface GeminiOrbProps {
  state: GeminiState
}

const ORB_SIZE = 52
const RING_WIDTH = 3

// The circular Gemini button attached to the nav banner. Its ring + content
// track the voice session, per the sketch's state row:
//   idle spark → gradient ring + glow (speaking) → mic + pulse (listening) →
//   spark + spinning loader ring (processing) → back to idle.
// The glow is the documented voice-session exception to design.md rule 0.10.
export function GeminiOrb({ state }: GeminiOrbProps) {
  const speakingLike = state === 'speaking' || state === 'downloaded' || state === 'declined'
  const listening = state === 'listening'
  const processing = state === 'processing'

  const ringBackground = processing
    ? tokens.geminiLoader
    : speakingLike || listening
      ? tokens.geminiGradient
      : tokens.geminiRingIdle

  const glow = speakingLike ? tokens.geminiGlow : 'none'

  return (
    <Box
      sx={{
        position: 'relative',
        width: ORB_SIZE,
        height: ORB_SIZE,
        borderRadius: '50%',
        flexShrink: 0,
        boxShadow: glow,
        transition: `box-shadow 240ms ${MOTION_EMPHASIZED}`,
        animation: `orb-appear 360ms ${MOTION_EMPHASIZED} backwards${
          listening ? ', orb-pulse 1.4s ease-in-out infinite' : ''
        }`,
        '@keyframes orb-appear': {
          from: { transform: 'scale(0.6)', opacity: 0 },
          to: { transform: 'scale(1)', opacity: 1 },
        },
        '@keyframes orb-pulse': {
          '0%, 100%': { boxShadow: tokens.geminiGlowSoft },
          '50%': { boxShadow: tokens.geminiGlowStrong },
        },
      }}
    >
      {/* Ring layer — spins alone during processing so the glyph stays upright. */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: ringBackground,
          ...(processing && {
            animation: 'orb-spin 900ms linear infinite',
            '@keyframes orb-spin': { to: { transform: 'rotate(360deg)' } },
          }),
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          inset: `${RING_WIDTH}px`,
          borderRadius: '50%',
          bgcolor: tokens.surface,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Spark ↔ mic cross-fade so state changes don't pop. */}
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            opacity: listening ? 0 : 1,
            transition: 'opacity 150ms ease',
          }}
        >
          <GeminiSpark size={24} />
        </Box>
        <MicIcon
          sx={{
            position: 'absolute',
            fontSize: 26,
            color: tokens.blue,
            opacity: listening ? 1 : 0,
            transition: 'opacity 150ms ease',
          }}
        />
      </Box>
    </Box>
  )
}
