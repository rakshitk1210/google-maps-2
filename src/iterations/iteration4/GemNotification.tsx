import { Box, Typography } from '@mui/material'
import DiamondIcon from '@mui/icons-material/Diamond'
import { NOTIFICATION_APP, NOTIFICATION_BODY, NOTIFICATION_TIME, NOTIFICATION_TITLE } from './gemData'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface GemNotificationProps {
  onTap: () => void
}

// Google-Maps-style push notification that slides in from the top once the car
// arrives. Tapping it opens the scratch-to-reveal modal. Geometry follows the
// floating-card spec (design.md 6.13): radius 24, 12px side margins, soft shadow.
export function GemNotification({ onTap }: GemNotificationProps) {
  return (
    <Box
      onClick={onTap}
      role="button"
      aria-label={NOTIFICATION_TITLE}
      sx={{
        position: 'absolute',
        top: 58,
        left: 12,
        right: 12,
        zIndex: 8,
        bgcolor: tokens.surface,
        borderRadius: '24px',
        p: '16px',
        display: 'flex',
        gap: '12px',
        cursor: 'pointer',
        boxShadow: tokens.shadowFloat,
        animation: `gem-notif-in 360ms ${MOTION_EMPHASIZED} both`,
        '@keyframes gem-notif-in': {
          from: { opacity: 0, transform: 'translateY(-16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          flexShrink: 0,
          borderRadius: '50%',
          bgcolor: tokens.cyanContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <DiamondIcon sx={{ fontSize: 22, color: tokens.onCyan }} />
      </Box>
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
        <Typography
          sx={{ fontSize: 15, fontWeight: 400, color: tokens.inkSecondary, mt: '2px', lineHeight: 1.35 }}
        >
          {NOTIFICATION_BODY}
        </Typography>
      </Box>
    </Box>
  )
}
