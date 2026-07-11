import { Box, Button, IconButton, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import DiamondIcon from '@mui/icons-material/Diamond'
import { CAMERA_TITLE, REVIEW_HEADLINE, REVIEW_SUBMIT_LABEL } from './gemData'
import { tokens } from './theme'

interface MemoryReviewScreenProps {
  photo: string
  onRetake: () => void
  onClose: () => void
  onSubmit: () => void
}

// Confirmation of the captured memory with a Submit CTA. Header mirrors the
// camera screen (back = retake, X = exit).
export function MemoryReviewScreen({ photo, onRetake, onClose, onSubmit }: MemoryReviewScreenProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 30,
        bgcolor: tokens.surface,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'inherit',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          pt: '54px',
          px: '12px',
          pb: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <IconButton aria-label="Retake" onClick={onRetake} sx={{ color: tokens.ink }}>
          <ArrowBackIcon sx={{ fontSize: 24 }} />
        </IconButton>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <DiamondIcon sx={{ fontSize: 20, color: tokens.teal }} />
          <Typography sx={{ fontSize: 18, fontWeight: 500, color: tokens.ink }}>{CAMERA_TITLE}</Typography>
        </Box>
        <IconButton aria-label="Close" onClick={onClose} sx={{ color: tokens.ink }}>
          <CloseIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', px: '20px', pt: '8px', minHeight: 0 }}>
        <Typography
          sx={{ fontSize: 26, fontWeight: 500, color: tokens.ink, letterSpacing: '-0.2px', mb: '16px' }}
        >
          {REVIEW_HEADLINE}
        </Typography>
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            borderRadius: '20px',
            overflow: 'hidden',
            bgcolor: tokens.surfaceDim,
            boxShadow: tokens.shadowCard,
          }}
        >
          <Box
            component="img"
            src={photo}
            alt="Your captured memory"
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </Box>
      </Box>

      <Box sx={{ px: '20px', pt: '20px', pb: '24px' }}>
        <Button
          fullWidth
          onClick={onSubmit}
          sx={{
            height: 56,
            borderRadius: 999,
            bgcolor: tokens.teal,
            color: '#fff',
            fontSize: 17,
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { bgcolor: tokens.tealBanner },
          }}
        >
          {REVIEW_SUBMIT_LABEL}
        </Button>
      </Box>
    </Box>
  )
}
