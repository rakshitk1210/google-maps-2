import { Box } from '@mui/material'
import { CarPlayStatusBar } from './CarPlayStatusBar'
import { CarPlayMap } from './CarPlayMap'
import { CarPlayBanner } from './CarPlayBanner'
import { CompassBadge } from './CompassBadge'
import { CarPlaySpeed } from './CarPlaySpeed'
import { CarPlayEtaPill } from './CarPlayEtaPill'
import { GeminiOrb } from './GeminiOrb'
import { DownloadWipe } from './DownloadWipe'
import { DeviceGlow } from './DeviceGlow'
import { tokens } from './theme'
import type { GeminiState } from './useGeminiFlow'

interface CarPlayScreenProps {
  geminiState: GeminiState
  runId: number
}

const ORB_VISIBLE_STATES: GeminiState[] = [
  'appearing',
  'speaking',
  'listening',
  'processing',
  'downloaded',
  'declined',
  'idleDone',
]

const VOICE_ACTIVE_STATES: GeminiState[] = ['speaking', 'listening', 'processing', 'downloaded', 'declined']

// CarPlay head unit: 720×432 screen (800×480 aspect) inside a dark bezel.
// Object placement follows the real CarPlay reference — turn banner top-left,
// compass + speed cluster top-right, a floating ETA pill bottom-left that
// leaves the map uncovered. The Gemini exchange is audio-only, so the orb is
// the only Gemini UI on screen.
export function CarPlayScreen({ geminiState, runId }: CarPlayScreenProps) {
  const orbVisible = ORB_VISIBLE_STATES.includes(geminiState)
  const voiceActive = VOICE_ACTIVE_STATES.includes(geminiState)

  return (
    <Box
      sx={{
        p: '12px',
        bgcolor: tokens.carPlayBezel,
        borderRadius: '24px',
        boxShadow: tokens.shadowDevice,
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 720,
          height: 432,
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          bgcolor: tokens.mapLand,
        }}
      >
        <CarPlayStatusBar />

        <Box sx={{ position: 'relative', flex: 1, minWidth: 0 }}>
          <CarPlayMap />
          <CarPlayBanner geminiSlot={orbVisible ? <GeminiOrb state={geminiState} /> : undefined} />
          <CompassBadge />
          <CarPlaySpeed />
          <CarPlayEtaPill />
          {geminiState === 'downloaded' && <DownloadWipe key={runId} />}
        </Box>

        <DeviceGlow active={voiceActive} />
      </Box>
    </Box>
  )
}
