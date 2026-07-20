import { Box, ButtonBase, Typography, ThemeProvider } from '@mui/material'
import { CarPlayScreen } from './CarPlayScreen'
import { GeminiSpark } from './GeminiSpark'
import { useGeminiFlow } from './useGeminiFlow'
import { theme, tokens } from './theme'

const IDLE_STATES = ['hidden', 'idleDone', 'dismissed']

// Iteration 12 renders a single CarPlay head unit instead of the shared
// 402×872 .phone-frame — PhoneFrame early-returns here. The Gemini
// offline-maps voice flow no longer auto-plays on mount — a presenter button
// below the stage triggers it (see useGeminiFlow); the whole exchange itself
// is audio, so the reply comes by voice or the presenter keys (Y / N).
export function GoogleMapsClone() {
  const { state, trigger, runId } = useGeminiFlow()
  const idle = IDLE_STATES.includes(state)

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <CarPlayScreen geminiState={state} runId={runId} />

        {/* Stage control (not in-screen CarPlay UI): starts the scripted flow. */}
        <ButtonBase
          aria-label="Trigger the Gemini flow"
          onClick={trigger}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            height: 40,
            px: '18px',
            borderRadius: 999,
            bgcolor: tokens.surface,
            border: `1px solid ${tokens.hairline}`,
          }}
        >
          <GeminiSpark size={16} />
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: tokens.ink }}>
            {idle ? 'Trigger Gemini' : 'Restart Gemini'}
          </Typography>
        </ButtonBase>
      </Box>
    </ThemeProvider>
  )
}
