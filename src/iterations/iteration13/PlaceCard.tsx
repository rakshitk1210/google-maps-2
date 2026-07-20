import { Box, ButtonBase, Typography } from '@mui/material'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import DirectionsIcon from '@mui/icons-material/Directions'
import type { TripPlace } from './tripData'
import { tokens } from './theme'

interface PlaceCardProps {
  place: TripPlace
  onDirections: (place: TripPlace) => void
}

// One curated place row (design.md §6.6 anatomy): 88px photo with the
// who-marked-it avatar badge pinned to its corner (iteration 9 sketch: "list
// item — who added this to list?"), name/rating/detail in the middle, and the
// directions button on the right that kicks off the route preview.
export function PlaceCard({ place, onDirections }: PlaceCardProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', py: '12px' }}>
      <Box sx={{ position: 'relative', flexShrink: 0 }}>
        <Box
          component="img"
          src={place.photo}
          loading="lazy"
          alt=""
          sx={{ width: 88, height: 88, borderRadius: '16px', objectFit: 'cover', display: 'block' }}
        />
        {/* Who marked this place */}
        <Box
          component="img"
          src={place.markedBy.avatar}
          alt={`Marked by ${place.markedBy.name}`}
          sx={{
            position: 'absolute',
            right: -6,
            bottom: -6,
            width: 28,
            height: 28,
            borderRadius: '50%',
            objectFit: 'cover',
            border: `2px solid ${tokens.surface}`,
          }}
        />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography noWrap sx={{ fontSize: 17, fontWeight: 500, color: tokens.ink }}>
          {place.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mt: '2px' }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, color: tokens.ink }}>{place.rating}</Typography>
          <StarRoundedIcon sx={{ fontSize: 15, color: tokens.amber }} />
          <Typography noWrap sx={{ fontSize: 14, fontWeight: 400, color: tokens.inkSecondary }}>
            ({place.reviewCount.toLocaleString()}) · {place.category}
          </Typography>
        </Box>
        <Typography noWrap sx={{ fontSize: 14, fontWeight: 400, color: tokens.inkSecondary, mt: '2px' }}>
          {place.detail}
        </Typography>
        <Typography noWrap sx={{ fontSize: 13, fontWeight: 400, color: tokens.inkSecondary, mt: '2px' }}>
          Marked by {place.markedBy.name}
        </Typography>
      </Box>

      <ButtonBase
        aria-label={`Directions to ${place.name}`}
        onClick={() => onDirections(place)}
        sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          flexShrink: 0,
          bgcolor: tokens.cyanContainerSoft,
          color: tokens.teal,
          '&:hover': { bgcolor: tokens.cyanContainer },
        }}
      >
        <DirectionsIcon sx={{ fontSize: 26 }} />
      </ButtonBase>
    </Box>
  )
}
