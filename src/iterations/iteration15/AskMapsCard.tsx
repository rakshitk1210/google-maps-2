import { useEffect, useRef, useState } from 'react'
import { Box, ButtonBase, InputBase } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import { AskSpark } from './AskSpark'
import { ASK_PLACEHOLDER } from './askData'
import { MOTION_EMPHASIZED, tokens } from './theme'

const TYPEWRITER_SUGGESTIONS = [
  'Find restaurants',
  'Fuel stops nearby',
  'Coffee breaks',
  'Scenic overlooks',
  'Rest areas',
]

interface AskMapsCardProps {
  open: boolean
  draft: string
  onDraftChange: (draft: string) => void
  /** ✕ — collapse the card and bring the Ask Maps pill back. */
  onClose: () => void
  /** Field focused — the parent slides the fake keyboard up. */
  onFocus: () => void
  /** Enter or the blue send circle — opens the Ask Maps results sheet. */
  onSubmit: () => void
}

// The inline Ask Maps card (Figma 191:4395 / 191:4717) that expands below the
// action pills: spark + title + ✕ over a grey search field. A blue send circle
// fades in once there's a draft. The card grows/shrinks via the grid-rows
// 0fr↔1fr trick so the chips + list below slide down without measuring.
export function AskMapsCard({ open, draft, onDraftChange, onClose, onFocus, onSubmit }: AskMapsCardProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('')
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const canSend = draft.trim().length > 0

  // Typewriter effect for placeholder suggestions
  useEffect(() => {
    if (!open) {
      setDisplayedPlaceholder('')
      setCharIndex(0)
      setCurrentSuggestionIndex(0)
      return
    }

    const currentSuggestion = TYPEWRITER_SUGGESTIONS[currentSuggestionIndex]
    const delay = charIndex === 0 ? 800 : charIndex === currentSuggestion.length ? 3000 : 50

    const timer = setTimeout(() => {
      if (charIndex < currentSuggestion.length) {
        setDisplayedPlaceholder(currentSuggestion.slice(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      } else {
        setCurrentSuggestionIndex((prev) => (prev + 1) % TYPEWRITER_SUGGESTIONS.length)
        setCharIndex(0)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [open, charIndex, currentSuggestionIndex])

  // Opening the card doesn't auto-focus (frame 2 shows no keyboard) — but
  // closing must blur so a stale focus doesn't keep the caret alive.
  useEffect(() => {
    if (!open) inputRef.current?.blur()
  }, [open])

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: open ? '1fr' : '0fr',
        opacity: open ? 1 : 0,
        transition: `grid-template-rows 320ms ${MOTION_EMPHASIZED}, opacity 320ms ${MOTION_EMPHASIZED}`,
        overflow: 'visible',
      }}
    >
      <Box sx={{ minHeight: 0 }}>
        <Box
          sx={{
            mt: '24px',
            p: '16px',
            borderRadius: '24px',
            bgcolor: tokens.surface,
            // Gemini/Glow — the one intentional shadow on this sheet.
            boxShadow: '0 0 8px rgba(66, 133, 244, 0.45)',
          }}
        >
          {/* Header: spark + title + ✕ */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px', flex: 1 }}>
              <AskSpark size={21} />
              <Box sx={{ fontSize: 18, fontWeight: 500, color: tokens.ink, letterSpacing: '-0.2px' }}>
                Ask Maps
              </Box>
            </Box>
            <ButtonBase
              onClick={onClose}
              sx={{ width: 28, height: 28, borderRadius: '50%', color: tokens.ink, mr: '-3px' }}
            >
              <CloseIcon sx={{ fontSize: 22 }} />
            </ButtonBase>
          </Box>

          {/* Search field */}
          <Box
            sx={{
              mt: '19px',
              height: 44,
              borderRadius: 999,
              bgcolor: '#F8F8F8',
              display: 'flex',
              alignItems: 'center',
              pl: '12px',
              pr: '7px',
              gap: '8px',
            }}
          >
            <SearchIcon sx={{ fontSize: 20, color: tokens.inkSecondary }} />
            <InputBase
              inputRef={inputRef}
              value={draft}
              onChange={(e) => onDraftChange(e.target.value)}
              onFocus={onFocus}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && canSend) onSubmit()
              }}
              placeholder={displayedPlaceholder || ASK_PLACEHOLDER}
              sx={{
                flex: 1,
                fontSize: 16,
                letterSpacing: '-0.2px',
                color: tokens.ink,
                '& input::placeholder': { color: '#8B929C', opacity: 1 },
              }}
            />
            <ButtonBase
              onClick={onSubmit}
              // Keep the input focused through the click so submit fires before
              // any blur handling.
              onPointerDown={(e) => e.preventDefault()}
              sx={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                bgcolor: tokens.blue,
                color: '#fff',
                flexShrink: 0,
                transform: canSend ? 'scale(1)' : 'scale(0.6)',
                opacity: canSend ? 1 : 0,
                pointerEvents: canSend ? 'auto' : 'none',
                transition: 'transform 200ms ease, opacity 200ms ease',
              }}
            >
              <ArrowUpwardIcon sx={{ fontSize: 20 }} />
            </ButtonBase>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
