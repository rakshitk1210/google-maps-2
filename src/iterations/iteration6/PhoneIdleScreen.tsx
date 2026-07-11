import { Box, Typography } from '@mui/material'
import PlaceIcon from '@mui/icons-material/Place'
import MicIcon from '@mui/icons-material/Mic'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import ExploreIcon from '@mui/icons-material/Explore'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import { PhoneStatusBar } from './PhoneStatusBar'
import { MEMBER_AVATAR_URLS } from './jamData'
import { tokens } from './theme'

const chipSx = {
  height: 44,
  px: '16px',
  borderRadius: 999,
  bgcolor: tokens.surface,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
  boxShadow: tokens.shadowFloat,
} as const

// Static Maps home per design.md §7 blueprint — decorative only, no Mapbox.
// Fake map canvas uses the §2 map palette; search bar per 6.1, chips per 6.2,
// bottom nav per 6.4. Authored at the 402×872 reference viewport.
export function PhoneIdleScreen() {
  return (
    <Box sx={{ position: 'absolute', inset: 0, bgcolor: tokens.mapLand, overflow: 'hidden' }}>
      {/* Abstract streets + park, §2 map-canvas palette */}
      <Box
        sx={{
          position: 'absolute',
          top: 180,
          left: -20,
          right: -20,
          height: 26,
          bgcolor: tokens.surface,
          border: `2px solid ${tokens.mapRoadCasing}`,
          transform: 'rotate(-8deg)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 120,
          bottom: 60,
          left: 120,
          width: 22,
          bgcolor: tokens.surface,
          border: `2px solid ${tokens.mapRoadCasing}`,
          transform: 'rotate(6deg)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 420,
          left: -20,
          right: -20,
          height: 20,
          bgcolor: tokens.surface,
          border: `2px solid ${tokens.mapRoadCasing}`,
          transform: 'rotate(4deg)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 500,
          right: -40,
          width: 220,
          height: 180,
          borderRadius: '48px',
          bgcolor: tokens.mapPark,
          transform: 'rotate(-12deg)',
        }}
      />

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
          bgcolor: tokens.surface,
          boxShadow: tokens.shadowFloat,
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
          src={MEMBER_AVATAR_URLS[0]}
          alt=""
          sx={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
        />
      </Box>

      {/* Chip row, §6.2: 12px below search, Ask Maps first with blue border */}
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
        <Box sx={{ ...chipSx, border: `1.5px solid ${tokens.blue}` }}>
          <AutoAwesomeIcon sx={{ fontSize: 22, color: tokens.blue }} />
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: tokens.blue }}>Ask Maps</Typography>
        </Box>
        <Box sx={chipSx}>
          <RestaurantIcon sx={{ fontSize: 22, color: tokens.ink }} />
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: tokens.ink }}>Restaurants</Typography>
        </Box>
        <Box sx={chipSx}>
          <LocalGasStationIcon sx={{ fontSize: 22, color: tokens.ink }} />
          <Typography sx={{ fontSize: 16, fontWeight: 500, color: tokens.ink }}>Gas</Typography>
        </Box>
      </Box>

      {/* Bottom navigation, §6.4: 84px, active Explore tab with cyan pill */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 84,
          bgcolor: tokens.surfaceNav,
          display: 'flex',
          justifyContent: 'space-around',
          pt: '8px',
          zIndex: 3,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <Box
            sx={{
              width: 64,
              height: 32,
              borderRadius: 999,
              bgcolor: tokens.cyanContainer,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ExploreIcon sx={{ fontSize: 24, color: tokens.teal }} />
          </Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: tokens.ink }}>Explore</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', pt: '4px' }}>
          <BookmarkBorderIcon sx={{ fontSize: 24, color: tokens.ink }} />
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: tokens.inkSecondary }}>You</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', pt: '4px' }}>
          <AddCircleOutlineIcon sx={{ fontSize: 24, color: tokens.ink }} />
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: tokens.inkSecondary }}>Contribute</Typography>
        </Box>
      </Box>
    </Box>
  )
}
