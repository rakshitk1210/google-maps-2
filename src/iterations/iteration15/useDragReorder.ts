import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import { MOTION_EMPHASIZED } from './theme'

// A hand-rolled pointer drag-to-reorder for a vertical list — same spirit as
// the sheet drag gestures in this iteration (pointer capture + direct
// transforms, no dnd dependency). Rows are addressed by their index in the
// *rendered* list; on drop it reports (from → to) so the caller splices its own
// source order. The drag starts from a grip handle, not the row body, so the
// sheet can still be scrolled with a normal swipe.
//
// The whole gesture resolves against row rects frozen at pick-up: the lifted
// row follows the finger, the rows it crosses slide open a gap, and on release
// the lifted row eases into that gap before the reordered DOM commits — so the
// list settles with no snap.
export function useDragReorder(count: number, onCommit: (from: number, to: number) => void) {
  const listRef = useRef<HTMLDivElement>(null)
  const geom = useRef<{ top: number; height: number }[]>([])
  const startY = useRef(0)
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const [delta, setDelta] = useState(0)
  const [settling, setSettling] = useState(false)

  useEffect(() => () => { if (settleTimer.current) clearTimeout(settleTimer.current) }, [])

  const reset = useCallback(() => {
    setDragIndex(null)
    setOverIndex(null)
    setDelta(0)
    setSettling(false)
  }, [])

  const onPointerDown = (index: number) => (e: ReactPointerEvent<HTMLElement>) => {
    if (!listRef.current) return
    // Own the gesture: keep it off the sheet scroll and the row's tap targets.
    e.preventDefault()
    e.stopPropagation()
    geom.current = (Array.from(listRef.current.children).slice(0, count) as HTMLElement[]).map(
      (el) => {
        const r = el.getBoundingClientRect()
        return { top: r.top, height: r.height }
      },
    )
    startY.current = e.clientY
    e.currentTarget.setPointerCapture(e.pointerId)
    setSettling(false)
    setDragIndex(index)
    setOverIndex(index)
    setDelta(0)
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (dragIndex === null || settling) return
    const d = e.clientY - startY.current
    setDelta(d)
    // Where the lifted row's midline now sits, measured against the frozen rects.
    const g = geom.current
    const center = g[dragIndex].top + g[dragIndex].height / 2 + d
    let target = dragIndex
    if (d > 0) {
      for (let i = dragIndex + 1; i < g.length; i++) {
        if (center > g[i].top + g[i].height / 2) target = i
        else break
      }
    } else if (d < 0) {
      for (let i = dragIndex - 1; i >= 0; i--) {
        if (center < g[i].top + g[i].height / 2) target = i
        else break
      }
    }
    if (target !== overIndex) setOverIndex(target)
  }

  const onPointerUp = (e: ReactPointerEvent<HTMLElement>) => {
    if (dragIndex === null) return
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // Pointer already released.
    }
    const from = dragIndex
    const to = overIndex ?? dragIndex
    if (to === from) {
      reset()
      return
    }
    // Ease the lifted row into the gap the others opened, then commit. `snapped`
    // is exactly the row's flow displacement after the reorder, so when the
    // reordered DOM lands and the transform clears, the pixels don't move.
    const snapped = geom.current[to].top - geom.current[from].top
    setSettling(true)
    setDelta(snapped)
    settleTimer.current = setTimeout(() => {
      onCommit(from, to)
      reset()
    }, 190)
  }

  const handleProps = (index: number) => ({
    onPointerDown: onPointerDown(index),
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
  })

  const rowStyle = (index: number): CSSProperties => {
    if (dragIndex === null) return {}
    const rowH = geom.current[dragIndex]?.height ?? 0

    if (index === dragIndex) {
      const lifted = !settling
      return {
        position: 'relative',
        zIndex: 3,
        transform: `translateY(${delta}px) scale(${lifted ? 1.015 : 1})`,
        transition: settling
          ? `transform 190ms ${MOTION_EMPHASIZED}, box-shadow 190ms ${MOTION_EMPHASIZED}`
          : 'none',
        boxShadow: lifted ? '0 6px 16px rgba(60,64,67,.22), 0 2px 6px rgba(60,64,67,.14)' : 'none',
        borderRadius: 16,
        borderBottomColor: 'transparent',
        background: '#FFFFFF',
        cursor: 'grabbing',
      }
    }

    // Rows between the source and the current target slide by one row height to
    // hold the gap open.
    const target = overIndex ?? dragIndex
    let shift = 0
    if (target > dragIndex && index > dragIndex && index <= target) shift = -rowH
    else if (target < dragIndex && index < dragIndex && index >= target) shift = rowH
    return {
      transform: `translateY(${shift}px)`,
      transition: `transform 190ms ${MOTION_EMPHASIZED}`,
    }
  }

  return { listRef, handleProps, rowStyle, dragIndex }
}
