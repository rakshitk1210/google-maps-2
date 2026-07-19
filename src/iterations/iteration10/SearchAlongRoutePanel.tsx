import { Box, ButtonBase, IconButton, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MicIcon from '@mui/icons-material/Mic'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import LocalCafeIcon from '@mui/icons-material/LocalCafe'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom'
import HotelIcon from '@mui/icons-material/Hotel'
import ScheduleIcon from '@mui/icons-material/Schedule'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface SearchAlongRoutePanelProps {
  onBack: () => void
  onSelectRestaurants: () => void
}

const CATEGORIES = [
  { label: 'Gas stations', Icon: LocalGasStationIcon },
  { label: 'Restaurants', Icon: RestaurantIcon },
  { label: 'Coffee shops', Icon: LocalCafeIcon },
  { label: 'Grocery stores', Icon: ShoppingCartIcon },
  { label: 'Rest stops', Icon: FamilyRestroomIcon },
  { label: 'Hotels', Icon: HotelIcon },
] as const

// Full-screen "Search along route" panel, mirroring the real Google Maps
// screen: search field with mic, a 2×3 grid of category tiles, and a Recent
// list. Only the Restaurants tile is wired — the demo's path runs through it.
export function SearchAlongRoutePanel({ onBack, onSelectRestaurants }: SearchAlongRoutePanelProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        bgcolor: tokens.surface,
        display: 'flex',
        flexDirection: 'column',
        animation: `search-panel-in 280ms ${MOTION_EMPHASIZED} both`,
        '@keyframes search-panel-in': {
          from: { opacity: 0, transform: 'translateY(28px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {/* Search field */}
      <Box
        sx={{
          mt: '62px',
          mx: '16px',
          height: 56,
          borderRadius: 999,
          bgcolor: tokens.surfaceDim,
          display: 'flex',
          alignItems: 'center',
          px: '6px',
          flexShrink: 0,
        }}
      >
        <IconButton aria-label="Back to navigation" onClick={onBack} sx={{ width: 44, height: 44, color: tokens.ink }}>
          <ArrowBackIcon sx={{ fontSize: 24 }} />
        </IconButton>
        <Typography sx={{ flex: 1, fontSize: 18, fontWeight: 400, color: tokens.inkSecondary, ml: '2px' }}>
          Search along route
        </Typography>
        <IconButton sx={{ width: 44, height: 44, color: tokens.ink }}>
          <MicIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </Box>

      {/* Category tiles */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          px: '16px',
          mt: '20px',
          flexShrink: 0,
        }}
      >
        {CATEGORIES.map(({ label, Icon }) => (
          <ButtonBase
            key={label}
            onClick={label === 'Restaurants' ? onSelectRestaurants : undefined}
            sx={{
              height: 96,
              borderRadius: '16px',
              bgcolor: tokens.surfaceDim,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontFamily: 'inherit',
            }}
          >
            <Icon sx={{ fontSize: 28, color: tokens.ink }} />
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: tokens.ink, lineHeight: 1.1 }}>
              {label}
            </Typography>
          </ButtonBase>
        ))}
      </Box>

      {/* Recent (decorative) */}
      <Box sx={{ mt: '24px', borderTop: `8px solid ${tokens.surfaceDim}`, pt: '16px', px: '16px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 17, fontWeight: 500, color: tokens.ink }}>Recent</Typography>
          <InfoOutlinedIcon sx={{ fontSize: 20, color: tokens.inkSecondary }} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', py: '14px' }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              bgcolor: tokens.surfaceDim,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <PhotoCameraIcon sx={{ fontSize: 22, color: tokens.inkSecondary }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 17, fontWeight: 400, color: tokens.ink }}>Mount Rainier</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 400, color: tokens.inkSecondary }}>
              Saved in Screenshots
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', py: '14px' }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              bgcolor: tokens.surfaceDim,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ScheduleIcon sx={{ fontSize: 22, color: tokens.inkSecondary }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 17, fontWeight: 400, color: tokens.ink }}>Taste of India</Typography>
            <Typography noWrap sx={{ fontSize: 14, fontWeight: 400, color: tokens.inkSecondary }}>
              Roosevelt Way Northeast, Seattle, WA
            </Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 400 }}>
              <Box component="span" sx={{ color: tokens.green }}>
                Open
              </Box>
              <Box component="span" sx={{ color: tokens.inkSecondary }}>
                {' '}
                · Closes 9 PM
              </Box>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
