import { useEffect, useState } from 'react'
import { Box, Button, ButtonBase, CircularProgress, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import DirectionsIcon from '@mui/icons-material/Directions'
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import { YOU_AVATAR } from '../../shared/peopleAvatars'
import { CARPLAY_SEND_MS, KELLEY_DISPLAY_NAME, MATCHED_WITH, type Restaurant } from './jamTripData'
import { MOTION_EMPHASIZED, tokens } from './theme'

const TICK_MS = 50

type SendState = 'idle' | 'sending' | 'sent'

interface MatchOverlayProps {
  restaurant: Restaurant
  onDirections: () => void
  onClose: () => void
}

// The celebration when your right-swipe lines up with a jam member's: scrim +
// centered card (iteration 4's reveal-modal shell), avatar pair, the matched
// restaurant, and the three ways to act on it — save it, route to it (via a
// route preview + Start, never a live re-route), or push it straight to the
// driver's CarPlay (iteration 6's sending → sent confirmation, inlined).
export function MatchOverlay({ restaurant, onDirections, onClose }: MatchOverlayProps) {
  const [saved, setSaved] = useState(false)
  const [send, setSend] = useState<SendState>('idle')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (send !== 'sending') return
    setProgress(0)
    // Progress derives from elapsed time (not tick count) so dropped/throttled
    // timer ticks never stretch the cancel window.
    const startTime = Date.now()
    const interval = setInterval(() => {
      setProgress(Math.min(((Date.now() - startTime) / CARPLAY_SEND_MS) * 100, 100))
    }, TICK_MS)
    return () => clearInterval(interval)
  }, [send])

  useEffect(() => {
    if (send === 'sending' && progress >= 100) setSend('sent')
  }, [progress, send])

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 12,
          bgcolor: 'rgba(0,0,0,0.5)',
          animation: 'match-scrim-in 240ms ease both',
          '@keyframes match-scrim-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          left: '7.5%',
          right: '7.5%',
          top: '50%',
          zIndex: 13,
          transform: 'translateY(-50%)',
          bgcolor: tokens.surface,
          borderRadius: '28px',
          p: '22px 20px',
          animation: `match-card-in 360ms ${MOTION_EMPHASIZED} both`,
          '@keyframes match-card-in': {
            from: { opacity: 0, transform: 'translateY(-50%) scale(0.88)' },
            to: { opacity: 1, transform: 'translateY(-50%) scale(1)' },
          },
        }}
      >
        <ButtonBase
          aria-label="Close match"
          onClick={onClose}
          disabled={send === 'sending'}
          sx={{
            position: 'absolute',
            top: 14,
            right: 14,
            width: 36,
            height: 36,
            borderRadius: '50%',
            bgcolor: tokens.surfaceDim,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: send === 'sending' ? 0.4 : 1,
          }}
        >
          <CloseIcon sx={{ fontSize: 20, color: tokens.ink }} />
        </ButtonBase>

        {/* Celebration header with staggered sparkles */}
        <Box sx={{ position: 'relative', textAlign: 'center' }}>
          {(['-8px 18%', '-2px 74%', '26px 88%'] as const).map((pos, i) => {
            const [top, left] = pos.split(' ')
            return (
              <Typography
                key={i}
                sx={{
                  position: 'absolute',
                  top,
                  left,
                  fontSize: 15,
                  color: tokens.blue,
                  animation: `sparkle-in 600ms ${200 + i * 160}ms ${MOTION_EMPHASIZED} both`,
                  '@keyframes sparkle-in': {
                    from: { opacity: 0, transform: 'scale(0)' },
                    '60%': { opacity: 1, transform: 'scale(1.3)' },
                    to: { opacity: 0.8, transform: 'scale(1)' },
                  },
                }}
              >
                ✦
              </Typography>
            )
          })}
          <Typography sx={{ fontSize: 26, fontWeight: 700, color: tokens.blue }}>
            It's a match!
          </Typography>
          <Typography sx={{ fontSize: 15, fontWeight: 400, color: tokens.inkSecondary, mt: '2px' }}>
            You matched with {MATCHED_WITH.name} on {restaurant.name}
          </Typography>
        </Box>

        {/* Avatar pair with the restaurant nestled between */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: '16px',
            position: 'relative',
          }}
        >
          <Box
            component="img"
            src={YOU_AVATAR}
            alt="You"
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              border: '3px solid #fff',
              objectFit: 'cover',
              position: 'relative',
              zIndex: 1,
            }}
          />
          <Box
            component="img"
            src={restaurant.photo}
            alt={restaurant.name}
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              border: '3px solid #fff',
              objectFit: 'cover',
              mx: '-10px',
              mt: '26px',
              position: 'relative',
              zIndex: 2,
            }}
          />
          <Box
            component="img"
            src={MATCHED_WITH.avatar}
            alt={MATCHED_WITH.name}
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              border: '3px solid #fff',
              objectFit: 'cover',
              position: 'relative',
              zIndex: 1,
            }}
          />
        </Box>

        {/* Matched restaurant mini-card */}
        <Box
          sx={{
            mt: '16px',
            borderRadius: '16px',
            bgcolor: tokens.surfaceDim,
            p: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 17, fontWeight: 600, color: tokens.ink }}>
              {restaurant.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mt: '2px' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 400, color: tokens.inkSecondary }}>
                {restaurant.rating.toFixed(1)}
              </Typography>
              <StarRoundedIcon sx={{ fontSize: 16, color: tokens.amber }} />
              <Typography noWrap sx={{ fontSize: 14, fontWeight: 400, color: tokens.inkSecondary }}>
                ({restaurant.reviewCount.toLocaleString()}) · {restaurant.price}
              </Typography>
            </Box>
            <Typography noWrap sx={{ fontSize: 14, fontWeight: 500, color: tokens.ink, mt: '2px' }}>
              {restaurant.detourNote}
            </Typography>
          </Box>
        </Box>

        {/* Actions */}
        {send === 'sending' ? (
          <Box sx={{ mt: '16px' }}>
            <Typography sx={{ fontSize: 16, fontWeight: 500, color: tokens.ink, lineHeight: 1.35 }}>
              Sending {restaurant.name} to {KELLEY_DISPLAY_NAME}'s car
            </Typography>
            <Button
              onClick={() => setSend('idle')}
              startIcon={
                <CircularProgress
                  size={18}
                  thickness={5}
                  variant="determinate"
                  value={progress}
                  sx={{ color: tokens.blue }}
                />
              }
              sx={{
                mt: '12px',
                width: '100%',
                height: 48,
                bgcolor: tokens.surfaceDim,
                color: tokens.ink,
                borderRadius: 999,
                fontSize: 16,
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { bgcolor: tokens.surfaceDim },
              }}
            >
              Cancel
            </Button>
          </Box>
        ) : (
          <>
            {send === 'sent' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mt: '14px' }}>
                <CheckCircleIcon sx={{ color: tokens.green, fontSize: 24, flexShrink: 0 }} />
                <Typography sx={{ fontSize: 15, fontWeight: 500, color: tokens.ink, lineHeight: 1.3 }}>
                  {KELLEY_DISPLAY_NAME}'s CarPlay is now heading to {restaurant.name}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', mt: '16px' }}>
              <ButtonBase
                onClick={() => setSaved((v) => !v)}
                sx={{
                  width: '100%',
                  height: 48,
                  borderRadius: 999,
                  bgcolor: saved ? tokens.cyanContainer : tokens.surface,
                  border: saved ? 'none' : `1.5px solid ${tokens.hairline}`,
                  color: saved ? tokens.onCyan : tokens.ink,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: 14,
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                }}
              >
                {saved ? <BookmarkIcon sx={{ fontSize: 19 }} /> : <BookmarkBorderIcon sx={{ fontSize: 19 }} />}
                {saved ? 'Added' : 'Add to list'}
              </ButtonBase>
              <Button
                onClick={onDirections}
                startIcon={<DirectionsIcon sx={{ fontSize: 20 }} />}
                sx={{
                  width: '100%',
                  height: 48,
                  borderRadius: 999,
                  bgcolor: tokens.blue,
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 500,
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  '&:hover': { bgcolor: tokens.blue },
                }}
              >
                Directions
              </Button>
              <ButtonBase
                onClick={() => setSend('sending')}
                disabled={send === 'sent'}
                sx={{
                  width: '100%',
                  height: 48,
                  borderRadius: 999,
                  bgcolor: send === 'sent' ? tokens.surfaceDim : tokens.surface,
                  border: send === 'sent' ? 'none' : `1.5px solid ${tokens.hairline}`,
                  color: send === 'sent' ? tokens.inkSecondary : tokens.ink,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: 14,
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                }}
              >
                <DirectionsCarFilledIcon sx={{ fontSize: 19 }} />
                {send === 'sent' ? 'Sent' : 'To CarPlay'}
              </ButtonBase>
            </Box>
          </>
        )}
      </Box>
    </>
  )
}
