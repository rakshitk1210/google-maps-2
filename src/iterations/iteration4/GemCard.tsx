import { Box, Button, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DiamondIcon from '@mui/icons-material/Diamond'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { GEM_CTA_LABEL, GEM_DESCRIPTION, GEM_SUBTITLE, GEM_TITLE } from './gemData'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface GemCardProps {
  onClose: () => void
  onGoThere: () => void
}

// Scrim + centered modal card. Rendered as a sibling of the map inside the
// phone frame so the scrim covers the banner, rail, sheet, and map markers.
export function GemCard({ onClose, onGoThere }: GemCardProps) {
  return (
    <>
      <Box
        onClick={onClose}
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          bgcolor: 'rgba(0,0,0,0.45)',
          animation: `gem-scrim-in 300ms ${MOTION_EMPHASIZED} both`,
          '@keyframes gem-scrim-in': {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: 24,
          right: 24,
          top: '50%',
          zIndex: 21,
          bgcolor: tokens.surface,
          borderRadius: '24px',
          p: '24px',
          boxShadow: tokens.shadowFloat,
          animation: `gem-card-in 300ms ${MOTION_EMPHASIZED} both`,
          '@keyframes gem-card-in': {
            from: { opacity: 0, transform: 'translateY(-50%) scale(0.92)' },
            to: { opacity: 1, transform: 'translateY(-50%) scale(1)' },
          },
        }}
      >
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 44,
            height: 44,
            bgcolor: tokens.surfaceDim,
            '&:hover': { bgcolor: tokens.surfaceDim },
          }}
        >
          <CloseIcon sx={{ fontSize: 24, color: tokens.ink }} />
        </IconButton>

        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: tokens.cyanContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: '16px',
          }}
        >
          <DiamondIcon sx={{ fontSize: 28, color: tokens.onCyan }} />
        </Box>

        <Typography sx={{ fontSize: 22, fontWeight: 500, color: tokens.ink, letterSpacing: '-0.2px' }}>
          {GEM_TITLE}
        </Typography>
        <Typography sx={{ fontSize: 15, fontWeight: 400, color: tokens.inkSecondary, mt: '4px' }}>
          {GEM_SUBTITLE}
        </Typography>
        <Typography sx={{ fontSize: 16, fontWeight: 400, color: tokens.inkSecondary, lineHeight: 1.45, mt: '12px' }}>
          {GEM_DESCRIPTION}
        </Typography>

        <Button
          fullWidth
          onClick={onGoThere}
          endIcon={<ArrowForwardIcon sx={{ fontSize: 20 }} />}
          sx={{
            mt: '20px',
            height: 48,
            borderRadius: 999,
            bgcolor: tokens.teal,
            color: '#fff',
            fontSize: 17,
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { bgcolor: tokens.tealBanner },
          }}
        >
          {GEM_CTA_LABEL}
        </Button>
      </Box>
    </>
  )
}
