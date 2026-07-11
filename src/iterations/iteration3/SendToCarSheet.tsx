import { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Paper, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { KYLE_DISPLAY_NAME } from './jamData'

const CANCEL_WINDOW_MS = 5000
const TICK_MS = 50

interface SendToCarSheetProps {
  phase: 'sending' | 'sent'
  onCancel: () => void
  onComplete: () => void
}

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
    <Paper
      elevation={8}
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 6,
        borderRadius: '20px 20px 0 0',
        px: 2,
        pt: '10px',
        pb: 3,
      }}
    >
      <Box sx={{ width: 36, height: 4, bgcolor: '#ccc', borderRadius: 999, mx: 'auto', mb: 2 }} />

      {phase === 'sending' ? (
        <>
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
            Sending the location to {KYLE_DISPLAY_NAME}'s CarPlay
          </Typography>
          <Button
            onClick={onCancel}
            startIcon={
              <CircularProgress size={18} thickness={5} variant="determinate" value={progress} sx={{ color: '#0b6858' }} />
            }
            sx={{
              mt: 2,
              width: '100%',
              bgcolor: '#f1f3f4',
              color: '#202124',
              borderRadius: 999,
              py: 1.25,
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
        </>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CheckCircleIcon sx={{ color: '#0b6858', fontSize: 28 }} />
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
            The location has been sent to {KYLE_DISPLAY_NAME}'s car
          </Typography>
        </Box>
      )}
    </Paper>
  )
}
