import { Box, Button, Chip, IconButton, Paper, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import SendIcon from '@mui/icons-material/Send'
import type { Cafe } from './jamData'

interface CafeDetailSheetProps {
  cafe: Cafe
  cafeIndex: number
  onClose: () => void
  onSendToCar: () => void
}

export function CafeDetailSheet({ cafe, cafeIndex, onClose, onSendToCar }: CafeDetailSheetProps) {
  return (
    <Paper
      elevation={8}
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: '30%',
        zIndex: 6,
        borderRadius: '20px 20px 0 0',
        px: 2,
        pt: '10px',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <Box sx={{ width: 36, height: 4, bgcolor: '#ccc', borderRadius: 999, mx: 'auto', mb: 2 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
          Cafe #{cafeIndex + 1} · {cafe.name}
        </Typography>
        <IconButton sx={{ bgcolor: '#eee' }} onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Typography color="text.secondary" sx={{ fontSize: 15, lineHeight: 1.5, mt: 1.5 }}>
        {cafe.description}
      </Typography>

      <Box sx={{ display: 'flex', gap: '6px', mt: 2 }}>
        {[1, 2].map((n) => (
          <Box
            key={n}
            component="img"
            src={`https://picsum.photos/seed/${cafe.id}-${n}/300/220`}
            loading="lazy"
            sx={{ flex: 1, width: 0, height: 130, borderRadius: '12px', objectFit: 'cover' }}
          />
        ))}
      </Box>

      <Chip label={cafe.reviews} sx={{ alignSelf: 'flex-start', mt: 2, bgcolor: '#f1f3f4', fontWeight: 500 }} />

      <Box sx={{ display: 'flex', gap: 1, mt: 'auto', mb: 2, pt: 2 }}>
        <Button
          startIcon={<BookmarkBorderIcon />}
          sx={{ flex: 1, bgcolor: '#a9d6cd', color: '#072d24', borderRadius: 999, py: 1.25, fontWeight: 600 }}
        >
          Save
        </Button>
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={onSendToCar}
          sx={{ flex: 1, bgcolor: '#0b6858', borderRadius: 999, py: 1.25, fontWeight: 600 }}
        >
          Send to car
        </Button>
      </Box>
    </Paper>
  )
}
