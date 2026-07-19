import { Box, Typography } from '@mui/material'
import { JAM_NAME, MEMBER_AVATARS } from './jamTripData'
import { MOTION_EMPHASIZED, tokens } from './theme'

// "People in a Jam" — a cyan tonal pill hanging under the banner's Then chip
// (iteration 9's Road Trip badge slot), showing the four member portraits so
// the driver always sees who's riding along in the shared session. Decorative.
export function JamChip() {
  return (
    <Box
      sx={{
        position: 'absolute',
        // Below the banner (58 + ~76) and its hanging Then chip (52) + gap.
        top: 196,
        left: 16,
        zIndex: 5,
        height: 40,
        px: '12px',
        borderRadius: 999,
        bgcolor: tokens.cyanContainer,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        animation: `badge-in 360ms 150ms ${MOTION_EMPHASIZED} both`,
        '@keyframes badge-in': {
          from: { opacity: 0, transform: 'translateY(-10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {MEMBER_AVATARS.map((avatar, i) => (
          <Box
            key={i}
            component="img"
            src={avatar}
            alt=""
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              border: '2px solid #fff',
              objectFit: 'cover',
              ml: i === 0 ? 0 : '-8px',
              zIndex: MEMBER_AVATARS.length - i,
              position: 'relative',
            }}
          />
        ))}
      </Box>
      <Typography sx={{ fontSize: 15, fontWeight: 600, color: tokens.onCyan }}>{JAM_NAME}</Typography>
    </Box>
  )
}
