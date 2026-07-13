import { useRef, useState } from 'react'
import { ThemeProvider } from '@mui/material'
import { ExploreScreen } from './ExploreScreen'
import type { RoadTripTab } from './BottomNav'
import { TokensContext, normalTheme, normalTokens, roadTripTheme, roadTripTokens } from './theme'

// Iteration 7 — Road Trip mode toggle. Phone-only (renders in the shared
// portrait frame, no CarPlay stage). One piece of state drives everything:
// the accent flush (blue-green → pink), the bottom-nav swap, and the
// blue-dot → car morph, all over the 350ms ease-out switch. Inside Road Trip
// mode the nav switches between Explore / Friends / Capture views.
export function GoogleMapsClone() {
  const [roadTrip, setRoadTrip] = useState(false)
  const [rtTab, setRtTab] = useState<RoadTripTab>('explore')
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
    // Leaving Road Trip mode always lands back on the map.
    setRtTab('explore')
  }

  return (
    <ThemeProvider theme={roadTrip ? roadTripTheme : normalTheme}>
      <TokensContext.Provider value={roadTrip ? roadTripTokens : normalTokens}>
        <ExploreScreen
          roadTrip={roadTrip}
          onToggleRoadTrip={handleToggleRoadTrip}
          activeTab={rtTab}
          onSelectTab={setRtTab}
        />
      </TokensContext.Provider>
    </ThemeProvider>
  )
}
