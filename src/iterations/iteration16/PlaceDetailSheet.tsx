import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { Box, Button, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import DirectionsIcon from '@mui/icons-material/Directions'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { SAMPLE_REVIEWS, type TripPlace } from './tripData'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface PlaceDetailSheetProps {
  /** Stays mounted through close so the slide-down animates. */
  place: TripPlace | null
  saved: boolean
  onToggleSave: () => void
  onClose: () => void
  /** Step to the neighbouring pin — swipe or the chevrons. */
  onPrev: () => void
  onNext: () => void
  /** Where this place sits in the pins currently on the map, for "4 of 12". */
  position: { index: number; total: number }
}

const TABS = ['Overview', 'Reviews', 'Photos', 'About']

/** Renders `rating`'s worth of amber stars (with a dimmed remainder). */
function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <Box sx={{ display: 'flex', gap: '1px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarRoundedIcon
          key={i}
          sx={{
            fontSize: size,
            color: tokens.amber,
            opacity: i < Math.floor(rating) ? 1 : i < rating ? 0.5 : 0.25,
          }}
        />
      ))}
    </Box>
  )
}

/** Sheet top edge when open — leaves a strip of map showing above it. */
const OPEN_TOP_RATIO = 0.42

/** A horizontal gesture past either of these steps to the neighbouring pin. */
const SWIPE_DISTANCE = 56
const SWIPE_VELOCITY = 0.45 // px/ms

/**
 * Place detail for whichever pin was tapped. Same rich place-page shape as
 * earlier iterations, with two real differences: Save actually commits — it
 * pins the place into the trip, so the map keeps the pin and the trip list
 * gains the card — and the sheet is a pager. Swiping it sideways (or tapping
 * the chevrons) walks the pins on the map without going back out to tap each
 * one, and the map flies along to keep the current place centred.
 */
