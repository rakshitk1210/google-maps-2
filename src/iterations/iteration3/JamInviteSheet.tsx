import { Box, Button, IconButton, Paper, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { DESTINATION_NAME, KYLE_AVATAR_SEED, KYLE_DISPLAY_NAME, YOUR_AVATAR_SEED } from './jamData'

interface JamInviteSheetProps {
  onJoin: () => void
  onDismiss: () => void
}

export function JamInviteSheet({ onJoin, onDismiss }: JamInviteSheetProps) {
  return (
    <Paper
      elevation={8}
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 5,
        borderRadius: '20px 20px 0 0',
        px: 2,
        pt: 2,
        pb: 3,
      }}
    >
      <Box sx={{ width: 36, height: 4, bgcolor: '#ccc', borderRadius: 999, mx: 'auto', mb: 2 }} />

      <IconButton onClick={onDismiss} sx={{ position: 'absolute', top: 12, right: 12, bgcolor: '#eee' }}>
        <CloseIcon fontSize="small" />
      </IconButton>

      <Box sx={{ display: 'flex', mb: 2 }}>
        <Box
          component="img"
          src={`https://picsum.photos/seed/${YOUR_AVATAR_SEED}/100/100`}
          sx={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
        />
        <Box
          component="img"
          src={`https://picsum.photos/seed/${KYLE_AVATAR_SEED}/100/100`}
          sx={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
            ml: '-14px',
          }}
        />
      </Box>

      <Typography sx={{ fontSize: 22, fontWeight: 700, mb: 2 }}>
        Join {KYLE_DISPLAY_NAME}'s Google Jam to {DESTINATION_NAME}
      </Typography>

      <Button
        variant="contained"
        fullWidth
        onClick={onJoin}
        sx={{ bgcolor: '#0b6858', borderRadius: 999, py: 1.5, fontWeight: 600 }}
      >
        Join
      </Button>
    </Paper>
  )
}
