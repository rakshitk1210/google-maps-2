import { useCallback, useEffect, useRef, useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import DiamondIcon from '@mui/icons-material/Diamond'
import CameraswitchIcon from '@mui/icons-material/Cameraswitch'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { CAMERA_TITLE, CAPTURE_FALLBACK_IMAGE } from './gemData'
import { tokens } from './theme'

interface CameraScreenProps {
  onBack: () => void
  onClose: () => void
  onCaptured: (dataUrl: string) => void
}

type FacingMode = 'user' | 'environment'

// Full-screen camera. Uses a real webcam via getUserMedia; if the browser
// denies permission or has no camera, it falls back to a placeholder viewfinder
// so the demo still completes. Controls (per the sketch): upload-from-device,
// shutter, reverse-camera.
export function CameraScreen({ onBack, onClose, onCaptured }: CameraScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [facingMode, setFacingMode] = useState<FacingMode>('user')
  const [cameraReady, setCameraReady] = useState(false)
  const [denied, setDenied] = useState(false)

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }, [])

  useEffect(() => {
    let cancelled = false

    async function start() {
      setCameraReady(false)
      stopStream()
      if (!navigator.mediaDevices?.getUserMedia) {
        setDenied(true)
        return
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play().catch(() => {})
        }
        setDenied(false)
        setCameraReady(true)
      } catch {
        if (!cancelled) setDenied(true)
      }
    }

    start()
    return () => {
      cancelled = true
      stopStream()
    }
  }, [facingMode, stopStream])

  const isFront = facingMode === 'user'

  const handleShutter = () => {
    const video = videoRef.current
    if (denied || !cameraReady || !video || !video.videoWidth) {
      onCaptured(CAPTURE_FALLBACK_IMAGE)
      return
    }
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      onCaptured(CAPTURE_FALLBACK_IMAGE)
      return
    }
    if (isFront) {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    onCaptured(canvas.toDataURL('image/jpeg', 0.9))
  }

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onCaptured(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 30,
        bgcolor: '#000',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'inherit',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          pt: '54px',
          px: '16px',
          pb: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0))',
        }}
      >
        <IconButton aria-label="Back" onClick={onBack} sx={{ color: '#fff' }}>
          <ArrowBackIcon sx={{ fontSize: 24 }} />
        </IconButton>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <DiamondIcon sx={{ fontSize: 20, color: '#fff' }} />
          <Typography sx={{ fontSize: 18, fontWeight: 500, color: '#fff' }}>{CAMERA_TITLE}</Typography>
        </Box>
        <IconButton aria-label="Close" onClick={onClose} sx={{ color: '#fff' }}>
          <CloseIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </Box>

      <Box sx={{ position: 'absolute', inset: 0 }}>
        <Box
          component="video"
          ref={videoRef}
          muted
          playsInline
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isFront ? 'scaleX(-1)' : 'none',
            display: denied ? 'none' : 'block',
          }}
        />
        {denied && (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.55)), url(${CAPTURE_FALLBACK_IMAGE})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              px: '32px',
              textAlign: 'center',
            }}
          >
            <DiamondIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.9)' }} />
            <Typography sx={{ fontSize: 16, fontWeight: 500, color: '#fff' }}>
              Camera unavailable
            </Typography>
            <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>
              Allow camera access, or tap the shutter to use a sample photo.
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          pb: '36px',
          pt: '24px',
          px: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleUpload}
        />
        <IconButton
          aria-label="Upload from device"
          onClick={() => fileInputRef.current?.click()}
          sx={{ width: 52, height: 52, bgcolor: 'rgba(255,255,255,0.16)', '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' } }}
        >
          <AddPhotoAlternateIcon sx={{ fontSize: 26, color: '#fff' }} />
        </IconButton>

        <Box
          role="button"
          aria-label="Capture photo"
          onClick={handleShutter}
          sx={{
            width: 76,
            height: 76,
            borderRadius: '50%',
            border: '4px solid #fff',
            p: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 120ms ease',
            '&:active': { transform: 'scale(0.94)' },
          }}
        >
          <Box sx={{ width: '100%', height: '100%', borderRadius: '50%', bgcolor: '#fff' }} />
        </Box>

        <IconButton
          aria-label="Reverse camera"
          onClick={() => setFacingMode((mode) => (mode === 'user' ? 'environment' : 'user'))}
          sx={{ width: 52, height: 52, bgcolor: 'rgba(255,255,255,0.16)', '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' } }}
        >
          <CameraswitchIcon sx={{ fontSize: 26, color: '#fff' }} />
        </IconButton>
      </Box>
    </Box>
  )
}
