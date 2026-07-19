import { useEffect, useRef, useState } from 'react'
import { Box, ButtonBase, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import { DECK, MATCH_INDEX, MEMBER_AVATARS, type Restaurant } from './jamTripData'
import { MOTION_EMPHASIZED, tokens } from './theme'

const SWIPE_COMMIT_PX = 90
const SWIPE_COMMIT_VELOCITY = 0.5 // px/ms
const FLY_OFF_MS = 300

interface QuickDecideSheetProps {
  onClose: () => void
  onMatch: (restaurant: Restaurant) => void
}

interface DragState {
  dx: number
  dy: number
}

// The jam's shared Tinder-style deck: swipe right if you'd stop there, left if
// not; everyone in the jam swipes the same cards. The 3rd card right-swiped
// (Hungry Panda) is scripted to line up with Winnie's swipe and fire the
// match. Cards follow the finger with a slight rotation, fly off past the
// commit threshold, and the under-card scales up into place.
export function QuickDecideSheet({ onClose, onMatch }: QuickDecideSheetProps) {
  const [index, setIndex] = useState(0)
  const [drag, setDrag] = useState<DragState | null>(null)
  const [leaving, setLeaving] = useState<'left' | 'right' | null>(null)
  const start = useRef({ x: 0, y: 0 })
  const lastMoves = useRef<{ x: number; t: number }[]>([])
  const flyTimer = useRef(0)

  useEffect(() => () => window.clearTimeout(flyTimer.current), [])

  const commit = (dir: 'left' | 'right') => {
    if (leaving !== null || index >= DECK.length) return
    setDrag(null)
    setLeaving(dir)
    const cardIndex = index
    flyTimer.current = window.setTimeout(() => {
      setIndex(cardIndex + 1)
      setLeaving(null)
      // The match fires only after the fly-off completes, so the celebration
      // never clips the card animation.
      if (dir === 'right' && cardIndex === MATCH_INDEX) onMatch(DECK[cardIndex])
    }, FLY_OFF_MS)
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    if (leaving !== null) return
    e.currentTarget.setPointerCapture(e.pointerId)
    start.current = { x: e.clientX, y: e.clientY }
    lastMoves.current = [{ x: e.clientX, t: performance.now() }]
    setDrag({ dx: 0, dy: 0 })
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (drag === null || leaving !== null) return
    const moves = lastMoves.current
    moves.push({ x: e.clientX, t: performance.now() })
    if (moves.length > 2) moves.shift()
    setDrag({ dx: e.clientX - start.current.x, dy: e.clientY - start.current.y })
  }

  const handlePointerUp = () => {
    if (drag === null || leaving !== null) return
    const [a, b] = [lastMoves.current[0], lastMoves.current[lastMoves.current.length - 1]]
    const velocity = b.t > a.t ? (b.x - a.x) / (b.t - a.t) : 0
    if (Math.abs(drag.dx) > SWIPE_COMMIT_PX || Math.abs(velocity) > SWIPE_COMMIT_VELOCITY) {
      commit((Math.abs(velocity) > SWIPE_COMMIT_VELOCITY ? velocity : drag.dx) > 0 ? 'right' : 'left')
    } else {
      setDrag(null) // springs back via the transition below
    }
  }

  const top = DECK[index]
  const under = DECK[index + 1]

  const topTransform =
    leaving !== null
      ? `translateX(${leaving === 'right' ? 480 : -480}px) rotate(${leaving === 'right' ? 20 : -20}deg)`
      : drag !== null
        ? `translate(${drag.dx}px, ${drag.dy * 0.15}px) rotate(${drag.dx * 0.08}deg)`
        : 'none'

  return (
    <>
      {/* Scrim over the results sheet */}
      <Box
        onClick={onClose}
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 9,
          bgcolor: 'rgba(0,0,0,0.35)',
          animation: 'qd-scrim-in 240ms ease both',
          '@keyframes qd-scrim-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          top: '9%',
          zIndex: 10,
          bgcolor: tokens.surface,
          borderRadius: '28px 28px 0 0',
          boxShadow: tokens.shadowSheet,
          pt: '8px',
          display: 'flex',
          flexDirection: 'column',
          animation: `qd-sheet-up 320ms ${MOTION_EMPHASIZED} both`,
          '@keyframes qd-sheet-up': {
            from: { opacity: 0, transform: 'translateY(80px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <Box sx={{ width: 40, height: 4, borderRadius: 999, bgcolor: tokens.dragHandle, mx: 'auto' }} />

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', px: '20px', mt: '10px' }}>
          <Typography sx={{ flex: 1, fontSize: 24, fontWeight: 500, color: tokens.ink }}>
            Quick Decide
          </Typography>
          <ButtonBase
            aria-label="Close Quick Decide"
            onClick={onClose}
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: tokens.surfaceDim,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CloseIcon sx={{ fontSize: 22, color: tokens.ink }} />
          </ButtonBase>
        </Box>

        {/* Jam roster */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', px: '20px', mt: '12px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {MEMBER_AVATARS.map((avatar, i) => (
              <Box
                key={i}
                component="img"
                src={avatar}
                alt=""
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: '2px solid #fff',
                  objectFit: 'cover',
                  ml: i === 0 ? 0 : '-10px',
                  zIndex: MEMBER_AVATARS.length - i,
                  position: 'relative',
                }}
              />
            ))}
          </Box>
          <Typography sx={{ fontSize: 14, fontWeight: 400, color: tokens.inkSecondary }}>
            Everyone in the jam sees the same deck
          </Typography>
        </Box>

        {/* Deck */}
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: '4px',
            minHeight: 0,
          }}
        >
          {!top && (
            <Typography sx={{ fontSize: 16, fontWeight: 400, color: tokens.inkSecondary }}>
              Waiting for the jam to catch up…
            </Typography>
          )}

          {under && (
            <SwipeCard
              restaurant={under}
              style={{
                position: 'absolute',
                transform: leaving !== null ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
                transition: `transform ${FLY_OFF_MS}ms ${MOTION_EMPHASIZED}`,
              }}
            />
          )}

          {top && (
            <Box
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              sx={{
                position: 'absolute',
                touchAction: 'none',
                userSelect: 'none',
                cursor: 'grab',
                '&:active': { cursor: 'grabbing' },
                transform: topTransform,
                opacity: leaving !== null ? 0 : 1,
                transition:
                  drag !== null
                    ? 'none'
                    : leaving !== null
                      ? `transform ${FLY_OFF_MS}ms ease-out, opacity ${FLY_OFF_MS}ms ease-out`
                      : `transform 250ms ${MOTION_EMPHASIZED}`,
              }}
            >
              <SwipeCard restaurant={top}>
                {/* LIKE / NOPE stamps fade in with the drag */}
                <Typography
                  sx={{
                    position: 'absolute',
                    top: 18,
                    left: 16,
                    px: '10px',
                    py: '2px',
                    border: `3px solid ${tokens.green}`,
                    borderRadius: '8px',
                    color: tokens.green,
                    fontSize: 26,
                    fontWeight: 800,
                    letterSpacing: '2px',
                    transform: 'rotate(-14deg)',
                    opacity: drag ? Math.min(Math.max(drag.dx / 80, 0), 1) : 0,
                  }}
                >
                  LIKE
                </Typography>
                <Typography
                  sx={{
                    position: 'absolute',
                    top: 18,
                    right: 16,
                    px: '10px',
                    py: '2px',
                    border: `3px solid ${tokens.red}`,
                    borderRadius: '8px',
                    color: tokens.red,
                    fontSize: 26,
                    fontWeight: 800,
                    letterSpacing: '2px',
                    transform: 'rotate(14deg)',
                    opacity: drag ? Math.min(Math.max(-drag.dx / 80, 0), 1) : 0,
                  }}
                >
                  NOPE
                </Typography>
              </SwipeCard>
            </Box>
          )}
        </Box>

        {/* Reject / accept tap fallbacks */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '28px',
            pb: '26px',
            pt: '10px',
            flexShrink: 0,
          }}
        >
          <ButtonBase
            aria-label="Reject"
            onClick={() => commit('left')}
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: tokens.surface,
              border: `1.5px solid ${tokens.hairline}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CloseIcon sx={{ fontSize: 28, color: tokens.red }} />
          </ButtonBase>
          <ButtonBase
            aria-label="Accept"
            onClick={() => commit('right')}
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: tokens.surface,
              border: `1.5px solid ${tokens.hairline}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckIcon sx={{ fontSize: 28, color: tokens.green }} />
          </ButtonBase>
        </Box>
      </Box>
    </>
  )
}

