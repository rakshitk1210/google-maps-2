import { Box, Typography } from '@mui/material'
import PlaceIcon from '@mui/icons-material/Place'
import MicIcon from '@mui/icons-material/Mic'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import { PhoneStatusBar } from './PhoneStatusBar'
import { MapCanvas } from './MapCanvas'
import { BottomNav } from './BottomNav'
import type { RoadTripTab } from './BottomNav'
import { RoadTripChip } from './RoadTripChip'
import { FriendsScreen } from './FriendsScreen'
import { CaptureScreen } from './CaptureScreen'
import { MODE_TRANSITION, useTokens } from './theme'

const AVATAR_URL = 'https://randomuser.me/api/portraits/women/44.jpg'

interface ExploreScreenProps {
  roadTrip: boolean
  onToggleRoadTrip: () => void
  activeTab: RoadTripTab
  onSelectTab: (tab: RoadTripTab) => void
}

// Explore home per design.md §7 blueprint: live Mapbox base layer (pannable,
// zoomable), §6.1 search pill, §6.2 chip row — with the Road Trip toggle chip
// leading it — §6.4 bottom nav, and the §2 location puck riding the map as a
// marker. Every surface reads mode-reactive tokens and cross-fades over the
// 350ms flush when Road Trip mode switches.
export function ExploreScreen({ roadTrip, onToggleRoadTrip, activeTab, onSelectTab }: ExploreScreenProps) {
  const t = useTokens()

  const chipSx = {
    height: 44,
    px: '16px',
    borderRadius: 999,
    bgcolor: t.surface,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
    transition: MODE_TRANSITION,
  } as const

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        bgcolor: t.mapLand,
        overflow: 'hidden',
        transition: MODE_TRANSITION,
      }}
    >
      {/* Live map base layer, full-bleed under the floating chrome */}
      <MapCanvas roadTrip={roadTrip} />

      <PhoneStatusBar />

      {/* Search bar, §6.1: 16px margins, top 62, 56px pill */}
      <Box
        sx={{
          position: 'absolute',
          top: 62,
          left: 16,
          right: 16,
          height: 56,
          borderRadius: 999,
          bgcolor: t.surface,
          display: 'flex',
          alignItems: 'center',
          pl: '16px',
          pr: '10px',
          zIndex: 3,
          transition: MODE_TRANSITION,
        }}
      >
        <PlaceIcon sx={{ fontSize: 26, color: t.red, transition: MODE_TRANSITION }} />
        <Typography
          sx={{
            fontSize: 19,
            fontWeight: 400,
            color: t.inkSecondary,
            ml: '14px',
            flex: 1,
            transition: MODE_TRANSITION,
          }}
        >
          Search here
        </Typography>
        <MicIcon sx={{ fontSize: 24, color: t.inkSecondary, mr: '10px', transition: MODE_TRANSITION }} />
        <Box
          component="img"
          src={AVATAR_URL}
          alt=""
          sx={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
        />
      </Box>

      {/* Chip row, §6.2: 12px below search — Road Trip toggle leads (iteration 7 sketch) */}
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
        <RoadTripChip on={roadTrip} onToggle={onToggleRoadTrip} />
        <Box sx={{ ...chipSx, border: `1.5px solid ${t.blue}` }}>
          <AutoAwesomeIcon sx={{ fontSize: 22, color: t.blue, transition: MODE_TRANSITION }} />
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: t.blue, transition: MODE_TRANSITION }}>
            Ask Maps
          </Typography>
        </Box>
        <Box sx={chipSx}>
          <RestaurantIcon sx={{ fontSize: 22, color: t.ink, transition: MODE_TRANSITION }} />
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: t.ink, transition: MODE_TRANSITION }}>
            Restaurants
          </Typography>
        </Box>
        <Box sx={chipSx}>
          <LocalGasStationIcon sx={{ fontSize: 22, color: t.ink, transition: MODE_TRANSITION }} />
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: t.ink, transition: MODE_TRANSITION }}>
            Gas
          </Typography>
        </Box>
      </Box>

      {/* Road Trip tab panels overlay the map chrome; nav stays on top */}
      {roadTrip && activeTab === 'friends' && <FriendsScreen />}
      {roadTrip && activeTab === 'capture' && <CaptureScreen />}

      <BottomNav roadTrip={roadTrip} activeTab={activeTab} onSelectTab={onSelectTab} />
    </Box>
  )
}
