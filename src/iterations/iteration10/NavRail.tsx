import { useState } from 'react'
import { Box } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import AltRouteIcon from '@mui/icons-material/AltRoute'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import { tokens } from './theme'

const CIRCLE = {
  width: 56,
  height: 56,
  borderRadius: '50%',
  bgcolor: tokens.surface,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: tokens.shadowFloat,
  cursor: 'pointer',
} as const

// Red/gray compass needle, matching Google's nav compass.
function CompassNeedle() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2 L15.2 12 L8.8 12 Z" fill={tokens.compassNorth} />
      <path d="M12 22 L8.8 12 L15.2 12 Z" fill={tokens.compassSouth} />
    </svg>
  )
}

interface NavRailProps {
  /** Opens the "Search along route" panel — the doorway into Quick Decide. */
  onSearchClick: () => void
}

// Right-hand rail of nav controls, design.md §6.13: 56px flat white circles,
// 12px apart, 16px off the right edge, starting below the banner. Search and
// mute are live — the rest are decorative for this demo.
export function NavRail({ onSearchClick }: NavRailProps) {
  const [muted, setMuted] = useState(true)

  return (
    <Box
      sx={{
        position: 'absolute',
        right: 16,
        top: '36%',
        zIndex: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <Box sx={CIRCLE}>
        <CompassNeedle />
      </Box>
      <Box sx={CIRCLE} onClick={onSearchClick} role="button" aria-label="Search along route">
        <SearchIcon sx={{ fontSize: 26, color: tokens.ink }} />
      </Box>
      <Box sx={CIRCLE} onClick={() => setMuted((v) => !v)}>
        {muted ? (
          <VolumeOffIcon sx={{ fontSize: 26, color: tokens.red }} />
        ) : (
          <VolumeUpIcon sx={{ fontSize: 26, color: tokens.ink }} />
        )}
      </Box>
      <Box sx={CIRCLE}>
        <AltRouteIcon sx={{ fontSize: 26, color: tokens.ink }} />
      </Box>
      <Box sx={CIRCLE}>
        <WarningRoundedIcon sx={{ fontSize: 28, color: tokens.amber }} />
      </Box>
    </Box>
  )
}