export function PlaceDetailSheet({
  place,
  saved,
  onToggleSave,
  onClose,
  onPrev,
  onNext,
  position,
}: PlaceDetailSheetProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [frameH, setFrameH] = useState(0)
  // While a finger is down the sheet follows it exactly; null means "settled".
  const [dragY, setDragY] = useState<number | null>(null)
  const [dragX, setDragX] = useState(0)
  // Axis is locked on the first decisive movement, so a vertical dismiss and a
  // horizontal place-change can share one gesture handler without fighting.
  const gesture = useRef<{ startX: number; startY: number; sheetY: number; axis: 'x' | 'y' | null }>(
    { startX: 0, startY: 0, sheetY: 0, axis: null },
  )
  const lastMoves = useRef<{ x: number; y: number; t: number }[]>([])

  useLayoutEffect(() => {
    const measure = () => {
      const parent = rootRef.current?.parentElement
      if (parent) setFrameH(parent.clientHeight)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const { openY, hiddenY } = useMemo(
    () => ({ openY: Math.round(frameH * OPEN_TOP_RATIO), hiddenY: frameH + 40 }),
    [frameH],
  )

  const open = place !== null
  const y = dragY ?? (open ? openY : hiddenY)

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    // Leave the header's own buttons alone — capturing the pointer here would
    // swallow the click that follows, which is what broke Close and Save.
    if ((e.target as HTMLElement).closest('button')) return
    if (!open || frameH === 0) return
    gesture.current = { startX: e.clientX, startY: e.clientY, sheetY: y, axis: null }
    lastMoves.current = [{ x: e.clientX, y: e.clientY, t: performance.now() }]
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragY(y)
  }

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragY === null) return
    const g = gesture.current
    const dx = e.clientX - g.startX
    const dy = e.clientY - g.startY
    if (!g.axis && Math.hypot(dx, dy) > 10) g.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'

    if (g.axis === 'x') {
      // Damped so the sheet leans with the finger rather than sliding away.
      setDragX(dx * 0.55)
    } else if (g.axis === 'y') {
      // Drags downward toward dismissal; a little upward pull is allowed for feel.
      setDragY(Math.max(g.sheetY + dy, openY - 24))
    }

    lastMoves.current.push({ x: e.clientX, y: e.clientY, t: performance.now() })
    if (lastMoves.current.length > 2) lastMoves.current.shift()
  }

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragY === null) return
    const g = gesture.current
    const [a, b] = [lastMoves.current[0], lastMoves.current[lastMoves.current.length - 1]]
    const dt = a && b ? b.t - a.t : 0

    if (g.axis === 'x') {
      const dx = e.clientX - g.startX
      const vx = dt > 0 ? (b.x - a.x) / dt : 0
      // Swiping left walks forward through the pins, right walks back.
      if (dx < -SWIPE_DISTANCE || vx < -SWIPE_VELOCITY) onNext()
      else if (dx > SWIPE_DISTANCE || vx > SWIPE_VELOCITY) onPrev()
      setDragX(0)
      setDragY(null)
      return
    }

    const vy = dt > 0 ? (b.y - a.y) / dt : 0 // + = downward
    // Flick down or drag past a quarter of the frame → dismiss.
    if (vy > 0.5 || dragY > openY + frameH * 0.25) onClose()
    setDragY(null)
  }

  const cancelGesture = () => {
    setDragX(0)
    setDragY(null)
  }

  // Keeps the last place on screen while the sheet slides away.
  const shown = useRef<TripPlace | null>(null)
  if (place) shown.current = place
  const p = place ?? shown.current
  if (!p) return <Box ref={rootRef} sx={{ display: 'none' }} />

  const [openLabel, openDetail] = p.openNote.split(' · ')

  return (
    <Box
      ref={rootRef}
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
        zIndex: 15,
        bgcolor: tokens.surface,
        borderRadius: '28px 28px 0 0',
        boxShadow: tokens.shadowSheet,
        display: 'flex',
        flexDirection: 'column',
        transform: `translate(${dragX}px, ${y}px)`,
        transition: dragY === null ? `transform 340ms ${MOTION_EMPHASIZED}` : 'none',
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      {/* Drag zone — handle + header block, matching the other sheets. Dragging
          down dismisses; dragging sideways walks the pins. */}
      <Box
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={cancelGesture}
        sx={{ px: '20px', pt: '8px', flexShrink: 0, touchAction: 'none', cursor: 'grab' }}
      >
        <Box
          sx={{ width: 40, height: 4, bgcolor: tokens.dragHandle, borderRadius: '2px', mx: 'auto' }}
        />

        {/* Which pin this is, and the two ways to reach its neighbours. The
            chevrons exist because a swipe is invisible until you try it. */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            mt: '4px',
          }}
        >
          <IconButton
            aria-label="Previous place"
            onClick={onPrev}
            sx={{ width: 28, height: 28, color: tokens.inkSecondary }}
          >
            <ChevronLeftIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <Typography
            sx={{ fontSize: 12, color: tokens.inkSecondary, minWidth: 62, textAlign: 'center' }}
          >
            {position.index + 1} of {position.total}
          </Typography>
          <IconButton
            aria-label="Next place"
            onClick={onNext}
            sx={{ width: 28, height: 28, color: tokens.inkSecondary }}
          >
            <ChevronRightIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '8px',
            pt: '4px',
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 24,
                fontWeight: 500,
                color: tokens.ink,
                letterSpacing: '-0.2px',
                lineHeight: 1.2,
              }}
            >
              {p.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <IconButton
              aria-label={saved ? 'Remove from trip' : 'Save to trip'}
              onClick={onToggleSave}
              sx={{
                width: 40,
                height: 40,
                bgcolor: saved ? tokens.cyanContainer : tokens.surfaceDim,
                '&:hover': { bgcolor: saved ? tokens.cyanContainer : tokens.surfaceDim },
              }}
            >
              {saved ? (
                <BookmarkIcon sx={{ fontSize: 20, color: tokens.teal }} />
              ) : (
                <BookmarkBorderIcon sx={{ fontSize: 20, color: tokens.ink }} />
              )}
            </IconButton>
            <IconButton
              aria-label="Share"
              sx={{ width: 40, height: 40, bgcolor: tokens.surfaceDim, '&:hover': { bgcolor: tokens.surfaceDim } }}
            >
              <ShareOutlinedIcon sx={{ fontSize: 20, color: tokens.ink }} />
            </IconButton>
            <IconButton
              aria-label="Close"
              onClick={onClose}
              sx={{ width: 40, height: 40, bgcolor: tokens.surfaceDim, '&:hover': { bgcolor: tokens.surfaceDim } }}
            >
              <CloseIcon sx={{ fontSize: 20, color: tokens.ink }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Scrolling body */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Box sx={{ px: '20px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '8px' }}>
            <Typography sx={{ fontSize: 15, fontWeight: 500, color: tokens.ink }}>{p.rating}</Typography>
            <Stars rating={p.rating} />
            <Typography sx={{ fontSize: 15, color: tokens.inkSecondary }}>
              ({p.reviewCount.toLocaleString()})
            </Typography>
          </Box>

          <Typography sx={{ fontSize: 15, color: tokens.inkSecondary, mt: '4px' }}>
            {p.detail} · {p.priceRange}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '4px' }}>
            <Typography sx={{ fontSize: 15, fontWeight: 500, color: tokens.green }}>
              {openLabel}
            </Typography>
            {openDetail && (
              <Typography sx={{ fontSize: 15, color: tokens.inkSecondary }}>· {openDetail}</Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '4px' }}>
            <DirectionsCarIcon sx={{ fontSize: 18, color: tokens.inkSecondary }} />
            <Typography sx={{ fontSize: 15, color: tokens.inkSecondary }}>{p.driveNote}</Typography>
          </Box>

          {/* Actions — Save is the one that commits */}
          <Box sx={{ display: 'flex', gap: '10px', mt: '16px' }}>
            <Button
              startIcon={<DirectionsIcon sx={{ fontSize: 20 }} />}
              sx={{
                height: 44,
                bgcolor: tokens.teal,
                color: '#fff',
                borderRadius: 999,
                fontSize: 16,
                fontWeight: 500,
                textTransform: 'none',
                px: '20px',
                '&:hover': { bgcolor: tokens.teal },
              }}
            >
              Directions
            </Button>
            <Button
              onClick={onToggleSave}
              startIcon={
                saved ? (
                  <BookmarkIcon sx={{ fontSize: 18 }} />
                ) : (
                  <BookmarkBorderIcon sx={{ fontSize: 18 }} />
                )
              }
              sx={{
                height: 44,
                bgcolor: saved ? tokens.teal : tokens.cyanContainer,
                color: saved ? '#fff' : tokens.onCyan,
                borderRadius: 999,
                fontSize: 16,
                fontWeight: 500,
                textTransform: 'none',
                px: '18px',
                transition: `background-color 200ms ${MOTION_EMPHASIZED}`,
                '&:hover': { bgcolor: saved ? tokens.teal : tokens.cyanContainer },
              }}
            >
              {saved ? 'Saved to trip' : 'Save'}
            </Button>
          </Box>
        </Box>

        {/* Photo hero */}
        <Box
          sx={{
            display: 'flex',
            gap: '4px',
            mt: '20px',
            mx: '20px',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={p.photo}
            loading="lazy"
            alt={p.name}
            sx={{
              width: '65%',
              flexShrink: 0,
              height: 200,
              objectFit: 'cover',
              borderRadius: '16px 0 0 16px',
            }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
            <Box
              component="img"
              src={p.pinPhoto}
              loading="lazy"
              alt=""
              sx={{ flex: 1, width: '100%', height: 0, objectFit: 'cover', borderRadius: '0 16px 0 0' }}
            />
            <Box
              component="img"
              src={p.photo}
              loading="lazy"
              alt=""
              sx={{ flex: 1, width: '100%', height: 0, objectFit: 'cover', borderRadius: '0 0 16px 0' }}
            />
          </Box>
        </Box>

        <Box sx={{ px: '20px', mt: '16px' }}>
          <Typography sx={{ fontSize: 16, color: tokens.ink, lineHeight: 1.5 }}>
            {p.description}
          </Typography>
        </Box>

        {/* Tab row (static, indicative) */}
        <Box sx={{ display: 'flex', mt: '20px', borderBottom: `1px solid ${tokens.hairline}`, px: '20px' }}>
          {TABS.map((tab, i) => (
            <Box
              key={tab}
              sx={{
                py: '12px',
                px: '14px',
                fontSize: 15,
                fontWeight: 500,
                color: i === 0 ? tokens.teal : tokens.inkSecondary,
                borderBottom: i === 0 ? `3px solid ${tokens.teal}` : '3px solid transparent',
                whiteSpace: 'nowrap',
              }}
            >
              {tab}
            </Box>
          ))}
        </Box>

        {/* Know before you go */}
        <Box sx={{ px: '20px', mt: '20px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TipsAndUpdatesOutlinedIcon sx={{ fontSize: 22, color: tokens.teal }} />
            <Typography sx={{ fontSize: 18, fontWeight: 500, color: tokens.ink }}>
              Know before you go
            </Typography>
          </Box>
          <Box sx={{ mt: '8px' }}>
            {p.highlights.map((highlight, i) => (
              <Box
                key={highlight}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: '14px',
                  borderTop: i > 0 ? `1px solid ${tokens.hairline}` : 'none',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: 1, pr: '8px' }}>
                  <Typography sx={{ fontSize: 15, color: tokens.ink, lineHeight: 1.4 }}>•</Typography>
                  <Typography sx={{ fontSize: 15, color: tokens.ink, lineHeight: 1.4 }}>
                    {highlight}
                  </Typography>
                </Box>
                <ChevronRightIcon sx={{ fontSize: 22, color: tokens.inkSecondary, flexShrink: 0 }} />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Reviews */}
        <Box sx={{ px: '20px', mt: '20px', pb: '32px' }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <Typography sx={{ fontSize: 18, fontWeight: 500, color: tokens.ink }}>Reviews</Typography>
            <Typography sx={{ fontSize: 14, color: tokens.inkSecondary }}>
              {p.rating} · {p.reviewCount.toLocaleString()} reviews
            </Typography>
          </Box>
          <Box sx={{ mt: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {SAMPLE_REVIEWS.map((review) => (
              <Box key={review.name}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Box
                    component="img"
                    src={review.avatar}
                    alt=""
                    sx={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: 15, fontWeight: 500, color: tokens.ink }}>
                      {review.name}
                    </Typography>
                    <Stars rating={review.rating} size={14} />
                  </Box>
                </Box>
                <Typography sx={{ fontSize: 15, color: tokens.ink, lineHeight: 1.5, mt: '8px' }}>
                  {review.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
