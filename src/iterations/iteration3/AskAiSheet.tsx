import { useEffect, useState } from 'react'
import { Box, Chip, Fade, IconButton, Paper, TextField, Typography } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CloseIcon from '@mui/icons-material/Close'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import { AI_RESPONSE, AI_USER_PROMPT, CAFES } from './jamData'

const AI_TOOLS = ['Find stops', 'Share ETA', 'Change destination']
const TYPE_SPEED_MS = 18
const THINKING_DELAY_MS = 600

interface AskAiSheetProps {
  skipAnimation: boolean
  onOpenCafe: (cafeId: string) => void
  onClose: () => void
}

export function AskAiSheet({ skipAnimation, onOpenCafe, onClose }: AskAiSheetProps) {
  const [charCount, setCharCount] = useState(skipAnimation ? AI_RESPONSE.length : 0)
  const typingDone = charCount >= AI_RESPONSE.length

  useEffect(() => {
    if (skipAnimation) return
    let interval: ReturnType<typeof setInterval> | undefined
    const delay = setTimeout(() => {
      // Chars derive from elapsed time (not tick count) so dropped/throttled
      // timer ticks never stretch the animation.
      const start = Date.now()
      interval = setInterval(() => {
        const chars = Math.min(Math.floor((Date.now() - start) / TYPE_SPEED_MS), AI_RESPONSE.length)
        setCharCount(chars)
        if (chars >= AI_RESPONSE.length && interval) clearInterval(interval)
      }, 40)
    }, THINKING_DELAY_MS)
    return () => {
      clearTimeout(delay)
      if (interval) clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: '30%',
        zIndex: 6,
        borderRadius: '20px 20px 0 0',
        px: 2,
        pt: '10px',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <Box sx={{ width: 36, height: 4, bgcolor: '#ccc', borderRadius: 999, mx: 'auto', mb: 2 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1a73e8' }}>
          <AutoAwesomeIcon />
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>Ask AI</Typography>
        </Box>
        <IconButton sx={{ bgcolor: '#eee' }} onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
        {AI_TOOLS.map((tool) => (
          <Chip key={tool} label={tool} size="small" sx={{ bgcolor: '#f1f3f4' }} />
        ))}
      </Box>

      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          sx={{
            alignSelf: 'flex-end',
            bgcolor: '#eee',
            borderRadius: '18px',
            px: 2,
            py: 1.25,
            maxWidth: '80%',
            fontSize: 15,
          }}
        >
          {AI_USER_PROMPT}
        </Box>

        <Typography sx={{ fontSize: 15, lineHeight: 1.5, minHeight: 46 }}>
          {AI_RESPONSE.slice(0, charCount)}
        </Typography>

        {typingDone &&
          CAFES.map((cafe) => (
            <Fade in timeout={300} key={cafe.id}>
              <Box sx={{ bgcolor: '#f8f9fa', borderRadius: '14px', p: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography sx={{ fontSize: 16, fontWeight: 600 }}>{cafe.name}</Typography>
                    <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                      {cafe.tagline}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => onOpenCafe(cafe.id)}
                    sx={{ bgcolor: '#a9d6cd', color: '#072d24', '&:hover': { bgcolor: '#a9d6cd' } }}
                  >
                    <ArrowOutwardIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', gap: '6px', mt: 1.5 }}>
                  {[1, 2, 3].map((n) => (
                    <Box
                      key={n}
                      component="img"
                      src={`https://picsum.photos/seed/${cafe.id}-${n}/200/140`}
                      loading="lazy"
                      sx={{ flex: 1, width: 0, height: 72, borderRadius: '10px', objectFit: 'cover' }}
                    />
                  ))}
                </Box>
              </Box>
            </Fade>
          ))}
      </Box>

      <Box
        sx={{
          mt: 'auto',
          mb: 2,
          pt: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#eee',
            borderRadius: 999,
            pl: 2,
            pr: 0.75,
            py: 0.75,
          }}
        >
          <TextField
            placeholder="Ask a question"
            variant="standard"
            slotProps={{ input: { disableUnderline: true, readOnly: true } }}
            sx={{ flex: 1 }}
          />
          <IconButton size="small" sx={{ bgcolor: '#fff' }}>
            <ArrowUpwardIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  )
}
