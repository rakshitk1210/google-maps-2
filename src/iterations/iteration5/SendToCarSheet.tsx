import { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { KYLE_DISPLAY_NAME } from './jamData'
import { tokens } from './theme'

const CANCEL_WINDOW_MS = 5000
const TICK_MS = 50

interface SendToCarSheetProps {
  phase: 'sending' | 'sent'
  onCancel: () => void
  onComplete: () => void
}

// Bottom sheet, design.md §5/§6.7: white sheet radius 28, drag handle, one gray
// (Cancel) pill during sending, confirmation row when sent. Flat (rule 0.10).
export function SendToCarSheet({ phase, onCancel, onComplete }: SendToCarSheetProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (phase !== 'sending') return
    setProgress(0)
    // Progress derives from elapsed time (not tick count) so dropped/throttled
    // timer ticks never stretch the 5s cancel window.
    const start = Date.now()
    const interval = setInterval(() => {
      setProgress(Math.min(((Date.now() - start) / CANCEL_WINDOW_MS) * 100, 100))
    }, TICK_MS)
    return () => clearInterval(interval)
  }, [phase])

  useEffect(() => {
    if (phase === 'sending' && progress >= 100) onComplete()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, phase])

  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 6,
        bgcolor: tokens.surface,
        borderRadius: '28px 28px 0 0',
        boxShadow: tokens.shadowSheet,
        px: '20px',
        pt: '8px',
        pb: '28px',
      }}
    >
      <Box sx={{ width: 40, height: 4, bgcolor: tokens.dragHandle, borderRadius: '2px', mx: 'auto' }} />

      {phase === 'sending' ? (
        <Box sx={{ pt: '12px' }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, color: tokens.ink, lineHeight: 1.35 }}>
            Sending the location to {KYLE_DISPLAY_NAME}'s CarPlay
          </Typography>
          <Button
            onClick={onCancel}
            startIcon={
              <CircularProgress size={18} thickness={5} variant="determinate" value={progress} sx={{ color: tokens.teal }} />
            }
            sx={{
              mt: '20px',
              width: '100%',
              height: 52,
              bgcolor: tokens.surfaceDim,
              color: tokens.ink,
              borderRadius: 999,
              fontSize: 17,
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: tokens.surfaceDim },
            }}
          >
            Cancel
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', pt: '12px' }}>
          <CheckCircleIcon sx={{ color: tokens.green, fontSize: 28, flexShrink: 0 }} />
          <Typography sx={{ fontSize: 18, fontWeight: 500, color: tokens.ink, lineHeight: 1.35 }}>
            The location has been sent to {KYLE_DISPLAY_NAME}'s car
          </Typography>
        </Box>
      )}
    </Box>
  )
}
