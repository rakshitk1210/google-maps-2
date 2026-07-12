import { useRef, useState } from 'react'
import { ThemeProvider } from '@mui/material'
import { ExploreScreen } from './ExploreScreen'
import { TokensContext, normalTheme, normalTokens, roadTripTheme, roadTripTokens } from './theme'

// Iteration 7 — Road Trip mode toggle. Phone-only (renders in the shared
// portrait frame, no CarPlay stage). One piece of state drives everything:
// the palette flush (blue-green → Pinkish Mode), the bottom-nav swap, and the
// blue-dot → car morph, all over the 350ms ease-out switch.
export function GoogleMapsClone() {
  const [roadTrip, setRoadTrip] = useState(false)
  const hornRef = useRef<HTMLAudioElement | null>(null)

  const handleToggleRoadTrip = () => {
    setRoadTrip((v) => {
      const next = !v
      if (next) {
        if (!hornRef.current) {
          hornRef.current = new Audio('/audio/road-trip-toggle.mp3')
          hornRef.current.volume = 0.5
        }
        hornRef.current.currentTime = 0
        void hornRef.current.play()
      }
      return next
    })
  }

  return (
    <ThemeProvider theme={roadTrip ? roadTripTheme : normalTheme}>
      <TokensContext.Provider value={roadTrip ? roadTripTokens : normalTokens}>
        <ExploreScreen roadTrip={roadTrip} onToggleRoadTrip={handleToggleRoadTrip} />
      </TokensContext.Provider>
    </ThemeProvider>
  )
}
