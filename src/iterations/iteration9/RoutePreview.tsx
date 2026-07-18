import { Box, Button, ButtonBase, IconButton, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import PlaceIcon from '@mui/icons-material/Place'
import NavigationIcon from '@mui/icons-material/Navigation'
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import { ORIGIN_LABEL, type TripPlace } from './tripData'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface RoutePreviewProps {
  place: TripPlace
  onBack: () => void
  onStart: () => void
}

// Directions overview (design.md §6.9): origin/destination card up top over
// the fitted route, and the bottom ETA card with the Start / Add stop / Saved
// pill row from the iteration 9 sketch. Start is the only wired action.
export function RoutePreview({ place, onBack, onStart }: RoutePreviewProps) {
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
          p: '10px 12px',
          animation: `preview-in 360ms ${MOTION_EMPHASIZED} both`,
          '@keyframes preview-in': {
            from: { opacity: 0, transform: 'translateY(-16px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <IconButton aria-label="Back" onClick={onBack} sx={{ width: 40, height: 40, color: tokens.ink }}>
          <ArrowBackIcon sx={{ fontSize: 24 }} />
        </IconButton>

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
              {place.name}
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
            {place.driveTime}
          </Typography>
          <Typography noWrap sx={{ fontSize: 16, fontWeight: 400, color: tokens.inkSecondary }}>
            {place.arriveTime} · Fastest route
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: '10px', mt: '16px' }}>
          <Button
            onClick={onStart}
            startIcon={<NavigationIcon sx={{ fontSize: 20 }} />}
            sx={{
              height: 52,
              px: '26px',
              borderRadius: 999,
              bgcolor: tokens.purple,
              color: '#fff',
              fontSize: 17,
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: tokens.purple },
            }}
          >
            Start
          </Button>
          <ButtonBase
            sx={{
              height: 52,
              px: '20px',
              borderRadius: 999,
              bgcolor: tokens.purpleSoft,
              color: tokens.onPurple,
              display: 'flex',
              gap: '8px',
              fontSize: 16,
              fontWeight: 500,
              fontFamily: 'inherit',
            }}
          >
            <AddLocationAltOutlinedIcon sx={{ fontSize: 21 }} />
            Add stop
          </ButtonBase>
          <ButtonBase
            sx={{
              height: 52,
              px: '20px',
              borderRadius: 999,
              bgcolor: tokens.surfaceDim,
              color: tokens.ink,
              display: 'flex',
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
