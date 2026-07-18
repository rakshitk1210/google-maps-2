import { Box, ButtonBase } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { CONTRIBUTORS } from './tripData'
import { tokens } from './theme'

// The people on this trip: overlapping 40px portrait stack plus a dashed "+"
// circle to invite more (iteration 9 sketch: "people contributed to create
// this itinerary").
export function ContributorAvatars() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {CONTRIBUTORS.map((person, index) => (
        <Box
          key={person.name}
          component="img"
          src={person.avatar}
          alt={person.name}
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            objectFit: 'cover',
            border: `2px solid ${tokens.surface}`,
            ml: index === 0 ? 0 : '-10px',
            position: 'relative',
            zIndex: CONTRIBUTORS.length - index,
          }}
        />
      ))}
      <ButtonBase
        aria-label="Add someone to the trip"
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          ml: '6px',
          border: `1.5px dashed ${tokens.purple}`,
          color: tokens.purple,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AddIcon sx={{ fontSize: 22 }} />
      </ButtonBase>
    </Box>
  )
}
