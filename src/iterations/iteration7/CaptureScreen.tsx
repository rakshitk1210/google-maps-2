import { Box, IconButton, Typography } from '@mui/material'
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import DiamondIcon from '@mui/icons-material/Diamond'
import { CAPTURED_MOMENTS, FRIEND_GEM_MOMENTS, LOCKED_MOMENTS } from './roadTripData'
import { MODE_TRANSITION, useTokens } from './theme'
import type { Moment } from './roadTripData'

// Capture tab (Road Trip mode): the moments captured so far, the locked ones
// that reveal when the trip ends, and per-friend tiles badged as gems left
// for others to find. Same full-screen shell as FriendsScreen.
export function CaptureScreen() {
  const t = useTokens()

  const tileSx = {
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    aspectRatio: '1',
  } as const

  const gemTile = (m: Moment) => (
    <Box key={m.id} sx={{ ...tileSx, flex: 1, minWidth: 0 }}>
      <Box component="img" src={m.photo} loading="lazy" alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      {/* Gem badge — this moment is a gem left for others to see */}
      <Box
        sx={{
          position: 'absolute',
          top: 6,
          right: 6,
          width: 28,
          height: 28,
          borderRadius: '50%',
          bgcolor: t.cyanContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <DiamondIcon sx={{ fontSize: 16, color: t.teal }} />
      </Box>
    </Box>
  )

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 84,
        bgcolor: t.surface,
        zIndex: 4,
        overflowY: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
        transition: MODE_TRANSITION,
      }}
    >
      <Box sx={{ px: '20px', pt: '66px', pb: '24px' }}>
        {/* Header, §6.5 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 26, fontWeight: 500, color: t.ink, letterSpacing: '-0.2px' }}>
            Capture Moments
          </Typography>
          <IconButton
            aria-label="Capture a moment"
            sx={{ width: 44, height: 44, bgcolor: t.surfaceDim, '&:hover': { bgcolor: t.surfaceDim } }}
          >
            <PhotoCameraOutlinedIcon sx={{ fontSize: 24, color: t.ink }} />
          </IconButton>
        </Box>

        {/* Captured moments: 2-column grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', mt: '16px' }}>
          {CAPTURED_MOMENTS.map((m) => (
            <Box key={m.id} sx={tileSx}>
              <Box
                component="img"
                src={m.photo}
                loading="lazy"
                alt=""
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Typography
                sx={{
                  position: 'absolute',
                  left: 10,
                  bottom: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#FFFFFF',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                }}
              >
                {m.caption}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Locked moments */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mt: '24px' }}>
          <Typography sx={{ fontSize: 22, fontWeight: 500, color: t.ink, letterSpacing: '-0.2px' }}>Locked</Typography>
          <LockOutlinedIcon sx={{ fontSize: 20, color: t.ink }} />
        </Box>
        <Typography sx={{ fontSize: 15, fontWeight: 400, color: t.inkSecondary, mt: '2px' }}>
          Unlocks after the roadtrip ends
        </Typography>
        <Box sx={{ display: 'flex', gap: '8px', mt: '12px' }}>
          {LOCKED_MOMENTS.map((m) => (
            <Box key={m.id} sx={{ ...tileSx, flex: 1, minWidth: 0 }}>
              <Box
                component="img"
                src={m.photo}
                loading="lazy"
                alt=""
                sx={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(14px)', transform: 'scale(1.2)' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LockOutlinedIcon sx={{ fontSize: 18, color: t.ink }} />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Per-friend gem moments */}
        {FRIEND_GEM_MOMENTS.map((group) => (
          <Box key={group.friend}>
            <Typography sx={{ fontSize: 22, fontWeight: 500, color: t.ink, letterSpacing: '-0.2px', mt: '24px' }}>
              {group.friend}
            </Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 400, color: t.inkSecondary, mt: '2px' }}>
              Gems left for others to find
            </Typography>
            <Box sx={{ display: 'flex', gap: '8px', mt: '12px' }}>{group.moments.map(gemTile)}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
