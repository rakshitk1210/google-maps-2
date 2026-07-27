import { useState } from 'react'
import { Box, ButtonBase, IconButton, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import IosShareIcon from '@mui/icons-material/IosShare'
import AddIcon from '@mui/icons-material/Add'
import RouteIcon from '@mui/icons-material/Route'
import sparkWhite from '../iteration15/assets/spark-white.svg'
import { MemberAvatars } from '../iteration16/MapChrome'
import { HomeIndicator, PhoneStatusBar } from './PhoneStatusBar'
import { CATEGORIES, TRIP_MILES, TRIP_TITLE, type Category, type TripPlace } from './tripData'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface TripListPageProps {
  open: boolean
  places: TripPlace[]
  onClose: () => void
}

/**
 * The trip list, reached from the chip under the nav banner. Same content as
 * iteration 16's page, restyled to this iteration's Figma: a sticky header that
 * survives the scroll, hairline chips instead of gray-bordered ones, and a
 * masonry grid whose lead card runs two rows tall so the page opens on one big
 * photo instead of a uniform tile field.
 *
 * It parks off-screen rather than unmounting, so the category filter and scroll
 * position survive a round trip back out to the drive.
 */
export function TripListPage({ open, places, onClose }: TripListPageProps) {
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
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: `transform 340ms ${MOTION_EMPHASIZED}`,
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      {/* Opaque strip behind the status bar. It has to be a real flex child
          rather than padding on the scroller: padding scrolls away, and the
          title would ride up into the clock. Keeping it out of the scroll flow
          also starts the scrollport below it, so nothing can render up there. */}
      <Box sx={{ height: 62, flexShrink: 0, bgcolor: tokens.surface }} />
      <PhoneStatusBar />

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {/* Header — sticks to the top so Back is always reachable. Its z-index
            clears the contributor avatars, which carry 1–4 of their own to
            stack the overlap and would otherwise paint over the back button. */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 6,
            bgcolor: tokens.surface,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: '24px',
            py: '16px',
          }}
        >
          <IconButton onClick={onClose} aria-label="Back to navigation" sx={circleBtnSx}>
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
        <Box sx={{ px: '24px', pt: '24px' }}>
          <Typography
            sx={{ fontSize: 30, fontWeight: 500, color: tokens.ink, letterSpacing: '-0.2px' }}
          >
            {TRIP_TITLE}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mt: '8px' }}>
            <MemberAvatars size={21} />
            <Typography sx={metaSx}>• {places.length} places</Typography>
            <Typography sx={metaSx}>• {TRIP_MILES}</Typography>
          </Box>
        </Box>

        {/* Trip actions */}
        <Box
          sx={{
            display: 'flex',
            gap: '12px',
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
            gap: '12px',
            mt: '24px',
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
                  border: `1px solid ${active ? tokens.ink : tokens.hairline}`,
                  bgcolor: active ? tokens.ink : tokens.surface,
                  transition: `background-color 160ms ${MOTION_EMPHASIZED}`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: active ? 500 : 400,
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

        {/* Masonry grid — the lead card spans two rows (150 + 10 gap + 150). */}
        <Box
          sx={{
            mt: '16px',
            px: '24px',
            pb: '60px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gridAutoRows: '150px',
            gap: '10px',
          }}
        >
          {visible.map((place, index) => {
            const hero = index === 0
            return (
              <Box
                key={place.id}
                sx={{
                  position: 'relative',
                  gridRow: hero ? 'span 2' : 'auto',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  animation: `iter17-card-in 300ms ${MOTION_EMPHASIZED} both`,
                  '@keyframes iter17-card-in': {
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
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,.3) 0%, rgba(0,0,0,0) 50%)',
                  }}
                />
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
              </Box>
            )
          })}
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
