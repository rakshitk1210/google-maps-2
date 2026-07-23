import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { Box, Typography } from '@mui/material'
import { ContributorAvatars } from './ContributorAvatars'
import { CategoryChips } from './CategoryChips'
import { PlaceCard } from './PlaceCard'
import { TRIP_TITLE, type TripPlace } from './tripData'
import { MOTION_EMPHASIZED, tokens } from './theme'

export type SheetSnap = 'peek' | 'full'

interface TripSheetProps {
  /** Slid on-screen at all — false parks the sheet below the frame. */
  visible: boolean
  /**
   * 'tab': lives behind the bottom nav on the Road Trip tab, snapping between
   * peek and full. 'overNav': overlays the driving view at full height with a
   * scrim, and dragging down dismisses it.
   */
  variant: 'tab' | 'overNav'
  snap: SheetSnap
  onSnapChange: (snap: SheetSnap) => void
  category: string
  onCategoryChange: (category: string) => void
  /** The shared itinerary in its current, user-arranged order. */
  places: TripPlace[]
  onDirections: (place: TripPlace) => void
  /** overNav only: scrim tap / drag-down dismiss. */
  onClose: () => void
}

const NAV_BAR_H = 84
/** Visible header at peek: drag handle + title + avatar row. */
const PEEK_VISIBLE_H = 196

// The itinerary bottom sheet (design.md §5: radius 28 top, drag handle, snap
// peek/full, content scrolls only at full). This is the first iteration with a
// real drag gesture: pointer events on the header block move the sheet's
// translateY directly, then it snaps by release velocity or nearest point.
// The component never unmounts — hiding just parks it below the frame — so the
// category filter and list scroll survive phase changes; that keeps the
// "filter to Nature mid-drive, then pick" beat seamless.
export function TripSheet({
  visible,
  variant,
  snap,
  onSnapChange,
  category,
  onCategoryChange,
  places,
  onDirections,
  onClose,
}: TripSheetProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [frameH, setFrameH] = useState(0)
  // While a finger is down the sheet follows it exactly; null means "settled".
  const [dragY, setDragY] = useState<number | null>(null)
  const dragStart = useRef({ pointerY: 0, sheetY: 0, moved: false })
  const lastMoves = useRef<{ y: number; t: number }[]>([])

  useLayoutEffect(() => {
    const measure = () => {
      const parent = rootRef.current?.parentElement
      if (parent) setFrameH(parent.clientHeight)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const { peekY, fullY, hiddenY } = useMemo(
    () => ({
      peekY: Math.max(frameH - NAV_BAR_H - PEEK_VISIBLE_H, 0),
      fullY: frameH * 0.06,
      hiddenY: frameH + 40,
    }),
    [frameH],
  )

  const settledY = !visible ? hiddenY : variant === 'overNav' ? fullY : snap === 'full' ? fullY : peekY
  const y = dragY ?? settledY
  const expanded = variant === 'overNav' || snap === 'full'

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!visible || frameH === 0) return
    dragStart.current = { pointerY: e.clientY, sheetY: y, moved: false }
    lastMoves.current = [{ y: e.clientY, t: performance.now() }]
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragY(y)
  }

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragY === null) return
    const delta = e.clientY - dragStart.current.pointerY
    if (Math.abs(delta) > 8) dragStart.current.moved = true
    // overNav can only be pulled downward (toward dismissal).
    const max = variant === 'overNav' ? hiddenY : peekY
    setDragY(Math.min(Math.max(dragStart.current.sheetY + delta, fullY), max))
    lastMoves.current.push({ y: e.clientY, t: performance.now() })
    if (lastMoves.current.length > 2) lastMoves.current.shift()
  }

  const handlePointerUp = () => {
    if (dragY === null) return
    const [a, b] = [lastMoves.current[0], lastMoves.current[lastMoves.current.length - 1]]
    const velocity = b && a && b.t > a.t ? (b.y - a.y) / (b.t - a.t) : 0 // px/ms, + = downward

    if (variant === 'overNav') {
      // Flick down or drag past a third of the way → dismiss.
      if (velocity > 0.5 || dragY > fullY + frameH * 0.3) onClose()
    } else if (Math.abs(velocity) > 0.5) {
      onSnapChange(velocity < 0 ? 'full' : 'peek')
    } else {
      onSnapChange(Math.abs(dragY - fullY) < Math.abs(dragY - peekY) ? 'full' : 'peek')
    }
    setDragY(null)
  }

  // Tapping the collapsed header also expands — sheets work both ways.
  const handleHeaderClick = () => {
    if (dragStart.current.moved) return
    if (variant === 'tab' && snap === 'peek') onSnapChange('full')
  }

  const filtered =
    category === 'All' ? places : places.filter((place) => place.category === category)

  return (
    <>
      {/* Scrim behind the over-nav sheet; tap to get back to driving. */}
      {variant === 'overNav' && (
        <Box
          onClick={onClose}
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.2)',
            zIndex: 8,
            opacity: visible ? 1 : 0,
            pointerEvents: visible ? 'auto' : 'none',
            transition: `opacity 300ms ${MOTION_EMPHASIZED}`,
          }}
        />
      )}

      <Box
        ref={rootRef}
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '100%',
          zIndex: variant === 'overNav' ? 9 : 6,
          bgcolor: tokens.surface,
          borderRadius: '28px 28px 0 0',
          boxShadow: tokens.shadowSheet,
          display: 'flex',
          flexDirection: 'column',
          transform: `translateY(${y}px)`,
          // The finger owns the transform while dragging; snapping animates.
          transition: dragY !== null ? 'none' : `transform 300ms ${MOTION_EMPHASIZED}`,
        }}
      >
        {/* Drag surface: handle + title + avatars */}
        <Box
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClick={handleHeaderClick}
          sx={{ px: '20px', pt: '8px', pb: '14px', touchAction: 'none', userSelect: 'none', cursor: 'grab' }}
        >
          <Box
            sx={{ width: 36, height: 4, borderRadius: 999, bgcolor: tokens.dragHandle, mx: 'auto', mb: '14px' }}
          />
          <Typography sx={{ fontSize: 24, fontWeight: 500, color: tokens.ink, letterSpacing: '-0.2px' }}>
            {TRIP_TITLE}
          </Typography>
          <Box sx={{ mt: '12px' }}>
            <ContributorAvatars />
          </Box>
        </Box>

        {/* Itinerary body — scrolls only once the sheet is fully open. */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: expanded ? 'auto' : 'hidden',
            '&::-webkit-scrollbar': { display: 'none' },
            px: '20px',
            pb: `${NAV_BAR_H + 40}px`,
          }}
        >
          <Typography sx={{ fontSize: 19, fontWeight: 500, color: tokens.ink, mt: '6px' }}>
            Places marked
          </Typography>
          <Box sx={{ mt: '12px' }}>
            <CategoryChips selected={category} onSelect={onCategoryChange} />
          </Box>

          <Box sx={{ mt: '6px' }}>
            {filtered.map((place, index) => (
              <Box
                key={place.id}
                sx={{ borderBottom: index < filtered.length - 1 ? `1px solid ${tokens.hairline}` : 'none' }}
              >
                <PlaceCard place={place} onDirections={onDirections} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  )
}
