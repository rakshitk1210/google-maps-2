import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { Box, ButtonBase, Typography } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import IosShareIcon from '@mui/icons-material/IosShare'
import CloseIcon from '@mui/icons-material/Close'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined'
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { ContributorAvatars } from './ContributorAvatars'
import { CategoryChips } from './CategoryChips'
import { PlaceCard } from './PlaceCard'
import { AskMapsCard } from './AskMapsCard'
import { AskSpark } from './AskSpark'
import { TRIP_TITLE, type TripPlace } from './tripData'
import { MOTION_EMPHASIZED, tokens } from './theme'
import { useDragReorder } from './useDragReorder'
import type { SheetSnap } from './TripSheet'

interface ListDetailSheetProps {
  snap: SheetSnap
  onSnapChange: (snap: SheetSnap) => void
  category: string
  onCategoryChange: (category: string) => void
  /** The shared itinerary in its current, user-arranged order. */
  places: TripPlace[]
  /** Commit a drag-to-reorder — the parent owns the list order. */
  onReorder: (next: TripPlace[]) => void
  /** Id of the just-added place to play the pop-in / push-down animation on. */
  justAddedId?: string | null
  /** Fired once the pop-in animation settles, so the parent can clear it. */
  onAnimatedIn?: () => void
  /** ✕ circle — back to the "Your lists" screen. */
  onClose: () => void
  /** The single dark-teal CTA — drops into road-trip mode. */
  onStartRoadtrip: () => void
  /** "Add places" pill — pops a new contribution onto the top of the list. */
  onAddPlace: () => void
  /** A place's directions button — jumps straight to route preview. */
  onDirections: (place: TripPlace) => void
  /** Whether the inline Ask Maps card is expanded (the pill hides meanwhile). */
  askOpen: boolean
  askDraft: string
  onAskDraftChange: (draft: string) => void
  /** Ask Maps pill — expands the inline card and snaps the sheet full. */
  onAskOpen: () => void
  /** The card's ✕ — collapse it and bring the pill back. */
  onAskClose: () => void
  /** Field focus — the parent slides the fake keyboard up. */
  onAskFocus: () => void
  /** Enter / send — opens the Ask Maps results sheet. */
  onAskSubmit: () => void
}

/** Visible header at peek: handle + circle actions + title + meta + pills. */
const PEEK_VISIBLE_H = 348

/** Immutable splice — moves one item from `from` to `to`. */
function arrayMove<T>(list: T[], from: number, to: number): T[] {
  const next = list.slice()
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}

/** Round icon action in the sheet's top-right cluster. */
function CircleAction({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: 38,
        height: 38,
        borderRadius: '50%',
        bgcolor: tokens.surfaceDim,
        color: tokens.ink,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </ButtonBase>
  )
}

