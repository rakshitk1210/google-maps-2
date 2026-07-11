import { useState } from 'react'
import { Box, ThemeProvider } from '@mui/material'
import { MapCanvas } from './MapCanvas'
import { NavigationBanner } from './NavigationBanner'
import { NavigationSheet } from './NavigationSheet'
import { FloatingActions } from './FloatingActions'
import { GemCard } from './GemCard'
import { GemNotification } from './GemNotification'
import { ScratchRevealModal } from './ScratchRevealModal'
import { CameraScreen } from './CameraScreen'
import { MemoryReviewScreen } from './MemoryReviewScreen'
import { HomeScreen } from './HomeScreen'
import { theme, tokens } from './theme'

// Iteration 4 — "Alex's gem" discovery, then leaving your own.
// 1. Active nav to Portland, gem pulsing on the map.
// 2. Tap the gem → scrim + centered card → "Go there" reroutes (30 min away).
// 3. Click the car (demo shortcut) → it teleports to the gem and a Google Maps
//    notification slides in.
// 4. Tap the notification → scratch-to-reveal Alex's memory.
// 5. Capture memory → camera → review → Submit.
// 6. Explore home: two gems (Alex + the one you just left) with a "Gem created" toast.
type Stage = 'idle' | 'arrived' | 'scratch' | 'camera' | 'review' | 'home'

export function GoogleMapsClone() {
  const [cardOpen, setCardOpen] = useState(false)
  const [routeTarget, setRouteTarget] = useState<'destination' | 'gem'>('destination')
  const [stage, setStage] = useState<Stage>('idle')
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)

  const rerouted = routeTarget === 'gem'
  const carAtGem = stage !== 'idle'
  const showNav = stage === 'idle' || stage === 'arrived' || stage === 'scratch'

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          borderRadius: 'inherit',
          bgcolor: tokens.mapLand,
        }}
      >
        {showNav && (
          <>
            <MapCanvas
              routeTarget={routeTarget}
              carAtGem={carAtGem}
              onGemClick={() => {
                if (stage === 'idle' && !rerouted) setCardOpen(true)
              }}
              onCarClick={() => {
                // Hidden demo gesture (double-tap the car): only active once
                // rerouted toward the gem.
                if (rerouted && stage === 'idle') setStage('arrived')
              }}
            />

            <NavigationBanner rerouted={rerouted} />

            <FloatingActions />

            <NavigationSheet rerouted={rerouted} onExit={() => {}} />

            {cardOpen && (
              <GemCard
                onClose={() => setCardOpen(false)}
                onGoThere={() => {
                  setCardOpen(false)
                  setRouteTarget('gem')
                }}
              />
            )}

            {stage === 'arrived' && <GemNotification onTap={() => setStage('scratch')} />}

            {stage === 'scratch' && (
              <ScratchRevealModal
                onClose={() => setStage('arrived')}
                onCapture={() => setStage('camera')}
              />
            )}
          </>
        )}

        {stage === 'camera' && (
          <CameraScreen
            onBack={() => setStage('scratch')}
            onClose={() => setStage('arrived')}
            onCaptured={(dataUrl) => {
              setCapturedPhoto(dataUrl)
              setStage('review')
            }}
          />
        )}

        {stage === 'review' && capturedPhoto && (
          <MemoryReviewScreen
            photo={capturedPhoto}
            onRetake={() => setStage('camera')}
            onClose={() => setStage('arrived')}
            onSubmit={() => setStage('home')}
          />
        )}

        {stage === 'home' && <HomeScreen />}
      </Box>
    </ThemeProvider>
  )
}
