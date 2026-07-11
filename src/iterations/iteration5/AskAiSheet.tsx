import { useEffect, useState } from 'react'
import { Box, Fade, IconButton, Typography } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import HistoryIcon from '@mui/icons-material/History'
import CloseIcon from '@mui/icons-material/Close'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import { AI_RESPONSE, AI_USER_PROMPT, CAFES } from './jamData'
import { tokens } from './theme'

const AI_TOOLS = ['Find stops', 'Share ETA', 'Change destination']
const TYPE_SPEED_MS = 18
const THINKING_DELAY_MS = 600

interface AskAiSheetProps {
  skipAnimation: boolean
  onOpenCafe: (cafeId: string) => void
  onClose: () => void
}

// Ask Maps sheet, design.md §6.16: blue sparkle + "Ask Maps" 24/500 header,
// gray circle header buttons, right-aligned user bubble, plain AI answer text,
// place cards, gray input pill pinned bottom. Flat (rule 0.10).
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

  const headerCircleSx = {
    width: 48,
    height: 48,
    bgcolor: tokens.surfaceDim,
    '&:hover': { bgcolor: tokens.surfaceDim },
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: '30%',
        zIndex: 6,
        bgcolor: tokens.surface,
        borderRadius: '28px 28px 0 0',
        boxShadow: tokens.shadowSheet,
        px: '20px',
        pt: '8px',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <Box sx={{ width: 40, height: 4, bgcolor: tokens.dragHandle, borderRadius: '2px', mx: 'auto' }} />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: '12px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AutoAwesomeIcon sx={{ fontSize: 26, color: tokens.blue }} />
          <Typography sx={{ fontSize: 24, fontWeight: 500, color: tokens.ink, letterSpacing: '-0.2px' }}>
            Ask Maps
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '8px' }}>
          <IconButton aria-label="History" sx={headerCircleSx}>
            <HistoryIcon sx={{ fontSize: 24, color: tokens.ink }} />
          </IconButton>
          <IconButton aria-label="Close" onClick={onClose} sx={headerCircleSx}>
            <CloseIcon sx={{ fontSize: 24, color: tokens.ink }} />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: '8px', mt: '16px', flexWrap: 'wrap' }}>
        {AI_TOOLS.map((tool) => (
          <Box
            key={tool}
            sx={{
              height: 44,
              display: 'flex',
              alignItems: 'center',
              px: '16px',
              borderRadius: 999,
              bgcolor: tokens.surfaceDim,
              fontSize: 16,
              fontWeight: 500,
              color: tokens.ink,
            }}
          >
            {tool}
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Box
          sx={{
            alignSelf: 'flex-end',
            bgcolor: tokens.userBubble,
            borderRadius: '24px',
            px: '20px',
            py: '16px',
            maxWidth: '75%',
            fontSize: 18,
            color: tokens.ink,
          }}
        >
          {AI_USER_PROMPT}
        </Box>

        <Typography sx={{ fontSize: 18, lineHeight: 1.45, color: tokens.ink, minHeight: 52 }}>
          {AI_RESPONSE.slice(0, charCount)}
        </Typography>

        {typingDone &&
          CAFES.map((cafe) => (
            <Fade in timeout={300} key={cafe.id}>
              <Box sx={{ bgcolor: tokens.aiCard, borderRadius: '16px', p: '16px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ minWidth: 0, pr: '12px' }}>
                    <Typography sx={{ fontSize: 18, fontWeight: 500, color: tokens.ink }}>{cafe.name}</Typography>
                    <Typography sx={{ fontSize: 15, fontWeight: 400, color: tokens.inkSecondary }}>
                      {cafe.tagline}
                    </Typography>
                  </Box>
                  <IconButton
                    aria-label={`Open ${cafe.name}`}
                    onClick={() => onOpenCafe(cafe.id)}
                    sx={{
                      width: 40,
                      height: 40,
                      flexShrink: 0,
                      bgcolor: tokens.cyanContainer,
                      '&:hover': { bgcolor: tokens.cyanContainer },
                    }}
                  >
                    <ArrowOutwardIcon sx={{ fontSize: 20, color: tokens.onCyan }} />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', gap: '6px', mt: '12px' }}>
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
          pt: '20px',
          pb: '20px',
          position: 'sticky',
          bottom: 0,
          bgcolor: tokens.surface,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: 56,
            bgcolor: tokens.surfaceDim,
            borderRadius: 999,
            pl: '20px',
            pr: '8px',
          }}
        >
          <Typography sx={{ flex: 1, fontSize: 18, fontWeight: 400, color: tokens.inkSecondary }}>
            Ask a question
          </Typography>
          <IconButton aria-label="Send" sx={{ width: 40, height: 40, bgcolor: tokens.surface, '&:hover': { bgcolor: tokens.surface } }}>
            <ArrowUpwardIcon sx={{ fontSize: 22, color: tokens.ink }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}