interface SwipeCardProps {
  restaurant: Restaurant
  style?: React.CSSProperties
  children?: React.ReactNode
}

// One deck card: photo with a bottom gradient, name over the fade, rating +
// price + tagline block. Cards are physically stacked, so they carry the pin
// shadow — the deck is the one piece of chrome that reads as layered objects.
function SwipeCard({ restaurant, style, children }: SwipeCardProps) {
  return (
    <Box
      style={style}
      sx={{
        width: 290,
        height: 360,
        borderRadius: '24px',
        overflow: 'hidden',
        bgcolor: tokens.surface,
        boxShadow: tokens.shadowPin,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <Box
          component="img"
          src={restaurant.photo}
          alt={restaurant.name}
          draggable={false}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 90,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.55))',
          }}
        />
        <Typography
          sx={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 10,
            fontSize: 22,
            fontWeight: 600,
            color: '#fff',
            textShadow: '0 1px 2px rgba(0,0,0,0.4)',
          }}
        >
          {restaurant.name}
        </Typography>
      </Box>
      <Box sx={{ px: '16px', py: '12px', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Typography sx={{ fontSize: 15, fontWeight: 500, color: tokens.ink }}>
            {restaurant.rating.toFixed(1)}
          </Typography>
          <StarRoundedIcon sx={{ fontSize: 18, color: tokens.amber }} />
          <Typography sx={{ fontSize: 15, fontWeight: 400, color: tokens.inkSecondary }}>
            ({restaurant.reviewCount.toLocaleString()}) · {restaurant.price}
          </Typography>
        </Box>
        <Typography noWrap sx={{ fontSize: 14, fontWeight: 400, color: tokens.inkSecondary, mt: '2px' }}>
          {restaurant.tagline}
        </Typography>
      </Box>
      {children}
    </Box>
  )
}
