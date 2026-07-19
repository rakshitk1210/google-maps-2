import { useState } from 'react'
import { Box, ThemeProvider } from '@mui/material'
import { JamMapCanvas } from './JamMapCanvas'
import { PhoneStatusBar } from './PhoneStatusBar'
import { NavBanner } from './NavBanner'
import { JamChip } from './JamChip'
import { NavRail } from './NavRail'
import { NavBottomBar } from './NavBottomBar'
import { SearchAlongRoutePanel } from './SearchAlongRoutePanel'
import { RestaurantsSheet } from './RestaurantsSheet'
import { QuickDecideSheet } from './QuickDecideSheet'
import { MatchOverlay } from './MatchOverlay'
import { RoutePreview } from './RoutePreview'
import { MATCH_NAV, TRIP_DESTINATION, type NavDestination, type Restaurant } from './jamTripData'
import { theme, tokens } from './theme'

type Screen = 'nav' | 'search' | 'results' | 'preview'

// Iteration 10 — "Quick Decide in a Jam". The app opens mid-drive: Kelley's
// Jam is northbound on I-5 toward Bellingham. The nav rail's search button
// leads to "Search along route" → Restaurants, which zooms out over the
// corridor with rating-pill markers and a results sheet whose blue Quick
// Decide button deals the jam a shared Tinder-style deck. The 3rd right-swipe
// matches with Winnie; from the match card the jam can save the spot, push it
// to Kelley's CarPlay, or get Directions — which (per the iteration 9
// correction) drops to a route preview and waits for a deliberate Start
// rather than re-routing live under the driver.
export function GoogleMapsClone() {
  const [screen, setScreen] = useState<Screen>('nav')
  // Committed nav destination vs. the pending one shown on the preview screen.
  const [destination, setDestination] = useState<NavDestination>(TRIP_DESTINATION)
  const [previewDest, setPreviewDest] = useState<NavDestination | null>(null)
  const [quickDecideOpen, setQuickDecideOpen] = useState(false)
  const [match, setMatch] = useState<Restaurant | null>(null)

  const handleDirections = () => {
    setMatch(null)
    setQuickDecideOpen(false)
    setPreviewDest(MATCH_NAV)
    setScreen('preview')
  }

  const handleStart = () => {
    if (previewDest) setDestination(previewDest)
    setPreviewDest(null)
    setScreen('nav')
  }

  const handlePreviewBack = () => {
    setPreviewDest(null)
    setScreen('nav')
  }

  const showNavChrome = screen === 'nav' || screen === 'results'

  return (
    <ThemeProvider theme={theme}>
      {/* overflow: clip (not hidden) — sheets overhang the frame, and a focus
          inside one would otherwise scroll this box off-kilter. */}
      <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'clip', bgcolor: tokens.mapLand }}>
        <JamMapCanvas
          phase={screen === 'preview' ? 'preview' : 'nav'}
          dest={previewDest ?? destination}
          restaurantsVisible={screen === 'results' || quickDecideOpen}
        />
        <PhoneStatusBar />

        {showNavChrome && (
          <>
            <NavBanner road={destination.bannerRoad} />
            <JamChip />
            <NavRail onSearchClick={() => setScreen('search')} />
            <NavBottomBar duration={destination.duration} meta={destination.meta} onExit={() => {}} />
          </>
        )}

        {screen === 'preview' && previewDest && (
          <RoutePreview dest={previewDest} onBack={handlePreviewBack} onStart={handleStart} />
        )}

        {screen === 'results' && (
          <RestaurantsSheet
            onClose={() => setScreen('nav')}
            onQuickDecide={() => setQuickDecideOpen(true)}
          />
        )}

        {quickDecideOpen && (
          <QuickDecideSheet onClose={() => setQuickDecideOpen(false)} onMatch={setMatch} />
        )}

        {match && (
          <MatchOverlay restaurant={match} onDirections={handleDirections} onClose={() => setMatch(null)} />
        )}

        {screen === 'search' && (
          <SearchAlongRoutePanel
            onBack={() => setScreen('nav')}
            onSelectRestaurants={() => setScreen('results')}
          />
        )}
      </Box>
    </ThemeProvider>
  )
}
