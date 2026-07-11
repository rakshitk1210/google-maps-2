import { Box, Button, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { DESTINATION_NAME, KYLE_AVATAR_URL, KYLE_DISPLAY_NAME, YOUR_AVATAR_URL } from './jamData'
import { tokens } from './theme'

interface JamInviteSheetProps {
  onJoin: () => void
  onDismiss: () => void
}

const avatarSx = {
  width: 48,
  height: 48,
  borderRadius: '50%',
  objectFit: 'cover' as const,
  border: '2px solid #fff',
}

// Bottom sheet, design.md §5/§6.5: white sheet radius 28, 40×4 drag handle,
// 20px gutters, one --teal filled CTA (rule 0.2). Flat (rule 0.10).
export function JamInviteSheet({ onJoin, onDismiss }: JamInviteSheetProps) {
  return (
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
        px: '20px',
        pt: '8px',
        pb: '28px',
      }}
    >
      <Box sx={{ width: 40, height: 4, bgcolor: tokens.dragHandle, borderRadius: '2px', mx: 'auto' }} />

      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', pt: '12px' }}>
        <Box sx={{ display: 'flex' }}>
          <Box component="img" src={YOUR_AVATAR_URL} sx={avatarSx} />
          <Box
            component="img"
            src={KYLE_AVATAR_URL}
            sx={{ ...avatarSx, ml: '-14px' }}
          />
        </Box>
        <IconButton
          aria-label="Dismiss"
          onClick={onDismiss}
          sx={{ width: 48, height: 48, bgcolor: tokens.surfaceDim, '&:hover': { bgcolor: tokens.surfaceDim } }}
        >
          <CloseIcon sx={{ fontSize: 24, color: tokens.ink }} />
        </IconButton>
      </Box>

      <Typography
        sx={{ fontSize: 26, fontWeight: 500, color: tokens.ink, letterSpacing: '-0.2px', lineHeight: 1.2, mt: '20px' }}
      >
        Join {KYLE_DISPLAY_NAME}'s Google Jam to {DESTINATION_NAME}
      </Typography>

      <Button
        fullWidth
        onClick={onJoin}
        sx={{
          mt: '24px',
          height: 56,
          borderRadius: 999,
          bgcolor: tokens.teal,
          color: '#fff',
          fontSize: 17,
          fontWeight: 500,
          textTransform: 'none',
          '&:hover': { bgcolor: tokens.teal },
        }}
      >
        Join
      </Button>
    </Box>
  )
}
