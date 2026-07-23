import { useEffect, useRef, useState } from 'react'
import { Box, ButtonBase, Fade, InputBase, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import { AskSpark } from './AskSpark'
import { ASK_RESPONSE, ASK_RESULTS } from './askData'
import type { TripPlace } from './tripData'
import { MOTION_EMPHASIZED, tokens } from './theme'

const TYPE_SPEED_MS = 18
const THINKING_DELAY_MS = 600

interface AskMapsSheetProps {
  open: boolean
  /** The submitted query — null while nothing has been asked yet. */
  query: string | null
  /** Returning from route preview — render the results instantly, no replay. */
  skipAnimation: boolean
  /** A result card's ↗ — jump into route preview for that place. */
  onOpenPlace: (place: TripPlace) => void
  onClose: () => void
}

// The Ask Maps results sheet (Figma 191:5110): user bubble, typewritten AI
// answer, two cafe cards with photo strips, and a decorative follow-up
// composer. Stays mounted and slides via translateY (the TrafficChatSheet
// pattern) so closing animates and the conversation survives a close/reopen.
export function AskMapsSheet({ open, query, skipAnimation, onOpenPlace, onClose }: AskMapsSheetProps) {
  // Hold the last real query so the text doesn't blank out mid slide-down.
  const lastQueryRef = useRef<string>('')
  if (query) lastQueryRef.current = query
  const shownQuery = query ?? lastQueryRef.current

  const [charCount, setCharCount] = useState(0)
  const typingDone = charCount >= ASK_RESPONSE.length

  // Re-run the typewriter per submitted query (iteration 3's elapsed-time
  // pattern — chars derive from Date.now() so throttled ticks never stretch
  // the reveal). skipAnimation lands with everything already rendered.
  useEffect(() => {
    if (!open || !query) return
    if (skipAnimation) {
      setCharCount(ASK_RESPONSE.length)
      return
    }
    setCharCount(0)
    let interval: ReturnType<typeof setInterval> | undefined
    const delay = setTimeout(() => {
      const start = Date.now()
      interval = setInterval(() => {
        const chars = Math.min(Math.floor((Date.now() - start) / TYPE_SPEED_MS), ASK_RESPONSE.length)
        setCharCount(chars)
        if (chars >= ASK_RESPONSE.length && interval) clearInterval(interval)
      }, 40)
    }, THINKING_DELAY_MS)
    return () => {
      clearTimeout(delay)
      if (interval) clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, query])

  return (
    <>
      {/* Scrim behind the sheet */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: 'rgba(255, 255, 255, 0.6)',
          zIndex: 6,
          pointerEvents: open ? 'auto' : 'none',
          opacity: open ? 1 : 0,
          transition: `opacity 320ms ${MOTION_EMPHASIZED}`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 610,
          maxHeight: '82%',
          zIndex: 7,
          bgcolor: tokens.surface,
          borderRadius: '28px 28px 0 0',
          display: 'flex',
          flexDirection: 'column',
          px: '20px',
          pt: '8px',
          transform: open ? 'translateY(0)' : 'translateY(105%)',
          transition: `transform 320ms ${MOTION_EMPHASIZED}`,
        }}
      >
      <Box
        sx={{ width: 40, height: 4, borderRadius: 999, bgcolor: tokens.dragHandle, mx: 'auto', flexShrink: 0 }}
      />

      {/* Header: spark + title + close circle */}
      <Box sx={{ display: 'flex', alignItems: 'center', pt: '12px', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
          <AskSpark size={30} />
          <Typography sx={{ fontSize: 24, fontWeight: 500, color: tokens.ink, letterSpacing: '-0.2px' }}>
            Ask Maps
          </Typography>
        </Box>
        <ButtonBase
          onClick={onClose}
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: tokens.surfaceDim,
            color: tokens.ink,
          }}
        >
          <CloseIcon sx={{ fontSize: 24 }} />
        </ButtonBase>
      </Box>

      {/* Conversation */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
          pt: '16px',
          pb: '8px',
          px: '4px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: '4px' }}>
          <Box
            sx={{
              bgcolor: '#EDF2F4',
              borderRadius: '20px',
              px: '16px',
              py: '10px',
              maxWidth: '80%',
              fontSize: 15,
              lineHeight: 1.4,
              color: tokens.ink,
            }}
          >
            {shownQuery}
          </Box>
        </Box>

        <Typography sx={{ fontSize: 15, lineHeight: 1.5, color: tokens.ink, pr: '4px', pt: '4px' }}>
          {ASK_RESPONSE.slice(0, charCount)}
        </Typography>

        {typingDone &&
          ASK_RESULTS.map((result, index) => (
            <Fade in timeout={300} style={{ transitionDelay: `${index * 120}ms` }} key={result.place.id}>
              <Box sx={{ bgcolor: '#E9F1F2', borderRadius: '16px', p: '16px', flexShrink: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 500, color: tokens.ink, lineHeight: 1.3 }}>
                      {result.place.name}
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: tokens.inkSecondary, mt: '4px', lineHeight: 1.3 }}>
                      {result.subtitle}
                    </Typography>
                  </Box>
                  <ButtonBase
                    onClick={() => onOpenPlace(result.place)}
                    aria-label={`Open ${result.place.name}`}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: tokens.cyanContainer,
                      color: tokens.onCyan,
                      flexShrink: 0,
                      mt: '2px',
                    }}
                  >
                    <ArrowOutwardIcon sx={{ fontSize: 20 }} />
                  </ButtonBase>
                </Box>
                <Box sx={{ display: 'flex', gap: '8px', mt: '12px' }}>
                  {result.photos.map((photo, n) => (
                    <Box
                      key={n}
                      component="img"
                      src={photo}
                      alt=""
                      sx={{ flex: 1, width: 0, height: 64, borderRadius: '10px', objectFit: 'cover' }}
                    />
                  ))}
                </Box>
              </Box>
            </Fade>
          ))}
      </Box>

      {/* Follow-up composer — decorative, like iteration 3's Ask AI footer. */}
      <Box sx={{ py: '16px', px: '4px', flexShrink: 0 }}>
        <Box
          sx={{
            height: 52,
            borderRadius: 999,
            bgcolor: tokens.surfaceDim,
            display: 'flex',
            alignItems: 'center',
            pl: '16px',
            pr: '8px',
          }}
        >
          <InputBase
            placeholder="Ask a question"
            readOnly
            sx={{
              flex: 1,
              fontSize: 15,
              '& input::placeholder': { color: tokens.inkSecondary, opacity: 1 },
            }}
          />
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: tokens.surface,
              color: tokens.ink,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowUpwardIcon sx={{ fontSize: 20 }} />
          </Box>
        </Box>
      </Box>
      </Box>
    </>
  )
}
