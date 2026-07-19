import { useRef, useState } from 'react'
import { Box, ThemeProvider, Typography } from '@mui/material'
import PlaceIcon from '@mui/icons-material/Place'
import MicIcon from '@mui/icons-material/Mic'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import { TripMapCanvas, type Phase } from './TripMapCanvas'
import { PhoneStatusBar } from './PhoneStatusBar'
import { BottomNav, type Tab } from './BottomNav'
import { TripSheet, type SheetSnap } from './TripSheet'
import { RoutePreview } from './RoutePreview'
import { NavBanner } from './NavBanner'
import { RoadTripBadge } from './RoadTripBadge'
import { NavBottomBar } from './NavBottomBar'
import { YOU_AVATAR, type TripPlace } from './tripData'
import { theme, tokens } from './theme'

// Iteration 9 — the Road Trip destination tab. The fam's shared "Roadtrip to
// Skagit Valley" itinerary lives in a draggable bottom sheet behind a new
// fourth nav tab. Tapping a place's directions button previews the route from
// the U District; Start drops into active nav; and the Road Trip chip
// under the banner reopens the itinerary mid-drive. Switching destinations —
// whether from the home tab or mid-drive — always lands back on the route
// preview screen with the new destination filled in; the driver has to press
// Start again rather than being re-routed live underneath them.
export function GoogleMapsClone() {
  const [tab, setTab] = useState<Tab>('explore')
  const [phase, setPhase] = useState<Phase>('home')
  const [snap, setSnap] = useState<SheetSnap>('peek')
  const [place, setPlace] = useState<TripPlace | null>(null)
  const [navSheetOpen, setNavSheetOpen] = useState(false)
  // Lives here (not in the sheet) so the filter survives phase changes.
  const [category, setCategory] = useState('All')
  const hornPlayed = useRef(false)

  const handleSelectTab = (next: Tab) => {
    setTab(next)
    if (next === 'roadtrip') {
      setSnap('peek')
      // The little horn toot from iteration 7, once per session.
      if (!hornPlayed.current) {
        hornPlayed.current = true
        const horn = new Audio('/audio/road-trip-toggle.mp3')
        horn.volume = 0.5
        horn.play().catch(() => {})
      }
    }
  }

  const handleDirections = (next: TripPlace) => {
    setPlace(next)
    setPhase('preview')
    // Drop out of nav (if we were in it) so the driver reviews the new route
    // and presses Start again, rather than being re-routed live underneath them.
    setNavSheetOpen(false)
  }

  const handleExitNav = () => {
    setPhase('home')
    setPlace(null)
    setNavSheetOpen(false)
  }

  return (
    <ThemeProvider theme={theme}>
      {/* overflow: clip (not hidden) — the parked sheet overhangs the frame,
          and a focus inside it would otherwise scroll this box off-kilter. */}
      <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'clip', bgcolor: tokens.mapLand }}>
        <TripMapCanvas phase={phase} place={place} />
        <PhoneStatusBar />

        {phase === 'home' && (
          <>
            {/* Search bar, §6.1: 16px margins, top 62, 56px pill */}
            <Box
              sx={{
                position: 'absolute',
                top: 62,
                left: 16,
                right: 16,
                height: 56,
                borderRadius: 999,
                bgcolor: tokens.surface,
                display: 'flex',
                alignItems: 'center',
                pl: '16px',
                pr: '10px',
                zIndex: 3,
              }}
            >
              <PlaceIcon sx={{ fontSize: 26, color: tokens.red }} />
              <Typography sx={{ fontSize: 19, fontWeight: 400, color: tokens.inkSecondary, ml: '14px', flex: 1 }}>
                Search here
              </Typography>
              <MicIcon sx={{ fontSize: 24, color: tokens.inkSecondary, mr: '10px' }} />
              <Box
                component="img"
                src={YOU_AVATAR}
                alt=""
                sx={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
              />
            </Box>

            {/* Chip row, §6.2: 12px below search (decorative) */}
            <Box
              sx={{
                position: 'absolute',
                top: 130,
                left: 16,
                right: 0,
                display: 'flex',
                gap: '8px',
                overflow: 'hidden',
                zIndex: 3,
              }}
            >
              <Box
                sx={{
                  height: 44,
                  px: '16px',
                  borderRadius: 999,
                  bgcolor: tokens.surface,
                  border: `1.5px solid ${tokens.blue}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexShrink: 0,
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: 22, color: tokens.blue }} />
                <Typography sx={{ fontSize: 16, fontWeight: 500, color: tokens.blue }}>Ask Maps</Typography>
              </Box>
              <Box
                sx={{
                  height: 44,
                  px: '16px',
                  borderRadius: 999,
                  bgcolor: tokens.surface,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexShrink: 0,
                }}
              >
                <RestaurantIcon sx={{ fontSize: 22, color: tokens.ink }} />
                <Typography sx={{ fontSize: 16, fontWeight: 500, color: tokens.ink }}>Restaurants</Typography>
              </Box>
              <Box
                sx={{
                  height: 44,
                  px: '16px',
                  borderRadius: 999,
                  bgcolor: tokens.surface,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexShrink: 0,
                }}
              >
                <LocalGasStationIcon sx={{ fontSize: 22, color: tokens.ink }} />
                <Typography sx={{ fontSize: 16, fontWeight: 500, color: tokens.ink }}>Gas</Typography>
              </Box>
            </Box>
          </>
        )}

        {phase === 'preview' && place && (
          <RoutePreview
            place={place}
            onBack={() => {
              setPhase('home')
              setPlace(null)
            }}
            onStart={() => setPhase('nav')}
          />
        )}

        {phase === 'nav' && place && (
          <>
            <NavBanner road={place.bannerRoad} />
            <RoadTripBadge onClick={() => setNavSheetOpen(true)} />
            <NavBottomBar duration={place.driveTime} meta={place.tripMeta} onExit={handleExitNav} />
          </>
        )}

        {phase === 'home' && <BottomNav activeTab={tab} onSelectTab={handleSelectTab} />}

        {/* Always mounted — parking it off-screen preserves the category
            filter and scroll position across the tab → nav round trip. */}
        <TripSheet
          visible={(phase === 'home' && tab === 'roadtrip') || (phase === 'nav' && navSheetOpen)}
          variant={phase === 'nav' ? 'overNav' : 'tab'}
          snap={snap}
          onSnapChange={setSnap}
          category={category}
          onCategoryChange={setCategory}
          onDirections={handleDirections}
          onClose={() => setNavSheetOpen(false)}
        />
      </Box>
    </ThemeProvider>
  )
}
