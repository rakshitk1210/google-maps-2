import { useState } from 'react'
import { Box, ButtonBase, IconButton, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import IosShareIcon from '@mui/icons-material/IosShare'
import AddIcon from '@mui/icons-material/Add'
import RouteIcon from '@mui/icons-material/Route'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import sparkWhite from '../iteration15/assets/spark-white.svg'
import { MemberAvatars } from './MapChrome'
import { HomeIndicator, PhoneStatusBar } from './PhoneStatusBar'
import { CATEGORIES, TRIP_MILES, TRIP_TITLE, type Category, type TripPlace } from './tripData'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface TripListPageProps {
  open: boolean
  /** The trip as it stands: the shared trail places plus anything saved. */
  places: TripPlace[]
  savedIds: string[]
  onClose: () => void
  onOpenPlace: (id: string) => void
}

/**
 * The full "North Cascades trip" page behind the trip card — every place in the
 * shared list, who's on it, and the category filter. Saved restaurants land here
 * too, badged, which is the payoff for saving from the map.
 */
export function TripListPage({ open, places, savedIds, onClose, onOpenPlace }: TripListPageProps) {
  const [category, setCategory] = useState<Category>('All')
  const visible = category === 'All' ? places : places.filter((p) => p.category === category)

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        bgcolor: tokens.surface,
        display: 'flex',
        flexDirection: 'column',
        // Parks off-screen rather than unmounting, so the filter survives a
        // round trip out to the map and back.
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: `transform 340ms ${MOTION_EMPHASIZED}`,
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      <PhoneStatusBar />

      <Box sx={{ flex: 1, overflowY: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
        {/* Header actions */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: '24px',
            pt: '70px',
          }}
        >
          <IconButton onClick={onClose} aria-label="Back to map" sx={circleBtnSx}>
            <ArrowBackIcon sx={{ fontSize: 20, color: tokens.ink }} />
          </IconButton>
          <Box sx={{ display: 'flex', gap: '12px' }}>
            <IconButton aria-label="More options" sx={circleBtnSx}>
              <MoreHorizIcon sx={{ fontSize: 20, color: tokens.ink }} />
            </IconButton>
            <IconButton aria-label="Share trip" sx={circleBtnSx}>
              <IosShareIcon sx={{ fontSize: 20, color: tokens.ink }} />
            </IconButton>
          </Box>
        </Box>

        {/* Title + who's on the trip */}
        <Box sx={{ px: '24px', pt: '33px' }}>
          <Typography
            sx={{ fontSize: 30, fontWeight: 500, color: tokens.ink, letterSpacing: '-0.2px' }}
          >
            {TRIP_TITLE}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mt: '8px' }}>
            <MemberAvatars />
            <Typography sx={metaSx}>• {places.length} places</Typography>
            <Typography sx={metaSx}>• {TRIP_MILES}</Typography>
          </Box>
        </Box>

        {/* Trip actions */}
        <Box
          sx={{
            display: 'flex',
            gap: '10px',
            mt: '25px',
            px: '24px',
            overflowX: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <ButtonBase sx={{ ...pillSx, background: tokens.geminiGradient }}>
            <Box component="img" src={sparkWhite} alt="" sx={{ width: 20, height: 20 }} />
            <Typography sx={{ ...pillLabelSx, color: tokens.surface }}>Ask Maps</Typography>
          </ButtonBase>
          <ButtonBase sx={{ ...pillSx, bgcolor: tokens.cyanContainerSoft }}>
            <AddIcon sx={{ fontSize: 20, color: tokens.onCyan }} />
            <Typography sx={{ ...pillLabelSx, color: tokens.onCyan }}>Add places</Typography>
          </ButtonBase>
          <ButtonBase sx={{ ...pillSx, bgcolor: tokens.cyanContainerSoft }}>
            <RouteIcon sx={{ fontSize: 20, color: tokens.onCyan, transform: 'rotate(90deg)' }} />
            <Typography sx={{ ...pillLabelSx, color: tokens.onCyan }}>Itinerary</Typography>
          </ButtonBase>
        </Box>

        {/* Category chips */}
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            mt: '20px',
            px: '24px',
            overflowX: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {CATEGORIES.map((chip) => {
            const active = chip === category
            return (
              <ButtonBase
                key={chip}
                onClick={() => setCategory(chip)}
                sx={{
                  px: '16px',
                  py: '8px',
                  borderRadius: '999px',
                  flexShrink: 0,
                  border: `1px solid ${active ? tokens.ink : tokens.dragHandle}`,
                  bgcolor: active ? tokens.ink : tokens.surface,
                  transition: `background-color 160ms ${MOTION_EMPHASIZED}`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    color: active ? tokens.surface : tokens.inkSecondary,
                  }}
                >
                  {chip}
                </Typography>
              </ButtonBase>
            )
          })}
        </Box>

        {/* Place grid */}
        <Box
          sx={{
            mt: '20px',
            px: '24px',
            pb: '60px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
          }}
        >
          {visible.map((place) => (
            <ButtonBase
              key={place.id}
              onClick={() => onOpenPlace(place.id)}
              sx={{
                position: 'relative',
                height: 184,
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'block',
                textAlign: 'left',
                animation: `nc-card-in 300ms ${MOTION_EMPHASIZED} both`,
                '@keyframes nc-card-in': {
                  from: { opacity: 0, transform: 'scale(0.96)' },
                  to: { opacity: 1, transform: 'scale(1)' },
                },
              }}
            >
              <Box
                component="img"
                src={place.photo}
                loading="lazy"
                alt=""
                sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,.45) 0%, rgba(0,0,0,0) 50%)',
                }}
              />
              {savedIds.includes(place.id) && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    bgcolor: tokens.teal,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BookmarkIcon sx={{ fontSize: 14, color: '#fff' }} />
                </Box>
              )}
              <Typography
                sx={{
                  position: 'absolute',
                  left: 12,
                  right: 12,
                  bottom: 12,
                  fontSize: 12,
                  fontWeight: 400,
                  color: tokens.surface,
                  letterSpacing: '-0.36px',
                }}
              >
                {place.name}
              </Typography>
            </ButtonBase>
          ))}
        </Box>
      </Box>

      <HomeIndicator />
    </Box>
  )
}

const circleBtnSx = {
  width: 40,
  height: 40,
  bgcolor: tokens.surface,
  boxShadow: tokens.shadowChrome,
  '&:hover': { bgcolor: tokens.surface },
} as const

const pillSx = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  height: 44,
  pl: '14px',
  pr: '16px',
  borderRadius: '999px',
  flexShrink: 0,
} as const

const pillLabelSx = {
  fontSize: 16,
  fontWeight: 500,
  whiteSpace: 'nowrap',
} as const

const metaSx = {
  fontSize: 14,
  fontWeight: 400,
  color: tokens.inkSecondary,
  letterSpacing: '-0.42px',
  whiteSpace: 'nowrap',
} as const
