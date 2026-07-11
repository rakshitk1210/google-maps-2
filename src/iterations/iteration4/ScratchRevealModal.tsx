import { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Button, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import {
  CAPTURE_CTA_LABEL,
  GEM_SUBTITLE,
  GEM_TITLE,
  MEMORY_CAPTION,
  MEMORY_IMAGE,
  SCRATCH_HINT,
} from './gemData'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface ScratchRevealModalProps {
  onClose: () => void
  onCapture: () => void
}

const REVEAL_THRESHOLD = 0.45

// Scrim + centered card (same modal pattern as GemCard). The memory photo sits
// underneath a canvas "foil"; pointer drags erase the foil, and once ~45% is
// scratched away the rest fades out to reveal Alex's memory and the CTA.
export function ScratchRevealModal({ onClose, onCapture }: ScratchRevealModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const [revealed, setRevealed] = useState(false)

  const paintFoil = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { width, height } = canvas
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, tokens.foil)
    gradient.addColorStop(1, tokens.foilDeep)
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Sparkle speckles so the foil reads as a scratch card.
    ctx.fillStyle = 'rgba(255,255,255,0.22)'
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      ctx.beginPath()
      ctx.arc(x, y, Math.random() * 1.6 + 0.4, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = "500 16px 'Google Sans Flex', 'Google Sans', Roboto, sans-serif"
    ctx.fillText('◆', width / 2, height / 2 - 16)
    ctx.fillText(SCRATCH_HINT, width / 2, height / 2 + 12)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
    paintFoil(canvas)
  }, [paintFoil])

  const scratchAt = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const rect = canvas.getBoundingClientRect()
      const x = ((clientX - rect.left) / rect.width) * canvas.width
      const y = ((clientY - rect.top) / rect.height) * canvas.height
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(x, y, 26, 0, Math.PI * 2)
      ctx.fill()
    },
    [],
  )

  const checkReveal = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let cleared = 0
    // Sample every 40th pixel's alpha for speed.
    for (let i = 3; i < data.length; i += 160) {
      if (data[i] === 0) cleared++
    }
    const total = data.length / 160
    if (cleared / total >= REVEAL_THRESHOLD) setRevealed(true)
  }, [])

  return (
    <>
      <Box
        onClick={onClose}
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          bgcolor: 'rgba(0,0,0,0.45)',
          animation: `gem-scrim-in 300ms ${MOTION_EMPHASIZED} both`,
          '@keyframes gem-scrim-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: 20,
          right: 20,
          top: '50%',
          zIndex: 21,
          bgcolor: tokens.surface,
          borderRadius: '24px',
          p: '20px',
          boxShadow: tokens.shadowFloat,
          animation: `gem-card-in 300ms ${MOTION_EMPHASIZED} both`,
          '@keyframes gem-card-in': {
            from: { opacity: 0, transform: 'translateY(-50%) scale(0.92)' },
            to: { opacity: 1, transform: 'translateY(-50%) scale(1)' },
          },
        }}
      >
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
            width: 44,
            height: 44,
            bgcolor: tokens.surfaceDim,
            '&:hover': { bgcolor: tokens.surfaceDim },
          }}
        >
          <CloseIcon sx={{ fontSize: 24, color: tokens.ink }} />
        </IconButton>

        <Typography sx={{ fontSize: 22, fontWeight: 500, color: tokens.ink, letterSpacing: '-0.2px', pr: '48px' }}>
          {GEM_TITLE}
        </Typography>
        <Typography sx={{ fontSize: 15, fontWeight: 400, color: tokens.inkSecondary, mt: '4px' }}>
          {GEM_SUBTITLE}
        </Typography>

        <Box
          sx={{
            position: 'relative',
            mt: '16px',
            width: '100%',
            aspectRatio: '4 / 5',
            borderRadius: '16px',
            overflow: 'hidden',
            bgcolor: tokens.surfaceDim,
          }}
        >
          <Box
            component="img"
            src={MEMORY_IMAGE}
            alt="Alex's memory"
            draggable={false}
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Box
            component="canvas"
            ref={canvasRef}
            onPointerDown={(event: React.PointerEvent<HTMLCanvasElement>) => {
              drawingRef.current = true
              event.currentTarget.setPointerCapture(event.pointerId)
              scratchAt(event.clientX, event.clientY)
            }}
            onPointerMove={(event: React.PointerEvent<HTMLCanvasElement>) => {
              if (!drawingRef.current) return
              scratchAt(event.clientX, event.clientY)
            }}
            onPointerUp={() => {
              drawingRef.current = false
              checkReveal()
            }}
            onPointerLeave={() => {
              if (drawingRef.current) {
                drawingRef.current = false
                checkReveal()
              }
            }}
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              touchAction: 'none',
              cursor: 'grab',
              opacity: revealed ? 0 : 1,
              pointerEvents: revealed ? 'none' : 'auto',
              transition: `opacity 400ms ${MOTION_EMPHASIZED}`,
            }}
          />
        </Box>

        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 400,
            color: tokens.inkSecondary,
            lineHeight: 1.45,
            mt: '12px',
            minHeight: 44,
            opacity: revealed ? 1 : 0,
            transition: `opacity 300ms ${MOTION_EMPHASIZED} 150ms`,
          }}
        >
          {MEMORY_CAPTION}
        </Typography>

        <Button
          fullWidth
          disabled={!revealed}
          onClick={onCapture}
          startIcon={<PhotoCameraIcon sx={{ fontSize: 20 }} />}
          sx={{
            mt: '16px',
            height: 48,
            borderRadius: 999,
            bgcolor: tokens.teal,
            color: '#fff',
            fontSize: 17,
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { bgcolor: tokens.tealBanner },
            '&.Mui-disabled': { bgcolor: '#E4E6E8', color: '#9AA0A6' },
          }}
        >
          {CAPTURE_CTA_LABEL}
        </Button>
      </Box>
    </>
  )
}
