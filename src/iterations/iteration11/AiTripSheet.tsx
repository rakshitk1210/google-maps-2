import { Box, Button, ButtonBase, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import NavigationIcon from '@mui/icons-material/Navigation'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { GeminiSpark } from './GeminiSpark'
import { CHIP_NEXT, SHEET_SUBTITLE, SHEET_TITLE, STOPS } from './roadTripData'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface AiTripSheetProps {
  /** 'plan' before the trip starts (Start CTA); 'active' once driving. */
  mode: 'plan' | 'active'
  onClose: () => void
  onStart: () => void
}

// The Gemini-planned itinerary sheet. In 'plan' mode it previews the four
// AI-picked stops with a wired Start CTA; in 'active' mode (reopened from the
// road-trip chip mid-drive) the first stop is highlighted as "Next stop" and
// the Start CTA gives way to a status line. Fixed height, conditionally
// mounted (no cross-phase state).
export function AiTripSheet({ mode, onClose, onStart }: AiTripSheetProps) {
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
          const isNext = active && i === 0
          return (
            <Box
              key={stop.id}
              sx={{
                width: 168,
                flexShrink: 0,
                borderRadius: '16px',
                p: isNext ? '5px' : 0,
                border: isNext ? `2px solid ${tokens.blue}` : '2px solid transparent',
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
                    bgcolor: isNext ? tokens.blue : 'rgba(255,255,255,0.92)',
                    color: isNext ? '#fff' : tokens.ink,
                    fontSize: 11.5,
                    fontWeight: 600,
                  }}
                >
                  {isNext ? 'Next stop' : `Stop ${i + 1}`}
                </Box>
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
              {CHIP_NEXT}
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
