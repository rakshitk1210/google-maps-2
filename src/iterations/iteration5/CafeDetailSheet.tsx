import { Box, Button, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import SendIcon from '@mui/icons-material/Send'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import type { Cafe } from './jamData'
import { tokens } from './theme'

interface CafeDetailSheetProps {
  cafe: Cafe
  cafeIndex: number
  onClose: () => void
  onSendToCar: () => void
}

// Place-detail bottom sheet, design.md §6.5/§6.7: white sheet radius 28, header
// with 48px gray close circle, tonal Save + one --teal filled "Send to car".
export function CafeDetailSheet({ cafe, cafeIndex, onClose, onSendToCar }: CafeDetailSheetProps) {
  const rating = cafe.reviews.replace(/^★\s*/, '')

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

      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', pt: '12px' }}>
        <Typography sx={{ fontSize: 26, fontWeight: 500, color: tokens.ink, letterSpacing: '-0.2px', lineHeight: 1.2 }}>
          Cafe #{cafeIndex + 1} · {cafe.name}
        </Typography>
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{ width: 48, height: 48, flexShrink: 0, bgcolor: tokens.surfaceDim, '&:hover': { bgcolor: tokens.surfaceDim } }}
        >
          <CloseIcon sx={{ fontSize: 24, color: tokens.ink }} />
        </IconButton>
      </Box>

      <Typography sx={{ fontSize: 16, fontWeight: 400, color: tokens.inkSecondary, lineHeight: 1.45, mt: '12px' }}>
        {cafe.description}
      </Typography>

      <Box sx={{ display: 'flex', gap: '8px', mt: '20px' }}>
        {cafe.photos.slice(0, 2).map((src) => (
          <Box
            key={src}
            component="img"
            src={src}
            loading="lazy"
            alt=""
            sx={{ flex: 1, width: 0, height: 130, borderRadius: '16px', objectFit: 'cover' }}
          />
        ))}
      </Box>

      <Box
        sx={{
          alignSelf: 'flex-start',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          mt: '20px',
          height: 44,
          px: '16px',
          borderRadius: 999,
          bgcolor: tokens.surfaceDim,
        }}
      >
        <StarRoundedIcon sx={{ fontSize: 18, color: tokens.amber }} />
        <Typography sx={{ fontSize: 15, fontWeight: 500, color: tokens.ink }}>{rating}</Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: '12px', mt: 'auto', pt: '20px', pb: '20px' }}>
        <Button
          startIcon={<BookmarkBorderIcon sx={{ fontSize: 20 }} />}
          sx={{
            flex: 1,
            height: 48,
            bgcolor: tokens.cyanContainer,
            color: tokens.onCyan,
            borderRadius: 999,
            fontSize: 17,
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { bgcolor: tokens.cyanContainer },
          }}
        >
          Save
        </Button>
        <Button
          startIcon={<SendIcon sx={{ fontSize: 20 }} />}
          onClick={onSendToCar}
          sx={{
            flex: 1,
            height: 48,
            bgcolor: tokens.teal,
            color: '#fff',
            borderRadius: 999,
            fontSize: 17,
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { bgcolor: tokens.teal },
          }}
        >
          Send to car
        </Button>
      </Box>
    </Box>
  )
}
