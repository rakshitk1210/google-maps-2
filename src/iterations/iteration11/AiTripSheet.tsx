import { Box, Button, ButtonBase, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import NavigationIcon from '@mui/icons-material/Navigation'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import CheckIcon from '@mui/icons-material/Check'
import { GeminiSpark } from './GeminiSpark'
import { SHEET_SUBTITLE, SHEET_TITLE, STOPS, type TripStop } from './roadTripData'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface AiTripSheetProps {
  /** 'plan' before the trip starts (Start CTA); 'active' once driving. */
  mode: 'plan' | 'active'
  /** Which stop is currently the trip's first destination. */
  selectedStopId: string
  /** "Next stop" label reflecting the current selection. */
  nextText: string
  onClose: () => void
  onStart: () => void
  /** Pick a stop as the first destination (radio tap). */
  onSelectStop: (id: string) => void
  /** Open a stop's detail page (card tap). */
  onOpenStop: (stop: TripStop) => void
}

// The Gemini-planned itinerary sheet. In 'plan' mode it previews the four
// AI-picked stops with a wired Start CTA; in 'active' mode (reopened from the
// road-trip chip mid-drive) the first stop is highlighted as "Next stop" and
// the Start CTA gives way to a status line. Fixed height, conditionally
// mounted (no cross-phase state).
export function AiTripSheet({
  mode,
  selectedStopId,
  nextText,
  onClose,
  onStart,
  onSelectStop,
  onOpenStop,
}: AiTripSheetProps) {
  const active = mode === 'active'

  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 8,
        bgcolor: tokens.surface,
        borderRadius: '28px 28px 0 0',
        boxShadow: tokens.shadowSheet,
        pt: '8px',
        pb: '20px',
        animation: `results-up 320ms ${MOTION_EMPHASIZED} both`,
        '@keyframes results-up': {
          from: { opacity: 0, transform: 'translateY(60px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Box sx={{ width: 40, height: 4, borderRadius: 999, bgcolor: tokens.dragHandle, mx: 'auto' }} />

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: '20px', mt: '10px' }}>
        <Typography sx={{ flex: 1, fontSize: 22, fontWeight: 500, color: tokens.ink, minWidth: 0 }} noWrap>
          {SHEET_TITLE}
        </Typography>
        <ButtonBase
          aria-label="Close road trip"
          onClick={onClose}
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: tokens.surfaceDim,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <CloseIcon sx={{ fontSize: 22, color: tokens.ink }} />
        </ButtonBase>
      </Box>

      {/* Gemini subtitle */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', px: '20px', mt: '6px' }}>
        <GeminiSpark size={18} />
        <Typography sx={{ fontSize: 13.5, fontWeight: 400, color: tokens.inkSecondary }}>
          Planned with{' '}
          <Box component="span" sx={{ color: tokens.blue, fontWeight: 600 }}>
            Gemini
          </Box>
          {SHEET_SUBTITLE}
        </Typography>
      </Box>

      {/* Horizontal stop cards — pl matches the title; ::after keeps the
          trailing edge padded when scrolled to the end (flex scroll quirk). */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'nowrap',
          gap: '12px',
          mt: '16px',
          pl: '20px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          '&::-webkit-scrollbar': { display: 'none' },
          '&::after': { content: '""', flex: '0 0 20px' },
        }}
      >
        {STOPS.map((stop, i) => {
          const selected = stop.id === selectedStopId
          const badgeLabel = selected ? (active ? 'Next stop' : '1st stop') : `Stop ${i + 1}`
          return (
            <Box
              key={stop.id}
              role="button"
              tabIndex={0}
              aria-label={`Open ${stop.name}`}
              onClick={() => onOpenStop(stop)}
              sx={{
                width: 168,
                flexShrink: 0,
                borderRadius: '16px',
                p: selected ? '5px' : 0,
                border: selected ? `2px solid ${tokens.blue}` : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src={stop.photo}
                  alt={stop.name}
                  sx={{ width: '100%', height: 110, borderRadius: '16px', objectFit: 'cover', display: 'block' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    px: '8px',
                    height: 22,
                    borderRadius: 999,
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: selected ? tokens.blue : 'rgba(255,255,255,0.92)',
                    color: selected ? '#fff' : tokens.ink,
                    fontSize: 11.5,
                    fontWeight: 600,
                  }}
                >
                  {badgeLabel}
                </Box>

                {/* First-stop selector — tap to reorder without leaving the sheet. */}
                {!active && (
                  <ButtonBase
                    aria-label={selected ? `${stop.name} is your first stop` : `Make ${stop.name} the first stop`}
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectStop(stop.id)
                    }}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      bgcolor: selected ? tokens.blue : 'rgba(255,255,255,0.92)',
                      border: selected ? 'none' : `1.5px solid ${tokens.dragHandle}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {selected && <CheckIcon sx={{ fontSize: 17, color: '#fff' }} />}
                  </ButtonBase>
                )}
              </Box>
              <Typography sx={{ fontSize: 15, fontWeight: 600, color: tokens.ink, mt: '6px' }} noWrap>
                {stop.name}
              </Typography>
              <Typography sx={{ fontSize: 12.5, fontWeight: 400, color: tokens.inkSecondary }} noWrap>
                {stop.note}
              </Typography>
            </Box>
          )
        })}
      </Box>

      {!active && (
        <Typography sx={{ fontSize: 12.5, color: tokens.inkSecondary, px: '20px', mt: '10px' }}>
          Tap a stop for details, or ✓ pick which to visit first.
        </Typography>
      )}

      {/* Footer */}
      {active ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            mx: '20px',
            mt: '18px',
            pt: '16px',
            borderTop: `1px solid ${tokens.hairline}`,
          }}
        >
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: tokens.blue, flexShrink: 0 }} />
          <Typography noWrap sx={{ fontSize: 15, fontWeight: 500, color: tokens.ink }}>
            On this road trip ·{' '}
            <Box component="span" sx={{ color: tokens.inkSecondary, fontWeight: 400 }}>
              {nextText}
            </Box>
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: '10px', px: '20px', mt: '18px' }}>
          <Button
            onClick={onStart}
            startIcon={<NavigationIcon sx={{ fontSize: 20 }} />}
            sx={{
              flex: 1,
              height: 52,
              borderRadius: 999,
              bgcolor: tokens.teal,
              color: '#fff',
              fontSize: 17,
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: tokens.teal },
            }}
          >
            Start
          </Button>
          <ButtonBase
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              bgcolor: tokens.cyanContainer,
              color: tokens.onCyan,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <BookmarkBorderIcon sx={{ fontSize: 22 }} />
          </ButtonBase>
          <ButtonBase
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              bgcolor: tokens.cyanContainer,
              color: tokens.onCyan,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 22 }} />
          </ButtonBase>
        </Box>
      )}
    </Box>
  )
}
