import { Box, Typography } from '@mui/material'
import {
  JOINED_COUNT_LABEL,
  JOINED_HEADLINE,
  JOINED_SUBLINE_REST,
  MEMBER_AVATAR_URLS,
} from './jamData'
import { MOTION_EMPHASIZED, tokens } from './theme'

const avatarSx = {
  width: 36,
  height: 36,
  borderRadius: '50%',
  objectFit: 'cover' as const,
  border: '2px solid #fff',
}

// Joined confirmation in the same notification slot: 4 overlapping member
// avatars (JamInviteSheet pattern) + headline + count subline. No CTA — the
// end state just reads alongside the CarPlay badge (rule 0.2). Flat (0.10).
export function JamJoinedCard() {
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
        p: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: tokens.shadowFloat,
        animation: `jam-joined-in 360ms ${MOTION_EMPHASIZED} both`,
        '@keyframes jam-joined-in': {
          from: { opacity: 0, transform: 'translateY(-16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Box sx={{ display: 'flex' }}>
        {MEMBER_AVATAR_URLS.map((src, index) => (
          <Box
            key={src}
            component="img"
            src={src}
            alt=""
            sx={{ ...avatarSx, ml: index > 0 ? '-10px' : 0 }}
          />
        ))}
      </Box>
      <Typography
        sx={{ fontSize: 18, fontWeight: 500, color: tokens.ink, letterSpacing: '-0.2px', mt: '12px' }}
      >
        {JOINED_HEADLINE}
      </Typography>
      <Typography sx={{ fontSize: 15, fontWeight: 400, color: tokens.inkSecondary, mt: '4px' }}>
        <Box component="span" sx={{ color: tokens.green, fontWeight: 500 }}>
          {JOINED_COUNT_LABEL}
        </Box>
        {JOINED_SUBLINE_REST}
      </Typography>
    </Box>
  )
}
