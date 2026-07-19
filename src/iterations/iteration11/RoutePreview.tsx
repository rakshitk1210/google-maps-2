import { Box, Button, ButtonBase, Typography } from '@mui/material'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import PlaceIcon from '@mui/icons-material/Place'
import NavigationIcon from '@mui/icons-material/Navigation'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import { GeminiSpark } from './GeminiSpark'
import { ORIGIN_LABEL, TRIP_DEST } from './roadTripData'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface RoutePreviewProps {
  onStart: () => void
  onMakeRoadTrip: () => void
}

// Directions overview (design.md §6.9) for Seattle → Vancouver — iteration 11's
// opening screen. Alongside the usual teal Start pill sits the Gemini-branded
// "Make it a Road Trip" button, whose soft-blue face + gradient border invite
// the AI-planned itinerary. Start and Make it a Road Trip are the wired
// actions; Saved is decorative.
export function RoutePreview({ onStart, onMakeRoadTrip }: RoutePreviewProps) {
  return (
    <>
      {/* Origin → destination header card */}
      <Box
        sx={{
          position: 'absolute',
          top: 54,
          left: 16,
          right: 16,
          zIndex: 5,
          bgcolor: tokens.surface,
          borderRadius: '24px',
          boxShadow: tokens.shadowFloat,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          p: '10px 16px',
          animation: `preview-in 360ms ${MOTION_EMPHASIZED} both`,
          '@keyframes preview-in': {
            from: { opacity: 0, transform: 'translateY(-16px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', py: '6px' }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                border: `3px solid ${tokens.inkSecondary}`,
                flexShrink: 0,
                boxSizing: 'border-box',
              }}
            />
            <Typography noWrap sx={{ fontSize: 16, fontWeight: 400, color: tokens.ink }}>
              {ORIGIN_LABEL}
            </Typography>
          </Box>
          <Box sx={{ borderTop: `1px solid ${tokens.hairline}` }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', py: '6px' }}>
            <PlaceIcon sx={{ fontSize: 16, color: tokens.red, flexShrink: 0, ml: '-2px', mr: '-2px' }} />
            <Typography noWrap sx={{ fontSize: 16, fontWeight: 500, color: tokens.ink }}>
              {TRIP_DEST.name}
            </Typography>
          </Box>
        </Box>

        <SwapVertIcon sx={{ fontSize: 24, color: tokens.inkSecondary, mx: '8px', flexShrink: 0 }} />
      </Box>

      {/* Bottom ETA card */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 5,
          bgcolor: tokens.surface,
          borderRadius: '28px 28px 0 0',
          boxShadow: tokens.shadowSheet,
          pt: '8px',
          pb: '22px',
          px: '20px',
          animation: `preview-up 360ms ${MOTION_EMPHASIZED} both`,
          '@keyframes preview-up': {
            from: { opacity: 0, transform: 'translateY(24px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <Box
          sx={{ width: 36, height: 4, borderRadius: 999, bgcolor: tokens.dragHandle, mx: 'auto', mb: '12px' }}
        />
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <Typography sx={{ fontSize: 26, fontWeight: 600, color: tokens.green, lineHeight: 1.15 }}>
            {TRIP_DEST.duration}
          </Typography>
          <Typography noWrap sx={{ fontSize: 16, fontWeight: 400, color: tokens.inkSecondary }}>
            {TRIP_DEST.arriveTime} · Fastest route
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'nowrap',
            gap: '10px',
            mt: '16px',
            mx: '-20px',
            px: '20px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <Button
            onClick={onStart}
            startIcon={<NavigationIcon sx={{ fontSize: 20 }} />}
            sx={{
              height: 52,
              px: '26px',
              borderRadius: 999,
              flexShrink: 0,
              whiteSpace: 'nowrap',
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

          {/* Gemini-branded CTA — soft-blue face inside a gradient border. */}
          <Box
            sx={{
              flexShrink: 0,
              borderRadius: 999,
              p: '1.5px',
              background: 'linear-gradient(90deg, #4285F4, #9B72CB, #D96570)',
            }}
          >
            <ButtonBase
              onClick={onMakeRoadTrip}
              sx={{
                height: 49,
                px: '20px',
                borderRadius: 999,
                whiteSpace: 'nowrap',
                bgcolor: tokens.blueContainer,
                color: tokens.blue,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: 16,
                fontWeight: 600,
                fontFamily: 'inherit',
              }}
            >
              <GeminiSpark size={18} badge badgeSize={28} />
              Make it a Road Trip
            </ButtonBase>
          </Box>

          <ButtonBase
            sx={{
              height: 52,
              px: '20px',
              borderRadius: 999,
              flexShrink: 0,
              whiteSpace: 'nowrap',
              bgcolor: tokens.cyanContainer,
              color: tokens.onCyan,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: 16,
              fontWeight: 500,
              fontFamily: 'inherit',
            }}
          >
            <BookmarkBorderIcon sx={{ fontSize: 21 }} />
            Saved
          </ButtonBase>
        </Box>
      </Box>
    </>
  )
}
