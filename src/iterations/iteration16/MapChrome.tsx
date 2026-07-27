import { Box, ButtonBase, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import LocalCafeIcon from '@mui/icons-material/LocalCafe'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import IcecreamIcon from '@mui/icons-material/Icecream'
import RouteIcon from '@mui/icons-material/Route'
import mapsLogo from './assets/maps-logo.png'
import sparkWhite from '../iteration15/assets/spark-white.svg'
import { YOU_AVATAR } from '../../shared/peopleAvatars'
import { CONTRIBUTORS, TRIP_MILES, TRIP_TITLE } from './tripData'
import { MOTION_EMPHASIZED, tokens } from './theme'

/** The 18px overlapping member stack used on the trip card. */
export function MemberAvatars({ size = 18 }: { size?: number }) {
  return (
    <Box sx={{ display: 'flex', flexShrink: 0 }}>
      {CONTRIBUTORS.map((person, index) => (
        <Box
          key={person.name}
          component="img"
          src={person.avatar}
          alt={person.name}
          sx={{
            width: size,
            height: size,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '1.25px solid #fff',
            ml: index === 0 ? 0 : `${-size * 0.22}px`,
            position: 'relative',
            zIndex: CONTRIBUTORS.length - index,
          }}
        />
      ))}
    </Box>
  )
}

/**
 * Filter row's vertical position. The Figma puts it at 704, which leaves only
 * ~12px above the trip card and reads as one welded block; sitting it higher
 * separates the two controls.
 */
const CHIP_ROW_TOP = 684

const CATEGORY_CHIPS = [
  { label: 'Restaurants', icon: RestaurantIcon },
  { label: 'Coffee', icon: LocalCafeIcon },
  { label: 'Shopping', icon: ShoppingBagIcon },
  { label: 'Desserts', icon: IcecreamIcon },
]

interface MapChromeProps {
  restaurantsMode: boolean
  onFilterRestaurants: () => void
  onClearFilter: () => void
  onOpenTrip: () => void
  /** Places currently in the trip, for the card's count. */
  placeCount: number
  /** Hidden while the detail sheet is up so the sheet has the stage. */
  dimmed: boolean
}

/**
 * Everything floating over the map: the Maps badge and account avatar up top,
 * the category filter row, and the trip card that opens the full list. The
 * filter row and the "Showing restaurants" pill occupy the same slot and
 * crossfade, so switching modes reads as one control changing state.
 */
export function MapChrome({
  restaurantsMode,
  onFilterRestaurants,
  onClearFilter,
  onOpenTrip,
  placeCount,
  dimmed,
}: MapChromeProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: dimmed ? 0 : 1,
        transition: `opacity 240ms ${MOTION_EMPHASIZED}`,
        '& > *': { pointerEvents: dimmed ? 'none' : 'auto' },
      }}
    >
      {/* Top row — Maps badge / account avatar */}
      <Box
        sx={{
          position: 'absolute',
          left: 24,
          right: 24,
          top: 70,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '999px',
            bgcolor: tokens.surface,
            boxShadow: tokens.shadowChrome,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box component="img" src={mapsLogo} alt="Google Maps" sx={{ width: 26, height: 26 }} />
        </Box>
        <Box
          component="img"
          src={YOU_AVATAR}
          alt="Your account"
          sx={{
            width: 40,
            height: 40,
            borderRadius: '999px',
            objectFit: 'cover',
            border: '2.4px solid #fff',
            boxShadow: tokens.shadowChrome,
          }}
        />
      </Box>

      {/* Filter row ↔ active-filter pill. Both live at y = 704 (Figma). */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: CHIP_ROW_TOP,
          height: 34,
          opacity: restaurantsMode ? 0 : 1,
          transform: restaurantsMode ? 'translateY(-6px)' : 'none',
          transition: `opacity 200ms ${MOTION_EMPHASIZED}, transform 200ms ${MOTION_EMPHASIZED}`,
          pointerEvents: restaurantsMode ? 'none' : 'auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            px: '24px',
            overflowX: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <ButtonBase sx={{ ...chipSx, background: tokens.geminiGradient, flexShrink: 0 }}>
            <Box component="img" src={sparkWhite} alt="" sx={{ width: 16, height: 16 }} />
            <Typography sx={{ ...chipLabelSx, color: tokens.surface }}>Ask Maps</Typography>
          </ButtonBase>
          {CATEGORY_CHIPS.map(({ label, icon: Icon }) => (
            <ButtonBase
              key={label}
              onClick={label === 'Restaurants' ? onFilterRestaurants : undefined}
              sx={{
                ...chipSx,
                bgcolor: tokens.frost,
                backdropFilter: tokens.frostBlur,
                flexShrink: 0,
              }}
            >
              <Icon sx={{ fontSize: 16, color: tokens.ink }} />
              <Typography sx={{ ...chipLabelSx, color: tokens.ink }}>{label}</Typography>
            </ButtonBase>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: CHIP_ROW_TOP,
          display: 'flex',
          justifyContent: 'center',
          opacity: restaurantsMode ? 1 : 0,
          transform: restaurantsMode ? 'none' : 'translateY(6px)',
          transition: `opacity 200ms ${MOTION_EMPHASIZED} 60ms, transform 200ms ${MOTION_EMPHASIZED} 60ms`,
          pointerEvents: restaurantsMode ? 'auto' : 'none',
        }}
      >
        <ButtonBase
          onClick={onClearFilter}
          aria-label="Stop showing restaurants"
          sx={{ ...chipSx, bgcolor: tokens.frost, backdropFilter: tokens.frostBlur, gap: '6px' }}
        >
          <Typography sx={{ ...chipLabelSx, color: tokens.ink }}>Showing restaurants</Typography>
          <CloseIcon sx={{ fontSize: 16, color: tokens.ink }} />
        </ButtonBase>
      </Box>

      {/* Trip card — the way into the full list */}
      <ButtonBase
        onClick={onOpenTrip}
        sx={{
          position: 'absolute',
          left: 24,
          right: 24,
          bottom: 46,
          p: '16px',
          borderRadius: '16px',
          bgcolor: tokens.frost,
          backdropFilter: tokens.frostBlur,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          textAlign: 'left',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
          <Typography
            sx={{ fontSize: 18, fontWeight: 500, color: tokens.ink, letterSpacing: '-0.54px' }}
          >
            {TRIP_TITLE}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MemberAvatars />
            <Typography sx={metaSx}>• {placeCount} places</Typography>
            <Typography sx={metaSx}>• {TRIP_MILES}</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            width: 44,
            height: 44,
            flexShrink: 0,
            borderRadius: '8px',
            bgcolor: tokens.cyanContainerSoft,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RouteIcon sx={{ fontSize: 24, color: tokens.onCyan, transform: 'rotate(90deg)' }} />
        </Box>
      </ButtonBase>
    </Box>
  )
}

const chipSx = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  pl: '10px',
  pr: '12px',
  py: '8px',
  borderRadius: '9999px',
  whiteSpace: 'nowrap',
} as const

const chipLabelSx = {
  fontSize: 14,
  fontWeight: 400,
  letterSpacing: '-0.42px',
  whiteSpace: 'nowrap',
} as const

const metaSx = {
  fontSize: 14,
  fontWeight: 400,
  color: tokens.inkSecondary,
  letterSpacing: '-0.42px',
  whiteSpace: 'nowrap',
} as const
