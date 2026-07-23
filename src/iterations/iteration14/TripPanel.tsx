import { Box, ButtonBase, Typography } from '@mui/material'
import DirectionsIcon from '@mui/icons-material/Directions'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import { CONTRIBUTORS, TRIP_PLACES, TRIP_TITLE, type TripPlace } from './tripData'
import { MOTION_EMPHASIZED, tokens } from './theme'

export const PANEL_WIDTH = 216

interface TripPanelProps {
  open: boolean
  onDirections: (place: TripPlace) => void
}

// The road-trip itinerary panel: the CarPlay screen splits and every place
// marked for Kelley's Roadtrip lists here, scrollable, each with its own
// "Get directions" — so switching stops never needs search mode. Animating
// width (not transform) is what actually compresses the flex map area beside
// it and drives the Mapbox canvas resize.
export function TripPanel({ open, onDirections }: TripPanelProps) {
  return (
    <Box
      sx={{
        width: open ? PANEL_WIDTH : 0,
        flexShrink: 0,
        overflow: 'hidden',
        bgcolor: tokens.surface,
        borderLeft: open ? `1px solid ${tokens.hairline}` : 'none',
        transition: `width 300ms ${MOTION_EMPHASIZED}`,
      }}
    >
      <Box sx={{ width: PANEL_WIDTH, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ px: '16px', pt: '14px', pb: '10px' }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, color: tokens.ink, lineHeight: 1.2 }}>
            {TRIP_TITLE}
          </Typography>
          <Box sx={{ display: 'flex', mt: '8px' }}>
            {CONTRIBUTORS.map((c, i) => (
              <Box
                key={c.name}
                component="img"
                src={c.avatar}
                alt={c.name}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  border: `2px solid ${tokens.surface}`,
                  objectFit: 'cover',
                  ml: i === 0 ? 0 : '-8px',
                  zIndex: CONTRIBUTORS.length - i,
                }}
              />
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            // Hidden scrollbar — the list still scrolls by drag/wheel.
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {TRIP_PLACES.map((place) => (
            <PanelPlaceRow key={place.id} place={place} onDirections={() => onDirections(place)} />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

function PanelPlaceRow({ place, onDirections }: { place: TripPlace; onDirections: () => void }) {
  return (
    <Box sx={{ px: '16px', py: '10px', borderTop: `1px solid ${tokens.hairline}` }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Typography
          noWrap
          sx={{ fontSize: 15, fontWeight: 500, color: tokens.ink, lineHeight: 1.25, minWidth: 0 }}
        >
          {place.name}
        </Typography>
        <Box
          component="img"
          src={place.markedBy.avatar}
          alt={`Marked by ${place.markedBy.name}`}
          sx={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
        />
      </Box>
      <RatingRow rating={place.rating} reviewCount={place.reviewCount} size={13} />
      <ButtonBase
        aria-label={`Get directions to ${place.name}`}
        onClick={onDirections}
        sx={{
          mt: '8px',
          height: 30,
          px: '12px',
          borderRadius: 999,
          bgcolor: tokens.cyanContainer,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <DirectionsIcon sx={{ fontSize: 16, color: tokens.onCyan }} />
        <Typography sx={{ fontSize: 13, fontWeight: 500, color: tokens.onCyan }}>
          Get directions
        </Typography>
      </ButtonBase>
    </Box>
  )
}

// Rating line shared by the panel rows and the directions card: value, five
// stars (filled by whole-star count, Figma-style), review count.
export function RatingRow({
  rating,
  reviewCount,
  size,
}: {
  rating: number
  reviewCount: number
  size: number
}) {
  const filled = Math.floor(rating)
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mt: '3px' }}>
      <Typography sx={{ fontSize: size, fontWeight: 500, color: tokens.ink, lineHeight: 1 }}>
        {rating.toFixed(1)}
      </Typography>
      <Box sx={{ display: 'flex' }}>
        {Array.from({ length: 5 }, (_, i) => (
          <StarRoundedIcon
            key={i}
            sx={{ fontSize: size + 3, color: i < filled ? tokens.amber : tokens.hairline }}
          />
        ))}
      </Box>
      <Typography sx={{ fontSize: size, fontWeight: 400, color: tokens.inkSecondary, lineHeight: 1 }}>
        ({reviewCount})
      </Typography>
    </Box>
  )
}
