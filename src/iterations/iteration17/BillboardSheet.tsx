import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { Box, ButtonBase, IconButton, Typography } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import StarHalfIcon from '@mui/icons-material/StarHalf'
import CloseIcon from '@mui/icons-material/Close'
import NavigationIcon from '@mui/icons-material/Navigation'
import DirectionsIcon from '@mui/icons-material/Directions'
import ScheduleIcon from '@mui/icons-material/Schedule'
import { CAFE_LADRO } from './tripData'
import { MOTION_EMPHASIZED, tokens } from './theme'

/** Sheet top edge when open — leaves the road visible above it. */
const OPEN_TOP_RATIO = 0.44

interface BillboardSheetProps {
  open: boolean
  /** True once Directions has framed the detour — Start becomes the only move. */
  previewing: boolean
  onStart: () => void
  onDirections: () => void
  onClose: () => void
}

/**
 * The café behind the billboard. Same place-sheet shape as earlier iterations,
 * but the buttons actually steer the drive: Directions freezes the trip and
 * frames the detour so it can be judged before committing, and Start swaps the
 * active route and puts the car back in motion toward the café.
 */
export function BillboardSheet({
  open,
  previewing,
  onStart,
  onDirections,
  onClose,
}: BillboardSheetProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [frameH, setFrameH] = useState(0)
  const [dragY, setDragY] = useState<number | null>(null)
  const dragStart = useRef({ pointerY: 0, sheetY: 0 })
  const lastMoves = useRef<{ y: number; t: number }[]>([])

  useEffect(() => {
    const frame = rootRef.current?.parentElement
    if (!frame) return
    setFrameH(frame.getBoundingClientRect().height)
  }, [])

  const openY = Math.round(frameH * OPEN_TOP_RATIO)
  const hiddenY = frameH || 900
  const y = dragY ?? (open ? openY : hiddenY)

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    // Let the sheet's own buttons take their taps — capturing the pointer here
    // would swallow the click that follows (iteration 16's close-button bug).
    if ((e.target as HTMLElement).closest('button')) return
    if (!open || frameH === 0) return
    dragStart.current = { pointerY: e.clientY, sheetY: y }
    lastMoves.current = [{ y: e.clientY, t: performance.now() }]
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragY(y)
  }

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragY === null) return
    const delta = e.clientY - dragStart.current.pointerY
    setDragY(Math.max(dragStart.current.sheetY + delta, openY - 24))
    lastMoves.current.push({ y: e.clientY, t: performance.now() })
    if (lastMoves.current.length > 2) lastMoves.current.shift()
  }

  const handlePointerUp = () => {
    if (dragY === null) return
    const [a, b] = [lastMoves.current[0], lastMoves.current[lastMoves.current.length - 1]]
    const velocity = a && b && b.t > a.t ? (b.y - a.y) / (b.t - a.t) : 0
    if (velocity > 0.5 || dragY > openY + frameH * 0.2) onClose()
    setDragY(null)
  }

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
        display: 'flex',
        flexDirection: 'column',
        transform: `translateY(${y}px)`,
        transition: dragY === null ? `transform 380ms ${MOTION_EMPHASIZED}` : 'none',
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      <Box
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        sx={{ px: '20px', pt: '8px', flexShrink: 0, touchAction: 'none', cursor: 'grab' }}
      >
        <Box
          sx={{ width: 40, height: 4, bgcolor: tokens.dragHandle, borderRadius: '2px', mx: 'auto' }}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '8px',
            pt: '14px',
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{ fontSize: 26, fontWeight: 500, color: tokens.ink, letterSpacing: '-0.3px' }}
            >
              {CAFE_LADRO.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '4px' }}>
              <Typography sx={{ fontSize: 15, fontWeight: 500, color: tokens.ink }}>
                {CAFE_LADRO.rating}
              </Typography>
              <Box sx={{ display: 'flex' }}>
                {[0, 1, 2, 3].map((i) => (
                  <StarIcon key={i} sx={{ fontSize: 15, color: tokens.amber }} />
                ))}
                <StarHalfIcon sx={{ fontSize: 15, color: tokens.amber }} />
              </Box>
              <Typography sx={{ fontSize: 15, color: tokens.inkSecondary }}>
                ({CAFE_LADRO.reviewCount}) · {CAFE_LADRO.priceRange}
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={onClose}
            aria-label="Close"
            sx={{
              width: 40,
              height: 40,
              flexShrink: 0,
              bgcolor: tokens.surfaceDim,
              '&:hover': { bgcolor: tokens.surfaceDim },
            }}
          >
            <CloseIcon sx={{ fontSize: 20, color: tokens.ink }} />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: '20px',
          pb: '28px',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Typography sx={{ fontSize: 15, color: tokens.inkSecondary, mt: '6px' }}>
          {CAFE_LADRO.tagline}
        </Typography>
        <Typography sx={{ fontSize: 15, color: tokens.green, fontWeight: 500, mt: '4px' }}>
          {CAFE_LADRO.openNote}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '8px' }}>
          <ScheduleIcon sx={{ fontSize: 18, color: tokens.inkSecondary }} />
          <Typography sx={{ fontSize: 15, color: tokens.inkSecondary }}>
            {CAFE_LADRO.detourNote}
          </Typography>
        </Box>

        {/* The two moves. Start commits the detour; Directions frames it first. */}
        <Box sx={{ display: 'flex', gap: '10px', mt: '18px' }}>
          <ButtonBase
            onClick={onStart}
            sx={{
              flex: 1,
              height: 52,
              gap: '8px',
              borderRadius: '999px',
              bgcolor: tokens.teal,
              transition: `transform 160ms ${MOTION_EMPHASIZED}`,
              '&:active': { transform: 'scale(0.98)' },
            }}
          >
            <NavigationIcon sx={{ fontSize: 20, color: '#fff' }} />
            <Typography sx={{ fontSize: 17, fontWeight: 500, color: '#fff' }}>Start</Typography>
          </ButtonBase>
          <ButtonBase
            onClick={onDirections}
            disabled={previewing}
            sx={{
              flex: 1,
              height: 52,
              gap: '8px',
              borderRadius: '999px',
              bgcolor: tokens.cyanContainerSoft,
              opacity: previewing ? 0.5 : 1,
              transition: `transform 160ms ${MOTION_EMPHASIZED}, opacity 200ms ${MOTION_EMPHASIZED}`,
              '&:active': { transform: 'scale(0.98)' },
            }}
          >
            <DirectionsIcon sx={{ fontSize: 20, color: tokens.onCyan }} />
            <Typography sx={{ fontSize: 17, fontWeight: 500, color: tokens.onCyan }}>
              {previewing ? 'Previewing' : 'Directions'}
            </Typography>
          </ButtonBase>
        </Box>

        <Box sx={{ display: 'flex', gap: '8px', mt: '20px' }}>
          <Box
            component="img"
            src={CAFE_LADRO.photos[0]}
            alt=""
            sx={{ flex: 2, height: 150, borderRadius: '12px', objectFit: 'cover', minWidth: 0 }}
          />
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
            {CAFE_LADRO.photos.slice(1).map((photo) => (
              <Box
                key={photo}
                component="img"
                src={photo}
                alt=""
                sx={{ width: '100%', height: 71, borderRadius: '12px', objectFit: 'cover' }}
              />
            ))}
          </Box>
        </Box>

        <Typography sx={{ fontSize: 15, color: tokens.ink, lineHeight: 1.55, mt: '18px' }}>
          {CAFE_LADRO.description}
        </Typography>

        <Typography sx={{ fontSize: 16, fontWeight: 500, color: tokens.ink, mt: '20px' }}>
          Know before you go
        </Typography>
        <Box sx={{ mt: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {CAFE_LADRO.highlights.map((line) => (
            <Box key={line} sx={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: tokens.teal,
                  mt: '7px',
                  flexShrink: 0,
                }}
              />
              <Typography sx={{ fontSize: 15, color: tokens.inkSecondary, lineHeight: 1.5 }}>
                {line}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
