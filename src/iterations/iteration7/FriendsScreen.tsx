import { Box, IconButton, Typography } from '@mui/material'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import { FAM_PLACES, TRIP_FRIENDS } from './roadTripData'
import { MODE_TRANSITION, useTokens } from './theme'

// Friends tab (Road Trip mode): "Your Roadtrip Fam" list + the places the fam
// marked for this trip. Full-screen panel per the sketch — design.md §6.5
// header (title + gray circle button), §6.6 row anatomy, 20px gutters. Sits
// above the map chrome and below the bottom nav.
export function FriendsScreen() {
  const t = useTokens()
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 84,
        bgcolor: t.surface,
        zIndex: 4,
        overflowY: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
        transition: MODE_TRANSITION,
      }}
    >
      <Box sx={{ px: '20px', pt: '66px', pb: '24px' }}>
        {/* Header, §6.5: title + 44px circle action */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 26, fontWeight: 500, color: t.ink, letterSpacing: '-0.2px' }}>
            Your Roadtrip Fam
          </Typography>
          <IconButton
            aria-label="Add friend"
            sx={{ width: 44, height: 44, bgcolor: t.surfaceDim, '&:hover': { bgcolor: t.surfaceDim } }}
          >
            <PersonAddAltOutlinedIcon sx={{ fontSize: 24, color: t.ink }} />
          </IconButton>
        </Box>

        {/* Friend rows, §6.6 anatomy: 56px avatar, 18/500 title, 15 gray */}
        <Box sx={{ mt: '12px' }}>
          {TRIP_FRIENDS.map((friend, index) => (
            <Box
              key={friend.name}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                py: '14px',
                borderBottom: index < TRIP_FRIENDS.length - 1 ? `1px solid ${t.hairline}` : 'none',
              }}
            >
              <Box
                component="img"
                src={friend.avatar}
                alt=""
                sx={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              />
              <Box>
                <Typography sx={{ fontSize: 18, fontWeight: 500, color: t.ink }}>{friend.name}</Typography>
                <Typography sx={{ fontSize: 15, fontWeight: 400, color: t.inkSecondary, mt: '2px' }}>
                  {friend.detail}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Places marked by the fam */}
        <Typography sx={{ fontSize: 22, fontWeight: 500, color: t.ink, letterSpacing: '-0.2px', mt: '24px' }}>
          Places marked by Fam
        </Typography>

        {FAM_PLACES.map((place) => (
          <Box key={place.id} sx={{ mt: '20px' }}>
            <Typography sx={{ fontSize: 18, fontWeight: 500, color: t.ink }}>{place.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mt: '2px' }}>
              <Typography sx={{ fontSize: 15, fontWeight: 500, color: t.ink }}>{place.rating}</Typography>
              <StarRoundedIcon sx={{ fontSize: 16, color: t.amber }} />
              <Typography sx={{ fontSize: 15, fontWeight: 400, color: t.inkSecondary }}>
                ({place.reviewCount}) · {place.category}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 15, fontWeight: 400, color: t.inkSecondary, mt: '2px' }}>
              {place.markedBy}
            </Typography>

            {/* Photo collage: 65/35 split (iteration 6 cafe-sheet pattern) */}
            <Box sx={{ display: 'flex', gap: '4px', mt: '10px', borderRadius: '16px', overflow: 'hidden' }}>
              <Box
                component="img"
                src={place.photos[0]}
                loading="lazy"
                alt=""
                sx={{ width: '65%', height: 160, objectFit: 'cover', borderRadius: '16px 0 0 16px' }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
                <Box
                  component="img"
                  src={place.photos[1]}
                  loading="lazy"
                  alt=""
                  sx={{ flex: 1, width: '100%', height: 0, objectFit: 'cover', borderRadius: '0 16px 0 0' }}
                />
                <Box
                  component="img"
                  src={place.photos[2]}
                  loading="lazy"
                  alt=""
                  sx={{ flex: 1, width: '100%', height: 0, objectFit: 'cover', borderRadius: '0 0 16px 0' }}
                />
              </Box>
            </Box>
            <Typography sx={{ fontSize: 15, fontWeight: 400, color: t.inkSecondary, mt: '8px', lineHeight: 1.4 }}>
              {place.note}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
