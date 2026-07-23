import { Box, ButtonBase } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import { MEMBER_AVATARS } from '../../shared/peopleAvatars'
import { MOTION_EMPHASIZED, tokens } from './theme'

interface MapButtonColumnProps {
  panelOpen: boolean
  onToggle: () => void
}

const circleSx = {
  width: 44,
  height: 44,
  borderRadius: '50%',
  bgcolor: tokens.surface,
  border: `1px solid ${tokens.hairline}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: tokens.shadowFloat,
} as const

// Floating control stack on the map's right edge (below the compass): the
// road-trip button — the travelers' faces — over search, volume and the
// hazard-report button. While the itinerary panel is open the top slot swaps
// to an X so the same control closes it.
export function MapButtonColumn({ panelOpen, onToggle }: MapButtonColumnProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        right: 12,
        top: 68,
        zIndex: 6,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <ButtonBase
        aria-label={panelOpen ? 'Close the road trip panel' : "Open Kelley's Roadtrip"}
        onClick={onToggle}
        sx={{
          ...circleSx,
          transition: `transform 200ms ${MOTION_EMPHASIZED}`,
          '&:active': { transform: 'scale(0.94)' },
        }}
      >
        {panelOpen ? <CloseIcon sx={{ fontSize: 20, color: tokens.ink }} /> : <FacesCluster />}
      </ButtonBase>

      <Box sx={circleSx}>
        <SearchIcon sx={{ fontSize: 20, color: tokens.ink }} />
      </Box>
      <Box sx={circleSx}>
        <VolumeUpIcon sx={{ fontSize: 20, color: tokens.ink }} />
      </Box>
      <Box sx={circleSx}>
        <WarningAmberRoundedIcon sx={{ fontSize: 20, color: tokens.amber }} />
      </Box>
    </Box>
  )
}

// The road-trip mark: the four travelers in a tight 2×2 cluster, clipped to a
// circle so the button reads as one badge rather than four chips.
function FacesCluster() {
  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1px',
        bgcolor: tokens.hairline,
      }}
    >
      {MEMBER_AVATARS.map((src) => (
        <Box
          key={src}
          component="img"
          src={src}
          alt=""
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ))}
    </Box>
  )
}
