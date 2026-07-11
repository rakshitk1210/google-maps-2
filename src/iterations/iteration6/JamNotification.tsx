import { Box, Button, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import {
  MEMBER_AVATAR_URLS,
  NOTIFICATION_APP,
  NOTIFICATION_BODY,
  NOTIFICATION_TIME,
  NOTIFICATION_TITLE,
} from './jamData'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface JamNotificationProps {
  onJoin: () => void
  onDismiss: () => void
}

// Push notification for the Jam invite, following the floating-card spec
// (design.md 6.13: radius 24, 12px side margins) and the slide-in pattern
// from iteration 4's GemNotification. Join Jam is the phone's single --teal
// filled CTA (rule 0.2). Flat (rule 0.10).
export function JamNotification({ onJoin, onDismiss }: JamNotificationProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 58,
        left: 12,
        right: 12,
        zIndex: 8,
        bgcolor: tokens.surface,
        borderRadius: '24px',
        p: '16px',
        boxShadow: tokens.shadowFloat,
        animation: `jam-notif-in 360ms ${MOTION_EMPHASIZED} both`,
        '@keyframes jam-notif-in': {
          from: { opacity: 0, transform: 'translateY(-16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Box sx={{ display: 'flex', gap: '12px' }}>
        <Box
          component="img"
          src={MEMBER_AVATAR_URLS[1]}
          alt=""
          sx={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Typography
              sx={{ fontSize: 13, fontWeight: 500, color: tokens.inkSecondary, letterSpacing: '0.2px' }}
            >
              {NOTIFICATION_APP}
            </Typography>
            <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: tokens.inkSecondary }} />
            <Typography sx={{ fontSize: 13, fontWeight: 400, color: tokens.inkSecondary }}>
              {NOTIFICATION_TIME}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: tokens.ink, mt: '2px', lineHeight: 1.25 }}>
            {NOTIFICATION_TITLE}
          </Typography>
          <Typography sx={{ fontSize: 15, fontWeight: 400, color: tokens.inkSecondary, mt: '2px' }}>
            {NOTIFICATION_BODY}
          </Typography>
        </Box>
        <IconButton
          aria-label="Dismiss"
          onClick={onDismiss}
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            bgcolor: tokens.surfaceDim,
            '&:hover': { bgcolor: tokens.surfaceDim },
          }}
        >
          <CloseIcon sx={{ fontSize: 22, color: tokens.ink }} />
        </IconButton>
      </Box>

      <Button
        fullWidth
        onClick={onJoin}
        sx={{
          mt: '14px',
          height: 48,
          borderRadius: 999,
          bgcolor: tokens.teal,
          color: '#fff',
          fontSize: 17,
          fontWeight: 500,
          textTransform: 'none',
          '&:hover': { bgcolor: tokens.teal },
        }}
      >
        Join Jam
      </Button>
    </Box>
  )
}