// The collaborative list-detail sheet (iteration 15). Draggable like the
// itinerary sheet (peek ↔ full) but topped with the list chrome: emoji header,
// ⋯/share/✕ circle actions, the shared-list title, contributor stack + meta,
// and the action-pill row — now led by the gradient "Ask Maps" pill that
// swaps itself for the inline AI search card. Below the drag surface the
// category chips and "Marked by X" place cards scroll once fully open.
export function ListDetailSheet({
  snap,
  onSnapChange,
  category,
  onCategoryChange,
  places,
  onReorder,
  justAddedId,
  onAnimatedIn,
  onClose,
  onStartRoadtrip,
  onAddPlace,
  onDirections,
  askOpen,
  askDraft,
  onAskDraftChange,
  onAskOpen,
  onAskClose,
  onAskFocus,
  onAskSubmit,
}: ListDetailSheetProps) {
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

  const { peekY, fullY } = useMemo(
    () => ({
      peekY: Math.max(frameH - PEEK_VISIBLE_H, 0),
      fullY: frameH * 0.06,
    }),
    [frameH],
  )

  const settledY = snap === 'full' ? fullY : peekY
  const y = dragY ?? settledY
  const expanded = snap === 'full'

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (frameH === 0) return
    dragStart.current = { pointerY: e.clientY, sheetY: y, moved: false }
    lastMoves.current = [{ y: e.clientY, t: performance.now() }]
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragY(y)
  }

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragY === null) return
    const delta = e.clientY - dragStart.current.pointerY
    if (Math.abs(delta) > 8) dragStart.current.moved = true
    setDragY(Math.min(Math.max(dragStart.current.sheetY + delta, fullY), peekY))
    lastMoves.current.push({ y: e.clientY, t: performance.now() })
    if (lastMoves.current.length > 2) lastMoves.current.shift()
  }

  const handlePointerUp = () => {
    if (dragY === null) return
    const [a, b] = [lastMoves.current[0], lastMoves.current[lastMoves.current.length - 1]]
    const velocity = b && a && b.t > a.t ? (b.y - a.y) / (b.t - a.t) : 0 // px/ms, + = downward

    if (Math.abs(velocity) > 0.5) {
      onSnapChange(velocity < 0 ? 'full' : 'peek')
    } else {
      onSnapChange(Math.abs(dragY - fullY) < Math.abs(dragY - peekY) ? 'full' : 'peek')
    }
    setDragY(null)
  }

  // Tapping the collapsed header also expands — sheets work both ways.
  const handleHeaderClick = () => {
    if (dragStart.current.moved) return
    if (snap === 'peek') onSnapChange('full')
  }

  const filtered =
    category === 'All' ? places : places.filter((place) => place.category === category)

  // A reorder happens within the currently-visible rows; thread the new visible
  // order back into the full list (rows hidden by the filter keep their slots),
  // so the arranged order survives filtering and carries into the road trip.
  const commitReorder = (from: number, to: number) => {
    const nextVisible = arrayMove(filtered, from, to)
    const visibleIds = new Set(filtered.map((place) => place.id))
    let cursor = 0
    onReorder(places.map((place) => (visibleIds.has(place.id) ? nextVisible[cursor++] : place)))
  }
  const reorder = useDragReorder(filtered.length, commitReorder)

  return (
    <Box
      ref={rootRef}
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
        zIndex: 6,
        bgcolor: tokens.surface,
        borderRadius: '28px 28px 0 0',
        boxShadow: tokens.shadowSheet,
        display: 'flex',
        flexDirection: 'column',
        transform: `translateY(${y}px)`,
        transition: dragY !== null ? 'none' : `transform 360ms ${MOTION_EMPHASIZED}`,
      }}
    >
      {/* Drag surface: handle + list chrome */}
      <Box
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleHeaderClick}
        sx={{ px: '20px', pt: '8px', pb: '10px', touchAction: 'none', userSelect: 'none', cursor: 'grab' }}
      >
        <Box
          sx={{ width: 36, height: 4, borderRadius: 999, bgcolor: tokens.dragHandle, mx: 'auto', mb: '12px' }}
        />

        {/* Emoji + circle actions row */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: 30, lineHeight: 1, flex: 1 }}>😍</Typography>
          {/* Stop propagation so tapping an action doesn't start a sheet drag. */}
          <Box onPointerDown={(e) => e.stopPropagation()} sx={{ display: 'flex', gap: '8px' }}>
            <CircleAction>
              <MoreHorizIcon sx={{ fontSize: 20 }} />
            </CircleAction>
            <CircleAction>
              <IosShareIcon sx={{ fontSize: 19 }} />
            </CircleAction>
            <CircleAction onClick={onClose}>
              <CloseIcon sx={{ fontSize: 20 }} />
            </CircleAction>
          </Box>
        </Box>

        <Typography
          sx={{ fontSize: 28, fontWeight: 500, color: tokens.ink, letterSpacing: '-0.3px', mt: '8px' }}
        >
          {TRIP_TITLE}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', mt: '10px' }}>
          <ContributorAvatars />
        </Box>
        <Typography sx={{ fontSize: 14, fontWeight: 400, color: tokens.inkSecondary, mt: '8px' }}>
          You, Kelley +2 · {places.length} places
        </Typography>

        {/* Action pills — the gradient Ask Maps pill leads; it collapses away
            while the inline card below is open. Stop propagation so tapping a
            pill doesn't start a sheet drag. */}
        <Box
          onPointerDown={(e) => e.stopPropagation()}
          sx={{
            display: 'flex',
            flexWrap: 'nowrap',
            gap: '10px',
            mt: '14px',
            mx: '-20px',
            px: '20px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <Box
            sx={{
              flexShrink: 0,
              overflow: 'hidden',
              maxWidth: askOpen ? 0 : 140,
              opacity: askOpen ? 0 : 1,
              // Swallow the row gap too, so the remaining pills close ranks.
              mr: askOpen ? '-10px' : 0,
              transition: `max-width 320ms ${MOTION_EMPHASIZED}, opacity 320ms ${MOTION_EMPHASIZED}, margin-right 320ms ${MOTION_EMPHASIZED}`,
              pointerEvents: askOpen ? 'none' : 'auto',
            }}
          >
            <ButtonBase
              onClick={onAskOpen}
              sx={{
                height: 44,
                pl: '14px',
                pr: '16px',
                borderRadius: 999,
                whiteSpace: 'nowrap',
                background: 'linear-gradient(90deg, #4285F4 0%, #9B72CB 50%, #D96570 100%)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <AskSpark size={20} tone="white" />
              <Typography sx={{ fontSize: 16, fontWeight: 500, color: '#fff' }}>Ask Maps</Typography>
            </ButtonBase>
          </Box>

          <ButtonBase
            onClick={onAddPlace}
            sx={{
              height: 44,
              px: '16px',
              borderRadius: 999,
              flexShrink: 0,
              whiteSpace: 'nowrap',
              bgcolor: tokens.cyanContainer,
              color: tokens.onCyan,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AddLocationAltOutlinedIcon sx={{ fontSize: 20 }} />
            <Typography sx={{ fontSize: 15, fontWeight: 500, color: tokens.onCyan }}>Add places</Typography>
          </ButtonBase>

          <ButtonBase
            sx={{
              height: 44,
              px: '16px',
              borderRadius: 999,
              flexShrink: 0,
              whiteSpace: 'nowrap',
              bgcolor: tokens.cyanContainer,
              color: tokens.onCyan,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <PersonAddAltIcon sx={{ fontSize: 20 }} />
            <Typography sx={{ fontSize: 15, fontWeight: 500, color: tokens.onCyan }}>
              Invite friends
            </Typography>
          </ButtonBase>

          <ButtonBase
            onClick={onStartRoadtrip}
            sx={{
              height: 44,
              px: '18px',
              borderRadius: 999,
              flexShrink: 0,
              whiteSpace: 'nowrap',
              bgcolor: tokens.teal,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <DirectionsCarFilledIcon sx={{ fontSize: 20 }} />
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Start a road trip</Typography>
          </ButtonBase>
        </Box>

        {/* Inline Ask Maps card — expands below the pills, pushing the chips
            and list down. Inside the drag surface, so stop pointer propagation
            or typing in the field would start a sheet drag. */}
        <Box onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
          <AskMapsCard
            open={askOpen}
            draft={askDraft}
            onDraftChange={onAskDraftChange}
            onClose={onAskClose}
            onFocus={onAskFocus}
            onSubmit={onAskSubmit}
          />
        </Box>
      </Box>

      {/* Body — chips + "Marked by X" cards, scrolls once fully open. */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: expanded ? 'auto' : 'hidden',
          overflowX: 'hidden',
          '&::-webkit-scrollbar': { display: 'none' },
          px: '20px',
          pt: '8px',
          pb: '48px',
        }}
      >
        <CategoryChips selected={category} onSelect={onCategoryChange} />
        <Box ref={reorder.listRef} sx={{ mt: '6px' }}>
          {filtered.map((place, index) => {
            const isNew = place.id === justAddedId
            const isDragging = reorder.dragIndex === index
            return (
              <Box
                key={place.id}
                onAnimationEnd={isNew ? onAnimatedIn : undefined}
                style={reorder.rowStyle(index)}
                sx={{
                  borderBottom:
                    index < filtered.length - 1 ? `1px solid ${tokens.hairline}` : 'none',
                  // A freshly contributed place pops in on top; the bouncy
                  // "back" easing overshoots translateY so the whole list below
                  // springs down as the new row grows into place.
                  ...(isNew && {
                    overflow: 'hidden',
                    animation: 'contribute-in 560ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
                    '@keyframes contribute-in': {
                      '0%': { maxHeight: 0, opacity: 0, transform: 'translateY(-12px)' },
                      '100%': { maxHeight: '240px', opacity: 1, transform: 'translateY(0)' },
                    },
                  }),
                }}
              >
                <PlaceCard
                  place={place}
                  onDirections={onDirections}
                  dragHandle={
                    <Box
                      role="button"
                      aria-label={`Reorder ${place.name}`}
                      {...reorder.handleProps(index)}
                      sx={{
                        alignSelf: 'stretch',
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0,
                        pl: '4px',
                        pr: '2px',
                        ml: '-4px',
                        color: isDragging ? tokens.inkSecondary : tokens.dragHandle,
                        cursor: 'grab',
                        touchAction: 'none',
                        transition: 'color 150ms ease',
                        '&:active': { cursor: 'grabbing' },
                      }}
                    >
                      <DragIndicatorIcon sx={{ fontSize: 22 }} />
                    </Box>
                  }
                />
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}
